import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Expandables from '../components/Expandable/Expandables';
import { useRouter } from 'expo-router';


// Define the module type
interface Module {
    title: string;
    topics: string[];
}

const Learn: React.FC = () => {
    const router = useRouter();

    // Your modules data
    const modules: Module[] = [
        {
            title: "Data Structures",
            topics: ["Arrays", "LinkedList", "Stacks", "Queues", "HashMaps", "Trees", "Graphs", "Heaps"]
        },
        {
            title: "Algorithms",
            topics: ["Sorting", "Searching"]
        },
        {
            title: "Advanced Algorithms",
            topics: ["Greedy Algorithm", "Dynamic Programming", "Graph Algorithms", "Recursion"]
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
            topics={item.topics.map(topic => ({ name: topic, route: topic.toLowerCase().replace(/\s+/g, '-'), action: '', danger: false }))}
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