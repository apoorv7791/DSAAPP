import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Graphs = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Graphs
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    }
})

export default Graphs;
