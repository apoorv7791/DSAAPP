import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const LinkedListVisual = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Linked List Visualizer</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20
    }
})

export default LinkedListVisual;
