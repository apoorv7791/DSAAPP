import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Expandables from '../components/Expandable/Expandables';
import { useRouter } from 'expo-router';


// Define the module type
interface Module {
    title: string;
    topics: Topic[];
}

type Topic = {
    name: string;
    icon: string;
    route: string;
}

const Learn: React.FC = () => {
    const router = useRouter();

    // Your modules data
    const modules: Module[] = [
        {
            title: "Data Structures",
            topics: [
                { name: "Arrays", icon: "grid-outline", route: "arrays" },
                { name: "LinkedList", icon: "git-branch-outline", route: "linkedlist" },
                { name: "Stacks", icon: "layers-outline", route: "stacks" },
                { name: "Queues", icon: "menu-outline", route: "queues" },
                { name: "HashMaps", icon: "key-outline", route: "hashmaps" },
                { name: "Trees", icon: "leaf-outline", route: "trees" },
                { name: "Graphs", icon: "share-social-outline", route: "graphs" },
                { name: "Heaps", icon: "cube-outline", route: "heaps" }
            ]
        },
        {
            title: "Algorithms",
            topics: [
                { name: "Sorting", icon: "swap-vertical-outline", route: "sorting" },
                { name: "Searching", icon: "search-outline", route: "searching" }
            ]
        },
        {
            title: "Advanced Algorithms",
            topics: [
                { name: "Greedy Algorithm", icon: "trending-up-outline", route: "greedy-algorithm" },
                { name: "Dynamic Programming", icon: "code-outline", route: "dynamic-programming" },
                { name: "Graph Algorithms", icon: "share-social-outline", route: "graph-algorithms" },
                { name: "Recursion", icon: "refresh-outline", route: "recursion" }
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
            onSelected={(topic) => selectedTopic(item.title, topic.name)}
        />
    );

    return (
        <View style={styles.container}>
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
        backgroundColor: "#f5f5f5", // 🔥 important
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