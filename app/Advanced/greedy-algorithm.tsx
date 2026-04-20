import React, { useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, ToastAndroid } from 'react-native';
import { FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ThemeContext } from '../theme/ThemeContext';

const GreedyAlgorithm = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const modules = [
        {
            id: "1",
            type: "subheading",
            text: "Greedy Algorithms",
            paragraph: "Greedy algorithms are a class of algorithms that make locally optimal choices at each step with the hope of finding a global optimum. \n These algorithms work by making the best possible decision at the current moment without considering future consequences. \n Greedy algorithms are often used for optimization problems where a solution needs to be found from a set of feasible solutions. \n Main usecases are coin change problem, activity selection, Huffman coding."
        },
        {
            id: "2",
            type: "list",
            items: [
                "Coin Change Problem",
                "Activity Selection Problem",
                "Huffman Coding",
                "Kruskal's Algorithm",
                "Prim's Algorithm"
            ]
        },
        {
            id: "3",
            type: "code",
            language: "Java",
            dataType: "greedy",
            code: `// Coin Change Problem
             "Problem Statement": "Given a set of n activities with their start and end times, find the maximum number of activities that can be performed by a single person or machine, assuming that a person can only work on a single activity at a time. \n" ,
            public int coinChange(int[] coins, int amount) {
                Arrays.sort(coins);
                int count = 0;
                
                for (int i = coins.length - 1; i >= 0; i--) {
                    while (amount >= coins[i]) {
                        amount -= coins[i];
                        count++;
                    }
                }
                
                return amount == 0 ? count : -1;
            } 
               `

        },
        {
            id: "4",
            type: "code",
            language: "Java",
            dataType: "greedy",
            code: `// Activity Selection Problem
            "Problem Statement": "Given a set of n activities with their start and end times, find the maximum number of activities that can be performed by a single person or machine, assuming that a person can only work on a single activity at a time. \n",
            public void activitySelection(int[] start, int[] end) {
                int n = start.length;
                int[][] activities = new int[n][3];
                
                for (int i = 0; i < n; i++) {
                    activities[i][0] = start[i];
                    activities[i][1] = end[i];
                    activities[i][2] = i;
                }
                
                Arrays.sort(activities, (a, b) -> a[1] - b[1]);
                
                System.out.print("Selected activities: " + activities[0][2] + " ");
                int lastEnd = activities[0][1];
                
                for (int i = 1; i < n; i++) {
                    if (activities[i][0] >= lastEnd) {
                        System.out.print(activities[i][2] + " ");
                        lastEnd = activities[i][1];
                    }
                }
            }`,
            description: "The Activity Selection Problem is a problem of selecting the maximum number of activities that can be performed by a single person or machine, assuming that a person can only work on a single activity at a time. \n The problem statement is as follows: \n Given a set of n activities with their start and end times, the task is to select the maximum number of activities that can be performed by a single person or machine, assuming that a person can only work on a single activity at a time. \n Note: The order of activities selected is not important. \n For example, for n = 4 and S = {1, 2, 3, 4}, the answer is 2 activities of 1 and 4. \n So, the output should be 2.",
        }
    ]

    const handleCopy = async (code: string) => {
        await Clipboard.setStringAsync(code);
        ToastAndroid.show("Code copied to clipboard", ToastAndroid.LONG);
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
                            <Pressable onPress={() => handleCopy(item.code)}>
                                <Text style={styles.copy}>Copy</Text>
                            </Pressable>

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
            fontSize: 15,
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

export default GreedyAlgorithm;