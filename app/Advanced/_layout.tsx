import React from 'react';
import { Stack } from 'expo-router';

const AdvancedLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Greedy Algorithm" options={{ title: "Greedy Algorithm" }} />
            <Stack.Screen name="Dynamic Programming" options={{ title: "Dynamic Programming" }} />
            <Stack.Screen name="Graph Algorithms" options={{ title: "Graph Algorithms" }} />
        </Stack>
    );
}



export default AdvancedLayout;
