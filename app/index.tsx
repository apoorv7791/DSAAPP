import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

const HomeScreen = () => {


    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.heading}>AlgoTrainer</Text>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Welcome to AlgoTrainer!</Text>
                    <Text style={styles.cardDescription}>Master algorithms and data structures with our interactive platform.</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>What we offer</Text>
                    <Text style={styles.cardDescription}>
                        - Fundamental concepts explained with clarity{'\n'}
                        - Interactive explantions of both Data Structures and Algorithms{'\n'}
                        - Visual Explanations of complex topics{'\n'}
                        - Practice problems with varying difficulty levels{'\n'}
                        - Real-world applications and case studies{'\n'}
                    </Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Advanced Concepts</Text>
                    <Text style={styles.cardDescription}>
                        - Adcanced Techniques will be explained very clearly with the help of visualizations{'\n'}
                        - In-depth analysis of algorithms and their complexities{'\n'}
                        - Optimization strategies and best practices{'\n'}
                    </Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Contact me</Text>
                    <Text style={styles.cardDescription}>Email: singhaporv7791@gmail.com{'\n'}Phone: +91 9953613646</Text>
                </View>
            </View>
        </ScrollView>
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
        width: '95%',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    }
})

export default HomeScreen;
