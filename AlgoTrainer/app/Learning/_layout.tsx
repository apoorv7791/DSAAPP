import React from 'react';
import { Stack } from 'expo-router';

const LearnLayout = () => {
    return (
        <Stack>
            <Stack.Screen name='difficulty' options={{ title: "Difficulty Level" }} />
            <Stack.Screen name='dailygoal' options={{ title: "Daily Goal" }} />
            <Stack.Screen name='progress' options={{ title: "Progress Tracking" }} />
        </Stack>
    );
}



export default LearnLayout;
