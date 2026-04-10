import React, { useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

const ArrayVisual = () => {
    const [animatedArray, setAnimatedArray] = React.useState<
        { value: number; anim: Animated.Value; prev: number }[]
    >([]);
    const [element, setElement] = useState("");

    const addElement = () => {
        if (element.trim() === "" || isNaN(Number(element))) return;
        const newItem = {
            Value: Number(element),
            amim: new Animated.Value(0),
            value: Number(element),
            anim: new Animated.Value(0),
            prev: 0,
        };
        setAnimatedArray((prev) => [...prev, newItem]);
        setElement("");
        // 🔥 animation start
        Animated.timing(newItem.anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }
    return (
        <View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20, // 🔥 added spacing
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        margin: 10,
        padding: 10,
        borderRadius: 8,
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
        backgroundColor: "#333",
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
        padding: 12,
        backgroundColor: "#4CAF50",
        borderRadius: 8,
        minWidth: 100,
        alignItems: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    bracket: {
        fontSize: 28,
        fontWeight: "bold",
        marginHorizontal: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    inputContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ArrayVisual;
