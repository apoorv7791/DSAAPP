import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const HashMaps = () => {
    const data = [
        {
            id: "1",
            type: "subheading",
            text: "What is a HashMap?",
        }
    ]
    return (
        <View style={styles.container}>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },

    section: {
        marginBottom: 16,
    },

    subHeading: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
        marginBottom: 6,
    },

    text: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24,
    },

    listRow: {
        flexDirection: "row",
        marginVertical: 4,
    },

    bullet: {
        marginRight: 8,
        color: "#888",
        fontSize: 16,
    },

    listText: {
        flex: 1,
        fontSize: 16,
        color: "#555",
    },

    codeBox: {
        backgroundColor: "#1e1e1e",
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
    },

    codeType: {
        color: "#aaa",
        fontSize: 12,
        marginBottom: 6,
    },

    code: {
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 20,
    },
});
export default HashMaps;
