import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Expandables from '../components/Expandable/Expandables';
import { useRouter } from 'expo-router';

const Settings = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const modules = [
        {
            title: "Account",
            items: [
                { name: "Profile", route: "/Account/Profile" },
                { name: "Language", route: "/Account/Language" },
                { name: "Themes", route: "/Account/Themes" }
            ]
        },
        {
            title: "App Settings",
            items: [
                { name: "Notifications", route: "/Screens/Notifications" },
                { name: "Privacy", route: "/Screens/Privacy" }
            ]
        },

    ];



    const handleSelect = (item: { name: string; route: string }) => {
        router.push(item.route as any);
    }
    const handleAuth = () => {
        setIsLoggedIn(!isLoggedIn);
    }
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
            <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                <Text style={styles.authText}>
                    {isLoggedIn ? "Logout" : "Login"}
                </Text>
            </TouchableOpacity>
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
