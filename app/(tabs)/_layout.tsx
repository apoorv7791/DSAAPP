import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from '../navigation/Tabbar';
import { ThemeContext } from '@react-navigation/native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                animation: "fade",
                headerStyle: {

                },
                tabBarStyle: {
                    height: 60,
                    borderTopWidth: 0,
                    elevation: 10,

                }
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            {/* Home Screen */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    )
                }}
            />

            {/* Learn Screen */}
            <Tabs.Screen
                name="learn"
                options={{
                    title: "Learn",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book" size={size} color={color} />
                    )
                }}
            />

            {/* Settings Screen */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cog" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}