import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
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
            topics: ["Arrays", "Linked Lists", "Stacks", "Queues", "HashMaps", "Trees", "Graphs"]
        },
        {
            title: "Algorithms",
            topics: ["Sorting", "Searching", "Dynamic Programming", "Greedy Algorithms", "Graph Algorithms"]
        }
    ];

    // Function to handle topic selection
    const selectedTopic = (module: string, topic: string) => {
        const formattedTopic = topic.replace(/[^a-zA-Z0-9]/g, '');
        const basePath = module === "Data Structures" ? "DataStructures" : "Algorithms";
        router.push(`/${basePath}/${formattedTopic}` as any);
    }
    // FlatList render function
    const renderModule = ({ item }: { item: Module }) => (
        <Expandables
            title={item.title}
            topics={item.topics}
            onSelected={(topic) => selectedTopic(item.title, topic)}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                keyExtractor={(item) => item.title}
                renderItem={renderModule}
                ListHeaderComponent={<Text style={styles.heading}>Learn</Text>}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Learn;