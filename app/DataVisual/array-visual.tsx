import React, { useState, useRef, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Pressable,
    Animated,
    ScrollView,
    ToastAndroid
} from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

const ArrayVisual = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [animatedArray, setAnimatedArray] = useState<
        { value: number; anim: Animated.Value; id: number }[]
    >([]);

    const [element, setElement] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    const scrollRef = useRef<ScrollView>(null);

    // 🔥 reusable animation
    const animateIn = (anim: Animated.Value) => {
        return Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        });
    };

    const animateOut = (anim: Animated.Value) => {
        return Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        });
    };

    // ➕ ADD
    const addElement = () => {
        if (isAnimating) return;
        if (element.trim() === '' || isNaN(Number(element))) return;

        const newItem = {
            value: Number(element),
            anim: new Animated.Value(0),
            id: Date.now(),
        };

        setAnimatedArray(prev => [...prev, newItem]);
        setElement("");

        setIsAnimating(true);
        animateIn(newItem.anim).start(() => {
            setIsAnimating(false);
            scrollRef.current?.scrollToEnd({ animated: true });
        });
    };

    // ➖ REMOVE LAST
    const handleRemove = () => {
        if (isAnimating || animatedArray.length === 0) return;

        const lastItem = animatedArray[animatedArray.length - 1];

        setIsAnimating(true);
        animateOut(lastItem.anim).start(() => {
            setAnimatedArray(prev => prev.slice(0, -1));
            setIsAnimating(false);
        });
    };

    // ➖ REMOVE FRONT
    const deletefromFront = () => {
        if (isAnimating || animatedArray.length === 0) return;

        const firstItem = animatedArray[0];

        setIsAnimating(true);
        animateOut(firstItem.anim).start(() => {
            setAnimatedArray(prev => prev.slice(1));
            setIsAnimating(false);
        });
    };

    // 🔍 SEARCH
    const searchElement = () => {
        if (isAnimating) return;

        const index = animatedArray.findIndex(
            item => item.value === Number(element)
        );

        if (index === -1) {
            ToastAndroid.show("Element not found", ToastAndroid.SHORT);
            return;
        }

        ToastAndroid.show(`Found at index ${index}`, ToastAndroid.SHORT);

        setIsAnimating(true);

        Animated.sequence([
            animateOut(animatedArray[index].anim),
            animateIn(animatedArray[index].anim),
        ]).start(() => setIsAnimating(false));
    };

    const resetArray = () => {
        if (isAnimating) return;
        setAnimatedArray([]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Array Visualizer</Text>

            {/* ARRAY */}
            <View style={styles.wrapper}>
                <Text style={styles.bracket}>[</Text>

                <ScrollView
                    horizontal
                    ref={scrollRef}
                    showsHorizontalScrollIndicator={false}
                >
                    {animatedArray.length === 0 ? (
                        <Text style={styles.emptyText}>Empty</Text>
                    ) : (
                        animatedArray.map((item) => (
                            <Animated.View
                                key={item.id}
                                style={[
                                    styles.box,
                                    {
                                        opacity: item.anim,
                                        transform: [
                                            {
                                                scale: item.anim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.6, 1],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Text style={styles.boxText}>{item.value}</Text>
                            </Animated.View>
                        ))
                    )}
                </ScrollView>

                <Text style={styles.bracket}>]</Text>
            </View>

            {/* INPUT */}
            <TextInput
                placeholder="Enter number"
                placeholderTextColor={theme.text + "80"}
                value={element}
                onChangeText={setElement}
                style={styles.input}
                keyboardType="decimal-pad"
            />

            {/* BUTTONS */}
            <View style={styles.buttonGrid}>
                {[
                    { label: "Add", fn: addElement },
                    { label: "Remove", fn: handleRemove },
                    { label: "Remove Front", fn: deletefromFront },
                    { label: "Search", fn: searchElement },
                    { label: "Reset", fn: resetArray },
                ].map((btn, i) => (
                    <Pressable
                        key={i}
                        style={styles.button}
                        onPress={btn.fn}
                        disabled={isAnimating}
                    >
                        <Text style={styles.buttonText}>{btn.label}</Text>
                    </Pressable>
                ))}
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
            padding: 12,
            borderRadius: 8,
            color: theme.text,
            backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : '#fff',
        },

        wrapper: {
            flexDirection: 'row',
            alignItems: 'center',
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
            elevation: 3,
        },

        boxText: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
        },

        emptyText: {
            color: theme.text,
            padding: 10,
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
    });

export default ArrayVisual;