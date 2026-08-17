// routes/user.js — user profile, goal, streak, difficulty routes
import express from 'express';
import {
    getProfile,
    updateProfile,
    getGoal,
    setGoal,
} from '../controller/userController.js';
import { getDifficulty, setDifficulty } from '../controller/difficultyController.js';
import { getStreak, updateStreak } from '../controller/streakController.js';

const router = express.Router();

router.get('/user/profile', getProfile);
router.put('/user/profile', updateProfile);
router.get('/user/goal', getGoal);
router.post('/user/goal', setGoal);
router.get('/user/streak', getStreak);
router.post('/user/streak', updateStreak);       // new — updates streak on activity
router.get('/user/difficulty', getDifficulty);   // new
router.put('/user/difficulty', setDifficulty);   // new

export default router;
