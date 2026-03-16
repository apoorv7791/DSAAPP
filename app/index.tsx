import React from 'react';
import { StyleSheet, View, Text, FlatList, ListRenderItem } from 'react-native';


type Module = {
    id: string,
    title: string,
    description: string,
}

const HomeScreen = () => {

    const modules: Module[] = [
        {
            id: "1",
            title: "AlgoTrainer",
            description:
                "AlgoTrainer helps you learn Data Structures and Algorithms through simple explanations, visual examples, and hands-on practice."
        },
        {
            id: "2",
            title: "What you will learn",
            description:
                "Understand core DSA topics like Arrays, Linked Lists, Trees, Graphs, and Hashing step by step."
        },
        {
            id: "3",
            title: "What we offer",
            description:
                "Interactive lessons, visual algorithm explanations, practice problems, and quizzes to strengthen your problem-solving skills."
        },
        {
            id: "4",
            title: "Advanced concepts",
            description: "After mastering the basics you can explore advanced techniques like BackTracking and Dynamic Programming to tackle complex problems with confidence."
        },
        {
            id: "5",
            title: "Practice and improve",
            description: "Regular practice is key to mastering DSA. Use our curated problem sets and quizzes to test your understanding and track your progress."
        }
    ];
    const renderItem: ListRenderItem<Module> = ({ item }) => {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome to AlgoTrainer!</Text>
            <FlatList<Module>
                data={modules}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'flex-start',
        paddingBottom: 20,

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cardDescription: {
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
        fontWeight: 'bold',
        lineHeight: 20,
    }
})

export default HomeScreen;
