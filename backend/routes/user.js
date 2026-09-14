// routes/user.js — user profile, goal, streak, difficulty routes
import express from 'express';
import {
    getProfile,
    updateProfile,
    deleteProfile,
    getGoal,
    setGoal,
    deleteGoal,
} from '../controller/userController.js';
import { getDifficulty, setDifficulty } from '../controller/difficultyController.js';
import { getStreak, updateStreak } from '../controller/streakController.js';

const router = express.Router();

router.get('/user/profile', getProfile);
router.put('/user/profile', updateProfile);
router.delete('/user/profile', deleteProfile);   // account deletion

router.get('/user/goal', getGoal);
router.post('/user/goal', setGoal);
router.delete('/user/goal', deleteGoal);         // clear goal

router.get('/user/streak', getStreak);
router.post('/user/streak', updateStreak);

router.get('/user/difficulty', getDifficulty);
router.put('/user/difficulty', setDifficulty);

export default router;
