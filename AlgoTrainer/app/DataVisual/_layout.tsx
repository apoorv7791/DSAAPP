import React from 'react';
import { Stack } from 'expo-router'

const DataLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="array-visual" options={{ title: "Array Visualizer" }} />
            <Stack.Screen name="linked-list-visual" options={{ title: "Linked List Visualizer" }} />
            <Stack.Screen name="stack-visual" options={{ title: "Stack Visualizer" }} />
            <Stack.Screen name="queue-visual" options={{ title: "Queue Visualizer" }} />
            <Stack.Screen name="hash-map-visual" options={{ title: "Hash Map Visualizer" }} />
            <Stack.Screen name="tree-visual" options={{ title: "Tree Visualizer" }} />
            <Stack.Screen name="graph-visual" options={{ title: "Graph Visualizer" }} />
            <Stack.Screen name="heaps-visual" options={{ title: "Heaps Visualizer" }} />
        </Stack>
    );
}



export default DataLayout;
