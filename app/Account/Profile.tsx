import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const Profile = () => {

    const [user, setUser] = React.useState({
        name: "Apoorv",
        email: "singhapoorv7791@gmail.com",
        avatar: require('../../assets/images/Apoorv.jpg'),
    });

    return (
        <View style={styles.container}>

            {/* 👤 Profile Header */}
            <View style={styles.header}>
                <Image
                    source={user.avatar}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
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
        marginTop: 40,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 15,
    },

    name: {
        fontSize: 22,
        fontWeight: "bold",
    },

    email: {
        fontSize: 14,
        color: "gray",
        marginTop: 5,
    },
});

export default Profile;