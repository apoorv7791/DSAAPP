import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import * as ClipBoard from 'expo-clipboard';

const Recursion = () => {
    const modules = [
        {
            id: "1",
            type: "subheading",
            text: "What is Recursion?\n",
        },
        {
            id: "2",
            type: "text",
            text: "Recursion is a programming technique where a function calls itself to solve a problem.\n It breaks down a complex problem into smaller, similar subproblems until it reaches a base case that can be solved directly.\n"
        },
        {
            id: "3",
            type: "subheading",
            text: "Why do we use Recursion?\n",
        },
        {
            id: "4",
            type: "text",
            text: "Recursion is useful for problems that have a naturally recursive structure,\n such as tree traversals, graph algorithms, divide-and-conquer algorithms,\n and mathematical computations like factorials or Fibonacci sequences.\n"
        },
        {
            id: "5",
            type: "subheading",
            text: "How does Recursion work?\n"
        },
        {
            id: "6",
            type: "text",
            text: "Recursion works by breaking down a problem into smaller subproblems of the same type.\n Each recursive call processes a smaller portion of the problem until it reaches a base case,\n which is a condition that stops the recursion.\n The base case is crucial to prevent infinite recursion and ensure the function eventually returns a result.\n"
        },
        {
            id: "7",
            type: "code",
            language: "Java",
            dataType: "Factorial implementaion",
            code: `public static int factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
} 
    public static void main(){
        System.out.println(factorial(5));
    }
    output: 1 2 6 24 120`
        },
        {
            id: "8",
            type: "code",
            language: "Java",
            dataType: "Fibonacci implementaion",
            code: `public static int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
    public static void main(){
        System.out.println(fibonacci(10));
    }
    output: 0 1 1 2 3 5 8 13 21 34`
        },

    ]
    const renderItem = ({ item }: { item: any }) => {
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
                            <TouchableOpacity onPress={() => handleCopy(item.code)}>
                                <Text style={styles.copy}>Copy</Text>
                            </TouchableOpacity>

                            <Text style={styles.codeType}>
                                {item.language} • {item.dataType}
                            </Text>
                        </View>

                        <ScrollView horizontal>
                            <Text style={styles.code}>{item.code}</Text>
                        </ScrollView>
                    </View>
                )
            default:
                return null;
        }
    }
    const handleCopy = async (code: string) => {
        await ClipBoard.setStringAsync(code);
        ToastAndroid.show("code copied Successfull", ToastAndroid.SHORT)
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
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
    },
    code: {
        color: "#ffffff",
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 20,
        flexWrap: "wrap", // 🔥 fix
    },
    copy: {
        color: "#20b912",
        fontSize: 15,
        fontWeight: "600",
        alignSelf: "flex-start",

    },

    // 🔥 List Styling
    listRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 4,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        elevation: 2,
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

export default Recursion;
