import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  activePersonas: {
    type: [String],
    default: ['health', 'travel']
  },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      health_sensitivity: 'aqi_pm25',
      travel_scope: 'domestic',
      farming_type: 'crop_farmer',
      workout_window: 'early_morning',
      commute_mode: 'car_drive'
    }
  },
  pinnedWidgetIds: {
    type: [String],
    default: []
  },
  removedWidgetIds: {
    type: [String],
    default: []
  },
  customAddedWidgetIds: {
    type: [String],
    default: []
  },
  savedLocationIds: {
    type: [String],
    default: ['delhi', 'punjab_farm', 'bengaluru', 'goa']
  },
  savedLocations: {
    type: Array,
    default: []
  },
  activeLocationId: {
    type: String,
    default: null
  },
  unit: {
    type: String,
    default: 'celsius'
  },
  hasCompletedOnboarding: {
    type: Boolean,
    default: true
  },
  isCustomLifestyle: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
export default UserPreferences;