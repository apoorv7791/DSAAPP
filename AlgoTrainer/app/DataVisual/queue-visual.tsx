import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';
import { Animated } from 'react-native';


type Node = {
    id: string;
    value: number;
}

const QueueVisual = () => {
    // states 
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [queue, setQueue] = useState<Node[]>([]); // state for alligning elements inside the queue
    const [input, setInput] = useState('');
    const MAX_SIZE = 8; // maximum size for adding elements in the queue
    const [message, setMessage] = useState('');
    const animations = React.useRef<{ [key: string]: Animated.Value }>({});

    // logic functions
    const enqueue = () => {
        if (queue.length >= MAX_SIZE) {
            setMessage("Queue Overflow: cannot add items");
            return;
        }

        if (input.trim() === '') {
            setMessage("Enter a value");
            return;
        }
        // Generate a unique ID for the new node using the current timestamp
        const id = Date.now().toString();
        const value = Number(input);

        // start position (invisible/right)
        animations.current[id] = new Animated.Value(50);

        const newNode = { id, value };


        setQueue(prev => [...prev, newNode]); // keeping track of the previous elements and then also adding new elements
        setInput('');
        setMessage('');

        Animated.timing(animations.current[id], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const dequeue = () => {
        if (queue.length === 0) {
            setMessage("Queue Underflow");
            return;
        }
        const first = queue[0];


        Animated.timing(animations.current[first.id], {
            toValue: -50,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setQueue(prev => prev.slice(1));
            delete animations.current[first.id];
        });

        setMessage('');
    }
    return (
        // UI rendering
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Enter number"
                placeholderTextColor={theme.textTertiary}
                keyboardType="numeric"
            />
            {/* Buttons*/}
            <View style={styles.row}>
                <Pressable style={styles.button} onPress={enqueue}>
                    <Text style={styles.buttonText}>Enqeue</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={dequeue}>
                    <Text style={styles.buttonText}>Deqeue</Text>
                </Pressable>
            </View>
            {/* Message */}
            {message !== '' && (
                <Text style={styles.message}>{message}</Text>
            )}
            <View style={styles.queueContainer}>
                {queue.length === 0 ? (
                    <Text style={styles.emptyText}>Queue is empty</Text>
                ) : (
                    queue.map((item, index) => {
                        const anim = animations.current[item.id];

                        return (
                            <Animated.View
                                key={item.id}
                                style={[
                                    styles.node,
                                    {
                                        transform: [
                                            {
                                                translateX: anim || new Animated.Value(0),
                                            },
                                        ],
                                        opacity: anim
                                            ? anim.interpolate({
                                                inputRange: [-50, 0, 50],
                                                outputRange: [0, 1, 0],
                                            })
                                            : 1,
                                    },
                                ]}
                            >
                                {index === 0 && (
                                    <Text style={styles.pointer}>FRONT</Text>
                                )}

                                <Text style={styles.nodeText}>{item.value}</Text>

                                {index === queue.length - 1 && (
                                    <Text style={styles.pointer}>REAR</Text>
                                )}
                            </Animated.View>
                        );
                    })
                )}
            </View>
        </View>
    );
}
// Style Components
const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.bg,
        },

        heading: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.text,
            marginBottom: 12,
        },

        input: {
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: 8,
            padding: 10,
            color: theme.text,
            backgroundColor: theme.bgSecondary,
        },

        row: {
            flexDirection: 'row',
            marginTop: 10,
            gap: 10,
        },

        button: {
            flex: 1,
            padding: 12,
            backgroundColor: theme.accent,
            borderRadius: 8,
            alignItems: 'center',
        },

        buttonText: {
            color: 'white',
            fontWeight: '600',
        },

        message: {
            marginTop: 10,
            color: 'red',
            fontWeight: '500',
        },

        queueContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 20,
            alignItems: 'center',
        },

        node: {
            padding: 12,
            marginRight: 10,
            marginBottom: 10,
            borderRadius: 10,
            backgroundColor: theme.primary,
            alignItems: 'center',
            minWidth: 60,
        },

        nodeText: {
            color: 'white',
            fontWeight: 'bold',
        },

        pointer: {
            fontSize: 10,
            color: 'white',
            opacity: 0.8,
        },

        emptyText: {
            color: theme.textTertiary,
            marginTop: 20,
        },

    })
}

export default QueueVisual;
