// lib/useStreak.ts — fetches and updates the user's streak
// Used by the home screen (display) and _layout.tsx (app-open trigger).

import { useState, useCallback } from 'react';
import { getStreak } from '@/lib/backendApi';

export type StreakState = {
    currentStreak: number;
    lastActiveDate: string | null;
    loaded: boolean;
};

export function useStreak() {
    const [streak, setStreak] = useState<StreakState>({
        currentStreak: 0,
        lastActiveDate: null,
        loaded: false,
    });

    const fetchStreak = useCallback(async () => {
        try {
            const data = await getStreak() as { current_streak: number; last_active_date: string | null };
            setStreak({
                currentStreak: data.current_streak ?? 0,
                lastActiveDate: data.last_active_date ?? null,
                loaded: true,
            });
        } catch {
            // Backend unreachable — show 0, don't crash
            setStreak(prev => ({ ...prev, loaded: true }));
        }
    }, []);

    return { streak, fetchStreak };
}
