import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const LinkedList = () => {
    return (
        <View>
            <Text style={styles.heading}>
                Linked List
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

export default LinkedList;
