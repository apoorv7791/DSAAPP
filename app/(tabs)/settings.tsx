import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Expandables from '../components/Expandable/Expandables';
import { useRouter } from 'expo-router';
// import { useAuth } from '../auth/AuthContext';

const Settings = () => {
    const router = useRouter();
    // const { isLoggedIn, login, logout } = useAuth();
    const modules = [
        {
            title: "Account",
            items: [
                { name: "Profile", route: "/Account/Profile", icon: "person" },
                { name: "Language", route: "/Account/Language", icon: "language" },
                { name: "Themes", route: "/Account/Themes", icon: "color-palette" }
            ]
        },
        {
            title: "App Settings",
            items: [
                { name: "Notifications", route: "/Screens/Notifications", icon: "notifications" },
                { name: "Privacy", route: "/Screens/Privacy", icon: "shield" },
                { name: "About", route: "Screens/About", icon: "information-circle" },
            ]
        },

    ];



    const handleSelect = (item: { name: string; route: string }) => {
        router.push(item.route as any);
    }
    // const handleAuth = () => {
    //     if (isLoggedIn) {
    //         logout();
    //     } else {
    //         login();
    //     }
    // }
    return (
        <View style={styles.container}>

            {modules.map((module, index) => (
                <Expandables
                    key={index}
                    title={module.title}
                    topics={module.items}
                    onSelected={handleSelect}
                />
            ))}
            {/* <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                <Text style={styles.authText}>
                    {isLoggedIn ? "Logout" : "Login"}
                </Text>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
        paddingBottom: 20,
    },
    authButton: {
        backgroundColor: "#0e3c6d",
        padding: 12,
        borderRadius: 8,
        marginTop: 30,
        alignSelf: "center",
    },
    authText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
})

export default Settings;
