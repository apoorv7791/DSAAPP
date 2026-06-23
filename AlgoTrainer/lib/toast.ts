// lib/toast.ts — cross-platform notification helper
import { Platform, ToastAndroid, Alert } from 'react-native';

export function showToast(message: string, duration: 'short' | 'long' = 'short') {
    if (Platform.OS === 'android') {
        ToastAndroid.show(
            message,
            duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG,
        );
    } else {
        Alert.alert(message);
    }
}
