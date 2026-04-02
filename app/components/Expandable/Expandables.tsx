import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



interface Topic {
    name: string;
    route: string;
}


interface Props {
    title: string,
    topics: Topic[],
    onSelected: (topic: Topic) => void
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
        outputRange: [0, topics.length * 50], // 50 px per topic
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
                    <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#23238c"
                    />
                </Animated.View>
            </TouchableOpacity>
            <Animated.View style={{ height, overflow: 'hidden' }}>
                {topics.map((topic, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.topicItem}
                        onPress={() => onSelected(topic)}
                    >
                        <Text style={styles.topicText}>{topic.name}</Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f5f5f5",
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
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111",
    },
    topic: {
        fontSize: 15,
        color: "#555",
        marginTop: 8,
    },
    topicsContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    topicItem: { paddingVertical: 10, paddingHorizontal: 8 },
    topicText: { fontSize: 16 }
});


export default Expandables;
