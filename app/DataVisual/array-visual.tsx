import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ArrayVisual = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Array Visualizer</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    heading: {
        fontSize: 21,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    }
})

export default ArrayVisual;
