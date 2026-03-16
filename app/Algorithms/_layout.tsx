import React from 'react';
import { Stack } from 'expo-router';

const AlgoLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="Sorting" options={{ title: "Sorting Algorithms" }} />
            <Stack.Screen name="Searching" options={{ title: "Searching Algorithms" }} />
            <Stack.Screen name="GreedyAlgorithm" options={{ title: "Greedy Algorithm" }} />
            <Stack.Screen name="DynamicProgramming" options={{ title: "Dynamic Programming" }} />
            <Stack.Screen name="GraphAlgorithms" options={{ title: "Graph Algorithms" }} />
        </Stack>
    );
}



export default AlgoLayout;
