import React, { useContext } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ToastAndroid } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

const DP = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const modules = [
        {
            id: "1",
            type: "subheading",
            text: "What is Dynamic Programming?.",
        },
        {
            id: "2",
            type: "paragraph",
            text: "Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable to problems exhibiting optimal substructure and overlapping subproblems.",
        },
        {
            id: "3",
            type: "subheading",
            text: "Key Characteristics",
        },
        {
            id: "4",
            type: "list",
            items: [
                "Optimal Substructure: An optimal solution contains optimal solutions to its subproblems.",
                "Overlapping Subproblems: The problem can be broken down into subproblems that are solved multiple times."
            ]
        },
        {
            id: "5",
            type: "subheading",
            text: "Why do we use Dynamic Programming?",
        },
        {
            id: "6",
            type: "paragraph",
            text: "Dynamic Programming is used to solve optimization problems by breaking them down into simpler subproblems and storing the results of these subproblems to avoid redundant calculations."
        },
        {
            id: "7",
            type: "subheading",
            text: "Types of Dynamic Programming",
        },
        {
            id: "8",
            type: "paragraph",
            text: "There are two main approaches to Dynamic Programming:"
        },
        {
            id: "9",
            type: "list",
            items: [
                "Top-down with memoization (Recursion + Caching)",
                "Bottom-up with tabulation (Iterative)"
            ]
        },
        {
            id: "10",
            type: "subheading",
            text: "Top-Down Approach (Memoization)",
        },
        {
            id: "11",
            type: "paragraph",
            text: "In the top-down approach, we solve the problem recursively and store the results of subproblems in a cache (memoization) to avoid redundant calculations."
        },
        {
            id: "12",
            type: "subheading",
            text: "Bottom-Up Approach (Tabulation)",
        },
        {
            id: "13",
            type: "paragraph",
            text: "In the bottom-up approach, we solve the problem iteratively by building up solutions from smaller subproblems, filling a table (tabulation) with the results."
        },
        {
            id: "14",
            type: "code",
            dataType: "Top down approach",
            code: `DP using memoization
            function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}`
        },
        {
            id: "15",
            type: "code",
            dataType: "Bottom up approach",
            code: `DP using tabulation
function fibonacci(n) {
  if (n <= 1) return n;
  let dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`
        }
    ]
    const handleCopy = async (code: string) => {
        await Clipboard.setStringAsync(code);
        ToastAndroid.show("Code copied to Clipboard", ToastAndroid.LONG);
    }
    const renderItem = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return (
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>{item.text}</Text>
                        {item.paragraph && (
                            <Text style={styles.text}>{item.paragraph}</Text>
                        )}
                    </View>
                )
            case "paragraph":
                return (
                    <View style={styles.section}>
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                )
            case "list":
                return (
                    <View style={styles.section}>
                        {item.items.map((itemText: string, index: number) => (
                            <View key={index} style={styles.listItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{itemText}</Text>
                            </View>
                        ))}
                    </View>
                )
            case "code":
                return (
                    <View style={styles.codeBox}>
                        <View style={styles.codeHeader}>
                            <View style={styles.codeBox}>
                                <View style={styles.codeHeader}>
                                    <Pressable onPress={() => handleCopy(item.code)}>
                                        <Text style={styles.copy}>Copy</Text>
                                    </Pressable>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <Text style={styles.code}>{item.code}</Text>
                                </ScrollView>
                            </View>
                            <Text style={styles.codeType}>
                                {item.language} • {item.dataType}
                            </Text>
                        </View>
                    </View>
                )
            default:
                return null
        }
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
                        <Pressable style={styles.btn}>
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

        heading: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.text,
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

        bold: {
            fontWeight: "bold",
            color: theme.text,
        },


        codeBox: {
            backgroundColor: theme.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
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
            color: theme.textSecondary,
            fontSize: 12,
        },
        code: {
            color: theme.mode === "dark" ? "#fff" : "#000",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 20,
            flexWrap: "wrap", // 🔥 fix
        },
        copy: {
            color: theme.primary,
            fontSize: 12,
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
            backgroundColor: theme.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
            borderRadius: 10,
            elevation: 2,
        },

        bullet: {
            marginRight: 8,
            color: theme.textSecondary,
            fontSize: 16,
        },

        listText: {
            flex: 1,
            fontSize: 16,
            color: theme.textSecondary,
        },
        btn: {
            backgroundColor: theme.primary,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignSelf: "flex-start",
        },
        btnText: {
            color: "#fff",
            fontSize: 14,
            fontWeight: "600",
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
        }
    });
}

export default DP;

