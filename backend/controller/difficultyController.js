// controller/difficultyController.js — difficulty level read + update
import { supabase } from '../db/supabase.js';

const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];

// GET /api/user/difficulty
export async function getDifficulty(req, res) {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('profiles')
        .select('difficulty')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Failed to fetch difficulty', error);
        return res.status(500).json({ error: 'Failed to fetch difficulty' });
    }

    res.json({ difficulty: data?.difficulty ?? null });
}

// PUT /api/user/difficulty
export async function setDifficulty(req, res) {
    const userId = req.user.id;
    const { difficulty } = req.body;

    if (!difficulty || !VALID_LEVELS.includes(difficulty)) {
        return res.status(400).json({
            error: `difficulty must be one of: ${VALID_LEVELS.join(', ')}`,
        });
    }

    const { error } = await supabase
        .from('profiles')
        .update({ difficulty })
        .eq('id', userId);

    if (error) {
        console.error('Failed to update difficulty', error);
        return res.status(500).json({ error: 'Failed to update difficulty' });
    }

    res.json({ success: true, difficulty });
}
