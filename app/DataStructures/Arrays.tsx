import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ToastAndroid } from 'react-native';;


const Arrays = () => {
    const content = [
        {
            id: "1",
            type: "subheading",
            text: "What is an Array?",
        },
        {
            id: "2",
            type: "text",
            text: "An array is a collection of elements stored in contiguous memory locations.",
        },
        {
            id: "3",
            type: "subheading",
            text: "Why do we use Arrays?",
        },
        {
            id: "4",
            type: "text",
            text: "Before arrays, storing multiple values required separate variables, which was inefficient and hard to manage.",
        },
        {
            id: "5",
            type: "list",
            items: [
                "Without arrays: int a=10, b=20, c=30 (messy 😵)",
                "Hard to process data using loops",
                "No structured way to store large data",
                "Memory handling becomes inefficient"
            ],
        },
        {
            id: "6",
            type: "code",
            text: "// Without Array\nint a = 10;\nint b = 20;\nint c = 30;\n\n// With Array\nint[] arr = {10, 20, 30};",
            language: "Java",
            dataType: "Comparison",
        },
        {
            id: "7",
            type: "text",
            text: "Arrays solve this by storing multiple values in a single variable and allowing easy access using index .",

        },

        {
            id: "8",
            type: "code",
            text: "int[] arr = {10, 20, 30, 40};",
            language: "Java",
            dataType: "Integer Array",
        },
        {
            id: "9",
            type: "code",
            text: "Accessing elements: arr[0] = {10};\n arr[1] = {20}; \n arr[2] = {30};\n arr[3] = {40};",
            language: "Java",
            dataType: "Integer Array",
        },
        {
            id: "10",
            type: "subheading",
            text: "Key Points",
        },
        {
            id: "11",
            type: "list",
            items: [
                "Fixed size",
                "Fast access using index",
                "Stored in contiguous memory",
            ],
        },
        {
            id: "12",
            type: "subheading",
            text: "Common Operations",
        },
        {
            id: "13",
            type: "list",
            items: [
                "Traversal",
                "Insertion",
                "Deletion",
                "Searching",
            ],
        },
        {
            id: "14",
            type: "subheading",
            text: "Try Yourself",
        },
        {
            id: "15",
            type: "code",
            text: "// Print all elements\nfor(int i=0; i<arr.length; i++){\n   System.out.println(arr[i]);\n}",
            language: "Java",
            dataType: "Practice",
        },
        {
            id: "16",
            type: "code",
            text: "// search an element (20)\nboolean found = false;\nfor(int i=0; i<arr.length; i++){\n   if(arr[i] == 20){\n       found = true;\n       break;\n   }\n}",
            language: "Java",
            dataType: "Practice",
        },
        {
            id: "17",
            type: "code",
            text: "// Insert an element at a specific index\nint[] newArr = new int[arr.length + 1];\nfor(int i=0; i<index; i++){\n   newArr[i] = arr[i];\n}\nnewArr[index] = element;\nfor(int i=index; i<arr.length; i++){\n   newArr[i+1] = arr[i];\n}",
            language: "Java",
            dataType: "Practice",
        },
        {
            id: "18",
            type: "code",
            text: "// Delete an element at a specific index\nvoid deleteAtIndex(int[] arr, int n, int index) {\n    if (index < 0 || index >= n) {\n        System.out.println(\"Invalid index\");\n        return;\n    }\n\n    // Shift elements to the left\n    for (int i = index; i < n - 1; i++) {\n        arr[i] = arr[i + 1];\n    }\n\n    // Reduce size\n    n = n - 1;\n}"
        },
        {
            id: "19",
            type: "code",
            text: "// Search for en element in log time using binary search (sorted array)\nboolean binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return true;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return false;\n}",
            language: "Java",
            dataType: "Practice",
        },

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
                );
            case "text":
                return (
                    <View style={styles.section}>
                        <Text style={styles.text}>
                            {item.text}
                        </Text>
                    </View>
                );
            case "code":
                return (
                    <View style={styles.codeBox}>
                        <View style={styles.codeHeader}>
                            <Text style={styles.codeType}>
                                {item.language} • {item.dataType}
                            </Text>

                            <TouchableOpacity onPress={() => handleCopy(item.text)}>
                                <Text style={styles.copy}>COPY</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text style={styles.code}>{item.text}</Text>
                        </ScrollView>
                    </View>
                );
            case "list":
                return (
                    <View>
                        {item.items.map((i: string, index: string) => (
                            <View key={index} style={styles.listRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{i}</Text>
                            </View>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    }, [content]);

    return (
        <View style={styles.container}>
            <FlatList
                data={content}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btnText}>Visualize</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
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

    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 16,
    },

    subHeading: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
        marginBottom: 6,
        marginTop: 10,
    },

    text: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24,
    },

    bold: {
        fontWeight: "bold",
        color: "#000",
    },


    codeBox: {
        backgroundColor: "#1e1e1e",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
        marginTop: 12,   // 👈 thoda gap badhao
        marginBottom: 8,
    },
    codeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    codeType: {
        color: "#aaa",
        fontSize: 12,
        flex: 1, // 🔥 important
    },
    code: {
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 20,
        flexWrap: "wrap", // 🔥 fix
    },
    copy: {
        color: "#4da6ff",
        fontSize: 15,
        fontWeight: "600",
    },
    // 🔥 List Styling
    listRow: {
        flexDirection: "row",
        alignItems: "flex-start",
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
    btn: {
        backgroundColor: "#4da6ff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    btnText: {
        color: "#3617e0",
        fontSize: 14,
        fontWeight: "600",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    }
});

export default Arrays;
