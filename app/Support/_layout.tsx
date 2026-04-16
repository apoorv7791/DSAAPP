import React from 'react';
import { Stack } from 'expo-router';
const SupportLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="help-center" options={{ title: "Help Center" }} />
            <Stack.Screen name="about" options={{ title: "About" }} />
            <Stack.Screen name="private-policy" options={{ title: "Private Policy" }} />
        </Stack>
    );
}



export default SupportLayout;
