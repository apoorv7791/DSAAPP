import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Index = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>AlgoTrainer</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    }
})

export default Index;
