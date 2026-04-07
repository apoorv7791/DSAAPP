import React from 'react';
import { StyleSheet, View } from 'react-native';
import Expandables from '../components/Expandable/Expandables';
import { useRouter } from 'expo-router';

const Settings = () => {
    const router = useRouter();
    const modules = [
        {
            title: "Account",
            items: [
                { name: "Profile", route: "/Screens/Profile" },
                { name: "Language", route: "/Screens/Language" },
                { name: "Themes", route: "/Screens/Themes" }
            ]
        },
        {
            title: "App Settings",
            items: [
                { name: "Notifications", route: "/Screens/Notifications" },
                { name: "Privacy", route: "/Screens/Privacy" }
            ]
        },
        {
            title: "Support",
            items: [
                { name: "Help Center", route: "/Screens/Help" },
                { name: "About App", route: "/Screens/About" }
            ]
        }
    ];

    const handleSelect = (item: { name: string; route: string }) => {
        router.push(item.route as any);
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
})

export default Settings;
