import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

// ==========================================
// 🛡️ CYBERSECURITY & SAFETY PROTOCOLS
// ==========================================

// 1. Trust Reverse Proxy (Required for Render, Nginx, Cloudflare to accurately parse client IPs & protocols)
app.set('trust proxy', 1);

// 2. Protocol Security: Enforce HTTPS in Production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// 3. Security Headers via Helmet (HSTS, Anti-Clickjacking, Anti-Sniffing)
app.use(helmet({
  contentSecurityPolicy: false, // Prevents breaking third-party weather map tiles and Google fonts
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000, // 1 Year HSTS (HTTP Strict Transport Security)
    includeSubDomains: true,
    preload: true
  }
}));
app.disable('x-powered-by'); // Mask Express server banner

// 4. Hardened CORS Whitelist
const ALLOWED_ORIGINS = [
  'https://mausam-2026.onrender.com',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost',
  'capacitor://localhost'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permit requests with no origin (e.g. mobile apps, curl, internal server-to-server)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(new Error(`Blocked by CORS security policy: origin ${origin} not authorized.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 5. Request Payload Limiting (Mitigate Memory Exhaustion & Buffer Bombing DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Data Sanitization against NoSQL Query Operator Injections ($gt, $ne, etc.)
function sanitizeInput(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeInput(obj[key]);
    }
  }
  return obj;
}

app.use((req, res, next) => {
  if (req.body) sanitizeInput(req.body);
  if (req.query) sanitizeInput(req.query);
  if (req.params) sanitizeInput(req.params);
  next();
});

// 7. Rate Limiting Protocols
// Strict Rate Limiter for Authentication (Mitigate credential stuffing & brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 attempts per IP
  standardHeaders: true, // Return RateLimit-* headers
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts from this IP. Please wait 15 minutes before retrying.'
  }
});

// General API Rate Limiter (Mitigate automated scraping & DDoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests received from this network. Please try again after 15 minutes.'
  }
});

// Mount Rate Limiters on API Endpoints
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

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

// 4. Safe Error Handler: Prevent leaking stack traces or internal server details to clients
app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('Blocked by CORS')) {
    return res.status(403).json({ error: 'Forbidden: Request blocked by CORS security policy.' });
  }
  console.error('[Unhandled Server Error]:', err.message);
  return res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected security or server error occurred.' 
      : err.message
  });
});

// 5. Start Server
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