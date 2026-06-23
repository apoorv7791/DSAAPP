// routes/user.js — user profile, goal, streak routes
import express from 'express';
import {
    getProfile,
    updateProfile,
    getGoal,
    setGoal,
    getStreak,
} from '../controller/userController.js';

const router = express.Router();

router.get('/user/profile', getProfile);
router.put('/user/profile', updateProfile);
router.get('/user/goal', getGoal);
router.post('/user/goal', setGoal);
router.get('/user/streak', getStreak);

export default router;
