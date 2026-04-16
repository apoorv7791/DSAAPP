import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DailyGoal = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Goal</Text>
            <Text style={styles.subtitle}>Set your daily learning goals...</Text>
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

export default DailyGoal;