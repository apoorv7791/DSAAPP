import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: true,
            animation: "fade",
            tabBarStyle: {
                height: 60,
                borderTopWidth: 0,
                elevation: 10,
            }

        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: "Learn",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}



export default TabsLayout;
