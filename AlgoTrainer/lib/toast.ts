// lib/toast.ts — cross-platform non-blocking toast helper
//
// Android → native ToastAndroid
// iOS     → in-app Animated toast via ToastProvider (no blocking Alert)
//
// Usage: showToast('Copied!')
// Setup: <ToastProvider /> must be rendered once at the root (_layout.tsx)

import { Platform, ToastAndroid } from 'react-native';
import { showToast as showInAppToast } from '@/components/Toast/ToastProvider';

export function showToast(message: string, duration: 'short' | 'long' = 'short') {
    if (Platform.OS === 'android') {
        ToastAndroid.show(
            message,
            duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG,
        );
    } else {
        // iOS & web: use the in-app animated toast (non-blocking)
        showInAppToast(message, duration);
    }
}
