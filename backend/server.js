// server.js — entry point, mounts all routes
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate } from './middleware/authenticate.js';
import progressRouter from './routes/progress.js';
import userRouter from './routes/user.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

// Public routes
app.get('/', (_req, res) => res.send('AlgoTrainer backend is running'));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Protected routes — authenticate runs before every /api request
app.use('/api', authenticate, progressRouter);
app.use('/api', authenticate, userRouter);

app.listen(PORT, () => {
    console.log(`AlgoTrainer backend listening on port ${PORT}`);
});
