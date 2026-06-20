import React from 'react';
import { Stack } from 'expo-router';
const SupportLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Help-Center" options={{ title: "Help Center" }} />
            <Stack.Screen name="About" options={{ title: "About" }} />
            <Stack.Screen name="private-policy" options={{ title: "Privacy Policy" }} />
            <Stack.Screen name="terms" options={{ title: "Terms of Service" }} />
        </Stack>
    );
}



export default SupportLayout;
