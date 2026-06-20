import { storage } from './storage';
import type { LearningTopicId } from './learningTopics';
import { LEARNING_TOPIC_IDS } from './learningTopics';

const STORAGE_KEY = 'learning_topic_progress_v1';

export type LearningProgressMap = Partial<Record<LearningTopicId, boolean>>;

function normalize(raw: unknown): LearningProgressMap {
    if (!raw || typeof raw !== 'object') return {};
    const out: LearningProgressMap = {};
    for (const id of LEARNING_TOPIC_IDS) {
        if ((raw as Record<string, unknown>)[id] === true) {
            out[id] = true;
        }
    }
    return out;
}

/** Loads learning progress from storage. */
export async function loadLearningProgress(): Promise<LearningProgressMap> {
    try {
        const data = await storage.get<LearningProgressMap>(STORAGE_KEY, {});
        return normalize(data);
    } catch (e) {
        console.warn('loadLearningProgress failed', e);
        return {};
    }
}

/** Saves learning progress to storage. */
export async function saveLearningProgress(map: LearningProgressMap): Promise<void> {
    try {
        const pruned: LearningProgressMap = {};
        for (const id of LEARNING_TOPIC_IDS) {
            if (map[id] === true) pruned[id] = true;
        }
        await storage.set(STORAGE_KEY, pruned);
    } catch (e) {
        console.warn('saveLearningProgress failed', e);
    }
}

/** Clears all locally stored topic completion flags (e.g. after account deletion). */
export async function clearLearningProgress(): Promise<void> {
    try {
        await storage.set(STORAGE_KEY, {});
    } catch (error) {
        console.warn('clearLearningProgress failed', error);
    }
}
