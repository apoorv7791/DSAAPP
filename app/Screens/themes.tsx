import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Themes = () => {
    return (
        <View>
            <Text style={styles.heading}>Themes</Text>
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
export default Themes;
