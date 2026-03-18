import React from 'react';
import { Stack } from 'expo-router';

const DataLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Arrays" options={{ title: "Arrays" }} />
            <Stack.Screen name="Linkedlist" options={{ title: "Linked list" }} />
            <Stack.Screen name="Stacks" options={{ title: "Stacks" }} />
            <Stack.Screen name="Queues" options={{ title: "Queues" }} />
            <Stack.Screen name="HashMaps" options={{ title: "HashMaps" }} />
            <Stack.Screen name="Trees" options={{ title: "Trees" }} />
            <Stack.Screen name="Graphs" options={{ title: "Graphs" }} />
        </Stack>
    );
}


export default DataLayout;
