import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

const StackVisual = () => {
    const [stack, setStack] = useState<number[]>([]);
    const [input, setInput] = useState('');
    const { theme } = React.useContext(ThemeContext);
    const [peekValue, setPeekValue] = useState<number | null>(null);
    const styles = getStyles(theme);


    const handlePush = () => {
        if (input === '') return;

        const value = Number(input);
        if (isNaN(value)) return;

        setStack(prev => [...prev, value]);
        setInput('');
    };

    const handlePop = () => {
        if (stack.length === 0) return;

        setStack(prev => prev.slice(0, -1));
    };

    const handlePeek = () => {
        if (stack.length === 0) {
            setPeekValue(null);
            return;
        }

        setPeekValue(stack[stack.length - 1]);
    };

    return (
        <View style={styles.container}>

            {/* Input + Buttons */}
            <View style={styles.controls}>
                <TextInput
                    style={styles.input}

                    placeholder="Enter number"
                    keyboardType="numeric"
                    value={input}
                    onChangeText={setInput}
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
            {/* Peek Button */}
            {peekValue !== null && (
                <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>
                    TOP VALUE: {peekValue}
                </Text>
            )}

            {/* Stack Container */}
            <View style={styles.stackContainer}>
                {stack.length === 0 && (
                    <Text style={styles.emptyText}>Stack is Empty</Text>
                )}

                {stack.map((item, index) => {
                    const isTop = index === stack.length - 1;

                    return (
                        <View key={index} style={styles.node}>
                            <Text style={styles.nodeText}>{item}</Text>

                            {isTop && (
                                <Text style={styles.topLabel}>TOP</Text>
                            )}
                        </View>
                    );
                })}
            </View>

        </View>
    );
};
const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: 'flex-start',
        },

        controls: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 20,
            alignItems: 'center',
        },

        input: {
            borderWidth: 5,
            padding: 10,
            width: 120,
            borderRadius: 10,
        },

        button: {
            backgroundColor: '#333',
            padding: 10,
            borderRadius: 8,
        },

        buttonText: {
            color: 'white',
            fontWeight: 'bold',
        },

        stackContainer: {
            height: 300,
            borderWidth: 2,
            borderColor: '#999',
            borderRadius: 10,
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: 10,
            overflow: 'visible',
        },

        node: {
            width: 80,
            height: 40,
            backgroundColor: '#4CAF50',
            marginVertical: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 6,
            position: 'relative',
        },

        nodeText: {
            color: 'white',
            fontWeight: 'bold',
        },

        topLabel: {
            position: 'absolute',
            top: -20,      // Position above the node instead of right
            fontSize: 12,
            color: 'red',
            fontWeight: 'bold',
        },

        emptyText: {
            color: '#777',
        },
    });

}

export default StackVisual;