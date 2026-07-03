import React, { useMemo, useCallback, useContext } from 'react';
import { StyleSheet, View, Text, Platform, ToastAndroid, FlatList, Pressable, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';

const Graphs = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { t, tArray } = useTranslation();
    const router = useRouter();

    const handleCopy = useCallback(async (text: string) => {
        await Clipboard.setStringAsync(text);
        ToastAndroid.show(t('common.copied'), ToastAndroid.LONG);
    }, [t]);

    const modules = useMemo(() => [
        {
            id: "1",
            type: "subheading",
            text: t('topicContent.graphs.title')
        },
        {
            id: "2",
            type: "paragraph",
            text: t('topicContent.graphs.description')
        },
        {
            id: "3",
            type: "subheading",
            text: t('topicContent.graphs.whyTitle')
        },
        {
            id: "4",
            type: "paragraph",
            text: t('topicContent.graphs.whyDesc')
        },
        {
            id: "5",
            type: "subheading",
            text: t('topicContent.graphs.typesTitle')
        },
        {
            id: "6",
            type: "list",
            items: tArray('topicContent.graphs.types')
        },
        {
            id: "7",
            type: "subheading",
            text: t('topicContent.graphs.repsTitle')
        },
        {
            id: "8",
            type: "paragraph",
            text: t('topicContent.graphs.repsDesc')
        },
        {
            id: "9",
            type: "code",
            language: "Java",
            dataType: "Graph Implementation (Adjacency List)",
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
            dataType: "Graph Implementation (Adjacency Matrix)",
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
    ], [t]);

    const renderContent = ({ item }: { item: any }) => {
        switch (item.type) {
            case "subheading":
                return <Text style={styles.heading}>{item.text}</Text>;
            case "paragraph":
                return <Text style={styles.text}>{item.text}</Text>;
            case "list":
                return <View>
                    {item.items.map((listItem: string, index: number) => (
                        <Text key={index} style={styles.text}>- {listItem}</Text>
                    ))}
                </View>
            case "code":
                return (
                    <View style={styles.codeBox}>
                        {item.language && item.dataType && (
                            <View style={styles.codeHeader}>
                                <Text style={styles.codeType}>{item.language} • {item.dataType}</Text>
                                <Pressable onPress={() => handleCopy(item.text)}>
                                    <Text style={styles.copy}>{t('common.copy')}</Text>
                                </Pressable>
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
                        <Pressable style={styles.btn} onPress={() => router.push("/DataVisual/graph-visual")}>
                            <Text style={styles.btnText}>{t('common.visualize')}</Text>
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
        heading: {
            fontSize: 24,
            fontWeight: "700",
            color: theme.text,
            marginBottom: 12,
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
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
export default Graphs;
