import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Language = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Language</Text>
            <Text style={styles.subtitle}>Choose your preferred language...</Text>
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

export default Language;