import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Language = () => {
    return (
        <View>
            <Text style={styles.heading}>Language</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center'
    }
})
export default Language;
