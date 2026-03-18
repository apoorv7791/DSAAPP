import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const HashMaps = () => {
    return (
        <View style={styles.contianer}>
            <Text style={styles.heading}>
                HashMaps
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contianer: {
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

export default HashMaps;
