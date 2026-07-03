import React from 'react';
import { Stack } from 'expo-router';

const ScreensLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Email" options={{ title: "Email" }} />
            <Stack.Screen name="Password" options={{ title: "Password" }} />
            <Stack.Screen name="Language" options={{ title: "Language" }} />
            <Stack.Screen name="Profile" options={{ title: "Profile" }} />
            <Stack.Screen name="ForgotPassword" options={{ title: "Forgot-Password" }} />
        </Stack>
    );
}



export default ScreensLayout;
