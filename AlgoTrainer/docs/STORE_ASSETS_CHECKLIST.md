# Play Store graphic assets — checklist

Complete these in **Google Play Console → Store presence** (names may vary slightly).

## Required / recommended

| Asset | Spec (typical) | Notes |
|--------|-----------------|------|
| **App icon** | 512×512 PNG (high-res icon in Console) | Use a foreground-safe design; avoid tiny text. |
| **Feature graphic** | **1024×500** JPEG or PNG | One banner; no transparency. |
| **Phone screenshots** | Min 2; PNG or JPEG; 16:9 or 9:16 per device | Show: home/topics, a lesson screen, settings/profile **with no personal data**, signed-out state if cleaner. |
| **Short description** | ≤80 chars | See [`PLAY_STORE_LISTING.md`](PLAY_STORE_LISTING.md). |
| **Full description** | ≤4000 chars | Same file. |

## Adaptive icon (Android app bundle)

In [`app.config.ts`](../app.config.ts), `android.adaptiveIcon.foregroundImage` should keep **important content inside the center ~66% circle** (Android masks the outer ring). If the current `Algo.png` looks cropped on some launchers:

1. Export a **1024×1024** foreground with padding / simplified logo.  
2. Keep `backgroundColor` consistent with brand (`#E6F4FE` today).  
3. Point `foregroundImage` at the new file (e.g. `assets/images/Algo-adaptive-fg.png`).

## Content rating

Complete the **IARC / content rating questionnaire** honestly (likely low sensitivity for an educational app—still disclose user interaction if applicable).

## Target audience & Families

If you declare **Families** or **Children**, extra policies apply. Default assumption: **not** directed at children under 13; align with your Privacy Policy.

## Privacy & Data safety URLs

- **Privacy policy URL:** must be **HTTPS** and publicly reachable. Host [`legal/privacy-policy.html`](legal/privacy-policy.html) (or sync your in-app policy to the same text).  
- **Data safety:** see [`PLAY_DATA_SAFETY.md`](PLAY_DATA_SAFETY.md).

## Internal testing track

Upload an **internal testing** build first, install from Play’s tester link, and verify: cold start, sign-up/sign-in, delete account, copy-code, and offline errors.
