import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Queues = () => {
    return (
        <View>
            <Text style={styles.heading}>
                Queues
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

export default Queues;
