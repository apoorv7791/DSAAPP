import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const Profile = () => {
    return (
        <View style={styles.container}>

            {/* 👤 Profile Header */}
            <View style={styles.header}>
                <Image
                    source={{ uri: "https://i.pravatar.cc/150?img=3" }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>Apoorv</Text>
                <Text style={styles.email}>singhapoorv7791@gmail.com</Text>
            </View>

            {/* 📊 Stats */}
            <View style={styles.card}>
                <Text style={styles.label}>🔥 Streak</Text>
                <Text style={styles.value}>5 Days</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>📚 Problems Solved</Text>
                <Text style={styles.value}>23</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>🏆 Level</Text>
                <Text style={styles.value}>Beginner</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
    },

    header: {
        alignItems: "center",
        marginBottom: 25,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },

    name: {
        fontSize: 22,
        fontWeight: "bold",
    },

    email: {
        fontSize: 14,
        color: "gray",
    },

    card: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 4,
    },

    label: {
        fontSize: 14,
        color: "gray",
        marginBottom: 5,
    },

    value: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Profile;