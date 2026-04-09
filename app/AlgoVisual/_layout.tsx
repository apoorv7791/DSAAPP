import React from 'react';
import { Stack } from 'expo-router';
const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="sorting-visual" options={{ title: "Sorting Visualizer" }} />
            <Stack.Screen name="searching-visual" options={{ title: "Searching Visualizer" }} />
        </Stack>
    );
}


export default Layout;
