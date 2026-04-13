import React, { useContext, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Switch,
    ListRenderItem
} from 'react-native';
import { useRouter } from 'expo-router';
import Expandables from '../components/Expandable/Expandables';
import { ThemeContext } from '../theme/ThemeContext';

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
                    right: (
                        <Switch
                            value={theme.mode === 'dark'}
                            onValueChange={toggleTheme}
                        />
                    )
                },
                {
                    name: "Language",
                    route: "/Screens/Language"
                }
            ]
        },
        {
            title: "Learning",
            topics: [
                {
                    name: "Difficulty",
                    route: isLoggedIn
                        ? "/Screens/Difficulty"
                        : "/Screens/login"
                },
                {
                    name: "Daily Goal",
                    route: isLoggedIn
                        ? "/Screens/DailyGoal"
                        : "/Screens/login"
                }
            ]
        },
        {
            title: "General",
            topics: [
                { name: "Help" },
                { name: "About" }
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
                    <Text style={[styles.heading, { color: theme.text }]}>
                        Settings
                    </Text>
                );
            case 'auth':
                return (
                    <View style={styles.authBox}>
                        <Text style={[styles.authText, { color: theme.text }]}>
                            Login Required
                        </Text>

                        <Text
                            style={[styles.loginBtn, { color: theme.primary }]}
                            onPress={() => router.push('/Registration/Login')}
                        >
                            Login / Sign Up
                        </Text>
                    </View>
                );
            case 'section':
                return (
                    <Expandables
                        title={item.title!}
                        theme={theme}
                        topics={item.topics!}
                        onSelected={handleNavigation}
                    />
                );
            default:
                return null;
        }
    }, [theme, handleNavigation]);

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
    }
});