import React from 'react';
import { Stack } from 'expo-router';

const AlgoLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="sorting" options={{ title: "Sorting Algorithms" }} />
            <Stack.Screen name="searching" options={{ title: "Searching Algorithms" }} />
        </Stack>
    );
}



export default AlgoLayout;
