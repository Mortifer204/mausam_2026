import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { UserPreferences } from '../models/UserPreferences.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mausam_sih2026_fallback_secret_key';

export function isValidGmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const gmailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@gmail\.com$/;
  return gmailRegex.test(trimmed);
}

// 1. Citizen Signup: POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, initialPreferences } = req.body;

    if (!isValidGmail(email)) {
      return res.status(400).json({
        error: 'Please provide a valid Gmail address ending with @gmail.com (e.g., yourname@gmail.com).'
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({
        error: 'Password must be at least 4 characters.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        error: 'An account with this Gmail address already exists. Please log in.'
      });
    }

    // Hash password securely with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      customId: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: (name || cleanEmail.split('@')[0]).trim(),
      email: cleanEmail,
      password: hashedPassword,
      isPasswordHashed: true
    });

    const preferences = await UserPreferences.create({
      userId: newUser._id,
      email: cleanEmail,
      activePersonas: initialPreferences?.activePersonas || ['health', 'travel'],
      answers: initialPreferences?.answers || {
        health_sensitivity: 'aqi_pm25',
        travel_scope: 'domestic',
        farming_type: 'crop_farmer',
        workout_window: 'early_morning',
        commute_mode: 'car_drive'
      },
      pinnedWidgetIds: initialPreferences?.pinnedWidgetIds || [],
      removedWidgetIds: initialPreferences?.removedWidgetIds || [],
      customAddedWidgetIds: initialPreferences?.customAddedWidgetIds || [],
      savedLocationIds: initialPreferences?.savedLocationIds || ['delhi', 'punjab_farm', 'bengaluru', 'goa'],
      unit: initialPreferences?.unit || 'celsius',
      hasCompletedOnboarding: initialPreferences?.hasCompletedOnboarding ?? true,
      isCustomLifestyle: initialPreferences?.isCustomLifestyle ?? false
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.customId || newUser._id,
        name: newUser.name,
        email: newUser.email,
        isGuest: false
      },
      preferences
    });
  } catch (err) {
    console.error('[Auth Signup Error]:', err);
    return res.status(500).json({ error: 'Server error creating account.' });
  }
});

// 2. Citizen Login: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidGmail(email)) {
      return res.status(400).json({
        error: 'Please enter a valid Gmail address ending with @gmail.com.'
      });
    }

    if (!password) {
      return res.status(400).json({
        error: 'Please enter your password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        error: 'No registered account found with this Gmail address. Please click Sign Up first.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Incorrect password. Please verify and try again.'
      });
    }

    let preferences = await UserPreferences.findOne({ userId: user._id });
    if (!preferences) {
      preferences = await UserPreferences.create({
        userId: user._id,
        email: user.email
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.customId || user._id,
        name: user.name,
        email: user.email,
        isGuest: false
      },
      preferences
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// 3. Verify Session: GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User session not found.' });
    }

    const preferences = await UserPreferences.findOne({ userId: user._id });

    return res.status(200).json({
      success: true,
      user: {
        id: user.customId || user._id,
        name: user.name,
        email: user.email,
        isGuest: false
      },
      preferences
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

export default router;