import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { 
  fetchRealtimeWeather, 
  reverseGeocodeCoords, 
  searchCitiesApi,
  fetchIpLocationFallback
} from '../services/liveWeatherService';
import { API_BASE_URL } from '../config/api';

const WeatherContext = createContext();

const STORAGE_LOCATIONS_KEY = 'mausam_real_locations_v2';
const STORAGE_ACTIVE_ID_KEY = 'mausam_real_active_id_v2';

export function WeatherProvider({ children }) {
  const { user } = useAuth();

  const userStorageKey = user?.email 
    ? `mausam_real_locations_${user.email}` 
    : STORAGE_LOCATIONS_KEY;
  const userActiveKey = user?.email 
    ? `mausam_real_active_id_${user.email}` 
    : STORAGE_ACTIVE_ID_KEY;

  const [activeLocationId, setActiveLocationId] = useState(() => {
    return localStorage.getItem(userActiveKey) || localStorage.getItem(STORAGE_ACTIVE_ID_KEY) || null;
  });

  const [realLocations, setRealLocations] = useState(() => {
    try {
      const saved = localStorage.getItem(userStorageKey) || localStorage.getItem(STORAGE_LOCATIONS_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Deduplicate by city name immediately
      const uniqueMap = new Map();
      parsed.forEach(loc => {
        if (loc?.name) {
          const key = loc.name.trim().toLowerCase();
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, loc);
          }
        }
      });
      return Array.from(uniqueMap.values());
    } catch {
      return [];
    }
  });

  const [weatherData, setWeatherData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());

  // Helper: Synchronize saved locations with MongoDB Atlas
  const syncLocationsToAtlas = (locations, activeId) => {
    if (!user || user.isGuest || !user.email) return;
    const cleanLocations = locations.map(l => ({
      id: l.id,
      name: l.name,
      state: l.state,
      district: l.district,
      coords: l.coords,
      isLive: l.isLive ?? true,
      temp: l.current?.temp ?? l.temp ?? 27,
      condition: l.current?.condition ?? l.condition ?? "Clear",
      current: {
        temp: l.current?.temp ?? l.temp ?? 27,
        condition: l.current?.condition ?? l.condition ?? "Clear",
        conditionCode: l.current?.conditionCode || "clear",
        feelsLike: l.current?.feelsLike ?? l.current?.temp ?? l.temp ?? 27,
        humidity: l.current?.humidity ?? 60,
        windSpeed: l.current?.windSpeed ?? 10,
        windDirection: l.current?.windDirection ?? "NW",
        uv: l.current?.uv ?? 4,
        aqi: l.current?.aqi ?? 45
      }
    }));

    fetch(`${API_BASE_URL}/api/user/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        preferences: {
          savedLocations: cleanLocations,
          activeLocationId: activeId
        }
      })
    }).catch(err => console.warn('[WeatherContext] Error syncing locations to Atlas:', err));
  };

  // Save locations and active id whenever they change (to local storage & MongoDB Atlas)
  useEffect(() => {
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(realLocations));
      if (activeLocationId) {
        localStorage.setItem(userActiveKey, activeLocationId);
      }
    } catch (e) {
      console.warn("Could not save locations:", e);
    }

    if (user && !user.isGuest && user.email && realLocations.length > 0) {
      syncLocationsToAtlas(realLocations, activeLocationId);
    }
  }, [realLocations, activeLocationId, user?.email]);

  // Fetch cloud saved locations from MongoDB Atlas on user login / session restore
  useEffect(() => {
    if (!user || user.isGuest || !user.email) return;

    let isMounted = true;
    fetch(`${API_BASE_URL}/api/user/preferences?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(async data => {
        if (!isMounted) return;
        const atlasLocations = data.preferences?.savedLocations;
        const atlasActiveId = data.preferences?.activeLocationId;

        if (Array.isArray(atlasLocations) && atlasLocations.length > 0) {
          const uniqueMap = new Map();
          atlasLocations.forEach(loc => {
            if (loc?.name) {
              const safeCurrent = loc.current || {
                temp: loc.temp ?? 27,
                condition: loc.condition ?? "Clear",
                conditionCode: "clear",
                feelsLike: loc.temp ?? 27,
                humidity: 60,
                windSpeed: 10,
                windDirection: "NW",
                uv: 4,
                aqi: 45
              };
              uniqueMap.set(loc.name.trim().toLowerCase(), {
                ...loc,
                current: safeCurrent
              });
            }
          });
          const cleanList = Array.from(uniqueMap.values());
          setRealLocations(cleanList);

          const targetActiveId = (atlasActiveId && cleanList.some(l => l.id === atlasActiveId))
            ? atlasActiveId
            : cleanList[0].id;
          setActiveLocationId(targetActiveId);

          const activeTarget = cleanList.find(l => l.id === targetActiveId) || cleanList[0];
          if (activeTarget?.coords) {
            try {
              setIsRefreshing(true);
              const fresh = await fetchRealtimeWeather(
                activeTarget.coords.lat,
                activeTarget.coords.lon,
                activeTarget.name,
                activeTarget.state,
                activeTarget.district
              );
              if (isMounted) {
                setWeatherData(fresh);
                setIsRefreshing(false);
              }
            } catch (e) {
              if (isMounted) {
                setWeatherData(activeTarget);
                setIsRefreshing(false);
              }
            }
          }

          // Background refresh all non-active locations to get live real-time temperatures for the dropdown
          cleanList.forEach(async (loc) => {
            if (loc.id !== targetActiveId && loc.coords) {
              try {
                const fresh = await fetchRealtimeWeather(loc.coords.lat, loc.coords.lon, loc.name, loc.state, loc.district);
                if (isMounted) {
                  setRealLocations(prev => prev.map(p => p.id === loc.id ? { ...p, current: fresh.current, isLive: true } : p));
                }
              } catch (e) {
                // Keep default values
              }
            }
          });
        } else if (realLocations.length > 0) {
          // If Atlas has no saved locations yet, seed it with current local locations
          syncLocationsToAtlas(realLocations, activeLocationId);
        }
      })
      .catch(err => console.warn('[WeatherContext] Could not fetch Atlas saved locations:', err));

    return () => { isMounted = false; };
  }, [user?.email]);

  // Initial load: fetch live GPS or fallback to real live data for default location
  useEffect(() => {
    const initializeLocation = async () => {
      // If we already have saved real locations in state, fetch the latest live weather for active
      if (realLocations.length > 0) {
        const currentActive = realLocations.find(l => l.id === activeLocationId) || realLocations[0];
        try {
          setIsRefreshing(true);
          const fresh = await fetchRealtimeWeather(
            currentActive.coords.lat,
            currentActive.coords.lon,
            currentActive.name,
            currentActive.state,
            currentActive.district
          );
          setWeatherData(fresh);
          setActiveLocationId(fresh.id);
          setIsRefreshing(false);
          return;
        } catch (e) {
          console.warn("Initial refresh of saved location failed:", e);
          setWeatherData(currentActive);
          setIsRefreshing(false);
          return;
        }
      }

      // If no locations saved, try live browser GPS
      if (navigator.geolocation) {
        setIsLoadingGps(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              const geo = await reverseGeocodeCoords(lat, lon);
              const liveData = await fetchRealtimeWeather(lat, lon, geo.name, geo.state, geo.district);
              setRealLocations([liveData]);
              setActiveLocationId(liveData.id);
              setWeatherData(liveData);
              setIsLoadingGps(false);
            } catch (err) {
              console.error("Auto GPS fetch failed, loading real live default:", err);
              loadDefaultLiveCity();
            }
          },
          (err) => {
            console.warn("Auto GPS permission skipped or denied:", err);
            loadDefaultLiveCity();
          },
          { timeout: 8000 }
        );
      } else {
        loadDefaultLiveCity();
      }
    };

    const loadDefaultLiveCity = async () => {
      // Fetch real live weather for New Delhi as default fallback (NOT mock)
      try {
        setIsLoadingGps(false);
        setIsRefreshing(true);
        const liveData = await fetchRealtimeWeather(28.6139, 77.2090, "New Delhi", "Delhi", "Central Delhi");
        setRealLocations([liveData]);
        setActiveLocationId(liveData.id);
        setWeatherData(liveData);
        setIsRefreshing(false);
      } catch (err) {
        console.error("Default live fetch failed:", err);
        setIsRefreshing(false);
      }
    };

    initializeLocation();
  }, []);

  /**
   * Fetches Real-Time GPS Location from user's device browser
   */
  const addOrUpdateLocation = (liveData) => {
    setRealLocations(prev => {
      const normalizedName = liveData.name?.trim().toLowerCase();
      // Remove any existing entry with the same ID or same city name
      const filtered = prev.filter(l => 
        l.id !== liveData.id && 
        l.name?.trim().toLowerCase() !== normalizedName
      );
      return [liveData, ...filtered];
    });
    setActiveLocationId(liveData.id);
    setWeatherData(liveData);
    setLastRefreshedAt(new Date());
  };

  const removeLocation = (locationId) => {
    setRealLocations(prev => {
      const updated = prev.filter(l => l.id !== locationId);
      if (activeLocationId === locationId && updated.length > 0) {
        changeLocation(updated[0].id);
      }
      return updated;
    });
  };

  /**
   * Fetches Real-Time GPS Location from user's device browser
   */
  const fetchCurrentGpsLocation = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setGpsError("Geolocation is not supported by your device browser.");
        return resolve(null);
      }

      setIsLoadingGps(true);
      setGpsError(null);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const geo = await reverseGeocodeCoords(lat, lon);
            const liveData = await fetchRealtimeWeather(lat, lon, geo.name, geo.state, geo.district);
            liveData.isLive = true;

            addOrUpdateLocation(liveData);
            setIsLoadingGps(false);
            resolve(liveData);
          } catch (err) {
            console.error("GPS weather fetch failed:", err);
            setGpsError("Could not retrieve live weather for your location. Please check your internet connection.");
            setIsLoadingGps(false);
            resolve(null);
          }
        },
        async (err) => {
          console.warn("Geolocation error, attempting IP fallback:", err);

          // Auto-fallback to Network IP location (works over HTTP on mobile!)
          try {
            const ipLoc = await fetchIpLocationFallback();
            if (ipLoc) {
              const liveData = await fetchRealtimeWeather(ipLoc.lat, ipLoc.lon, ipLoc.name, ipLoc.state, ipLoc.district);
              liveData.isLive = true;
              addOrUpdateLocation(liveData);
              setIsLoadingGps(false);
              setGpsError(null);
              return resolve(liveData);
            }
          } catch (ipErr) {
            console.warn("IP Geolocation fallback failed:", ipErr);
          }

          let msg = "Location permission blocked. Search your city or allow location in your browser.";
          if (err.code === err.POSITION_UNAVAILABLE) msg = "Location information is unavailable.";
          if (err.code === err.TIMEOUT) msg = "Location request timed out.";
          setGpsError(msg);
          setIsLoadingGps(false);
          resolve(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  /**
   * Fetches real-time weather for any searched city
   */
  const fetchAndSelectCity = async (cityObj) => {
    setIsRefreshing(true);
    try {
      const liveData = await fetchRealtimeWeather(
        cityObj.lat, 
        cityObj.lon, 
        cityObj.name, 
        cityObj.state, 
        cityObj.district
      );
      addOrUpdateLocation(liveData);
      setIsRefreshing(false);
      return liveData;
    } catch (err) {
      console.error("City weather fetch failed:", err);
      setIsRefreshing(false);
      throw err;
    }
  };

  const changeLocation = async (locationId) => {
    const target = realLocations.find(l => l.id === locationId);
    if (!target) return;

    setIsRefreshing(true);
    setActiveLocationId(locationId);
    try {
      const fresh = await fetchRealtimeWeather(
        target.coords.lat,
        target.coords.lon,
        target.name,
        target.state,
        target.district
      );
      setWeatherData(fresh);
      setRealLocations(prev => prev.map(l => l.id === locationId ? fresh : l));
    } catch (e) {
      setWeatherData(target);
    } finally {
      setIsRefreshing(false);
      setLastRefreshedAt(new Date());
    }
  };

  const refreshWeather = async () => {
    if (!weatherData?.coords) return;
    setIsRefreshing(true);
    try {
      const fresh = await fetchRealtimeWeather(
        weatherData.coords.lat,
        weatherData.coords.lon,
        weatherData.name,
        weatherData.state,
        weatherData.district
      );
      setWeatherData(fresh);
      setRealLocations(prev => prev.map(l => l.id === fresh.id ? fresh : l));
    } catch (err) {
      console.warn("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
      setLastRefreshedAt(new Date());
    }
  };

  // Automatically pull live weather every 5 minutes in background
  useEffect(() => {
    if (!weatherData?.coords?.lat) return;
    const interval = setInterval(() => {
      refreshWeather();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weatherData?.coords?.lat, weatherData?.coords?.lon]);

  return (
    <WeatherContext.Provider
      value={{
        activeLocationId,
        changeLocation,
        removeLocation,
        weatherData,
        allLocations: realLocations,
        isRefreshing,
        refreshWeather,
        lastRefreshedAt,
        fetchCurrentGpsLocation,
        fetchAndSelectCity,
        isLoadingGps,
        gpsError,
        setGpsError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
