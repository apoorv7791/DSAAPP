// controller/progressController.js — DB logic for learning topic progress
import { supabase } from '../db/supabase.js';

// GET /api/progress
export async function getProgress(req, res) {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from('learning_topic_progress')
        .select('topic_id')
        .eq('user_id', userId);

    if (error) {
        console.error('Failed to load progress', error);
        return res.status(500).json({ error: 'Failed to load progress' });
    }

    const progress = {};
    data.forEach((row) => {
        if (row.topic_id) {
            progress[row.topic_id] = true;
        }
    });

    res.json({ progress });
}

// POST /api/progress
export async function updateProgress(req, res) {
    const userId = req.user.id;
    const progress = req.body.progress;

    if (!progress || typeof progress !== 'object') {
        return res.status(400).json({ error: 'progress object is required' });
    }

    const completedEntries = [];
    const deleteIds = [];

    for (const [topicId, completed] of Object.entries(progress)) {
        if (completed === true) {
            completedEntries.push({
                user_id: userId,
                topic_id: topicId,
                completed: true,
                updated_at: new Date().toISOString(),
            });
        } else if (completed === false) {
            deleteIds.push(topicId);
        }
    }

    if (completedEntries.length > 0) {
        const { error } = await supabase
            .from('learning_topic_progress')
            .upsert(completedEntries, { onConflict: 'user_id,topic_id' });

        if (error) {
            console.error('Failed to upsert progress', error);
            return res.status(500).json({ error: 'Failed to update progress' });
        }
    }

    if (deleteIds.length > 0) {
        const { error } = await supabase
            .from('learning_topic_progress')
            .delete()
            .eq('user_id', userId)
            .in('topic_id', deleteIds);

        if (error) {
            console.error('Failed to delete progress rows', error);
            return res.status(500).json({ error: 'Failed to delete progress' });
        }
    }

    res.json({ success: true });
}
