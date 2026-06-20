import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    ToastAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/theme/ThemeContext';
import { supabase } from '@/lib/supabase';

const Password = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!newPassword || !confirmPassword) {
            ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
            return;
        }
        if (newPassword.length < 6) {
            ToastAndroid.show('Password must be at least 6 characters', ToastAndroid.SHORT);
            return;
        }
        if (newPassword !== confirmPassword) {
            ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Password updated successfully 🔒', ToastAndroid.SHORT);
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err: any) {
            ToastAndroid.show(err?.message || 'Something went wrong', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>Change Password</Text>
            <Text style={styles.subheading}>
                Choose a strong password with at least 6 characters.
            </Text>

            {/* New Password */}
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    placeholderTextColor={theme.textTertiary}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNew}
                />
                <Pressable onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                    <Ionicons
                        name={showNew ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={theme.textSecondary}
                    />
                </Pressable>
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    placeholderTextColor={theme.textTertiary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirm}
                />
                <Pressable onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    <Ionicons
                        name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={theme.textSecondary}
                    />
                </Pressable>
            </View>

            {/* Strength hint */}
            {newPassword.length > 0 && (
                <Text style={[
                    styles.strengthHint,
                    { color: newPassword.length >= 8 ? theme.success : theme.warning }
                ]}>
                    {newPassword.length >= 8 ? '✓ Strong password' : '⚠ Use 8+ characters for a stronger password'}
                </Text>
            )}

            <Pressable
                style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                onPress={handleUpdate}
                disabled={loading}
            >
                <Text style={styles.saveBtnText}>
                    {loading ? 'Updating...' : 'Update Password'}
                </Text>
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
        heading: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 8,
        },
        subheading: {
            fontSize: 15,
            color: theme.textSecondary,
            marginBottom: 28,
            lineHeight: 22,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 8,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: theme.border,
            borderRadius: 12,
            backgroundColor: theme.bgCard,
            marginBottom: 20,
            paddingRight: 12,
        },
        input: {
            flex: 1,
            padding: 14,
            fontSize: 15,
            color: theme.text,
        },
        eyeBtn: {
            padding: 4,
        },
        strengthHint: {
            fontSize: 13,
            marginBottom: 20,
            marginTop: -10,
        },
        saveBtn: {
            backgroundColor: theme.primary,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 8,
        },
        saveBtnText: {
            color: theme.textInverse,
            fontSize: 16,
            fontWeight: '700',
        },
    });

export default Password;
