import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Profile = () => {
    return (
        <View>
            <Text style={styles.heading}>Profile</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginTop: 20,
    }
})

export default Profile;
