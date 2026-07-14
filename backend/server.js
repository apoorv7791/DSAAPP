import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate } from './middleware/authenticate.js';
import progressRouter from './routes/progress.js';
import userRouter from './routes/user.js';
import { supabase } from './db/supabase.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

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

app.use(express.json({ limit: '1mb' }));

// Public routes
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

// Protected routes
app.use('/api', authenticate, progressRouter);
app.use('/api', authenticate, userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

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
