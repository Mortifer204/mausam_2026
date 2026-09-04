// Rich authentic Indian meteorological datasets tailored for IMD / MoES Mausam application
export const MOCK_WEATHER_LOCATIONS = [
  {
    id: "delhi",
    name: "New Delhi",
    state: "Delhi NCR",
    district: "Central Delhi",
    type: "Metropolitan Capital",
    coords: { lat: 28.6139, lon: 77.2090 },
    current: {
      temp: 28,
      condition: "Haze & Thunderheads",
      conditionCode: "thunder",
      feelsLike: 32,
      minTemp: 22,
      maxTemp: 34,
      humidity: 74,
      windSpeed: 18,
      windDirection: "NW",
      windGust: 38,
      aqi: 182,
      aqiStatus: "Unhealthy",
      pm25: 96,
      pm10: 174,
      uv: 6,
      pressure: 1008,
      visibility: 3.2, // km
      dewPoint: 23,
      sunrise: "06:04 AM",
      sunset: "06:42 PM",
      updatedAgo: "3 min ago",
      tagline: "Unhealthy air quality today; carry a rain jacket for expected 6:00 PM showers."
    },
    alerts: [
      {
        id: "imd_delhi_alert_1",
        level: "orange", // 'green' | 'yellow' | 'orange' | 'red'
        title: "IMD Orange Alert: Squall & Thunderstorm Warning",
        headline: "Gusty winds (40-50 km/h) with moderate to heavy rain expected post 17:30 IST",
        issuedBy: "Regional Meteorological Centre, New Delhi (IMD)",
        validUntil: "Tonight, 23:00 IST",
        instructions: [
          "Secure loose outdoor fixtures and avoid parking under aged trees.",
          "Expect waterlogging on Ring Road and airport arterial expressways.",
          "Vulnerable individuals should avoid prolonged outdoor exposure due to elevated PM2.5."
        ]
      }
    ],
    hourly: [
      { time: "Now", temp: 28, condition: "Haze", icon: "CloudSun", pop: 20, aqi: 182, fitScore: 45 },
      { time: "11 AM", temp: 30, condition: "Partly Cloudy", icon: "CloudSun", pop: 25, aqi: 178, fitScore: 50 },
      { time: "12 PM", temp: 32, condition: "Partly Cloudy", icon: "Sun", pop: 30, aqi: 165, fitScore: 48 },
      { time: "1 PM", temp: 33, condition: "Sunny / Hot", icon: "Sun", pop: 35, aqi: 160, fitScore: 40 },
      { time: "2 PM", temp: 34, condition: "Cloudy", icon: "Cloud", pop: 45, aqi: 155, fitScore: 42 },
      { time: "3 PM", temp: 33, condition: "Overcast", icon: "CloudRain", pop: 60, aqi: 140, fitScore: 55 },
      { time: "4 PM", temp: 31, condition: "Light Rain", icon: "CloudRain", pop: 75, aqi: 125, fitScore: 60 },
      { time: "5 PM", temp: 29, condition: "Thunderstorm", icon: "CloudLightning", pop: 85, aqi: 110, fitScore: 35 },
      { time: "6 PM", temp: 26, condition: "Heavy Squall", icon: "CloudRain", pop: 90, aqi: 95, fitScore: 30 },
      { time: "7 PM", temp: 25, condition: "Rain", icon: "CloudRain", pop: 80, aqi: 90, fitScore: 40 },
      { time: "8 PM", temp: 25, condition: "Drizzle", icon: "CloudRain", pop: 50, aqi: 98, fitScore: 58 },
      { time: "9 PM", temp: 24, condition: "Cool Breeze", icon: "Cloud", pop: 30, aqi: 110, fitScore: 70 },
      { time: "10 PM", temp: 24, condition: "Partly Clear", icon: "Moon", pop: 15, aqi: 120, fitScore: 72 },
    ],
    daily: [
      { day: "Today", condition: "Squall/Rain", high: 34, low: 22, pop: 85, aqi: 182 },
      { day: "Fri", condition: "Scattered Rain", high: 32, low: 23, pop: 65, aqi: 120 },
      { day: "Sat", condition: "Clear Sky", high: 33, low: 22, pop: 15, aqi: 145 },
      { day: "Sun", condition: "Sunny", high: 35, low: 23, pop: 10, aqi: 170 },
      { day: "Mon", condition: "Haze", high: 36, low: 24, pop: 20, aqi: 195 },
      { day: "Tue", condition: "Partly Cloudy", high: 35, low: 24, pop: 30, aqi: 180 },
      { day: "Wed", condition: "Light Shower", high: 33, low: 23, pop: 55, aqi: 150 },
    ],
    specialized: {
      health: {
        aqi: 182,
        category: "Unhealthy",
        mainPollutant: "PM2.5",
        pm25Value: 96,
        pm10Value: 174,
        pollenLevel: "Moderate (Grass & Weed)",
        uvIndex: 6,
        uvCategory: "High (Peak: 11:30 - 14:00)",
        actionGuideline: "Sensitive groups, asthmatic patients and children should wear N95 outdoors. Keep windows closed during peak afternoon haze."
      },
      fitness: {
        runningScore: 52, // 0 - 100
        status: "Suboptimal",
        bestWindow: "8:30 PM - 10:00 PM (Post-rain washed air)",
        heatIndex: 32,
        hydrationAdvice: "Drink 500ml water prior to workouts. Avoid midday aerobic exercise due to ozone and PM2.5."
      },
      travel: {
        transitStatus: "Moderate Delays Expected",
        destinationComparison: {
          city: "Mumbai (Transit Destination)",
          temp: 30,
          condition: "Heavy Monsoon Rain",
          rainProb: 92
        },
        packingList: [
          { item: "Compact Windproof Umbrella", essential: true },
          { item: "Breathable Rain Poncho / Jacket", essential: true },
          { item: "N95 Particulate Mask", essential: true },
          { item: "Quick-dry synthetic clothing", essential: false },
          { item: "Moisture-resistant shoe covers", essential: false }
        ],
        advisory: "Indira Gandhi Int'l Airport (DEL) experiencing air traffic sequencing holds due to inbound storm front."
      },
      farming: {
        soilMoisture: 58,
        soilTemp: 24,
        evapotranspiration: 4.8,
        frostRisk: "Zero Risk",
        cropAdvisory: "With 25-35mm rainfall predicted, suspend irrigation for standing pulse and vegetable crops. Ensure field drainage channels are cleared.",
        sprayCondition: "Unfavorable (Wash-off risk within 3 hours)"
      },
      family: {
        schoolCommuteSafety: "Caution Advised",
        commuteNote: "School bus commute between 2:30 PM and 4:30 PM may coincide with lightning and sudden rainfall.",
        playFeasibility: "Indoor activities recommended after 3 PM.",
        dressCode: "Cotton inner layer with portable raincoat in schoolbag."
      },
      commuter: {
        fogRisk: "Low",
        highwayVisibilityKm: 3.2,
        flashFloodRisk: "Moderate on low-lying underpasses",
        peakWindowImpact: "Severe slowdowns on DND Flyway & NH-48 post 5:00 PM."
      },
      beach: {
        tideStatus: "N/A (Inland Hub)",
        waveHeight: 0,
        waterTemp: 0
      },
      events: {
        feasibilityScore: 38,
        rating: "High Weather Risk",
        criticalWindow: "17:00 - 20:30 IST",
        recommendation: "Ensure waterproof canopy covers and wind anchors for outdoor stage equipment."
      }
    }
  },
  {
    id: "punjab_farm",
    name: "Ludhiana Agromet Hub",
    state: "Punjab",
    district: "Ludhiana Rural",
    type: "Agricultural Heartland",
    coords: { lat: 30.9010, lon: 75.8573 },
    current: {
      temp: 26,
      condition: "Clear & Crisp",
      conditionCode: "clear",
      feelsLike: 26,
      minTemp: 16,
      maxTemp: 29,
      humidity: 58,
      windSpeed: 10,
      windDirection: "N",
      windGust: 16,
      aqi: 72,
      aqiStatus: "Satisfactory",
      pm25: 28,
      pm10: 64,
      uv: 5,
      pressure: 1014,
      visibility: 8.5,
      dewPoint: 15,
      sunrise: "06:18 AM",
      sunset: "06:48 PM",
      updatedAgo: "Just now",
      tagline: "Ideal field conditions: soil moisture steady at 64%; perfect window for foliar fertilizer application."
    },
    alerts: [
      {
        id: "imd_punjab_agromet_1",
        level: "green",
        title: "IMD Agromet Advisory: Optimal Crop Growth Phase",
        headline: "Fair weather prevailing over Central Punjab. No hazardous rainfall or hail predicted for 5 days.",
        issuedBy: "Punjab Agricultural University (PAU) & IMD Agromet Cell",
        validUntil: "Valid through Sunday",
        instructions: [
          "Proceed with planned nitrogen top-dressing in wheat/cereal blocks.",
          "Monitor soil moisture in lighter sandy loam patches.",
          "Early morning dew is moderate; safe for tractor implement operations after 8:30 AM."
        ]
      }
    ],
    hourly: [
      { time: "Now", temp: 26, condition: "Clear", icon: "Sun", pop: 5, aqi: 72, fitScore: 90 },
      { time: "11 AM", temp: 27, condition: "Sunny", icon: "Sun", pop: 5, aqi: 75, fitScore: 88 },
      { time: "12 PM", temp: 28, condition: "Sunny", icon: "Sun", pop: 5, aqi: 78, fitScore: 82 },
      { time: "1 PM", temp: 29, condition: "Clear", icon: "Sun", pop: 10, aqi: 80, fitScore: 78 },
      { time: "2 PM", temp: 29, condition: "Clear", icon: "Sun", pop: 10, aqi: 76, fitScore: 79 },
      { time: "3 PM", temp: 28, condition: "Light Breeze", icon: "Sun", pop: 5, aqi: 74, fitScore: 84 },
      { time: "4 PM", temp: 27, condition: "Sunny", icon: "Sun", pop: 5, aqi: 70, fitScore: 88 },
      { time: "5 PM", temp: 25, condition: "Golden Hour", icon: "Sun", pop: 5, aqi: 68, fitScore: 94 },
      { time: "6 PM", temp: 23, condition: "Clear Dusk", icon: "Sun", pop: 5, aqi: 66, fitScore: 96 },
      { time: "7 PM", temp: 21, condition: "Clear Night", icon: "Moon", pop: 5, aqi: 70, fitScore: 92 },
      { time: "8 PM", temp: 20, condition: "Cool", icon: "Moon", pop: 5, aqi: 75, fitScore: 85 },
      { time: "9 PM", temp: 19, condition: "Crisp", icon: "Moon", pop: 5, aqi: 78, fitScore: 80 },
    ],
    daily: [
      { day: "Today", condition: "Sunny", high: 29, low: 16, pop: 5, aqi: 72 },
      { day: "Fri", condition: "Sunny", high: 30, low: 17, pop: 5, aqi: 76 },
      { day: "Sat", condition: "Clear Sky", high: 30, low: 17, pop: 5, aqi: 80 },
      { day: "Sun", condition: "Clear Sky", high: 31, low: 18, pop: 10, aqi: 84 },
      { day: "Mon", condition: "Light Clouds", high: 29, low: 17, pop: 15, aqi: 88 },
      { day: "Tue", condition: "Partly Cloudy", high: 28, low: 16, pop: 20, aqi: 82 },
      { day: "Wed", condition: "Clear", high: 29, low: 16, pop: 10, aqi: 75 },
    ],
    specialized: {
      health: {
        aqi: 72,
        category: "Satisfactory",
        mainPollutant: "PM10",
        pm25Value: 28,
        pm10Value: 64,
        pollenLevel: "High (Wheat Flowering Season)",
        uvIndex: 5,
        uvCategory: "Moderate",
        actionGuideline: "Fresh rural air quality. High pollen counts in field perimeters; wear eye protection during crop inspection."
      },
      fitness: {
        runningScore: 92,
        status: "Prime Conditions",
        bestWindow: "5:30 AM - 7:30 AM & 5:00 PM - 6:45 PM",
        heatIndex: 26,
        hydrationAdvice: "Optimal temperature for endurance running and cycling."
      },
      travel: {
        transitStatus: "Smooth Highways",
        destinationComparison: {
          city: "Chandigarh",
          temp: 27,
          condition: "Clear",
          rainProb: 5
        },
        packingList: [
          { item: "Light jacket for evenings", essential: true },
          { item: "UV protective sunglasses", essential: true },
          { item: "Sun hat for outdoor inspection", essential: true }
        ],
        advisory: "GT Road and expressway corridors free of obstruction."
      },
      farming: {
        soilMoisture: 64, // percentage
        soilTemp: 21,
        evapotranspiration: 3.4, // mm/day
        frostRisk: "Low (Min 16°C safely above threshold)",
        cropAdvisory: "Soil moisture is in the ideal 60-70% root-zone saturation. Excellent window for pesticide/micronutrient foliar spray between 09:00 and 16:00.",
        sprayCondition: "Highly Favorable (Dry leaves, gentle wind 10 km/h)"
      },
      family: {
        schoolCommuteSafety: "Safe & Pleasant",
        commuteNote: "Clear morning commute. No rain gear required.",
        playFeasibility: "Exceptional outdoor weather throughout the afternoon.",
        dressCode: "Comfortable single layer clothing."
      },
      commuter: {
        fogRisk: "Negligible",
        highwayVisibilityKm: 8.5,
        flashFloodRisk: "None",
        peakWindowImpact: "Unimpeded driving conditions."
      },
      beach: {
        tideStatus: "N/A",
        waveHeight: 0,
        waterTemp: 0
      },
      events: {
        feasibilityScore: 96,
        rating: "Perfect Event Weather",
        criticalWindow: "All Day",
        recommendation: "Ideal for open lawn weddings and community farmer gatherings."
      }
    }
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    district: "Bengaluru Urban",
    type: "Tech & Fitness Hub",
    coords: { lat: 12.9716, lon: 77.5946 },
    current: {
      temp: 22,
      condition: "Gentle Breeze & Mild Sun",
      conditionCode: "pleasant",
      feelsLike: 22,
      minTemp: 18,
      maxTemp: 27,
      humidity: 62,
      windSpeed: 14,
      windDirection: "E",
      windGust: 22,
      aqi: 48,
      aqiStatus: "Good",
      pm25: 14,
      pm10: 38,
      uv: 7,
      pressure: 1012,
      visibility: 9.0,
      dewPoint: 15,
      sunrise: "06:12 AM",
      sunset: "06:34 PM",
      updatedAgo: "1 min ago",
      tagline: "Prime fitness weather: Air quality Good (AQI 48). Peak outdoor running score 94/100."
    },
    alerts: [
      {
        id: "imd_blr_alert_1",
        level: "green",
        title: "IMD Weather Watch: Normal Plateau Conditions",
        headline: "Pleasant temperatures prevailing across Karnataka plateau. Light isolated drizzle possible at night.",
        issuedBy: "IMD Meteorological Centre, Bengaluru",
        validUntil: "Next 48 Hours",
        instructions: [
          "Enjoy outdoor recreation and commutes with standard hydration.",
          "UV index will be high (7) around solar noon (12:00 - 13:30)."
        ]
      }
    ],
    hourly: [
      { time: "Now", temp: 22, condition: "Pleasant", icon: "CloudSun", pop: 10, aqi: 48, fitScore: 95 },
      { time: "11 AM", temp: 24, condition: "Sunny", icon: "Sun", pop: 10, aqi: 50, fitScore: 90 },
      { time: "12 PM", temp: 26, condition: "Warm Sun", icon: "Sun", pop: 15, aqi: 54, fitScore: 80 },
      { time: "1 PM", temp: 27, condition: "Sunny", icon: "Sun", pop: 15, aqi: 55, fitScore: 78 },
      { time: "2 PM", temp: 27, condition: "Scattered Clouds", icon: "CloudSun", pop: 20, aqi: 52, fitScore: 82 },
      { time: "3 PM", temp: 26, condition: "Partly Cloudy", icon: "CloudSun", pop: 25, aqi: 48, fitScore: 88 },
      { time: "4 PM", temp: 25, condition: "Pleasant Breeze", icon: "Cloud", pop: 25, aqi: 45, fitScore: 92 },
      { time: "5 PM", temp: 24, condition: "Cool Breeze", icon: "CloudSun", pop: 20, aqi: 42, fitScore: 96 },
      { time: "6 PM", temp: 23, condition: "Sunset Mild", icon: "Sun", pop: 20, aqi: 44, fitScore: 95 },
      { time: "7 PM", temp: 21, condition: "Breezy", icon: "Moon", pop: 25, aqi: 46, fitScore: 90 },
      { time: "8 PM", temp: 20, condition: "Cool Night", icon: "Moon", pop: 30, aqi: 48, fitScore: 88 },
      { time: "9 PM", temp: 19, condition: "Night Drizzle Risk", icon: "CloudRain", pop: 40, aqi: 45, fitScore: 82 },
    ],
    daily: [
      { day: "Today", condition: "Pleasant", high: 27, low: 18, pop: 20, aqi: 48 },
      { day: "Fri", condition: "Partly Cloudy", high: 27, low: 19, pop: 25, aqi: 52 },
      { day: "Sat", condition: "Scattered Shower", high: 26, low: 19, pop: 45, aqi: 42 },
      { day: "Sun", condition: "Pleasant", high: 27, low: 18, pop: 30, aqi: 46 },
      { day: "Mon", condition: "Sunny", high: 28, low: 19, pop: 15, aqi: 50 },
      { day: "Tue", condition: "Partly Cloudy", high: 28, low: 18, pop: 20, aqi: 55 },
      { day: "Wed", condition: "Clear", high: 27, low: 18, pop: 15, aqi: 48 },
    ],
    specialized: {
      health: {
        aqi: 48,
        category: "Good",
        mainPollutant: "None",
        pm25Value: 14,
        pm10Value: 38,
        pollenLevel: "Moderate (Tree pollen in park belts)",
        uvIndex: 7,
        uvCategory: "High around midday",
        actionGuideline: "Air quality is pristine for breathing exercises and open-window ventilation. Apply SPF 30+ sunscreen if out between 11:30 AM and 2 PM."
      },
      fitness: {
        runningScore: 96,
        status: "Exceptional Running Quality",
        bestWindow: "Now until 10:30 AM & 4:30 PM - 7:00 PM",
        heatIndex: 22,
        hydrationAdvice: "Ideal marathon prep conditions. Standard 250ml/hour hydration recommended."
      },
      travel: {
        transitStatus: "Normal Bengaluru Traffic",
        destinationComparison: {
          city: "Mysuru",
          temp: 28,
          condition: "Sunny",
          rainProb: 15
        },
        packingList: [
          { item: "Light cardigan / windbreaker for breezy evening", essential: true },
          { item: "Running shoes", essential: true },
          { item: "UV protective sunglasses", essential: true }
        ],
        advisory: "Expressway between Bengaluru and Mysuru is clear; no weather related transit delays."
      },
      farming: {
        soilMoisture: 52,
        soilTemp: 22,
        evapotranspiration: 4.1,
        frostRisk: "Zero Risk",
        cropAdvisory: "Good conditions for terrace gardening, flowering shrubs, and polyhouse vegetable saplings.",
        sprayCondition: "Favorable"
      },
      family: {
        schoolCommuteSafety: "Ideal Conditions",
        commuteNote: "Smooth morning drop. Mild breeze.",
        playFeasibility: "Excellent for Cubbon Park or playground games.",
        dressCode: "Comfortable standard casuals."
      },
      commuter: {
        fogRisk: "None",
        highwayVisibilityKm: 9.0,
        flashFloodRisk: "None",
        peakWindowImpact: "Weather has zero negative impact on Outer Ring Road (ORR) traffic flow."
      },
      beach: {
        tideStatus: "N/A",
        waveHeight: 0,
        waterTemp: 0
      },
      events: {
        feasibilityScore: 92,
        rating: "Optimal Event Weather",
        criticalWindow: "Ideal through 8 PM",
        recommendation: "Great for rooftop dinners, sports meetups, and outdoor company mixers."
      }
    }
  },
  {
    id: "goa",
    name: "Goa (Panaji Coastal)",
    state: "Goa",
    district: "North Goa",
    type: "Coastal & Surf Haven",
    coords: { lat: 15.4909, lon: 73.8278 },
    current: {
      temp: 31,
      condition: "Sunny & Ocean Breeze",
      conditionCode: "sunny",
      feelsLike: 36,
      minTemp: 25,
      maxTemp: 33,
      humidity: 82,
      windSpeed: 24,
      windDirection: "WSW",
      windGust: 34,
      aqi: 32,
      aqiStatus: "Good",
      pm25: 8,
      pm10: 24,
      uv: 9,
      pressure: 1009,
      visibility: 10.0,
      dewPoint: 27,
      sunrise: "06:31 AM",
      sunset: "06:49 PM",
      updatedAgo: "4 min ago",
      tagline: "Coastal alert: High tide expected at 2:15 PM (2.1m); swell height 1.6m; strong onshore breeze."
    },
    alerts: [
      {
        id: "imd_goa_alert_1",
        level: "yellow",
        title: "IMD Coastal Safety Watch: Moderate Swell & High Tide",
        headline: "Sea condition rough to moderate along Goa coast. Swell height 1.4 - 1.8 meters.",
        issuedBy: "IMD Marine Weather Forecasting Centre, Goa",
        validUntil: "Next 24 Hours",
        instructions: [
          "Fishermen advised not to venture into deep sea along Konkan coast.",
          "Swimmers should adhere to red flag zones identified by coastal lifeguards.",
          "High UV index (9) requires high protection sunblock and hydration."
        ]
      }
    ],
    hourly: [
      { time: "Now", temp: 31, condition: "Sunny", icon: "Sun", pop: 10, aqi: 32, fitScore: 70 },
      { time: "12 PM", temp: 32, condition: "Hot Sun", icon: "Sun", pop: 10, aqi: 34, fitScore: 60 },
      { time: "1 PM", temp: 33, condition: "High UV", icon: "Sun", pop: 15, aqi: 35, fitScore: 55 },
      { time: "2 PM", temp: 32, condition: "High Tide", icon: "Waves", pop: 20, aqi: 32, fitScore: 65 },
      { time: "3 PM", temp: 31, condition: "Breezy", icon: "Wind", pop: 25, aqi: 30, fitScore: 72 },
      { time: "4 PM", temp: 30, condition: "Surf Swell", icon: "Waves", pop: 25, aqi: 28, fitScore: 85 },
      { time: "5 PM", temp: 29, condition: "Coastal Sunset", icon: "Sun", pop: 20, aqi: 26, fitScore: 92 },
      { time: "6 PM", temp: 28, condition: "Golden Dusk", icon: "Sun", pop: 15, aqi: 28, fitScore: 94 },
      { time: "7 PM", temp: 27, condition: "Warm Breeze", icon: "Moon", pop: 15, aqi: 30, fitScore: 90 },
      { time: "8 PM", temp: 27, condition: "Ocean Waves", icon: "Moon", pop: 10, aqi: 32, fitScore: 88 },
    ],
    daily: [
      { day: "Today", condition: "Sunny/Breezy", high: 33, low: 25, pop: 20, aqi: 32 },
      { day: "Fri", condition: "Coastal Thunder", high: 32, low: 25, pop: 45, aqi: 28 },
      { day: "Sat", condition: "Scattered Rain", high: 31, low: 24, pop: 60, aqi: 25 },
      { day: "Sun", condition: "Breezy Sun", high: 32, low: 25, pop: 30, aqi: 30 },
      { day: "Mon", condition: "Clear Ocean", high: 33, low: 26, pop: 15, aqi: 35 },
      { day: "Tue", condition: "Sunny", high: 33, low: 25, pop: 20, aqi: 34 },
      { day: "Wed", condition: "Sunny", high: 32, low: 25, pop: 25, aqi: 32 },
    ],
    specialized: {
      health: {
        aqi: 32,
        category: "Good",
        mainPollutant: "None",
        pm25Value: 8,
        pm10Value: 24,
        pollenLevel: "Low",
        uvIndex: 9,
        uvCategory: "Very High / Extreme",
        actionGuideline: "Pure maritime air. However, UV index of 9 will cause sunburn within 20 minutes without sun protection. Reapply water-resistant SPF 50."
      },
      fitness: {
        runningScore: 68,
        status: "Humid Coastal Run",
        bestWindow: "6:00 AM - 7:30 AM along beach firm sand",
        heatIndex: 36,
        hydrationAdvice: "High sweat rate due to 82% humidity. Electrolyte replenishment required."
      },
      travel: {
        transitStatus: "Smooth Coastal Transit",
        destinationComparison: {
          city: "Kochi",
          temp: 30,
          condition: "Rain",
          rainProb: 75
        },
        packingList: [
          { item: "High-protection reef-safe sunscreen SPF 50+", essential: true },
          { item: "Quick-dry swimwear & UV rashguard", essential: true },
          { item: "Polarized sunglasses", essential: true },
          { item: "Waterproof drybag for valuables", essential: true }
        ],
        advisory: "Ferry crossings between Betim and Panaji operating on normal schedule."
      },
      farming: {
        soilMoisture: 72,
        soilTemp: 27,
        evapotranspiration: 5.2,
        frostRisk: "Zero",
        cropAdvisory: "High salinity breeze along coastal coconut and cashew plantations. Maintain freshwater drip irrigation.",
        sprayCondition: "Moderate"
      },
      family: {
        schoolCommuteSafety: "Normal",
        commuteNote: "Sunny commute, high heat.",
        playFeasibility: "Beach play safe in shallow designated zones under lifeguard supervision.",
        dressCode: "Light breathable cottons and wide-brim sun hats."
      },
      commuter: {
        fogRisk: "None",
        highwayVisibilityKm: 10.0,
        flashFloodRisk: "Low",
        peakWindowImpact: "Clear roads, beware of high winds across Zuari bridge."
      },
      beach: {
        tideStatus: "High Tide at 2:15 PM (2.1m)",
        nextLowTide: "Low Tide at 8:40 PM (0.4m)",
        waveHeightMeters: 1.6,
        waterTempC: 28,
        surfQuality: "Good (Consistent 4-5ft clean beach break at Ashwem)",
        ripCurrentRisk: "Moderate on outgoing tide (15:00 - 18:00)"
      },
      events: {
        feasibilityScore: 84,
        rating: "Great Beach Event Weather",
        criticalWindow: "Ideal Sunset Window 17:30 - 20:00",
        recommendation: "Ensure shaded cabanas and cold hydration stations for beachside gatherings."
      }
    }
  }
];

export const GET_LOCATION_BY_ID = (id) => 
  MOCK_WEATHER_LOCATIONS.find(loc => loc.id === id) || MOCK_WEATHER_LOCATIONS[0];
