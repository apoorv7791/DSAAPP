// controller/streakController.js — streak read + update logic
import { supabase } from '../db/supabase.js';

// GET /api/user/streak
export async function getStreak(req, res) {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak, last_active_date')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Failed to fetch streak', error);
        return res.status(500).json({ error: 'Failed to fetch streak' });
    }

    res.json({
        current_streak: data?.current_streak ?? 0,
        last_active_date: data?.last_active_date ?? null,
    });
}

// POST /api/user/streak
// Call this whenever the user does something active (marks a topic done, opens app, etc.)
// Logic:
//   - already active today  → no change, return current streak
//   - active yesterday      → increment streak
//   - 2+ days ago / never   → reset streak to 1
export async function updateStreak(req, res) {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Fetch existing streak row
    const { data: existing, error: fetchError } = await supabase
        .from('user_streaks')
        .select('current_streak, last_active_date')
        .eq('user_id', userId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Failed to fetch streak for update', fetchError);
        return res.status(500).json({ error: 'Failed to update streak' });
    }

    // Already marked active today — nothing to do
    if (existing?.last_active_date === today) {
        return res.json({
            current_streak: existing.current_streak,
            last_active_date: existing.last_active_date,
            updated: false,
        });
    }

    // Calculate new streak
    let newStreak = 1; // default: start fresh

    if (existing?.last_active_date) {
        const last = new Date(existing.last_active_date);
        const todayDate = new Date(today);
        const diffDays = Math.round(
            (todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
            // Consecutive day — keep the chain going
            newStreak = (existing.current_streak ?? 0) + 1;
        }
        // diffDays >= 2 → chain broke, newStreak stays 1
    }

    // Upsert the updated streak
    const { error: upsertError } = await supabase
        .from('user_streaks')
        .upsert(
            {
                user_id: userId,
                current_streak: newStreak,
                last_active_date: today,
            },
            { onConflict: 'user_id' }
        );

    if (upsertError) {
        console.error('Failed to upsert streak', upsertError);
        return res.status(500).json({ error: 'Failed to update streak' });
    }

    res.json({
        current_streak: newStreak,
        last_active_date: today,
        updated: true,
    });
}
