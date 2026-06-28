import { Stack } from 'expo-router';
import React from 'react';

const RegLayout = () => {
    return (


        <Stack>
            <Stack.Screen name="Signup" options={{ title: "Register" }} />
            <Stack.Screen name="Login" options={{ title: "Login" }} />
        </Stack>


    );
}


export default RegLayout;
