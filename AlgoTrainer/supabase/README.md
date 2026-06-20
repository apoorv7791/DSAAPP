# Supabase (AlgoTrainer)

This folder was added so schema changes can live in git (`migrations/`) instead of only the Dashboard.

## One-time remote link

1. Install the CLI: [Supabase CLI](https://supabase.com/docs/guides/cli).
2. From `AlgoTrainer/`, run `supabase login` then `supabase link --project-ref <your-project-ref>`.

## Baseline from an existing project

After linking:

```bash
supabase db pull
```

That writes remote schema into `supabase/migrations/`. Resolve overlaps with any local migration (e.g. `learning_topic_progress`) before pushing to production.

## Local stack

Match `[db] major_version` in `config.toml` to your hosted Postgres (Dashboard → Database → version, or `SHOW server_version;`).

```bash
supabase start
supabase db reset
```

Client env vars stay in `.env` / `.env.local` (see `.env.example`); never commit real keys.

## Account deletion (Edge Function)

The app sends **POST** to **`delete-account`** to remove `learning_topic_progress`, `profiles`, and the auth user. Deploy after linking your project:

```bash
cd AlgoTrainer
supabase functions deploy delete-account
```

Hosted projects inject `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` automatically for Edge Functions.

Ensure migrations are applied so **`public.profiles`** exists (see `migrations/20250516120000_profiles.sql`) alongside `learning_topic_progress`. If you already created `profiles` manually, run `supabase db push` or merge policies in the Dashboard before shipping.

## Public legal pages (Play Store)

Host the HTML under [`docs/legal/`](../docs/legal/) at stable HTTPS URLs and set `EXPO_PUBLIC_PRIVACY_POLICY_URL` / `EXPO_PUBLIC_TERMS_OF_SERVICE_URL` in EAS—see [`docs/RELEASE_ANDROID.md`](../docs/RELEASE_ANDROID.md).
