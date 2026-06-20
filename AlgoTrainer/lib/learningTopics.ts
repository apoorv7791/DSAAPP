/** Stable ids aligned with expo-router segments under DataStructures/ and Algorithms/. */

export const LEARNING_TOPIC_IDS = [
    'arrays',
    'linkedlist',
    'stacks',
    'queues',
    'hashmaps',
    'trees',
    'graphs',
    'heaps',
    'sorting',
    'searching',
    'dynamic-programming',
    'graph-algorithms',
    'greedy-algorithm',
    'recursion',
] as const;

export type LearningTopicId = (typeof LEARNING_TOPIC_IDS)[number];

export type LearningTopicMeta = {
    id: LearningTopicId;
    label: string;
    /** Ionicons glyph name */
    icon: string;
};

export const LEARNING_TOPICS: LearningTopicMeta[] = [
    { id: 'arrays', label: 'Arrays', icon: 'grid-outline' },
    { id: 'linkedlist', label: 'Linked List', icon: 'git-branch-outline' },
    { id: 'stacks', label: 'Stacks', icon: 'layers-outline' },
    { id: 'queues', label: 'Queues', icon: 'menu-outline' },
    { id: 'hashmaps', label: 'Hash Maps', icon: 'key-outline' },
    { id: 'trees', label: 'Trees', icon: 'leaf-outline' },
    { id: 'graphs', label: 'Graphs', icon: 'share-social-outline' },
    { id: 'heaps', label: 'Heaps', icon: 'cube-outline' },
    { id: 'sorting', label: 'Sorting', icon: 'swap-vertical-outline' },
    { id: 'searching', label: 'Searching', icon: 'search-outline' },
    { id: 'dynamic-programming', label: 'Dynamic Programming', icon: 'flash-outline' },
    { id: 'graph-algorithms', label: 'Graph Algorithms', icon: 'analytics-outline' },
    { id: 'greedy-algorithm', label: 'Greedy Algorithm', icon: 'fast-food-outline' },
    { id: 'recursion', label: 'Recursion', icon: 'repeat-outline' },
];

const TRACKED = new Set<string>(LEARNING_TOPIC_IDS);

/** Resolve a tracked topic id from URL path segments (expo-router). */
export function learningTopicIdFromSegments(segments: string[]): LearningTopicId | null {
    for (let i = 0; i < segments.length - 1; i++) {
        const parent = segments[i];
        const leaf = segments[i + 1];
        if (
            (parent === 'DataStructures' || parent === 'Algorithms' || parent === 'Advanced') &&
            TRACKED.has(leaf)
        ) {
            return leaf as LearningTopicId;
        }
    }
    return null;
}
