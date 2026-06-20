# Google Play Data safety — AlgoTrainer draft

Use this as a **draft** when completing **App content → Data safety** in Play Console. Adjust if you add analytics, ads, or new SDKs.

## Data collection and security

| Question area | Suggested answer (verify against your live app) |
|---------------|--------------------------------------------------|
| **Collected or shared?** | The app collects **some** data (account email for authentication; optional synced learning topic progress). |
| **Encryption in transit** | **Yes** (HTTPS to Supabase). |
| **Account creation** | **Yes** (email + password via Supabase Auth). |
| **Account deletion** | **In-app** deletion removes the Supabase user and related rows; users can also contact `support@algotrainer.app` (per privacy policy). |

## Data types

### Personal info

- **Email address**  
  - **Collected:** Yes (user provides at sign-up).  
  - **Purpose:** Account management / authentication.  
  - **Required or optional:** Required for account features.  
  - **Ephemeral:** No.  
  - **User can delete:** Yes (account deletion in Profile, or support request).

### App activity (if you treat synced progress as such)

- **Other user-generated content** (or **App interactions**, depending on Play’s taxonomy): optional **learning topic completion** synced to Supabase (`learning_topic_progress`).  
  - **Purpose:** App functionality (personalise / resume progress).  
  - **User can delete:** Yes (deleted with account; local-only data cleared on device when user deletes account in-app).

### Clipboard

- The app **writes** code examples to the device clipboard when the user taps “copy”. It does **not** read the clipboard for collection. In Play’s form, answer **clipboard** questions based on whether you declare **reading** clipboard; typically you **do not** collect clipboard **content** from the user if you only **set** clipboard for copy-to-paste UX. Re-read the current Play questionnaire wording and choose the option that matches **read vs write** behavior.

## Data handled ephemerally

- If you do **not** process data only in memory without retention, answer **No** unless you implement that pattern.

## Prominent disclosure

- No extra location / sensitive permission prompts beyond what Expo modules add; clipboard write may not require a runtime permission on recent Android—follow Play rules for any permission or sensitive behavior you add later.

## Developers / service providers

- **Supabase** (authentication, database). Link their privacy policy where the form allows.

## Updates

When you add third-party SDKs (analytics, ads, crash reporting), revisit this document and the Play form.
