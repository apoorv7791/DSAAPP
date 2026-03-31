import React from 'react';
import { Stack } from 'expo-router';

const AdvancedLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="greedy-algorithm" options={{ title: "Greedy Algorithm" }} />
            <Stack.Screen name="dynamic-programming" options={{ title: "Dynamic Programming" }} />
            <Stack.Screen name="graph-algorithms" options={{ title: "Graph Algorithms" }} />
            <Stack.Screen name="recursion" options={{ title: "Recursion" }} />
        </Stack>
    );
}



export default AdvancedLayout;
