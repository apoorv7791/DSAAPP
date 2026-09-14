// middleware/authenticate.js — verifies Supabase JWT locally (no network round-trip)
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!JWT_SECRET) {
    console.error('[authenticate] Missing SUPABASE_JWT_SECRET in environment. Add it to your .env file.');
    process.exit(1);
}

export function authenticate(req, res, next) {
    const authorization = req.headers.authorization;
    const token =
        typeof authorization === 'string' && authorization.startsWith('Bearer ')
            ? authorization.slice(7)
            : null;

    if (!token) {
        return res.status(401).json({ error: 'Missing authorization token' });
    }

    try {
        // Supabase JWTs use HS256 signed with the project JWT secret.
        // Verifying locally avoids a Supabase API call on every request.
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

        // Supabase puts the user UUID in the `sub` claim
        if (!payload.sub) {
            return res.status(401).json({ error: 'Invalid token: missing sub claim' });
        }

        // Mimic the shape that supabase.auth.getUser() used to return
        req.user = { id: payload.sub, email: payload.email ?? null };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}
