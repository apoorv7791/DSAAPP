import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { AuthProvider } from '@/auth/AuthContext';
import { LearningProgressProvider } from '@/context/LearningProgressContext';
import { ThemeContext } from '@/theme/ThemeContext';
import { ThemeProvider } from '@/theme/ThemeContext';
import {
  ThemeProvider as NavThemeProvider,
  DarkTheme,
  DefaultTheme
} from '@react-navigation/native';
import { LanguageProvider } from '@/context/LanguageContext';

function RootNavigation() {
  const { theme } = useContext(ThemeContext);

  const navTheme =
    theme.mode === 'dark'
      ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.bg,
          card: theme.bg, // header + tab bg
          text: theme.text,
          border: theme.border,
          primary: theme.primary,
        },
      }
      : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.bg,
          card: theme.bg,
          text: theme.text,
          border: theme.border,
          primary: theme.primary,
        },
      };

  return (
    <NavThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="Learning" />
        <Stack.Screen name="Registration" />
        <Stack.Screen name="Screens" />
        <Stack.Screen name="Support" />
      </Stack>
    </NavThemeProvider>
  );
}

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <LearningProgressProvider>
            <RootNavigation />
          </LearningProgressProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default RootLayout;