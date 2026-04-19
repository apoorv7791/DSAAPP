import React from 'react';
import { Stack } from 'expo-router';

const AdvanceLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="greedy-visual" options={{ title: "Greedy Visualization" }} />
            <Stack.Screen name="dynamic-visual" options={{ title: "Dynamic Programming Visualization" }} />
            <Stack.Screen name="graph-visual" options={{ title: "Graph Algorithms Visualization" }} />
            <Stack.Screen name="recursion" options={{ title: "Recursion Visualization" }} />
        </Stack>
    );
}



export default AdvanceLayout;
