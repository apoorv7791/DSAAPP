import React, { useState, useContext, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Pressable,
    Animated,
} from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

interface StackNode {
    id: string;
    value: number;
}

const StackVisual = () => {
    const [stack, setStack] = useState<StackNode[]>([]);
    const [input, setInput] = useState('');
    const MAX_SIZE = 6;
    const [message, setMessage] = useState('');
    const { theme } = useContext(ThemeContext);

    const styles = React.useMemo(() => getStyles(theme), [theme]);

    const animValues = useRef<{ [key: string]: Animated.Value }>({}).current;

    const createAnim = (id: string) => {
        animValues[id] = new Animated.Value(0);

        Animated.spring(animValues[id], {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
        }).start();
    };

    const handlePush = () => {
        const trimmed = input.trim();
        const value = Number(trimmed);
        if (!trimmed || isNaN(value)) return;

        if (stack.length >= MAX_SIZE) {
            setMessage("Stack is OverFlow 😵‍💫");
            return;
        }

        const newNode: StackNode = {
            id: Date.now().toString(),
            value,
        };

        setStack(prev => [...prev, newNode]);
        createAnim(newNode.id);
        setInput('');
        setMessage('');
    };

    const handlePop = () => {
        if (stack.length === 0) {
            setMessage("Stack Underflow");
            return;
        }

        const last = stack[stack.length - 1];

        if (last && animValues[last.id]) {
            Animated.timing(animValues[last.id], {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setStack(prev => prev.slice(0, -1));
                delete animValues[last.id];
            });
        }

        setMessage("");
    };

    const handlePeek = () => {
        if (stack.length === 0) {
            setMessage("Stack is Empty");
            return;
        }
        setMessage("Peeked top element");
    }


    const topNode = stack.at(-1) ?? null;

    return (
        <View style={styles.container}>
            {message !== '' && (
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>{message}</Text>

                </View>
            )}

            {/* INPUT CONTROLS */}
            <View style={styles.controls}>

                <TextInput
                    style={styles.input}
                    placeholder="Enter number"
                    keyboardType="numeric"
                    value={input}
                    onChangeText={setInput}
                    placeholderTextColor="#201f1f"
                />

                <Pressable style={styles.button} onPress={handlePush}>
                    <Text style={styles.buttonText}>PUSH</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={handlePop}>
                    <Text style={styles.buttonText}>POP</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={handlePeek}>
                    <Text style={styles.buttonText}>PEEK</Text>
                </Pressable>


            </View>

            {/* TOP DISPLAY */}
            <View style={styles.topPanel}>

                <Text style={styles.topText}>
                    TOP: {topNode ? topNode.value : 'NULL'}
                </Text>
            </View>

            {/* STACK */}
            <View style={styles.stackContainer}>
                {stack.length === 0 && (
                    <Text style={styles.emptyText}>Stack is Empty</Text>
                )}

                {[...stack].reverse().map((item, index) => {
                    const isTop = index === 0;
                    const getScale = (id: string) => {
                        if (!animValues[id]) {
                            animValues[id] = new Animated.Value(1);
                        }
                        return animValues[id];
                    };
                    const scale = getScale(item.id);


                    return (
                        <Animated.View
                            key={item.id}
                            style={[
                                styles.node,
                                {
                                    transform: [{ scale }],
                                },
                            ]}
                        >
                            <Text style={styles.nodeText}>
                                {item.value}
                            </Text>
                            {isTop && (
                                <Text style={styles.topLabel}>TOP</Text>
                            )}
                        </Animated.View>
                    );
                })}
            </View>
        </View>
    );
};

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.background,
        },

        controls: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 15,
        },

        input: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            padding: 10,
            borderRadius: 10,
            color: theme.text,
        },

        button: {
            backgroundColor: theme.primary,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
        },

        buttonText: {
            color: theme.mode === 'dark' ? 'white' : '#0b1220',
            fontWeight: '700',
            fontSize: 12,
        },
        peekBox: {
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: '#3b82f6',
            alignItems: 'center',
        },

        peekText: {
            color: 'white',
            fontWeight: '700',
        },
        topPanel: {
            marginBottom: 15,
            padding: 10,
            backgroundColor: theme.card,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.border,
        },

        topText: {
            color: theme.text,
            fontWeight: '700',
            fontSize: 16,
        },

        stackContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            padding: 10,
            backgroundColor: theme.background,
        },
        messageBox: {
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: '#ef4444',
            alignItems: 'center',
        },

        messageText: {
            color: 'white',
            fontWeight: '700',
        },
        node: {
            width: 90,
            height: 45,
            backgroundColor: theme.primary,
            marginVertical: 6,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
        },

        nodeText: {
            color: theme.mode === 'dark' ? '#0b1220' : 'white',
            fontWeight: '800',
        },
        topLabel: {
            position: 'absolute',
            right: -35,
            top: '50%',
            transform: [{ translateY: -6 }],
            fontSize: 11,
            color: theme.mode === 'dark' ? '#facc15' : '#d97706',
            fontWeight: '800',
        },
        emptyText: {
            color: theme.text,
            opacity: 0.6,
            marginTop: 20,
        },
    });
export default StackVisual;