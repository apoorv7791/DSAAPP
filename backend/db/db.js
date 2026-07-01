// db/db.js — PostgreSQL connection pool using Supabase's connection string
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Supabase provides a direct Postgres connection string in your project settings:
// Settings → Database → Connection string → URI mode
// Add it to backend/.env as DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for Supabase hosted Postgres
});

// Test the connection on startup
pool.connect((err, _client, release) => {
    if (err) {
        console.error('[DB] Failed to connect to PostgreSQL:', err.message);
        return;
    }
    release();
    console.log('[DB] PostgreSQL connected successfully');
});

export default pool;
