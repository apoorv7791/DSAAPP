import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const GraphAlgorithms = () => {
    const modules = [
        {
            id: "1",
            type: "subheading",
            text: "Graph Algorithms",
            paragraph: "Graph algorithms are a set of algorithms that are used to solve graph-related problems. \n Graphs are mathematical structures that consist of a set of vertices (or nodes) and a set of edges (or arcs) that connect pairs of vertices. \n Graph algorithms are used to find paths, cycles, and other properties of graphs. \n Main usecases are networks routing, gps locations."
        },
        {
            id: "2",
            type: "list",
            items: [
                "Breadth-First Search (BFS)",
                "Depth-First Search (DFS)",
            ]
        },
        {
            id: "3",
            type: "code",
            language: "Java",
            dataType: "graph",
            code: `// BFS Implementation
            public void bfs(int start) {
                boolean[] visited = new boolean[vertices];
                Queue<Integer> queue = new LinkedList<>();
                
                visited[start] = true;
                queue.add(start);
                
                while (!queue.isEmpty()) {
                    int node = queue.poll();
                    System.out.print(node + " ");
                    
                    for (int neighbor : adjList.get(node)) {
                        if (!visited[neighbor]) {
                            visited[neighbor] = true;
                            queue.add(neighbor);
                        }
                    }
                }
            }`
        },
        {
            id: "4",
            type: "code",
            language: "Java",
            dataType: "graph",
            code: `// DFS Implementation
            public void dfs(int start) {
                boolean[] visited = new boolean[vertices];
                dfsHelper(start, visited);
            }
            
            private void dfsHelper(int node, boolean[] visited) {
                visited[node] = true;
                System.out.print(node + " ");
                
                for (int neighbor : adjList.get(node)) {
                    if (!visited[neighbor]) {
                        dfsHelper(neighbor, visited);
                    }
                }
            }`
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
                            <View style={styles.codeBox}>
                                <View style={styles.codeHeader}>
                                    <TouchableOpacity onPress={() => handleCopy(item.code)}>
                                        <Text style={styles.copy}>Copy</Text>
                                    </TouchableOpacity>
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
                return null;
        }
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                renderItem={renderItem}
                keyExtractor={(item => item.id)}
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

export default GraphAlgorithms;


