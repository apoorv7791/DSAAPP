import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const Settings = () => {
    const navigate = useRouter();
    const { isLoggedIn, logout } = useAuth();
    const [darkMode, setDarkMode] = React.useState(false);
    const [notifications, setNotifications] = React.useState(true);
    const [soundEffects, setSoundEffects] = React.useState(true);
    const [autoPlay, setAutoPlay] = React.useState(false);

    const handleLogout = () => {
        logout();
    };

    const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const SettingsItem = ({
        icon,
        title,
        subtitle,
        onPress,
        rightComponent
    }: {
        icon: string;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        rightComponent?: React.ReactNode;
    }) => (
        <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
            <View style={styles.itemLeft}>
                <Ionicons name={icon as any} size={24} color="#6c5ce7" style={styles.itemIcon} />
                <View>
                    <Text style={styles.itemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightComponent || <Ionicons name="chevron-forward" size={20} color="#999" />}
        </TouchableOpacity>
    );

    if (!isLoggedIn) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Settings</Text>
                <Text style={styles.subHeading}>Not logged in</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigate.push("/Registration/Login")}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigate.push("/Registration/Signup")}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Settings</Text>

            {/* User Profile Section */}
            <SettingsSection title="Profile">
                <View style={styles.profileContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color="#fff" />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>John Doe</Text>
                        <Text style={styles.profileEmail}>john.doe@example.com</Text>
                        <Text style={styles.profileStats}>Level 5 · 150 problems solved</Text>
                    </View>
                </View>
            </SettingsSection>

            {/* App Preferences */}
            <SettingsSection title="Preferences">
                <SettingsItem
                    icon="moon-outline"
                    title="Dark Mode"
                    subtitle="Reduce eye strain in low light"
                    rightComponent={
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#e0e0e0', true: '#6c5ce7' }}
                            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
                        />
                    }
                />
                <SettingsItem
                    icon="notifications-outline"
                    title="Notifications"
                    subtitle="Get reminders for daily practice"
                    rightComponent={
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#e0e0e0', true: '#6c5ce7' }}
                            thumbColor={notifications ? '#fff' : '#f4f3f4'}
                        />
                    }
                />
                <SettingsItem
                    icon="volume-high-outline"
                    title="Sound Effects"
                    subtitle="Play sounds for interactions"
                    rightComponent={
                        <Switch
                            value={soundEffects}
                            onValueChange={setSoundEffects}
                            trackColor={{ false: '#e0e0e0', true: '#6c5ce7' }}
                            thumbColor={soundEffects ? '#fff' : '#f4f3f4'}
                        />
                    }
                />
            </SettingsSection>

            {/* Learning Settings */}
            <SettingsSection title="Learning">
                <SettingsItem
                    icon="bar-chart-outline"
                    title="Difficulty"
                    subtitle="Intermediate"
                    onPress={() => { }}
                />
                <SettingsItem
                    icon="time-outline"
                    title="Daily Goal"
                    subtitle="30 minutes"
                    onPress={() => { }}
                />
                <SettingsItem
                    icon="play-circle-outline"
                    title="Auto-play Visualizations"
                    subtitle="Automatically start animations"
                    rightComponent={
                        <Switch
                            value={autoPlay}
                            onValueChange={setAutoPlay}
                            trackColor={{ false: '#e0e0e0', true: '#6c5ce7' }}
                            thumbColor={autoPlay ? '#fff' : '#f4f3f4'}
                        />
                    }
                />
                <SettingsItem
                    icon="trophy-outline"
                    title="Achievements"
                    subtitle="View your accomplishments"
                    onPress={() => { }}
                />
            </SettingsSection>

            {/* Account Management */}
            <SettingsSection title="Account">
                <SettingsItem
                    icon="person-circle-outline"
                    title="Edit Profile"
                    onPress={() => { }}
                />
                <SettingsItem
                    icon="download-outline"
                    title="Export Progress"
                    subtitle="Download your learning data"
                    onPress={() => { }}
                />
                <SettingsItem
                    icon="help-circle-outline"
                    title="Help & Support"
                    onPress={() => { }}
                />
                <SettingsItem
                    icon="information-circle-outline"
                    title="About"
                    subtitle="Version 1.0.0"
                    onPress={() => { }}
                />
            </SettingsSection>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#2c3e50',
    },
    subHeading: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        color: '#7f8c8d',
    },
    button: {
        backgroundColor: "#6c5ce7",
        padding: 16,
        borderRadius: 12,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#fff",
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 4,
    },
    profileStats: {
        fontSize: 14,
        color: '#6c5ce7',
        fontWeight: '500',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemIcon: {
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2c3e50',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#e74c3c',
        marginLeft: 8,
    },
})

export default Settings;
