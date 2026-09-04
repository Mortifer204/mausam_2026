import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB } from './db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { User } from './models/User.js';
import { UserPreferences } from './models/UserPreferences.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../data/users.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// 1. Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    return res.json({
      status: 'healthy',
      service: 'Mausam Express & MongoDB Atlas Backend',
      cluster: 'MausamCluster',
      database: 'mausam_db',
      totalRegisteredCitizens: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message });
  }
});

// 2. Mount Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Serve built production frontend if dist directory exists
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// 3. Optional: Initial Data Migration from data/users.json to Atlas
async function migrateLegacyUsers() {
  try {
    if (!fs.existsSync(DB_PATH)) return;
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const legacyUsers = JSON.parse(raw || '[]');

    if (!Array.isArray(legacyUsers) || legacyUsers.length === 0) return;

    console.log(`[Migration] Checking ${legacyUsers.length} legacy users from users.json...`);
    let migratedCount = 0;

    for (const legacy of legacyUsers) {
      if (!legacy.email) continue;
      const cleanEmail = legacy.email.trim().toLowerCase();

      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create({
          customId: legacy.id,
          name: legacy.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          password: legacy.password || 'password123',
          isPasswordHashed: false
        });
        migratedCount++;
      }

      if (legacy.preferences) {
        await UserPreferences.findOneAndUpdate(
          { userId: user._id },
          {
            $set: {
              email: cleanEmail,
              ...legacy.preferences
            }
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }

    if (migratedCount > 0) {
      console.log(`[Migration] Successfully seeded ${migratedCount} accounts into MongoDB Atlas!`);
    } else {
      console.log('[Migration] All legacy accounts are already synchronized with Atlas.');
    }
  } catch (err) {
    console.warn('[Migration Warning]: Could not complete legacy migration:', err.message);
  }
}

// 4. Start Server
async function startServer() {
  try {
    await connectDB();
    await migrateLegacyUsers();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=================================================`);
      console.log(`⚡ Mausam Backend running on: http://localhost:${PORT}`);
      console.log(`☁️  Database: Connected to MongoDB Atlas Cluster`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('[Fatal Server Startup Error]:', err);
    process.exit(1);
  }
}

startServer();