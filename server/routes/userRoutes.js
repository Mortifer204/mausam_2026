import express from 'express';
import { User } from '../models/User.js';
import { UserPreferences } from '../models/UserPreferences.js';

const router = express.Router();

// 1. Get Preferences: GET /api/user/preferences?email=...
router.get('/preferences', async (req, res) => {
  try {
    const emailParam = req.query.email;
    if (!emailParam) {
      return res.status(400).json({ error: 'Missing email query parameter.' });
    }

    const cleanEmail = emailParam.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: 'User account not found in Atlas DB.' });
    }

    let preferences = await UserPreferences.findOne({ userId: user._id });
    if (!preferences) {
      preferences = await UserPreferences.create({
        userId: user._id,
        email: cleanEmail
      });
    }

    return res.status(200).json({
      success: true,
      preferences
    });
  } catch (err) {
    console.error('[User Preferences GET Error]:', err);
    return res.status(500).json({ error: 'Error fetching user preferences.' });
  }
});

// 2. Save/Update Preferences: POST /api/user/preferences
router.post('/preferences', async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'User email is required to save preferences.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: 'User account not found in Atlas DB.' });
    }

    const updated = await UserPreferences.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          email: cleanEmail,
          ...preferences
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Preferences stored permanently on MongoDB Atlas.',
      preferences: updated
    });
  } catch (err) {
    console.error('[User Preferences POST Error]:', err);
    return res.status(500).json({ error: 'Error updating user preferences on Atlas.' });
  }
});

export default router;