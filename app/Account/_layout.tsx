import React from 'react';
import { Stack } from 'expo-router';

const AccountLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: "#fff" },
                headerTitleStyle: { fontWeight: "600" },
            }}
        >
            <Stack.Screen name="Profile" options={{ title: "Profile" }} />
            <Stack.Screen name="Language" options={{ title: "Language" }} />
            <Stack.Screen name="Themes" options={{ title: "Themes" }} />
        </Stack>
    );
};

export default AccountLayout;