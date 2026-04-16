import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    ScrollView,
    ToastAndroid
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const ArrayVisual = () => {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    // 🔥 CHANGE 1: animated array
    const [animatedArray, setAnimatedArray] = useState<
        { value: number; anim: Animated.Value }[]
    >([]);

    const [element, setElement] = useState("");

    // ➕ ADD ELEMENT WITH ANIMATION
    const addElement = () => {
        if (element.trim() === '' || isNaN(Number(element))) return;

        const newItem = {
            value: Number(element),
            anim: new Animated.Value(0),
        };

        setAnimatedArray((prev) => [...prev, newItem]);
        setElement("");

        // 🔥 animation start
        Animated.timing(newItem.anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // ➖ REMOVE WITH ANIMATION
    const handleRemove = () => {
        if (animatedArray.length === 0) return;

        const lastItem = animatedArray[animatedArray.length - 1];

        Animated.timing(lastItem.anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setAnimatedArray((prev) => prev.slice(0, -1));
        });
    };

    const deletefromFront = () => {
        if (animatedArray.length === 0) return;

        const firstItem = animatedArray[0];

        Animated.timing(firstItem.anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setAnimatedArray((prev) => prev.slice(1));
        });
    }

    const searchElement = () => {
        const foundIndex = animatedArray.findIndex((item) => item.value === Number(element));
        if (foundIndex === -1) {
            ToastAndroid.show("Element not found", ToastAndroid.SHORT);
        } else {
            ToastAndroid.show("Element found at index " + foundIndex, ToastAndroid.SHORT);
            Animated.sequence([
                Animated.timing(animatedArray[foundIndex].anim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedArray[foundIndex].anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }

    const resetArray = () => {
        setAnimatedArray([]);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Array Visualizer</Text>

            {/* ARRAY VISUAL */}
            <View style={styles.wrapper}>
                <Text style={styles.bracket}>[</Text>

                <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {animatedArray.map((item, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.box,
                                    {
                                        opacity: item.anim,
                                        transform: [
                                            {
                                                scale: item.anim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.5, 1],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Text style={styles.boxText}>{item.value}</Text>
                            </Animated.View>
                        ))}
                    </ScrollView>
                </View>

                <Text style={styles.bracket}>]</Text>
            </View>


            {/* INPUT */}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter element"
                    value={element}
                    onChangeText={setElement}
                    style={styles.input}
                    keyboardType='numeric'
                />
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonGrid}>
                <TouchableOpacity style={styles.button} onPress={addElement}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleRemove}>
                    <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={deletefromFront}>
                    <Text style={styles.buttonText}>Remove from front</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={searchElement}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.button} onPress={resetArray}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.bg,
        },

        heading: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
            color: theme.text,
        },

        input: {
            borderWidth: 1,
            borderColor: theme.border,
            margin: 10,
            padding: 10,
            borderRadius: 8,
            color: theme.text,
            backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : '#fff',
        },

        wrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
        },

        box: {
            width: 50,
            height: 50,
            backgroundColor: theme.primary,
            margin: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
        },

        boxText: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
        },

        button: {
            width: "48%",
            padding: 15,
            backgroundColor: theme.primary,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 10,
        },

        buttonGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginTop: 20,
        },

        buttonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
        },

        bracket: {
            fontSize: 28,
            fontWeight: "bold",
            marginHorizontal: 5,
            color: theme.text,
        },

        inputContainer: {
            justifyContent: "center",
            alignItems: "center",
        },
    });

export default ArrayVisual;