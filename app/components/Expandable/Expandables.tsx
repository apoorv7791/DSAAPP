import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createTypography } from '../../theme/Typography';
import { spacingUtils } from '../../theme/Spacing';

interface Topic {
    right: any | null;
    name: string;
    route?: string;
    icon?: string;
}

interface Props {
    title: string;
    topics: Topic[];
    onSelected: (topic: Topic) => void;
    defaultOpen?: boolean;
    theme?: any;
}

const Expandables = ({
    title,
    topics,
    onSelected,
    defaultOpen = false,
    theme,
}: Props) => {
    const [expanded, setExpanded] = useState(defaultOpen);
    const [contentHeight, setContentHeight] = useState(0);
    const safeTheme = theme || {
        text: '#000000',
        textSecondary: '#666666',
        textTertiary: '#999999',
        bg: '#ffffff',
        bgCard: '#ffffff',
        bgSurface: '#f8f9fa',
        border: '#e0e0e0',
        primary: '#6366f1',
    };

    const typography = createTypography(safeTheme);

    const animation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: expanded ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [expanded]);

    // Height animation (dynamic)
    const height = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, contentHeight],
    });

    // Rotate icon
    const rotate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    // Fade effect
    const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const toggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    // Memoized topics (performance boost)
    const renderedTopics = useMemo(() => {
        return topics.map((topic, index) => (
            <Pressable
                key={index}
                style={[styles.topicItem, { backgroundColor: safeTheme.bgSurface }]}
                onPress={() => onSelected(topic)}
            >
                <View style={styles.topicContent}>
                    {topic.icon && (
                        <Ionicons
                            name={topic.icon as any}
                            size={20}
                            color={safeTheme.textSecondary}
                            style={styles.topicIcon}
                        />
                    )}
                    <Text style={[typography.bodyMedium, { color: safeTheme.text }]}>{topic.name}</Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={safeTheme.textTertiary}
                />
                {topic.right && topic.right}
            </Pressable>
        ));
    }, [topics, theme, typography]);

    return (
        <View style={[styles.container, { backgroundColor: safeTheme.bgCard, borderColor: safeTheme.border }]}>
            {/* Header */}
            <Pressable style={styles.header} onPress={toggleExpand}>
                <Text style={[typography.labelLarge, { color: safeTheme.text }]}>{title}</Text>

                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionicons
                        name="chevron-down"
                        size={22}
                        color={safeTheme.primary}
                    />
                </Animated.View>
            </Pressable>

            {/* Animated Content */}
            <Animated.View style={{ height, opacity, overflow: 'hidden' }}>
                <View
                    style={[styles.contentContainer, { borderTopColor: safeTheme.border }]}
                    onLayout={(e) =>
                        setContentHeight(e.nativeEvent.layout.height)
                    }
                >
                    {renderedTopics}
                </View>
            </Animated.View>
        </View>
    );
};

export default Expandables;

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        marginVertical: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111",
    },
    contentContainer: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    topicItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    topicContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    topicIcon: {
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    topicText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
});