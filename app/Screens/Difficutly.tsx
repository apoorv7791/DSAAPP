import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Difficulty = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Difficulty</Text>
            <Text style={styles.subtitle}>Choose your difficulty level...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});

export default Difficulty;