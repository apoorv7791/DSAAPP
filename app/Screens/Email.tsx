import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Email = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Email Settings</Text>
            <Text style={styles.subtitle}>Manage your email preferences...</Text>
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

export default Email;