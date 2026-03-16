import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Graphs = () => {
    return (
        <View>
            <Text style={styles.heading}>
                Graphs
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    }
})

export default Graphs;
