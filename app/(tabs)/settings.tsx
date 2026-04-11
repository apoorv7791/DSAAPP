import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Switch,
    Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const Settings = () => {
    const router = useRouter();
    const { isLoggedIn, logout, user } = useAuth();

    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);
    const [autoPlay, setAutoPlay] = useState(false);

    const isGuest = !isLoggedIn;

    const theme = darkMode
        ? {
            bg: '#121212',
            card: '#1e1e1e',
            text: '#ffffff',
            subText: '#aaaaaa'
        }
        : {
            bg: '#f5f5f5',
            card: '#ffffff',
            text: '#2c3e50',
            subText: '#7f8c8d'
        };

    const handleLogin = () => router.push('/Registration/Login');
    const handleSignup = () => router.push('/Registration/Signup');

    const handleLogout = () => logout();

    const SettingsSection = ({ title, children }: any) => (
        <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
            {children}
        </View>
    );

    const SettingsItem = ({ icon, title, subtitle, onPress, right }: any) => (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [
                styles.item,
                {
                    backgroundColor: pressed ? '#eee' : theme.card
                }
            ]}
        >
            <View style={styles.itemLeft}>
                <Ionicons name={icon} size={22} color="#6c5ce7" />
                <View style={{ marginLeft: 12 }}>
                    <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.itemSubtitle, { color: theme.subText }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            {right || <Ionicons name="chevron-forward" size={18} color="#999" />}
        </Pressable>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
            <Text style={[styles.heading, { color: theme.text }]}>Settings</Text>

            {/* Auth Section */}
            {isGuest && (
                <View style={styles.authBox}>
                    <Text style={styles.subHeading}>Login to save progress</Text>
                    <Pressable style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </Pressable>
                </View>
            )}

            {/* Profile */}
            {!isGuest && (
                <SettingsSection title="Profile">
                    <View style={styles.profile}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={30} color="#fff" />
                        </View>
                        <View>
                            <Text style={{ color: theme.text, fontSize: 18 }}>
                                {user?.name || 'User'}
                            </Text>
                            <Text style={{ color: theme.subText }}>
                                {user?.email}
                            </Text>
                        </View>
                    </View>
                </SettingsSection>
            )}

            {/* Preferences */}
            <SettingsSection title="Preferences">
                <SettingsItem
                    icon="moon-outline"
                    title="Dark Mode"
                    right={
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                        />
                    }
                />
                <SettingsItem
                    icon="notifications-outline"
                    title="Notifications"
                    right={
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                        />
                    }
                />
                <SettingsItem
                    icon="volume-high-outline"
                    title="Sound Effects"
                    right={
                        <Switch
                            value={soundEffects}
                            onValueChange={setSoundEffects}
                        />
                    }
                />
            </SettingsSection>

            {/* Learning */}
            <SettingsSection title="Learning">
                <SettingsItem
                    icon="bar-chart-outline"
                    title="Difficulty"
                    subtitle={isGuest ? 'Login to unlock' : 'Intermediate'}
                    onPress={isGuest ? handleLogin : () => { }}
                />
                <SettingsItem
                    icon="time-outline"
                    title="Daily Goal"
                    subtitle={isGuest ? 'Login required' : '30 mins'}
                    onPress={isGuest ? handleLogin : () => { }}
                />
                <SettingsItem
                    icon="play-circle-outline"
                    title="Auto Play"
                    right={
                        <Switch
                            value={autoPlay}
                            onValueChange={setAutoPlay}
                        />
                    }
                />
            </SettingsSection>

            {/* General */}
            <SettingsSection title="General">
                <SettingsItem icon="help-circle-outline" title="Help" />
                <SettingsItem icon="information-circle-outline" title="About" />
            </SettingsSection>

            {!isGuest && (
                <Pressable style={styles.logout} onPress={handleLogout}>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Logout</Text>
                </Pressable>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    subHeading: { textAlign: 'center', marginBottom: 10 },

    authBox: { marginBottom: 20 },

    button: {
        backgroundColor: '#6c5ce7',
        padding: 14,
        borderRadius: 10,
        marginVertical: 5
    },
    buttonText: { color: '#fff', textAlign: 'center' },

    section: {
        borderRadius: 12,
        marginBottom: 16,
        paddingBottom: 10
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        padding: 12
    },

    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14
    },

    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    itemTitle: { fontSize: 15, fontWeight: '500' },
    itemSubtitle: { fontSize: 13 },

    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },

    logout: {
        alignItems: 'center',
        padding: 16
    }
});

export default Settings;