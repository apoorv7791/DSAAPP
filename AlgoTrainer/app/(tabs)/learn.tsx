import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import Expandables from '@/components/Expandable/Expandables';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';
import { useLearningProgress } from '@/context/LearningProgressContext';
import { LEARNING_TOPICS } from '@/lib/learningTopics';
import { createTypography } from '@/theme/Typography';
import spacing from '@/theme/Spacing';
import { Ionicons } from '@expo/vector-icons';

// Define the module type
interface Module {
    title: string;
    topics: Topic[];
    id: 'Data Structures' | 'Algorithms' | 'Advanced';
}

type Topic = {
    name: string;
    icon: string;
    route: string;
    right: any;
    displayName: string;
}

const Learn: React.FC = () => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();
    const typography = createTypography(theme);
    const { isDone } = useLearningProgress();

    // Calculate category progress
    const categoryProgress = useMemo(() => {
        const dataStructures = ['Arrays', 'LinkedList', 'Stacks', 'Queues', 'HashMaps', 'Trees', 'Graphs', 'Heaps'];
        const algorithms = ['Sorting', 'Searching'];
        const advanced = ['Greedy', 'DynamicProgramming', 'GraphAlgorithms', 'Recursion'];

        const getCategoryCompletion = (topicNames: string[]) => {
            const completed = topicNames.filter(name => {
                const topic = LEARNING_TOPICS.find(t => t.label.replace(/\s+/g, '') === name);
                return topic && isDone(topic.id);
            }).length;
            return Math.round((completed / topicNames.length) * 100);
        };

        return {
            dataStructures: getCategoryCompletion(dataStructures),
            algorithms: getCategoryCompletion(algorithms),
            advanced: getCategoryCompletion(advanced),
        };
    }, [isDone]);

    // Your modules data
    const modules: Module[] = useMemo(() => [
        {
            id: "Data Structures",
            title: t('categories.dataStructures'),
            topics: [
                { name: "Arrays", displayName: t('topics.arrays'), icon: "grid-outline", route: "arrays", right: null },
                { name: "LinkedList", displayName: t('topics.linkedList'), icon: "git-branch-outline", route: "linkedlist", right: null },
                { name: "Stacks", displayName: t('topics.stacks'), icon: "layers-outline", route: "stacks", right: null },
                { name: "Queues", displayName: t('topics.queues'), icon: "menu-outline", route: "queues", right: null },
                { name: "HashMaps", displayName: t('topics.hashMaps'), icon: "key-outline", route: "hashmaps", right: null },
                { name: "Trees", displayName: t('topics.trees'), icon: "leaf-outline", route: "trees", right: null },
                { name: "Graphs", displayName: t('topics.graphs'), icon: "share-social-outline", route: "graphs", right: null },
                { name: "Heaps", displayName: t('topics.heaps'), icon: "cube-outline", route: "heaps", right: null },
            ]
        },
        {
            id: "Algorithms",
            title: t('categories.algorithms'),
            topics: [
                { name: "Sorting", displayName: t('topics.sorting'), icon: "swap-vertical-outline", route: "sorting", right: null },
                { name: "Searching", displayName: t('topics.searching'), icon: "search-outline", route: "searching", right: null },
            ]
        },
        {
            id: "Advanced",
            title: t('categories.advancedAlgorithms'),
            topics: [
                { name: "Greedy Algorithm", displayName: t('topics.greedy'), icon: "trending-up-outline", route: "greedy-algorithm", right: null },
                { name: "Dynamic Programming", displayName: t('topics.dp'), icon: "code-outline", route: "dynamic-programming", right: null },
                { name: "Graph Algorithms", displayName: t('topics.graphAlgo'), icon: "share-social-outline", route: "graph-algorithms", right: null },
                { name: "Recursion", displayName: t('topics.recursion'), icon: "refresh-outline", route: "recursion", right: null },
            ]
        }
    ], [t]);

    // Function to handle topic selection
    const selectedTopic = (moduleId: string, topic: Topic) => {
        const formattedTopic = topic.route;
        const basePath =
            moduleId === "Data Structures"
                ? "DataStructures"
                : moduleId === "Algorithms"
                    ? "Algorithms"
                    : "Advanced";

        router.push(`/${basePath}/${formattedTopic}` as any);
    }

    // Get progress percentage for a category
    const getProgressPercent = (moduleId: string) => {
        switch (moduleId) {
            case "Data Structures":
                return categoryProgress.dataStructures;
            case "Algorithms":
                return categoryProgress.algorithms;
            case "Advanced":
                return categoryProgress.advanced;
            default:
                return 0;
        }
    };

    // FlatList render function
    const renderModule = ({ item }: { item: Module }) => {
        const progress = getProgressPercent(item.id);

        return (
            <View>
                <View style={styles.categoryHeader}>
                    <View>
                        <Text style={[typography.labelMedium, { color: theme.textSecondary }]}>
                            {item.topics.length} topics
                        </Text>
                    </View>
                    <View style={styles.progressBadge}>
                        <Text style={[typography.labelSmall, { color: theme.primary }]}>
                            {progress}%
                        </Text>
                    </View>
                </View>
                <Expandables
                    title={item.title}
                    topics={item.topics.map(t => ({ ...t, name: t.displayName }))}
                    theme={theme}
                    onSelected={(topic) => {
                        const originalTopic = item.topics.find(ot => ot.displayName === topic.name);
                        if (originalTopic) {
                            selectedTopic(item.id, originalTopic);
                        }
                    }}
                />
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
                <Text style={[typography.h2, { color: theme.text }]}>
                    Explore Topics
                </Text>
                <Text style={[typography.bodySmall, { color: theme.textSecondary, marginTop: 4 }]}>
                    Select a category to start learning
                </Text>
            </View>
            <FlatList
                data={modules}
                keyExtractor={(item) => item.title}
                renderItem={renderModule}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16, paddingTop: 8 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    progressBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
});

export default Learn;