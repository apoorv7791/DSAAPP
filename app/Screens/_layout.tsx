import React from 'react';
import { Stack } from 'expo-router';

const ScreensLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Email" options={{ title: "Email" }} />
            <Stack.Screen name="Password" options={{ title: "Password" }} />
            <Stack.Screen name="Difficulty" options={{ title: "Difficulty" }} />
            <Stack.Screen name="DailyGoal" options={{ title: "Daily Goal" }} />
            <Stack.Screen name="Language" options={{ title: "Language" }} />
            <Stack.Screen name="Profile" options={{ title: "Profile" }} />

        </Stack>
    );
}



export default ScreensLayout;
