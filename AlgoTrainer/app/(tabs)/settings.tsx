import React, { useContext, useCallback, useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Switch,
  ListRenderItem,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import Expandables from "@/components/Expandable/Expandables";
import { ThemeContext } from "@/theme/ThemeContext";
import { createTypography } from "@/theme/Typography";
import { spacingUtils } from "@/theme/Spacing";
import Card from "@/components/Card/Card";
import { useAuth } from "@/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/app/context/LanguageContext";
import { areNotificationsEnabled, requestNotificationPermissions, enableNotifications as enableNotificationsFn, disableNotifications } from "@/lib/notifications";
interface Topic {
  name: string;
  route?: string;
  icon?: string;
  right: React.ReactNode | null;
}

interface Section {
  title: string;
  topics: Topic[];
}

interface FlatListItem {
  type: "header" | "auth" | "section";
  title?: string;
  topics?: Topic[];
}

const Settings = () => {
  const router = useRouter();
  const { theme, useSystemTheme, toggleTheme, setUseSystemTheme } = useContext(ThemeContext);
  const typography = createTypography(theme);
  const { isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    logout();
  }, [logout]);

  // Check notification status on component mount
  useEffect(() => {
    const checkNotificationStatus = async () => {
      const enabled = await areNotificationsEnabled();
      setNotificationsEnabled(enabled);
    };
    checkNotificationStatus();
  }, []);

  const handleToggleNotification = useCallback(async (value: boolean) => {
    if (value) {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        const success = await enableNotificationsFn();
        if (success) {
          setNotificationsEnabled(true);
        }
      }
    } else {
      const success = await disableNotifications();
      if (success) {
        setNotificationsEnabled(false);
      }
    }
  }, []);

  const handleNavigation = useCallback(
    (topic: Topic) => {
      if (topic.name === t("settings.logout")) {
        void handleLogout();
        return;
      }
      if (!topic.route) return;
      router.push(topic.route as any);
    },
    [handleLogout, router, t],
  );

  // 🔥 memoized settings data (performance + clarity)
  const settingsData: Section[] = useMemo(
    () => [
      {
        title: t("settings.preferences"),
        topics: [
          {
            name: t("settings.darkMode"),
            icon: "moon-outline",
            right: (
              <Switch
                value={theme.mode === "dark" && !useSystemTheme}
                onValueChange={() => {
                  if (useSystemTheme) {
                    setUseSystemTheme(false)
                  }
                  toggleTheme()
                }}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={
                  theme.mode === "dark" ? theme.text : theme.textSecondary
                }
              />
            ),

          },
          {
            name: "Follow System Theme",
            icon: "phone-portrait-outline",
            right: (
              <Switch
                value={useSystemTheme}
                onValueChange={setUseSystemTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={useSystemTheme ? theme.text : theme.textSecondary}
              />
            ),
          },
          {
            name: "Notifications",
            icon: "notifications-outline",
            right: (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotification}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={
                  notificationsEnabled ? theme.text : theme.textSecondary
                }
              />
            ),
          },
          {
            name: t("settings.language"),
            icon: "language-outline",
            route: "/Screens/Language",
            right: null,
          },
          // Add Profile option when logged in
          ...(isLoggedIn
            ? [
              {
                name: t("settings.profile"),
                icon: "person-outline",
                route: "/Screens/Profile",
                right: null,
              },
            ]
            : []),
          // Add Logout option when logged in
          ...(isLoggedIn
            ? [
              {
                name: t("settings.logout"),
                icon: "log-out-outline",
                route: undefined,
                right: null,
              },
            ]
            : []),
        ],
      },
      {
        title: t("settings.learning"),
        topics: [
          {
            name: t("settings.difficulty"),
            icon: "bar-chart-outline",
            route: isLoggedIn ? "/Learning/difficulty" : "/Registration/Login",
            right: null,
          },
          {
            name: t("settings.dailyGoal"),
            icon: "flag-outline",
            route: isLoggedIn ? "/Learning/dailygoal" : "/Registration/Login",
            right: null,
          },
          {
            name: t("settings.progress"),
            icon: "analytics-outline",
            route: isLoggedIn ? "/Learning/progress" : "/Registration/Login",
            right: null,
          },
        ],
      },
      {
        title: t("settings.support"),
        topics: [
          {
            name: t("settings.helpCenter"),
            icon: "help-circle-outline",
            route: "/Support/Help-Center",
            right: null,
          },
          {
            name: t("settings.about"),
            icon: "information-circle-outline",
            route: "/Support/About",
            right: null,
          },
          {
            name: t("settings.privacyPolicy"),
            icon: "lock-closed-outline",
            route: "/Support/private-policy",
            right: null,
          },
          {
            name: t("settings.termsOfService"),
            icon: "document-text-outline",
            route: "/Support/terms",
            right: null,
          },
        ],
      },
    ],
    [
      theme.mode,
      isLoggedIn,
      logout,
      t,
      toggleTheme,
      theme.border,
      theme.primary,
      theme.text,
      theme.textSecondary,
    ],
  );

  // flattened data for FlatList
  const flatListData: FlatListItem[] = useMemo(() => {
    const data: FlatListItem[] = [{ type: "header" }];

    if (!isLoggedIn) {
      data.push({ type: "auth" });
    }

    settingsData.forEach((section) => {
      data.push({
        type: "section",
        title: section.title,
        topics: section.topics,
      });
    });

    return data;
  }, [settingsData, isLoggedIn]);

  // renderItem function for FlatList
  const renderItem: ListRenderItem<FlatListItem> = useCallback(
    ({ item }) => {
      switch (item.type) {
        case "header":
          return (
            <View
              style={[
                spacingUtils.px.lg,
                { paddingTop: 24, paddingBottom: 16 },
              ]}
            >
            
              <Text style={[typography.h1, { color: theme.text }]}>
                {t("settings.title")}
              </Text>
              <Text
                style={[
                  typography.bodyMedium,
                  { color: theme.textSecondary, marginTop: 8 },
                ]}
              >
                {t("settings.subtitle")}
              </Text>
            </View>
          );
        case "auth":
          return (
            <View style={[spacingUtils.mx.lg, { marginBottom: 16 }]}>
              <Card
                theme={theme}
                variant="outlined"
                style={{ padding: 16, alignItems: "center" }}
              >
                <Text
                  style={[
                    typography.bodyMedium,
                    {
                      color: theme.text,
                      textAlign: "center",
                      marginBottom: 12,
                    },
                  ]}
                >
                  {t("settings.authPrompt")}
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable
                    style={{
                      backgroundColor: theme.primary,
                      paddingHorizontal: 24,
                      paddingVertical: 10,
                      borderRadius: 20,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={() => router.push("/Registration/Login")}
                  >
                    <Text
                      style={[
                        typography.labelMedium,
                        { color: theme.textInverse },
                      ]}
                    >
                      {t("settings.login")}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      backgroundColor: "transparent",
                      borderWidth: 1,
                      borderColor: theme.primary,
                      paddingHorizontal: 24,
                      paddingVertical: 10,
                      borderRadius: 20,
                      flex: 1,
                      alignItems: "center",
                    }}
                    onPress={() => router.push("/Registration/Signup")}
                  >
                    <Text
                      style={[typography.labelMedium, { color: theme.primary }]}
                    >
                      {t("settings.signup")}
                    </Text>
                  </Pressable>
                </View>
              </Card>
            </View>
          );
        case "section":
          return (
            <View style={[spacingUtils.mx.lg, { marginBottom: 16 }]}>
              <Expandables
                title={item.title!}
                theme={theme}
                topics={item.topics!}
                onSelected={handleNavigation}
              />
            </View>
          );
        default:
          return null;
      }
    },
    [theme, handleNavigation, typography],
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.bg }]}
      data={flatListData}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  authBox: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },

  authText: {
    textAlign: "center",
    fontSize: 14,
  },
  loginBtn: {
    textAlign: "center",
    marginTop: 6,
    fontWeight: "600",
  },
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
});
