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

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('[authenticate] Supabase token verification failed:', error?.message);
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = {
            id: user.id,
            email: user.email ?? null,
        };

        next();
    } catch (err) {
        console.error('[authenticate] Authentication failed:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
}