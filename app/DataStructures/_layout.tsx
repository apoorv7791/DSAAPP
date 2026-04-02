import React from 'react';
import { Stack } from 'expo-router';

const DataLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="arrays" options={{ title: "Arrays" }} />
            <Stack.Screen name="linkedlist" options={{ title: "Linked List" }} />
            <Stack.Screen name="stacks" options={{ title: "Stacks" }} />
            <Stack.Screen name="queues" options={{ title: "Queues" }} />
            <Stack.Screen name="hashmaps" options={{ title: "HashMaps" }} />
            <Stack.Screen name="trees" options={{ title: "Trees" }} />
            <Stack.Screen name="graphs" options={{ title: "Graphs" }} />
            <Stack.Screen name="heaps" options={{ title: "Heaps" }} />
        </Stack>
    );
}


export default DataLayout;
