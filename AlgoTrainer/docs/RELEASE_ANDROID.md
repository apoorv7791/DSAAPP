# Android release (Google Play) with EAS

AlgoTrainer uses **Expo Application Services (EAS)** with the `production` profile from [`eas.json`](../eas.json). Native `android/` is generated on the build servers (not committed).

## 1. Environment variables on EAS (required)

Local `.env` is **not** available during cloud builds. Set the same `EXPO_PUBLIC_*` variables for production:

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `EXPO_PUBLIC_BACKEND_URL` | Public **HTTPS** base URL of your deployed backend API (used for progress, goal, and streak endpoints) |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | Public **HTTPS** URL you host (see [`docs/legal/privacy-policy.html`](legal/privacy-policy.html)) |
| `EXPO_PUBLIC_TERMS_OF_SERVICE_URL` | Optional; public HTTPS URL for Terms (see [`docs/legal/terms-of-service.html`](legal/terms-of-service.html)) |

### Using EAS CLI (Expo account)

From `AlgoTrainer/`:

```bash
npx eas-cli login
```

Create or update environment variables for the **production** environment (names must match exactly; values are available at bundle time for `EXPO_PUBLIC_*`):

```bash
npx eas-cli env:create --name EXPO_PUBLIC_SUPABASE_URL --type string --environment production --value "https://YOUR_PROJECT_REF.supabase.co"
npx eas-cli env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --type sensitive --environment production
npx eas-cli env:create --name EXPO_PUBLIC_BACKEND_URL --type string --environment production --value "https://api.your-domain.example"
npx eas-cli env:create --name EXPO_PUBLIC_PRIVACY_POLICY_URL --type string --environment production --value "https://your-domain.example/privacy-policy.html"
```

**Important:** If `eas build` prints **“No environment variables … found for the `production` environment”**, the AAB may still build, but the app will **throw on startup** until `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set on EAS. Also, if `EXPO_PUBLIC_BACKEND_URL` is missing, logged-in features that call your backend will fall back to `http://localhost:4000`, which will not work for Play users. Create those variables, then rebuild.

Repeat for optional Terms URL. If your CLI version uses interactive prompts instead, use `eas env:create` and follow the prompts equivalent to the above.

Alternatively, use **Expo dashboard → Project → Environment variables**.

See also: [EAS Environment variables](https://docs.expo.dev/eas/environment-variables/).

## 2. Production AAB build

```bash
cd AlgoTrainer
npx eas-cli build --platform android --profile production
```

- Do **not** use the `development` profile for Play; it sets `developmentClient: true`.
- With `"appVersionSource": "remote"`, bump the **version name** in the Expo project when you ship meaningful updates; `autoIncrement` handles **versionCode** for Play uploads.

## 3. Submit to Play (optional)

After a successful build:

```bash
npx eas-cli submit --platform android --profile production --latest
```

Ensure Play Console **Upload key** / **App signing** is configured per Google’s flow.

## 4. Smoke-test config locally (no EAS login)

Verify static config resolves (replace with placeholder values):

```bash
cd AlgoTrainer
EXPO_PUBLIC_SUPABASE_URL=https://example.supabase.co \
EXPO_PUBLIC_SUPABASE_ANON_KEY=example-anon-key \
EXPO_PUBLIC_BACKEND_URL=https://api.example.com \
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://example.com/privacy \
npx expo config --type public
```

The app throws on startup if Supabase env vars are missing—this surfaces misconfigured EAS env before users hit a blank screen.

## 5. Account deletion backend

Ship the **delete-account** Edge Function before relying on in-app deletion in production:

```bash
cd AlgoTrainer
supabase functions deploy delete-account
```

See [`supabase/README.md`](../supabase/README.md).
