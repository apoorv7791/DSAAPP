import React from 'react';
import { Stack } from 'expo-router';

const AlgoLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Sorting" options={{ title: "Sorting Algorithms" }} />
            <Stack.Screen name="Searching" options={{ title: "Searching Algorithms" }} />
        </Stack>
    );
}



export default AlgoLayout;
