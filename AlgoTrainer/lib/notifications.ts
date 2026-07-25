// lib/notifications.ts - Expo Go compatible version
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';

const NOTIFICATIONS_KEY = 'notifications_enabled';
const LAST_REMINDER_KEY = 'last_reminder_date';

export async function requestNotificationPermissions() {
    // For Expo Go, we simulate permission grant
    // Real notifications require development build
    return true;
}

export async function enableNotifications() {
    try {
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, 'true');
        return true;
    } catch (error) {
        console.error('Failed to enable notifications:', error);
        return false;
    }
}

export async function disableNotifications() {
    try {
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, 'false');
        return true;
    } catch (error) {
        console.error('Failed to disable notifications:', error);
        return false;
    }
}

export async function areNotificationsEnabled(): Promise<boolean> {
    try {
        const enabled = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        return enabled === 'true';
    } catch (error) {
        console.error('Failed to check notification status:', error);
        return false;
    }
}

export async function checkAndShowReminder() {
    const enabled = await areNotificationsEnabled();
    if (!enabled) return;

    const lastReminder = await AsyncStorage.getItem(LAST_REMINDER_KEY);
    const today = new Date().toDateString();

    if (lastReminder !== today) {
        // Show in-app reminder
        Alert.alert(
            'Time to learn!',
            'Don\'t break your streak - complete your daily DSA practice',
            [
                { text: 'Later', style: 'cancel' },
                {
                    text: 'Start Learning', onPress: () => {
                        // Navigate to learning section
                        // You'll need to implement navigation
                    }
                }
            ]
        );

        await AsyncStorage.setItem(LAST_REMINDER_KEY, today);
    }
}

export async function scheduleDailyReminder(hour: number = 9) {
    // For Expo Go, we just enable the reminder system
    // Real scheduling requires development build
    await enableNotifications();
}

export async function cancelAllNotifications() {
    await disableNotifications();
}