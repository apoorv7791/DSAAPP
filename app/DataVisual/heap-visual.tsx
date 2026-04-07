import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HeapVisual = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Heap Visualizer</Text>
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
        textAlign: 'center',
        marginVertical: 20
    }
})

export default HeapVisual;
