// routes/progress.js — learning topic progress routes
import express from 'express';
import { getProgress, updateProgress } from '../controller/progressController.js';

const router = express.Router();

router.get('/progress', getProgress);
router.post('/progress', updateProgress);

export default router;
