import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config/api';

const PersonalizationContext = createContext();

export function PersonalizationProvider({ children }) {
  const { user, lastUserPreferences } = useAuth();

  // Helper to load user's cached preferences on mount
  const getCachedPreferences = () => {
    if (lastUserPreferences) return lastUserPreferences;
    if (user?.email) {
      try {
        const cached = localStorage.getItem(`mausam_user_pref_${user.email}`);
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.warn('Could not parse cached preferences:', e);
      }
    }
    return null;
  };

  const initialPrefs = getCachedPreferences();

  const [activePersonas, setActivePersonas] = useState(() => initialPrefs?.activePersonas || ['health', 'travel']);
  const [answers, setAnswers] = useState(() => initialPrefs?.answers || {
    health_sensitivity: 'aqi_pm25',
    travel_scope: 'domestic',
    farming_type: 'crop_farmer',
    workout_window: 'early_morning',
    commute_mode: 'car_drive',
  });
  const [pinnedWidgetIds, setPinnedWidgetIds] = useState(() => initialPrefs?.pinnedWidgetIds || []);
  const [removedWidgetIds, setRemovedWidgetIds] = useState(() => initialPrefs?.removedWidgetIds || []);
  const [customAddedWidgetIds, setCustomAddedWidgetIds] = useState(() => initialPrefs?.customAddedWidgetIds || []);
  const [isCustomLifestyle, setIsCustomLifestyle] = useState(() => initialPrefs?.isCustomLifestyle || false);
  const [savedLocationIds, setSavedLocationIds] = useState(() => initialPrefs?.savedLocationIds || ['delhi', 'punjab_farm', 'bengaluru', 'goa']);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => typeof initialPrefs?.hasCompletedOnboarding === 'boolean' ? initialPrefs.hasCompletedOnboarding : true);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [unit, setUnit] = useState(() => initialPrefs?.unit || 'celsius');

  // Guard flag: PREVENTS accidental overwrite of backend data until initial load has completed
  const isLoadedFromBackendRef = useRef(false);

  // 1. Initial Load from Backend Disk
  useEffect(() => {
    if (lastUserPreferences) {
      applyPreferences(lastUserPreferences);
      isLoadedFromBackendRef.current = true;
      return;
    }

    if (user && !user.isGuest && user.email) {
      fetch(`${API_BASE_URL}/api/user/preferences?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.preferences) {
            applyPreferences(data.preferences);
            if (user?.email) {
              localStorage.setItem(`mausam_user_pref_${user.email}`, JSON.stringify(data.preferences));
            }
          }
          isLoadedFromBackendRef.current = true;
        })
        .catch(err => {
          console.warn('Could not fetch preferences from backend, using cached:', err);
          isLoadedFromBackendRef.current = true;
        });
    } else {
      isLoadedFromBackendRef.current = true;
    }
  }, [user, lastUserPreferences]);

  const applyPreferences = (p) => {
    if (Array.isArray(p.activePersonas)) setActivePersonas(p.activePersonas);
    if (p.answers) setAnswers(p.answers);
    if (Array.isArray(p.pinnedWidgetIds)) setPinnedWidgetIds(p.pinnedWidgetIds);
    if (Array.isArray(p.removedWidgetIds)) setRemovedWidgetIds(p.removedWidgetIds);
    if (Array.isArray(p.customAddedWidgetIds)) setCustomAddedWidgetIds(p.customAddedWidgetIds);
    if (typeof p.isCustomLifestyle === 'boolean') setIsCustomLifestyle(p.isCustomLifestyle);
    if (Array.isArray(p.savedLocationIds)) setSavedLocationIds(p.savedLocationIds);
    if (p.unit) setUnit(p.unit);
    if (typeof p.hasCompletedOnboarding === 'boolean') {
      setHasCompletedOnboarding(p.hasCompletedOnboarding);
    }
  };

  // 2. Persist preferences to backend disk and local cache on genuine user changes
  useEffect(() => {
    if (!isLoadedFromBackendRef.current) return;
    if (!user || user.isGuest || !user.email) return;

    const prefs = {
      activePersonas,
      answers,
      pinnedWidgetIds,
      removedWidgetIds,
      customAddedWidgetIds,
      isCustomLifestyle,
      savedLocationIds,
      hasCompletedOnboarding,
      unit
    };

    // Cache immediately per email
    try {
      localStorage.setItem(`mausam_user_pref_${user.email}`, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Cache write failed:', e);
    }

    // Save to backend disk
    fetch(`${API_BASE_URL}/api/user/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, preferences: prefs })
    }).catch(err => console.warn('Backend sync failed:', err));
  }, [activePersonas, answers, pinnedWidgetIds, removedWidgetIds, customAddedWidgetIds, isCustomLifestyle, savedLocationIds, hasCompletedOnboarding, unit, user]);

  /**
   * Action: Remove Widget (-)
   * Removes any widget from home page and switches lifestyle interest to custom
   */
  const removeWidget = (widgetId) => {
    setRemovedWidgetIds(prev => (prev.includes(widgetId) ? prev : [...prev, widgetId]));
    setCustomAddedWidgetIds(prev => prev.filter(id => id !== widgetId));
    setIsCustomLifestyle(true);
  };

  /**
   * Action: Add Desired Widget (+)
   * Adds any unlisted widget to home page and switches lifestyle interest to custom
   */
  const addWidget = (widgetId) => {
    setCustomAddedWidgetIds(prev => (prev.includes(widgetId) ? prev : [...prev, widgetId]));
    setRemovedWidgetIds(prev => prev.filter(id => id !== widgetId));
    setIsCustomLifestyle(true);
  };

  /**
   * Action: Reset to Standard Categories
   */
  const resetToDefaultPersonas = () => {
    setRemovedWidgetIds([]);
    setCustomAddedWidgetIds([]);
    setIsCustomLifestyle(false);
  };

  const togglePersona = (personaId) => {
    setActivePersonas(prev => {
      if (prev.includes(personaId)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== personaId);
      } else {
        return [...prev, personaId];
      }
    });
  };

  const setPersonas = (personaList) => {
    if (Array.isArray(personaList) && personaList.length > 0) {
      setActivePersonas(personaList);
    }
  };

  const saveAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const togglePinWidget = (widgetId) => {
    setPinnedWidgetIds(prev =>
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const toggleSavedLocation = (locationId) => {
    setSavedLocationIds(prev =>
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    setIsOnboardingModalOpen(false);
  };

  return (
    <PersonalizationContext.Provider
      value={{
        activePersonas,
        togglePersona,
        setPersonas,
        answers,
        saveAnswer,
        pinnedWidgetIds,
        togglePinWidget,
        removedWidgetIds,
        customAddedWidgetIds,
        isCustomLifestyle,
        removeWidget,
        addWidget,
        resetToDefaultPersonas,
        savedLocationIds,
        toggleSavedLocation,
        hasCompletedOnboarding,
        completeOnboarding,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
        unit,
        setUnit,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}
