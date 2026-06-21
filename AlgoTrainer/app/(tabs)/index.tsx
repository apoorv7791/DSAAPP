import React, { useContext, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Pressable,
} from 'react-native';

import { ThemeContext } from '@/theme/ThemeContext';
import { createTypography } from '@/theme/Typography';
import spacing, { spacingUtils } from '@/theme/Spacing';
import Card from '@/components/Card/Card';
import { useTranslation } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import { useLearningProgress } from '@/context/LearningProgressContext';
import { LEARNING_TOPICS } from '@/lib/learningTopics';
import { Ionicons } from '@expo/vector-icons';

type Module = {
    id: string;
    title: string;
    description: string;
    category?: 'algorithms' | 'dataStructures' | 'practice' | 'visual';
};

const HomeScreen = () => {
    const { theme } = useContext(ThemeContext);
    const typography = createTypography(theme);
    const { t } = useTranslation();
    const router = useRouter();
    const { isDone } = useLearningProgress();

    // Calculate progress
    const completed = LEARNING_TOPICS.filter((t) => isDone(t.id)).length;
    const total = LEARNING_TOPICS.length;
    const percent = Math.round((completed / total) * 100);

    // Find next recommended topic (first incomplete one)
    const nextTopic = LEARNING_TOPICS.find((t) => !isDone(t.id));

    const modules: Module[] = useMemo(
        () => [
            {
                id: '1',
                title: t('home.learnTitle'),
                description: t('home.learnDesc'),
                category: 'dataStructures',
            },
            {
                id: '2',
                title: t('home.visualTitle'),
                description: t('home.visualDesc'),
                category: 'visual',
            },
            {
                id: '3',
                title: t('home.practiceTitle'),
                description: t('home.practiceDesc'),
                category: 'practice',
            },
            {
                id: '4',
                title: t('home.progressTitle'),
                description: t('home.progressDesc'),
                category: 'practice',
            },
        ],
        [t]
    );

    const getCategoryColor = (category?: Module['category']) => {
        switch (category) {
            case 'algorithms':
                return theme.algorithms;
            case 'dataStructures':
                return theme.dataStructures;
            case 'practice':
                return theme.practice;
            case 'visual':
                return theme.visual;
            default:
                return theme.primary;
        }
    };

    const onModulePress = useCallback((module: Module) => {
        if (module.category === 'dataStructures' || module.category === 'algorithms' || module.category === 'visual') {
            router.push('/learn');
        } else if (module.category === 'practice') {
            router.push('/Learning/progress');
        }
    }, [router]);

    const renderItem = useCallback(
        ({ item }: { item: Module }) => {
            const color = getCategoryColor(item.category);

            return (
                <Pressable onPress={() => onModulePress(item)}>
                    <Card
                        theme={theme}
                        variant="elevated"
                        style={[
                            styles.card,
                            { borderLeftColor: color, borderLeftWidth: 4 },
                        ]}
                    >
                        <View style={styles.cardContent}>
                            <Text
                                style={[
                                    typography.h3,
                                    { color: theme.text },
                                ]}
                            >
                                {item.title}
                            </Text>
                            <Text
                                style={[
                                    typography.bodyMedium,
                                    {
                                        color: theme.textSecondary,
                                        marginTop: spacing.xs,
                                    },
                                ]}
                            >
                                {item.description}
                            </Text>
                        </View>
                    </Card>
                </Pressable>
            );
        },
        [theme, typography, onModulePress]
    );

    const listHeader = (
        <>
            {/* Header */}
            <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
                <Text style={[typography.h1, { color: theme.text }]}>
                    {t('home.title')}
                </Text>
                <Text
                    style={[
                        typography.bodyMedium,
                        { color: theme.textSecondary, marginTop: 6 },
                    ]}
                >
                    {t('home.subtitle')}
                </Text>
            </View>

            {/* Progress Summary Card */}
            <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
                <Card theme={theme} variant="elevated" style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={[typography.h3, { color: theme.text }]}>
                            Your Progress
                        </Text>
                        <Ionicons name="analytics" size={24} color={theme.primary} />
                    </View>

                    <View style={styles.progressStats}>
                        <View style={styles.statItem}>
                            <Text style={[typography.h2, { color: theme.primary }]}>
                                {completed}
                            </Text>
                            <Text style={[typography.labelSmall, { color: theme.textSecondary }]}>
                                Completed
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[typography.h2, { color: theme.accent }]}>
                                {total - completed}
                            </Text>
                            <Text style={[typography.labelSmall, { color: theme.textSecondary }]}>
                                Remaining
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[typography.h2, { color: theme.success }]}>
                                {percent}%
                            </Text>
                            <Text style={[typography.labelSmall, { color: theme.textSecondary }]}>
                                Done
                            </Text>
                        </View>
                    </View>

                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${percent}%`, backgroundColor: theme.primary },
                            ]}
                        />
                    </View>
                </Card>
            </View>

            {/* Continue Learning Suggestion */}
            {nextTopic && (
                <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
                    <Pressable onPress={() => router.push('/learn')}>
                        <Card theme={theme} variant="outlined" style={styles.continueCard}>
                            <View style={styles.continueContent}>
                                <View>
                                    <Text style={[typography.labelSmall, { color: theme.textSecondary }]}>
                                        Continue Learning
                                    </Text>
                                    <Text style={[typography.bodyMedium, { color: theme.text, marginTop: 4 }]}>
                                        {nextTopic.label}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color={theme.primary} />
                            </View>
                        </Card>
                    </Pressable>
                </View>
            )}

            {/* Quick Access label */}
            <Text style={[typography.labelMedium, { color: theme.textSecondary, marginBottom: spacing.md, paddingHorizontal: spacing.md }]}>
                Quick Access
            </Text>
        </>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <FlatList
                data={modules}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={listHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    progressCard: {
        padding: spacing.md,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    progressStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#e0e0e0',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    continueCard: {
        padding: spacing.md,
    },
    continueContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    card: {
        marginBottom: spacing.md,
    },
    cardContent: {
        padding: spacing.md,
    },
    listContent: {
        paddingBottom: 40,
    },
});

export default HomeScreen;
