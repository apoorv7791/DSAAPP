import React from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}



export default RootLayout;
