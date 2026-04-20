import React, { useCallback, useContext } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, Platform, ScrollView } from 'react-native';
import { ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../theme/ThemeContext';

const Stacks = () => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const modules = [
        {
            id: "1",
            type: "subheading",
            text: "What is a Stack?",
        },
        {
            id: "2",
            type: "text",
            text: "A stack is a linear data structure that follows the Last In First Out (LIFO) principle. It allows operations only at one end, called the top of the stack. The main operations are push (to add an element) and pop (to remove the top element).",
        },
        {
            id: "3",
            type: "subheading",
            text: "Why do we use Stacks?",
        },
        {
            id: "4",
            type: "text",
            text: "Stacks are used in various applications such as expression evaluation, backtracking algorithms, and function call management in programming languages. They provide a simple way to manage data that needs to be processed in reverse order.",
        },
        {
            id: "5",
            type: "code",
            language: "Java",
            dataType: "Stack Implementation",
            text: `class Stack {
    int stk[] = new int[100];
    int top = -1;
}`
        },
        {
            id: "6",
            type: "code",
            language: "Java",
            dataType: "Push Operations",
            text: `void push(int item) {
if (top >= 99) {
    System.out.println("Stack overflow");
} else {
    stk[++top] = item;
    }
}`
        },
        {
            id: "7",
            type: "code",
            language: "Java",
            dataType: "Pop Operations",
            text: `int pop() {
if (top < 0) {
    System.out.println("Stack underflow");
    return 0;
} else {
    return stk[top--];
    }
}`
        },
        {
            id: "8",
            type: "code",
            language: "Java",
            dataType: "Peek Operations",
            text: `int peek() {
 if (top < 0) {
    System.out.println("Stack is empty");
    return 0;
} else {
    return stk[top];
    }
}`
        },
        {
            id: "9",
            type: "code",
            language: "Java",
            dataType: "Is Empty Operations",
            text: `boolean isEmpty() {
return (top < 0);
}`
        },
        {
            id: "10",
            type: "code",
            language: "Java",
            dataType: "Display Stack",
            text: `void display() {
if (top < 0) {
    System.out.println("Stack is empty");
} else {
    for (int i = top; i >= 0; i--) {
        System.out.print(stk[i] + " ");
    }
    System.out.println();
    }
}`
        }

    ]

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
            default:
                return null;
        }
    }, [modules]);
    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.btn} onPress={() => router.push("/DataVisual/stack-visual")}>
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
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
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
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
export default Stacks;
