import React, { useContext, useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { LearningProgressProvider } from "@/context/LearningProgressContext";
import { ThemeContext, ThemeProvider } from "@/theme/ThemeContext";
import {
  ThemeProvider as NavThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { ToastProvider } from "@/components/Toast/ToastProvider";
import { updateStreak } from "@/lib/backendApi";

/** Fires POST /api/user/streak once per app launch when the user is logged in. */
function AppOpenStreakTrigger() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    // Fire-and-forget — streak is not critical enough to block anything
    void updateStreak().catch(() => { });
  }, [isLoggedIn]);

  return null;
}

function RootNavigation() {
  const { theme } = useContext(ThemeContext);

  const navTheme =
    theme.mode === "dark"
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
    Ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <LearningProgressProvider>
            <AppOpenStreakTrigger />
            <RootNavigation />
            {/* Non-blocking toast overlay — works on iOS and Android */}
            <ToastProvider />
          </LearningProgressProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
