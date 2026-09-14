import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { authenticate } from './middleware/authenticate.js';
import progressRouter from './routes/progress.js';
import userRouter from './routes/user.js';
import { supabase } from './db/supabase.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

// ─── CORS ────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.EXPO_PUBLIC_FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps / curl / Postman
      if (
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS not allowed'));
    },
  })
);

// ─── REQUEST LOGGING ─────────────────────────────────────────────────────────
// 'dev' format: "GET /api/progress 200 4ms"
// Switch to 'combined' in production if you want Apache-style logs for log aggregators.
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── BODY PARSING ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ─── RATE LIMITING ───────────────────────────────────────────────────────────

// General limiter — applies to all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // 200 requests per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Tighter limiter for mutating endpoints (POST/PUT/DELETE on user data)
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,                   // 60 writes per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.send('AlgoTrainer backend is running');
});

app.get('/health', async (_req, res) => {
  const { error } = await supabase.from('profiles').select('id').limit(1);

  if (error) {
    return res.status(503).json({
      status: 'degraded',
      database: 'unreachable',
      error: error.message,
    });
  }

  res.json({
    status: 'ok',
    database: 'connected',
    uptime: process.uptime(),
  });
});

// ─── PROTECTED ROUTES ────────────────────────────────────────────────────────

app.use('/api', apiLimiter, authenticate, progressRouter);
app.use('/api', apiLimiter, authenticate, userRouter);

// Apply the tighter write limiter on top of the general one for mutations
app.use('/api', writeLimiter, authenticate, (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) return next();
  next('route');
});

// ─── ERROR HANDLERS ──────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── STARTUP ─────────────────────────────────────────────────────────────────

async function startServer() {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      console.error('[DB] connection failed:', error.message);
    } else {
      console.log('[DB] connected successfully');
    }

    const server = app.listen(PORT, () => {
      console.log(`AlgoTrainer backend listening on port ${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
