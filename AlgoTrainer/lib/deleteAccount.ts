import { supabase } from './supabase';

export type DeleteAccountResult = { ok: true } | { ok: false; message: string };

/**
 * Deletes the signed-in user via Supabase Edge Function `delete-account` (service role on server).
 * Deploy: `supabase functions deploy delete-account` — see supabase/README.md.
 */
export async function deleteAccountViaEdgeFunction(): Promise<DeleteAccountResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return { ok: false, message: 'You are not signed in.' };
  }

  const base = process.env.EXPO_PUBLIC_SUPABASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/functions/v1/delete-account`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let message = `Request failed (${res.status})`;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j.error) message = j.error;
    } catch {
      if (text) message = text;
    }
    return { ok: false, message };
  }

  return { ok: true };
}
