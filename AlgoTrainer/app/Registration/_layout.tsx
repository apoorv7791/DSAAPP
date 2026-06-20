import { Stack } from 'expo-router';
import React from 'react';

const RegLayout = () => {
    return (


        <Stack>
            <Stack.Screen name="register" options={{ title: "Register" }} />
            <Stack.Screen name="login" options={{ title: "Login" }} />
        </Stack>


    );
}


export default RegLayout;
