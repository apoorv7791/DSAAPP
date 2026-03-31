import React from 'react';
import { StyleSheet, View, Text, Platform, ToastAndroid, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';


const Graphs = () => {
    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show("Code copied to clipboard!", ToastAndroid.LONG);
    }
    const modules = [
        {
            id: "1",
            type: "subheading",
            text: "What are Graphs?"
        },
        {
            id: "2",
            type: "paragraph",
            text: "A graph is a collection of nodes (also called vertices) connected by edges.  \n It is a non-linear data structure that is used to represent relationships between different elements."
        },
        {
            id: "3",
            type: "subheading",
            text: "why do we use Graphs?."
        },
        {
            id: "4",
            type: "paragraph",
            text: "Graphs are used to model pairwise relationships between objects. \n They are widely used in various applications such as social networks, maps, and recommendation systems and also in gps navigation."
        },
        {
            id: "5",
            type: "subheading",
            text: "Types of Graphs"
        },
        {
            id: "6",
            type: "list",
            items: [
                { id: "6.1", text: "Undirected Graph: In an undirected graph, the edges do not have a direction. The relationship between the nodes is bidirectional." },
                { id: "6.2", text: "Directed Graph: In a directed graph, the edges have a direction. The relationship between the nodes is unidirectional." }
            ]
        },
        {
            id: "7",
            type: "subheading",
            text: "Graph Representations"
        },
        {
            id: "8",
            type: "paragraph",
            text: "There are two common ways to represent a graph: adjacency matrix and adjacency list. \n An adjacency matrix is a 2D array where the value at row i and column j indicates the presence of an edge between vertices i and j. \n An adjacency list is an array of lists, where each index represents a vertex and contains a list of its adjacent vertices."
        },
        {
            id: "9",
            type: "code",
            language: "Java",
            dataType: "Graph Implementation",
            text: `class Graph {
    int V; // number of vertices
    LinkedList<Integer> adjListArray[]; // adjacency list

    Graph(int V) {
        this.V = V;
        adjListArray = new LinkedList[V];
        for (int i = 0; i < V; i++) {
            adjListArray[i] = new LinkedList();
        }
    }
}`
        },
        {
            id: "10",
            type: "code",
            language: "Java",
            dataType: "Graph Implementation",
            text: `class Graph {
    int V; // number of vertices
    boolean adjMatrix[][]; // adjacency matrix

    Graph(int V) {
        this.V = V;
        adjMatrix = new boolean[V][V];
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                adjMatrix[i][j] = false;
            }
        }
    }

    void addEdge(int src, int dest) {
        adjMatrix[src][dest] = true;
        adjMatrix[dest][src] = true; // for undirected graph
    }`
        },
    ]
    const renderContent = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return <Text style={styles.heading}>{item.text}</Text>;
            case "paragraph":
                return <Text style={styles.text}>{item.text}</Text>;
            case "list":
                return <View>
                    {item.items.map((listItem: any) => (
                        <Text key={listItem.id} style={styles.text}>- {listItem.text}</Text>
                    ))}
                </View>
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
            default:
                return null;
        }
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                renderItem={renderContent}
                keyExtractor={(item: { id: any; }) => item.id}
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
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        fontSize: 13,
        lineHeight: 20,
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



export default Graphs;
