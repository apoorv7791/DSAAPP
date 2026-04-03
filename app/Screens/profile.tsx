import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Profile = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>👤 Profile</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Username</Text>
                <Text style={styles.value}>Apoorv</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>apoorv@example.com</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Streak</Text>
                <Text style={styles.value}>🔥 5 Days</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginTop: 20,
    },
    card: {
        width: '90%',
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        marginTop: 15,

        // 👇 subtle shadow (Android + iOS feel)
        elevation: 3,
    },

    label: {
        fontSize: 14,
        color: 'gray',
    },

    value: {
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default Profile;
