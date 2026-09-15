// components/Toast/ToastProvider.tsx
// Lightweight non-blocking toast that works on both iOS and Android.
// Drop <ToastProvider /> once at the root (inside _layout.tsx).
// Call showToast() from anywhere — it uses a module-level ref.

import React, {
    useRef,
    useState,
    useCallback,
    useImperativeHandle,
    forwardRef,
    useEffect,
} from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

// ─── Public API ───────────────────────────────────────────────────────────────

export type ToastHandle = {
    show: (message: string, duration?: 'short' | 'long') => void;
};

/** Module-level ref — set once the component mounts. */
let _toastRef: ToastHandle | null = null;

export function showToast(message: string, duration: 'short' | 'long' = 'short') {
    _toastRef?.show(message, duration);
}

// ─── Component ────────────────────────────────────────────────────────────────

const DURATIONS = { short: 2000, long: 3500 } as const;

const ToastBase = forwardRef<ToastHandle>((_, ref) => {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hide = useCallback(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    }, [opacity]);

    const show = useCallback(
        (msg: string, dur: 'short' | 'long' = 'short') => {
            // Cancel any running timer
            if (hideTimer.current) clearTimeout(hideTimer.current);

            setMessage(msg);
            setVisible(true);

            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            hideTimer.current = setTimeout(hide, DURATIONS[dur]);
        },
        [opacity, hide],
    );

    // Clean up timer on unmount
    useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

    useImperativeHandle(ref, () => ({ show }), [show]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
            <View style={styles.toast}>
                <Text style={styles.text} numberOfLines={2}>{message}</Text>
            </View>
        </Animated.View>
    );
});

ToastBase.displayName = 'ToastBase';

// ─── Provider (mount once at root) ───────────────────────────────────────────

export function ToastProvider() {
    const ref = useRef<ToastHandle>(null);

    useEffect(() => {
        _toastRef = ref.current;
        return () => { _toastRef = null; };
    }, []);

    return <ToastBase ref={ref} />;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90,         // above tab bar
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
    },
    toast: {
        backgroundColor: 'rgba(30,30,30,0.88)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        maxWidth: '80%',
    },
    text: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
});
