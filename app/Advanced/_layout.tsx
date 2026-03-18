import React from 'react';
import { Stack } from 'expo-router';

const AdvancedLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Greedy" options={{ title: "Greedy Algorithm" }} />
            <Stack.Screen name="DP" options={{ title: "Dynamic Programming" }} />
            <Stack.Screen name="GraphAlgorithms" options={{ title: "Graph Algorithms" }} />
        </Stack>
    );
}



export default AdvancedLayout;
