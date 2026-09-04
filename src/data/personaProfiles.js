// Data definitions for the 8 Target User Categories for MoES/IMD Mausam
export const PERSONA_CATEGORIES = [
  {
    id: "health",
    title: "Health & Wellness",
    tagline: "Air Quality, UV, Pollen & Respiratory Safety",
    icon: "HeartPulse",
    color: "emerald",
    accentBg: "bg-emerald-500/15",
    borderAccent: "border-emerald-500/30",
    textAccent: "text-emerald-400",
    questions: [
      {
        id: "health_sensitivity",
        prompt: "Do you or family members have specific environmental sensitivities?",
        options: [
          { value: "aqi_pm25", label: "Smog & PM2.5 (Asthma/Dust)" },
          { value: "pollen_allergies", label: "Pollen & Seasonal Allergies" },
          { value: "heat_migraine", label: "Heat Sensitivity & Migraines" },
          { value: "general_wellness", label: "General Healthy Living" },
        ]
      }
    ],
    priorityWidgets: ["health_aqi", "uv_index", "humidity_heat", "rain_probability", "forecast_7day"]
  },
  {
    id: "fitness",
    title: "Outdoor Fitness",
    tagline: "Best Running Hours, Heat Index & Wind",
    icon: "Flame",
    color: "amber",
    accentBg: "bg-amber-500/15",
    borderAccent: "border-amber-500/30",
    textAccent: "text-amber-400",
    questions: [
      {
        id: "workout_window",
        prompt: "When do you usually exercise outdoors?",
        options: [
          { value: "early_morning", label: "Early Morning (5:00 - 7:30 AM)" },
          { value: "evening", label: "Evening (5:30 - 8:00 PM)" },
          { value: "weekends", label: "Weekend Long Runs / Cycling" },
          { value: "flexible", label: "Whenever weather is optimal" },
        ]
      }
    ],
    priorityWidgets: ["fitness_running", "feels_like_temp", "uv_index", "wind_metrics", "sunrise_sunset"]
  },
  {
    id: "travel",
    title: "Travel & Transit",
    tagline: "Destination Weather, Radar & Packing Assistant",
    icon: "Plane",
    color: "sky",
    accentBg: "bg-sky-500/15",
    borderAccent: "border-sky-500/30",
    textAccent: "text-sky-400",
    questions: [
      {
        id: "travel_scope",
        prompt: "What kind of travel do you primarily undertake?",
        options: [
          { value: "domestic", label: "Domestic Flight & Train Travel" },
          { value: "roadtrips", label: "Highway Road Trips & Getaways" },
          { value: "international", label: "International Travel" },
          { value: "frequent_weekend", label: "Weekend Intercity Trips" },
        ]
      }
    ],
    priorityWidgets: ["travel_packing", "destination_weather", "rain_probability", "severe_alerts", "forecast_7day"]
  },
  {
    id: "farming",
    title: "Farming & Gardening",
    tagline: "Soil Moisture, 72h Rain & Agromet Advisory",
    icon: "Sprout",
    color: "green",
    accentBg: "bg-green-500/15",
    borderAccent: "border-green-500/30",
    textAccent: "text-green-400",
    questions: [
      {
        id: "farming_type",
        prompt: "What best describes your agricultural profile?",
        options: [
          { value: "crop_farmer", label: "Field Farmer (Cereals, Pulses, Cash Crops)" },
          { value: "horticulture", label: "Horticulture / Fruit Orchards" },
          { value: "home_gardener", label: "Home / Kitchen Gardener" },
          { value: "agri_consultant", label: "Agri-consultant / Plantation" },
        ]
      }
    ],
    priorityWidgets: ["farming_agro", "soil_moisture", "rain_probability", "frost_dew", "wind_metrics"]
  },
  {
    id: "family",
    title: "Family & Kids",
    tagline: "School Commute Safety, Rain Alerts & Play Windows",
    icon: "Users",
    color: "indigo",
    accentBg: "bg-indigo-500/15",
    borderAccent: "border-indigo-500/30",
    textAccent: "text-indigo-400",
    questions: [
      {
        id: "family_focus",
        prompt: "What is your main family weather priority?",
        options: [
          { value: "school_commute", label: "Morning School Drop & Bus Weather" },
          { value: "outdoor_play", label: "Afternoon Outdoor Play Safety" },
          { value: "weekend_outings", label: "Weekend Family Trips & Picnics" },
          { value: "elder_care", label: "Elderly Heat & Humidity Care" },
        ]
      }
    ],
    priorityWidgets: ["family_commute", "rain_probability", "health_aqi", "severe_alerts", "forecast_7day"]
  },
  {
    id: "commuter",
    title: "Daily Commute",
    tagline: "Fog, Visibility, Squalls & Highway Delays",
    icon: "Car",
    color: "blue",
    accentBg: "bg-blue-500/15",
    borderAccent: "border-blue-500/30",
    textAccent: "text-blue-400",
    questions: [
      {
        id: "commute_mode",
        prompt: "How do you primarily commute to work?",
        options: [
          { value: "two_wheeler", label: "Motorcycle / Scooter (High weather exposure)" },
          { value: "car_drive", label: "Driving Car (Visibility & Fog focus)" },
          { value: "public_transit", label: "Metro / Bus / Train" },
          { value: "walking_cycling", label: "Walking / Bicycle" },
        ]
      }
    ],
    priorityWidgets: ["commuter_fog", "rain_probability", "wind_metrics", "severe_alerts", "humidity_heat"]
  },
  {
    id: "beach",
    title: "Beach & Surf",
    tagline: "Tide Timings, Wave Swell, Water Temp & Coastal Winds",
    icon: "Waves",
    color: "cyan",
    accentBg: "bg-cyan-500/15",
    borderAccent: "border-cyan-500/30",
    textAccent: "text-cyan-400",
    questions: [
      {
        id: "beach_activity",
        prompt: "What is your primary coastal activity?",
        options: [
          { value: "surfing_water", label: "Surfing, Swimming & Water Sports" },
          { value: "beach_leisure", label: "Beach Leisure, Sunbathing & Walks" },
          { value: "coastal_fishing", label: "Coastal Boating & Angling" },
          { value: "photography", label: "Seascape & Sunset Photography" },
        ]
      }
    ],
    priorityWidgets: ["beach_tides", "wind_metrics", "uv_index", "sunrise_sunset", "forecast_7day"]
  },
  {
    id: "events",
    title: "Outdoor Events",
    tagline: "Event Feasibility, Extended Rain Prob & Comfort Index",
    icon: "CalendarCheck",
    color: "rose",
    accentBg: "bg-rose-500/15",
    borderAccent: "border-rose-500/30",
    textAccent: "text-rose-400",
    questions: [
      {
        id: "event_type",
        prompt: "What kind of events are you tracking?",
        options: [
          { value: "wedding_party", label: "Weddings, Lawn Receptions & Parties" },
          { value: "sports_tournament", label: "Sports Matches & Outdoor Tournaments" },
          { value: "festivals_concerts", label: "Concerts, Fairs & Exhibitions" },
          { value: "corporate_retreats", label: "Corporate Team Offsites" },
        ]
      }
    ],
    priorityWidgets: ["event_forecast", "rain_probability", "wind_metrics", "humidity_heat", "forecast_7day"]
  }
];

export const GET_PERSONA_BY_ID = (id) => PERSONA_CATEGORIES.find(p => p.id === id);
