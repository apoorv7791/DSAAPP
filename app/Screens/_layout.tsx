import React from 'react';
import { Stack } from 'expo-router';

const ScreenLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: "#fff" },
                headerTitleStyle: { fontWeight: "600" },
            }}
        >
            <Stack.Screen name='profile' options={{ title: "Profile" }} />
            <Stack.Screen name='language' options={{ title: "Language" }} />
            <Stack.Screen name='themes' options={{ title: "Themes" }} />
        </Stack>
    );
}




export default ScreenLayout;
