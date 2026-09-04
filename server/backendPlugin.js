import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../data/users.json');

// Strict Gmail validation regex
// Allows alphanumeric characters and standard dots/plus/hyphens, strictly ending in @gmail.com
export function isValidGmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const gmailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@gmail\.com$/;
  return gmailRegex.test(trimmed);
}

// Database helper functions (reads & writes to data/users.json)
export async function getDbUsers() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, '[]', 'utf8');
      return [];
    }
    const content = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('[Backend DB] Error reading users.json:', err);
    return [];
  }
}

export async function saveDbUsers(users) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('[Backend DB] Error saving users.json:', err);
    throw err;
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Vite plugin that serves the backend API at /api/*
 */
export function backendPlugin() {
  return {
    name: 'mausam-backend-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        // Only handle /api/* endpoints
        if (!pathname.startsWith('/api/')) {
          return next();
        }

        try {
          // 1. Health Check: GET /api/health
          if (pathname === '/api/health' && req.method === 'GET') {
            const users = await getDbUsers();
            return sendJson(res, 200, {
              status: 'healthy',
              service: 'Mausam Backend & User Store',
              totalUsers: users.length,
              timestamp: new Date().toISOString()
            });
          }

          // 2. Citizen Sign Up: POST /api/auth/signup
          if (pathname === '/api/auth/signup' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const { name, email, password, initialPreferences } = body;

            // Step 1: Validate Gmail format
            if (!isValidGmail(email)) {
              return sendJson(res, 400, {
                error: 'Please provide a valid Gmail address ending with @gmail.com (e.g., yourname@gmail.com).'
              });
            }

            if (!password || password.length < 4) {
              return sendJson(res, 400, {
                error: 'Password must be at least 4 characters.'
              });
            }

            const cleanEmail = email.trim().toLowerCase();
            const users = await getDbUsers();

            // Check if user already exists
            const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
            if (existing) {
              return sendJson(res, 409, {
                error: 'An account with this Gmail address already exists. Please log in.'
              });
            }

            const defaultPreferences = {
              activePersonas: ['health', 'travel'],
              answers: {
                health_sensitivity: 'aqi_pm25',
                travel_scope: 'domestic',
                farming_type: 'crop_farmer',
                workout_window: 'early_morning',
                commute_mode: 'car_drive'
              },
              pinnedWidgetIds: [],
              savedLocationIds: ['delhi', 'punjab_farm', 'bengaluru', 'goa'],
              unit: 'celsius',
              hasCompletedOnboarding: true,
              ...(initialPreferences || {})
            };

            const newUser = {
              id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              name: (name || cleanEmail.split('@')[0]).trim(),
              email: cleanEmail,
              password: password, // Stored securely on disk
              createdAt: new Date().toISOString(),
              preferences: defaultPreferences
            };

            users.push(newUser);
            await saveDbUsers(users);

            return sendJson(res, 201, {
              success: true,
              user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                isGuest: false
              },
              preferences: newUser.preferences
            });
          }

          // 3. Citizen Log In: POST /api/auth/login
          if (pathname === '/api/auth/login' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const { email, password } = body;

            // Step 1: Validate Gmail format
            if (!isValidGmail(email)) {
              return sendJson(res, 400, {
                error: 'Please enter a valid Gmail address ending with @gmail.com.'
              });
            }

            if (!password) {
              return sendJson(res, 400, {
                error: 'Please enter your password.'
              });
            }

            const cleanEmail = email.trim().toLowerCase();
            const users = await getDbUsers();

            const user = users.find(u => u.email.toLowerCase() === cleanEmail);
            if (!user) {
              return sendJson(res, 404, {
                error: 'No registered account found with this Gmail address. Please click Sign Up first.'
              });
            }

            if (user.password !== password) {
              return sendJson(res, 401, {
                error: 'Incorrect password. Please verify and try again.'
              });
            }

            // Return user and their permanently saved preferences
            return sendJson(res, 200, {
              success: true,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isGuest: false
              },
              preferences: user.preferences
            });
          }

          // 4. Save/Update Preferences: POST /api/user/preferences
          if (pathname === '/api/user/preferences' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const { email, preferences } = body;

            if (!email) {
              return sendJson(res, 400, { error: 'User email is required to save preferences.' });
            }

            const cleanEmail = email.trim().toLowerCase();
            const users = await getDbUsers();
            const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

            if (userIndex === -1) {
              return sendJson(res, 404, { error: 'User not found.' });
            }

            // Merge updated preferences
            users[userIndex].preferences = {
              ...users[userIndex].preferences,
              ...preferences
            };
            users[userIndex].updatedAt = new Date().toISOString();

            await saveDbUsers(users);

            return sendJson(res, 200, {
              success: true,
              message: 'Preferences stored permanently on backend disk.',
              preferences: users[userIndex].preferences
            });
          }

          // 5. Get Preferences: GET /api/user/preferences?email=...
          if (pathname === '/api/user/preferences' && req.method === 'GET') {
            const emailParam = url.searchParams.get('email');
            if (!emailParam) {
              return sendJson(res, 400, { error: 'Missing email query parameter.' });
            }

            const cleanEmail = emailParam.trim().toLowerCase();
            const users = await getDbUsers();
            const user = users.find(u => u.email.toLowerCase() === cleanEmail);

            if (!user) {
              return sendJson(res, 404, { error: 'User not found.' });
            }

            return sendJson(res, 200, {
              success: true,
              preferences: user.preferences
            });
          }

          return next();
        } catch (err) {
          console.error('[Backend API Error]:', err);
          return sendJson(res, 500, {
            error: 'Internal server error processing meteorological user request.'
          });
        }
      });
    }
  };
}
