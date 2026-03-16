import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Learn = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Learn</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        paddingBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    }
})

export default Learn;
