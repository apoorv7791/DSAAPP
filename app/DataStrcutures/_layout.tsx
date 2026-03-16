import React from 'react';
import { Stack } from 'expo-router';

const DataLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Arrays" options={{ title: "Arrays" }} />
            <Stack.Screen name="LinkedList" options={{ title: "Linked List" }} />
        </Stack>
    );
}


export default DataLayout;
