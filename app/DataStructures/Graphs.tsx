import React from 'react';
import { StyleSheet, View, Text, Platform, ToastAndroid, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../theme/ThemeContext';

const Graphs = () => {
    const { theme } = React.useContext(ThemeContext);
    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show("Code copied to clipboard!", ToastAndroid.LONG);

    }
    const router = useRouter();
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
                        <TouchableOpacity style={styles.btn} onPress={() => router.push("/DataVisual/graph-visual")}>
                            <Text style={styles.btnText}>Visualize</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}
const getStyles = (theme: any) => {
    StyleSheet.create({
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
    });

}
export default Graphs;
