import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { usePathname } from 'expo-router';
import { learningTopicIdFromSegments, type LearningTopicId, LEARNING_TOPIC_IDS } from '@/lib/learningTopics';
import {
    loadLearningProgress,
    saveLearningProgress,
    type LearningProgressMap,
} from '@/lib/learningProgressStorage';
import { useAuth } from '@/auth/AuthContext';
import { supabase } from '@/lib/supabase';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

async function getAccessToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
}

async function fetchRemoteProgress(token: string): Promise<LearningProgressMap> {
    const response = await fetch(`${BACKEND_URL}/api/progress`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load remote progress');
    }

    const body = await response.json();
    return body.progress ?? {};
}

async function sendRemoteProgress(token: string, progress: LearningProgressMap): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/api/progress`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
    });

    if (!response.ok) {
        throw new Error('Failed to save remote progress');
    }
}

async function updateStreak(token: string): Promise<void> {
    try {
        await fetch(`${BACKEND_URL}/api/user/streak`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        // Silently succeed or fail — streak is not critical enough to block user actions
    } catch (e) {
        console.log('Streak update failed:', e);
    }
}

type LearningProgressContextValue = {
    /** Topic ids marked complete (true only; missing = not done) */
    completedById: LearningProgressMap;
    loaded: boolean;
    /** Mark complete when user opens a lesson (idempotent). */
    markComplete: (id: LearningTopicId) => void;
    /** Toggle completion from Progress screen. */
    toggleTopic: (id: LearningTopicId) => void;
    isDone: (id: LearningTopicId) => boolean;
    /** Reload from disk (e.g. on screen focus). */
    refresh: () => Promise<void>;
};

const LearningProgressContext = createContext<LearningProgressContextValue | null>(null);

function pathToSegments(pathname: string): string[] {
    return pathname.split('/').filter(Boolean);
}

/** Marks progress when route matches a tracked lesson (client-side “live” updates). */
function TopicProgressRouteSync() {
    const pathname = usePathname();
    const { markComplete } = useLearningProgress();

    useEffect(() => {
        const id = learningTopicIdFromSegments(pathToSegments(pathname));
        if (id) markComplete(id);
    }, [pathname, markComplete]);

    return null;
}

export function LearningProgressProvider({ children }: { children: ReactNode }) {
    const [completedById, setCompletedById] = useState<LearningProgressMap>({});
    const [loaded, setLoaded] = useState(false);
    const { isLoggedIn } = useAuth();

    const refresh = useCallback(async () => {
        // If logged out, clear local progress and show empty state
        if (!isLoggedIn) {
            await saveLearningProgress({});
            setCompletedById({});
            setLoaded(true);
            return;
        }

        // 1. Load from local storage first for speed
        const local = await loadLearningProgress();
        let next = { ...local };

        // 2. Sync with backend
        try {
            const token = await getAccessToken();
            if (token) {
                const remoteProgress = await fetchRemoteProgress(token);
                next = { ...local, ...remoteProgress };
                await saveLearningProgress(next);
            }
        } catch (e) {
            console.error('Failed to sync progress with backend', e);
        }

        setCompletedById(next);
        setLoaded(true);
    }, [isLoggedIn]);

    useEffect(() => {
        void refresh();
    }, [refresh, isLoggedIn]); // Re-sync when login status changes

    const persist = useCallback(async (next: LearningProgressMap, updatedId?: LearningTopicId) => {
        // Save to local storage
        await saveLearningProgress(next);

        // If logged in, save to backend
        if (isLoggedIn && updatedId) {
            try {
                const token = await getAccessToken();
                if (token) {
                    await sendRemoteProgress(token, { [updatedId]: !!next[updatedId] });

                    // Update streak when a topic is marked complete (not on toggle-off)
                    if (next[updatedId] === true) {
                        void updateStreak(token);
                    }
                }
            } catch (e) {
                console.error('Failed to save progress to backend', e);
            }
        }
    }, [isLoggedIn]);

    const markComplete = useCallback(
        (id: LearningTopicId) => {
            setCompletedById((prev) => {
                if (prev[id]) return prev;
                const next = { ...prev, [id]: true };
                void persist(next, id);
                return next;
            });
        },
        [persist],
    );

    const toggleTopic = useCallback(
        (id: LearningTopicId) => {
            setCompletedById((prev) => {
                const next = { ...prev, [id]: !prev[id] };
                const updatedState = { ...next };
                if (!updatedState[id]) {
                    delete updatedState[id];
                }
                void persist(updatedState, id);
                return updatedState;
            });
        },
        [persist],
    );

    const isDone = useCallback(
        (id: LearningTopicId) => completedById[id] === true,
        [completedById],
    );

    const value = useMemo(
        () => ({
            completedById,
            loaded,
            markComplete,
            toggleTopic,
            isDone,
            refresh,
        }),
        [completedById, loaded, markComplete, toggleTopic, isDone, refresh],
    );

    return (
        <LearningProgressContext.Provider value={value}>
            <TopicProgressRouteSync />
            {children}
        </LearningProgressContext.Provider>
    );
}

export function useLearningProgress(): LearningProgressContextValue {
    const ctx = useContext(LearningProgressContext);
    if (!ctx) {
        throw new Error('useLearningProgress must be used within LearningProgressProvider');
    }
    return ctx;
}

