import React from 'react';
import { StyleSheet, View, Text, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';
const Searching = () => {
    return (
        <View style={styles.container}>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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

export default Searching;
