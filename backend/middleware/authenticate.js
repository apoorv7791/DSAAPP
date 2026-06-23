// middleware/authenticate.js — verifies Supabase JWT on every protected request
import { supabase } from '../db/supabase.js';

export async function authenticate(req, res, next) {
    const authorization = req.headers.authorization;
    const token =
        typeof authorization === 'string' && authorization.startsWith('Bearer ')
            ? authorization.slice(7)
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
