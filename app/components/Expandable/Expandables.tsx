import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    title: string,
    topics: string[],
    onSelected: (topic: string) => void
}

const Expandables = ({ title, topics, onSelected }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: expanded ? 1 : 0,
            duration: 300,
            useNativeDriver: false
        }).start();
    }, [expanded]);

    // interpolate
    const height = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, topics.length * 45], // 45 px per topic
    })
    const rotate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header} onPress={toggleExpand}
            >
                <Text style={styles.title}>{title}</Text>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionicons name="chevron-down" size={24} color="black" />
                </Animated.View>
            </TouchableOpacity>
            <Animated.View style={{ height, overflow: 'hidden' }}>
                {topics.map((topic, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.topicItem}
                        onPress={() => onSelected(topic)}
                    >
                        <Text style={styles.topicText}>{topic}</Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        marginVertical: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    title: { fontSize: 18, fontWeight: '600' },
    topicsContainer: { paddingLeft: 20, paddingVertical: 10 },
    topicItem: { paddingVertical: 10, paddingHorizontal: 8 },
    topicText: { fontSize: 16 }
});


export default Expandables;
