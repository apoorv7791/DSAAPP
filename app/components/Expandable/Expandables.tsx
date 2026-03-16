import React from 'react';
import { Animated, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExpandableProps {
    item: string,
    topics: string[],
}


const Expandables = ({ item, topics }: ExpandableProps) => {
    const [expanded, setExpanded] = React.useState(false);
    const rotateAnim = React.useRef(new Animated.Value(0)).current;
    const toggleExpand = () => {
        const toValue = expanded ? 0 : 1;
        Animated.timing(rotateAnim, {
            toValue,
            duration: 200,
            useNativeDriver: true
        }).start();
        setExpanded(!expanded);
    }
    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });
    return (
        <View>
            <TouchableOpacity style={styles.header} onPress={toggleExpand}>

                <Text style={styles.title}>{item}</Text>


                <Animated.View>
                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#555"
                    />
                </Animated.View>
            </TouchableOpacity>
            {expanded && (
                <View style={styles.content}>
                    {topics.map((topic, index) => (
                        <Text key={index} style={styles.topic}>
                            • {topic}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        elevation: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    content: {
        padding: 16,
        backgroundColor: "#f9f9f9"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold"
    },

    topicContainer: {
        paddingLeft: 20,
        marginTop: 10
    },

    topic: {
        fontSize: 16,
        marginBottom: 6
    }

})

export default Expandables;
