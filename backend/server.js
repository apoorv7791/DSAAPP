
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PORT = Number(process.env.PORT ?? 4000);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

async function authenticate(req, res, next) {
    const authorization = req.headers.authorization;
    const token = typeof authorization === 'string' && authorization.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length)
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Missing authorization token' });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user;
    next();
}

app.get('/', (req, res) => {
    res.send('AlgoTrainer backend is running');
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/progress', authenticate, async (req, res) => {
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
});

app.post('/api/progress', authenticate, async (req, res) => {
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
});

app.listen(PORT, () => {
    console.log(`AlgoTrainer backend listening on port ${PORT}`);
});

