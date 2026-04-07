import React from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { AuthProvider } from './auth/AuthContext';

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}



export default RootLayout;
