import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Topic {
    name: string;
    route: string;
    icon?: string;
}

interface Props {
    title: string;
    topics: Topic[];
    onSelected: (topic: Topic) => void;
    defaultOpen?: boolean;
}

const Expandables = ({
    title,
    topics,
    onSelected,
    defaultOpen = false,
}: Props) => {
    const [expanded, setExpanded] = useState(defaultOpen);
    const [contentHeight, setContentHeight] = useState(0);

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
            <TouchableOpacity
                key={index}
                style={styles.topicItem}
                onPress={() => onSelected(topic)}
                activeOpacity={0.7}
            >
                <View style={styles.topicContent}>
                    {topic.icon && (
                        <Ionicons
                            name={topic.icon as any}
                            size={20}
                            color="#666"
                            style={styles.topicIcon}
                        />
                    )}
                    <Text style={styles.topicText}>{topic.name}</Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#ccc"
                />
            </TouchableOpacity>
        ));
    }, [topics]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity style={styles.header} onPress={toggleExpand}>
                <Text style={styles.title}>{title}</Text>

                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionicons
                        name="chevron-down"
                        size={22}
                        color="#23238c"
                    />
                </Animated.View>
            </TouchableOpacity>

            {/* Animated Content */}
            <Animated.View style={{ height, opacity, overflow: 'hidden' }}>
                <View
                    style={styles.contentContainer}
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
        backgroundColor: "white",
        borderRadius: 12,
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
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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