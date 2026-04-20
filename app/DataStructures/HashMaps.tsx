import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, FlatList, Platform } from 'react-native';
import * as  Clipboard from 'expo-clipboard';
import { ToastAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../theme/ThemeContext';
const HashMaps = () => {
    const router = useRouter();
    const { theme } = React.useContext(ThemeContext);
    const styles = getStyles(theme);
    const data = [
        {
            id: "1",
            type: "subheading",
            text: "what is a HashMap"
        },
        {
            id: "2",
            type: "text",
            text: "A HashMap is a data structure that stores data in key-value pairs."
        },

        {
            id: "3",
            type: "subheading",
            text: "Real Life Example"
        },
        {
            id: "4",
            type: "text",
            text: "Think of a contact list — you search using a name to find a phone number. Here, the name is the key and the number is the value."
        },

        {
            id: "5",
            type: "subheading",
            text: "How it works?"
        },
        {
            id: "6",
            type: "text",
            text: "A HashMap uses a hash function to convert a key into an index where the value is stored."
        },

        {
            id: "7",
            type: "code",
            language: "Java",
            dataType: "Hash Function",
            text: `int index = key % size;`
        },

        {
            id: "8",
            type: "subheading",
            text: "Why is it fast?"
        },
        {
            id: "9",
            type: "list",
            items: [
                "Direct access using index (O(1) average)",
                "No need to traverse the entire data",
                "Efficient for large datasets"
            ]
        },

        {
            id: "10",
            type: "subheading",
            text: "Collision Problem"
        },
        {
            id: "11",
            type: "text",
            text: "Sometimes two different keys map to the same index. This is called a collision."
        },

        {
            id: "12",
            type: "code",
            language: "Java",
            dataType: "Collision Example",
            text: `23 % 10 = 3\n33 % 10 = 3`
        },

        {
            id: "13",
            type: "subheading",
            text: "Solution"
        },
        {
            id: "14",
            type: "text",
            text: "To handle collisions, we use a LinkedList (or similar structure) to store multiple values at the same index."
        },

        {
            id: "15",
            type: "highlight",
            text: "HashMap = Array + Hash Function + LinkedList."
        },
        {
            id: "16",
            type: "multicode",
            codes: [
                {
                    title: "HashMap implemetnation",
                    text: "var map = new HashMap<String, Integer>();"
                },
                {
                    title: "Put",
                    text: `map.put("A", 10); \n map.put("B", 20); \n map.put("C", 30);`
                },
                {
                    title: "Get",
                    text: `map.get("A");`
                },
                {
                    title: "Remove",
                    text: `map.remove("A");`
                },
                {
                    title: "Output",
                    text: `{B=20, C=30}`
                },
                {
                    title: "Contains",
                    text: `map.containsKey("B"); // true\n map.containsKey("A"); // false`
                },
                {
                    title: "Output",
                    text: `{A=10, B=20, C=30}`
                },
                {
                    title: "Explanation",
                    text: `
In this example, we create a HashMap that maps String keys to Integer values.\n
We add three key-value pairs to the map,\n
retrieve the value associated with key 'A', and then remove it.\n
The final output shows the remaining key-value pairs in the map.`
                }
            ]
        }
    ];

    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show("Code copied to clipboard!", ToastAndroid.LONG);
    }

    const renderItem = useCallback(({ item }: any) => {
        switch (item.type) {
            case "subheading":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.text}</Text>
                    </View>
                )
            case "text":
                return (
                    <View style={styles.section}>
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                )
            case "code":
                return (
                    <View style={styles.codeBox}>
                        <View style={styles.codeHeader}>
                            <Text style={styles.codeType}>
                                {item.language} • {item.dataType}
                            </Text>

                            <Pressable onPress={() => handleCopy(item.text)}>
                                <Text style={styles.copy}>COPY</Text>
                            </Pressable>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text style={styles.code}>{item.text}</Text>
                        </ScrollView>
                    </View>
                );
            case "list":
                return (
                    <View style={styles.section}>
                        {item.items.map((i: string, index: number) => (
                            <View key={index} style={styles.listRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{i}</Text>
                            </View>
                        ))}
                    </View>
                );
            case "multicode":
                return (
                    <View style={styles.section}>
                        {item.codes.map((code: any, index: number) => (
                            <View key={index} style={{ marginBottom: 12 }}>
                                <Text style={{ ...styles.codeType, marginBottom: 4 }}>{code.title}</Text>
                                <View style={styles.codeBox}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <Text style={styles.code}>{code.text}</Text>
                                    </ScrollView>
                                    <Pressable onPress={() => handleCopy(code.text)} style={{ position: "absolute", top: 8, right: 8 }}>
                                        <Text style={styles.copy}>Copy</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                )
            default:
                return null;
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.btn} onPress={() => router.push("/DataVisual/hash-map-visual")}>
                            <Text style={styles.btnText}>Visualize</Text>
                        </Pressable>
                    </View>
                }
            />

        </View>
    );
}
const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.bg,
        },

        section: {
            marginBottom: 16,
        },

        subHeading: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.text,
            marginBottom: 6,
            marginTop: 10,
        },

        text: {
            fontSize: 16,
            color: theme.textSecondary,
            lineHeight: 24,
        },
        listRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 8,
        },
        listText: {
            flex: 1,
            fontSize: 16,
            color: theme.textSecondary,
        },

        bullet: {
            marginRight: 8,
            color: theme.textSecondary,
            fontSize: 16,
        },

        codeBox: {
            backgroundColor: theme.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            marginTop: 12,
            marginBottom: 8,
        },

        code: {
            color: theme.mode === "dark" ? "#fff" : "#000",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 20,
        },
        codeHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        codeType: {
            color: theme.textSecondary,
            fontSize: 12,
            flex: 1,
        },

        copy: {
            color: theme.primary,
            fontSize: 15,
            fontWeight: "600",
        },
        buttonContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        btn: {
            backgroundColor: theme.primary,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
        },

        btnText: {
            color: "#fff",
            fontSize: 14,
            fontWeight: "600",
        },
    });
}

export default HashMaps;
