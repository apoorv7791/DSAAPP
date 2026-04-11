import React from 'react';
import { Stack } from 'expo-router';

const RegLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Login" options={{ title: "Login" }} />
            <Stack.Screen name="SignUp" options={{ title: "Signup" }} />
        </Stack>
    );
}



export default RegLayout;
