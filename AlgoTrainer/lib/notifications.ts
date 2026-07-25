import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermissions() {
    const existingStatus = (await Notifications.getPermissionsAsync()) as any;
    let finalStatus = existingStatus.granted;

    if (!existingStatus.granted) {
        const requestedStatus = (await Notifications.requestPermissionsAsync()) as any;
        finalStatus = requestedStatus.granted;
    }

    if (!finalStatus) {
        console.log('Failed to get push token for push notification!');
        return false;
    }

    return true;
}

export async function scheduleDailyReminder(hour: number = 9) {
    await requestNotificationPermissions();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Time to learn!",
            body: "Don't break your streak - complete your daily DSA practice",
            data: { type: 'daily_reminder' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: hour,
            minute: 0,
            repeats: true,
        },
    });
}

export async function scheduleStreakReminder() {
    await requestNotificationPermissions();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Keep your streak alive!",
            body: "You haven't practiced today. Complete a lesson to maintain your streak.",
            data: { type: 'streak_reminder' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 24 * 60 * 60, // 24 hours
            repeats: true,
        },
    });
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}