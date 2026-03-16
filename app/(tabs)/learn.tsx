import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Expandables from '../components/Expandable/Expandables';

const Learn = () => {
    const data = [
        {
            item: "Data Strcutures",
            topics: ["Arrays", "Linked Lists", "Stacks", "Queues", "HashMaps", "Trees", "Graphs"]
        },
        {
            item: "Algorithms",
            topics: ["Sorting", "Searching", "Greedy Algorithm", "Dynamic Programming", "Graph Algorithms"]
        }
    ]

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.heading}>Learn</Text>
                {data.map((section, index) => (
                    <Expandables
                        key={index}
                        item={section.item}
                        topics={section.topics}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        paddingBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    }
})

export default Learn;
