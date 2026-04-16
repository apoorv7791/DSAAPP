import React, { useContext, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Switch,
    ListRenderItem,
    TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Expandables from '../components/Expandable/Expandables';
import { ThemeContext } from '../theme/ThemeContext';
import { createTypography } from '../theme/Typography';
import { spacingUtils } from '../theme/Spacing';
import Card from '../components/Card/Card';

interface Topic {
    name: string;
    route?: string;
    icon?: string;
    right?: React.ReactNode;
}

interface Section {
    title: string;
    topics: Topic[];
}

interface FlatListItem {
    type: 'header' | 'auth' | 'section';
    title?: string;
    topics?: Topic[];
}

const Settings = () => {
    const router = useRouter();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const typography = createTypography(theme);

    const isLoggedIn = false;

    // 🔥 navigation handler (clean + reusable)
    const handleNavigation = useCallback((topic: Topic) => {
        if (!topic.route) return;
        router.push(topic.route as any);
    }, []);

    // 🔥 memoized settings data (performance + clarity)
    const settingsData: Section[] = useMemo(() => [
        {
            title: "Preferences",
            topics: [
                {
                    name: "Dark Mode",
                    icon: "moon-outline",
                    right: (
                        <Switch
                            value={theme.mode === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: theme.border, true: theme.primary }}
                            thumbColor={theme.mode === 'dark' ? theme.text : theme.textSecondary}
                        />
                    )
                },
                {
                    name: "Language",
                    icon: "language-outline",
                    route: "/Screens/Language",
                    right: (
                        <Switch
                            value={false}
                            onValueChange={() => { }}
                            trackColor={{ false: theme.border, true: theme.primary }}
                            thumbColor={theme.textSecondary}
                        />
                    )
                },

            ]
        },
        // {
        //     title: "Learning",
        //     topics: [
        //         {
        //             name: "Difficulty Level",
        //             icon: "bar-chart-outline",
        //             route: isLoggedIn
        //                 ? "/Screens/Difficulty"
        //                 : "/Screens/login"
        //         },
        //         {
        //             name: "Daily Goal",
        //             icon: "flag-outline",
        //             route: isLoggedIn
        //                 ? "/Screens/DailyGoal"
        //                 : "/Screens/login"
        //         },
        //         {
        //             name: "Progress Tracking",
        //             icon: "analytics-outline",
        //             route: isLoggedIn
        //                 ? "/Screens/Progress"
        //                 : "/Screens/login"
        //         }
        //     ]
        // },
        {
            title: "Support",
            topics: [
                {
                    name: "Help Center",
                    icon: "help-circle-outline",
                    route: "/Screens/Help"
                },
                {
                    name: "About",
                    icon: "information-circle-outline",
                    route: "/Screens/About"
                },
                {
                    name: "Privacy Policy",
                    icon: "lock-closed-outline",
                    route: "/Screens/Privacy"
                }
            ]
        }
    ], [theme.mode, isLoggedIn]);

    // flattened data for FlatList
    const flatListData: FlatListItem[] = useMemo(() => {
        const data: FlatListItem[] = [
            { type: 'header' }
        ];

        if (!isLoggedIn) {
            data.push({ type: 'auth' });
        }

        settingsData.forEach(section => {
            data.push({
                type: 'section',
                title: section.title,
                topics: section.topics
            });
        });

        return data;
    }, [settingsData, isLoggedIn]);

    // renderItem function for FlatList
    const renderItem: ListRenderItem<FlatListItem> = useCallback(({ item }) => {
        switch (item.type) {
            case 'header':
                return (
                    <View style={[spacingUtils.px.lg, { paddingTop: 24, paddingBottom: 16 }]}>
                        <Text style={[typography.h1, { color: theme.text }]}>
                            Settings
                        </Text>
                        <Text style={[typography.bodyMedium, { color: theme.textSecondary, marginTop: 8 }]}>
                            Customize your learning experience
                        </Text>
                    </View>
                );
            case 'auth':
                return (
                    <View style={[spacingUtils.mx.lg, { marginBottom: 16 }]}>
                        <Card
                            theme={theme}
                            variant="outlined"
                            style={{ padding: 16, alignItems: 'center' }}
                        >
                            <Ionicons
                                name="lock-closed-outline"
                                size={48}
                                color={theme.textSecondary}
                                style={{ marginBottom: 8 }}
                            />
                            <Text style={[typography.labelLarge, { color: theme.text }]}>
                                Login Required
                            </Text>
                            <Text style={[typography.bodySmall, { color: theme.textSecondary, textAlign: 'center', marginTop: 8 }]}>
                                Sign in to access personalized features and track your progress
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/Registration/Login')}
                                style={[styles.loginButton, { backgroundColor: theme.primary }]}
                            >
                                <Text style={[typography.labelMedium, { color: theme.textInverse }]}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/Registration/Signup')}
                                style={[styles.loginButton, { backgroundColor: theme.primary }]}
                            >
                                <Text style={[typography.labelMedium, { color: theme.textInverse }]}>
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </Card>
                    </View>
                );
            case 'section':
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
    }, [theme, handleNavigation, typography]);

    return (
        <FlatList
            style={[styles.container, { backgroundColor: theme.bg }]}
            data={flatListData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
        />
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        padding: 16
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20
    },

    authBox: {
        marginBottom: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#f5f5f5"
    },

    authText: {
        textAlign: 'center',
        fontSize: 14
    },
    loginBtn: {
        textAlign: 'center',
        marginTop: 6,
        fontWeight: '600'
    },
    loginButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    }
});