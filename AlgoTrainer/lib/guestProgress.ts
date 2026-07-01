// lib/guestProgress.ts
import { storage } from './storage';

const GUEST_GOAL_KEY = 'guest_daily_goal';


export const guestProgress = {
    async getGoal(): Promise<number | null> {
        return storage.get<number | null>(GUEST_GOAL_KEY, null);
    },
    async setGoal(minutes: number): Promise<void> {
        return storage.set(GUEST_GOAL_KEY, minutes);
    },
    async clearGoal(): Promise<void> {
        return storage.remove(GUEST_GOAL_KEY);
    },
};
