// controller/userController.js — DB logic for user profile, goal, streak
import { supabase } from '../db/supabase.js';

// GET /api/user/profile
export async function getProfile(req, res) {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Failed to fetch profile', error);
        return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    res.json({ profile: data });
}

// PUT /api/user/profile
export async function updateProfile(req, res) {
    const userId = req.user.id;
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'username is required' });
    }

    const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', userId);

    if (error) {
        console.error('Failed to update profile', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }

    res.json({ success: true });
}

// GET /api/user/goal
export async function getGoal(req, res) {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('user_goals')
        .select('daily_minutes')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
        console.error('Failed to fetch goal', error);
        return res.status(500).json({ error: 'Failed to fetch goal' });
    }

    res.json({ daily_minutes: data?.daily_minutes ?? null });
}

// POST /api/user/goal
export async function setGoal(req, res) {
    const userId = req.user.id;
    const { daily_minutes } = req.body;

    if (!daily_minutes || typeof daily_minutes !== 'number') {
        return res.status(400).json({ error: 'daily_minutes (number) is required' });
    }

    const { error } = await supabase
        .from('user_goals')
        .upsert({ user_id: userId, daily_minutes }, { onConflict: 'user_id' });

    if (error) {
        console.error('Failed to set goal', error);
        return res.status(500).json({ error: 'Failed to set goal' });
    }

    res.json({ success: true });
}

