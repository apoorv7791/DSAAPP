import React, { useContext } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Expandables from '../components/Expandable/Expandables';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../theme/ThemeContext';

// Define the module type
interface Module {
    title: string;
    topics: Topic[];
}

type Topic = {
    name: string;
    icon: string;
    route: string;
    right: any;
}

const Learn: React.FC = () => {
    const router = useRouter();
    const { theme } = useContext(ThemeContext);

    // Your modules data
    const modules: Module[] = [
        {
            title: "Data Structures",
            topics: [
                { name: "Arrays", icon: "grid-outline", route: "arrays", right: null },
                { name: "LinkedList", icon: "git-branch-outline", route: "linkedlist", right: null },
                { name: "Stacks", icon: "layers-outline", route: "stacks", right: null },
                { name: "Queues", icon: "menu-outline", route: "queues", right: null },
                { name: "HashMaps", icon: "key-outline", route: "hashmaps", right: null },
                { name: "Trees", icon: "leaf-outline", route: "trees", right: null },
                { name: "Graphs", icon: "share-social-outline", route: "graphs", right: null },
                { name: "Heaps", icon: "cube-outline", route: "heaps", right: null },
            ]
        },
        {
            title: "Algorithms",
            topics: [
                { name: "Sorting", icon: "swap-vertical-outline", route: "sorting", right: null },
                { name: "Searching", icon: "search-outline", route: "searching", right: null },
            ]
        },
        {
            title: "Advanced Algorithms",
            topics: [
                { name: "Greedy Algorithm", icon: "trending-up-outline", route: "greedy-algorithm", right: null },
                { name: "Dynamic Programming", icon: "code-outline", route: "dynamic-programming", right: null },
                { name: "Graph Algorithms", icon: "share-social-outline", route: "graph-algorithms", right: null },
                { name: "Recursion", icon: "refresh-outline", route: "recursion", right: null },
            ]
        }
    ];

    // Function to handle topic selection
    const selectedTopic = (module: string, topic: string) => {
        const formattedTopic = topic.toLowerCase().replace(/\s+/g, '-');
        const basePath =
            module === "Data Structures"
                ? "DataStructures"
                : module === "Algorithms"
                    ? "Algorithms"
                    : "Advanced";

        router.push(`/${basePath}/${formattedTopic}` as any);
    }
    // FlatList render function
    const renderModule = ({ item }: { item: Module }) => (
        <Expandables
            title={item.title}
            topics={item.topics}
            theme={theme}
            onSelected={(topic) => selectedTopic(item.title, topic.name)}
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <FlatList
                data={modules}
                keyExtractor={(item) => item.title}
                renderItem={renderModule}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    heading: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111",
        marginBottom: 10,
        marginLeft: 4,
    }
});

export default Learn;