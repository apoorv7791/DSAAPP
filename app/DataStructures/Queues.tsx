import React, { useContext } from 'react';
import { StyleSheet, View, Text, Platform, ToastAndroid, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router'
import { ThemeContext } from '../theme/ThemeContext';
const Queues = () => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const content = [
        {
            id: "1",
            type: "subheading",
            text: "What is a Queue?",
        },
        {
            id: "2",
            type: "text",
            text: "A queue is a linear data structure that follows the First In First Out (FIFO) principle. Elements are added at the rear (enqueue) and removed from the front (dequeue)."
        },
        {
            id: "3",
            type: "subheading",
            text: "Why do we use Queues?",
        },
        {
            id: "4",
            type: "text",
            text: "Queues are used in various applications such as task scheduling, breadth-first search algorithms, and managing resources in operating systems. They provide a simple way to manage data that needs to be processed in the order it was received."
        },
        {
            id: "5",
            type: "code",
            language: "Java",
            dataType: "Queue Implementation",
            text: `class Queue {
    int queue[] = new int[100];
    int front = 0;
    int rear = -1;
    }`
        },
        {
            id: "6",
            type: "code",
            language: "Java",
            dataType: "Enqueue Operation",
            text: "void enqueue(int item) {\n    if (rear >= 99) {\n        System.out.println(\"Queue overflow\");\n    } else {\n        queue[++rear] = item;\n    }\n}"
        },
        {
            id: "7",
            type: "code",
            language: "Java",
            dataType: "Dequeue Operation",
            text: "int dequeue() {\n    if (front > rear) {\n        System.out.println(\"Queue underflow\");\n        return -1;\n    } else {\n        return queue[front++];\n    }\n}"
        },
        {
            id: "8",
            type: "code",
            language: "Java",
            dataType: "Peek Operation",

            text: "int peek() {\n    if (front > rear) {\n        System.out.println(\"Queue is empty\");\n        return -1;\n    } else {\n        return queue[front];\n    }\n}"
        },
        {
            id: "9",
            type: "code",
            language: "Java",
            dataType: "Size Operation",
            text: "int size() {\n    return rear - front + 1;\n}"
        },
        {
            id: "10",
            type: "list",
            items: [
                "Queue is a fundamental data structure used in various applications such as task scheduling, breadth-first search algorithms, and managing resources in operating systems.",
                "It follows the First In First Out (FIFO) principle, where elements are added at the rear and removed from the front.",
                "Queues can be implemented using arrays or linked lists, and they provide a simple way to manage data that needs to be processed in the order it was received."
            ]
        },

    ]
    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show("Code copied to clipboard!", ToastAndroid.LONG);
    }

    const renderItem = ({ item }: any) => {
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
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                );
            case "code":
                return (
                    <View style={styles.codeBox}>
                        {item.language && item.dataType && (
                            <View style={styles.codeHeader}>
                                <Text style={styles.codeType}>{item.language} • {item.dataType}</Text>
                                <TouchableOpacity onPress={() => handleCopy(item.text)}>
                                    <Text style={styles.copy}>COPY</Text>
                                </TouchableOpacity>
                            </View>
                        )}
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
                )
            default:
                return null;
        }
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={content}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.btn} onPress={() => router.push("/DataVisual/queue-visual")}>
                            <Text style={styles.btnText}>Visualize</Text>
                        </TouchableOpacity>
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

        listText: {
            flex: 1,
            fontSize: 16,
            color: theme.textSecondary,
        },
        listRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 8,
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
        codeHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        code: {
            color: theme.mode === "dark" ? "#fff" : "#000",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 20,
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
        buttonContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
        }
    });
}


export default Queues;
