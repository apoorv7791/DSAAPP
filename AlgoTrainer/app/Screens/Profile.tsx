import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/theme/ThemeContext';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { deleteAccountViaEdgeFunction } from '@/lib/deleteAccount';
import { clearLearningProgress } from '@/lib/learningProgressStorage';
import { useLearningProgress } from '@/context/LearningProgressContext';
import { LEARNING_TOPICS } from '@/lib/learningTopics';
import { showToast } from '@/lib/toast';

type ProfileType = {
    id: string;
    username: string | null;
};

const MENU_ITEMS = [
    { label: 'Edit Email', icon: 'mail-outline' as const, route: '/Screens/Email' },
    { label: 'Change Password', icon: 'lock-closed-outline' as const, route: '/Screens/Password' },
];

const Profile = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const router = useRouter();
    const { logout, user } = useAuth();
    const { completedById, isDone } = useLearningProgress();

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [streak, setStreak] = useState(0);

    const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

    // Calculate real stats
    const completedCount = Object.keys(completedById).length;

    const stats = [
        { label: 'Topics Completed', value: completedCount.toString(), icon: 'checkmark-circle-outline' as const },
        { label: 'Day Streak', value: streak.toString(), icon: 'flame-outline' as const },
        { label: 'Total Topics', value: LEARNING_TOPICS.length.toString(), icon: 'list-outline' as const },
    ];

    // Fetch profile + streak
    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.id) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username')
                .eq('id', user.id)
                .single();

            if (!error && data) {
                setProfile(data);
            }

            // Fetch streak from backend
            try {
                const { data: sessionData } = await supabase.auth.getSession();
                const token = sessionData.session?.access_token;
                if (token) {
                    const res = await fetch(`${BACKEND_URL}/api/user/streak`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                        const body = await res.json();
                        setStreak(body.current_streak ?? 0);
                    }
                }
            } catch (e) {
                // streak fetch failure is non-critical
            }

            setLoading(false);
        };

        loadProfile();
    }, [user?.id]);

    const displayName = loading
        ? 'Loading...'
        : profile?.username ?? 'Guest User';

    const displayEmail = user?.email ?? 'Not logged in';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        showToast('Logged out');
        router.replace('/(tabs)');
    };

    const confirmDeleteAccount = () => {
        Alert.alert(
            'Delete account',
            'This permanently removes your account and synced progress on our servers. Local progress on this device will be cleared. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => void runDeleteAccount(),
                },
            ],
        );
    };

    const runDeleteAccount = async () => {
        setDeletingAccount(true);
        try {
            const result = await deleteAccountViaEdgeFunction();
            if (!result.ok) {
                showToast(result.message, 'long');
                return;
            }

            await clearLearningProgress();
            await supabase.auth.signOut();
            logout();
            showToast('Account deleted');
            router.replace('/(tabs)');
        } finally {
            setDeletingAccount(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            {/* Avatar */}
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={48} color={theme.textInverse} />
                </View>

                {loading ? (
                    <ActivityIndicator color={theme.primary} />
                ) : (
                    <>
                        <Text style={styles.name}>{displayName}</Text>
                        <Text style={styles.email}>{displayEmail}</Text>
                    </>
                )}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                {stats.map((stat) => (
                    <View key={stat.label} style={styles.statCard}>
                        <Ionicons name={stat.icon} size={22} color={theme.primary} />
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Menu */}
            <View style={styles.menuSection}>
                {MENU_ITEMS.map((item) => (
                    <Pressable
                        key={item.label}
                        style={styles.menuRow}
                        onPress={() => router.push(item.route as any)}
                    >
                        <View style={styles.menuLeft}>
                            <Ionicons name={item.icon} size={20} color={theme.primary} />
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                    </Pressable>
                ))}
            </View>

            <Pressable
                style={[styles.deleteAccountBtn, deletingAccount && { opacity: 0.6 }]}
                onPress={confirmDeleteAccount}
                disabled={deletingAccount}
            >
                {deletingAccount ? (
                    <ActivityIndicator color={theme.textSecondary} />
                ) : (
                    <>
                        <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
                        <Text style={styles.deleteAccountText}>Delete account</Text>
                    </>
                )}
            </Pressable>

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={theme.error} />
                <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
        </ScrollView>
    );
};

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg,
        },
        content: {
            padding: 20,
            paddingBottom: 40,
        },
        avatarSection: {
            alignItems: 'center',
            marginBottom: 28,
        },
        avatar: {
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
        },
        name: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.text,
        },
        email: {
            fontSize: 14,
            color: theme.textSecondary,
            marginTop: 4,
        },
        statsRow: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 28,
        },
        statCard: {
            flex: 1,
            alignItems: 'center',
            gap: 6,
            padding: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.bgCard,
        },
        statValue: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.text,
        },
        statLabel: {
            fontSize: 11,
            color: theme.textSecondary,
            textAlign: 'center',
        },
        menuSection: {
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.bgCard,
            overflow: 'hidden',
            marginBottom: 20,
        },
        menuRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderLight,
        },
        menuLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        menuLabel: {
            fontSize: 15,
            color: theme.text,
            fontWeight: '500',
        },
        deleteAccountBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.bgCard,
            marginBottom: 12,
        },
        deleteAccountText: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.textSecondary,
        },
        logoutBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 14,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: theme.error,
        },
        logoutText: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.error,
        },
    });

export default Profile;