import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ToastAndroid,
} from 'react-native';

import { supabase } from '@/lib/supabase';
import { ThemeContext } from '@/theme/ThemeContext';
import { useRouter } from 'expo-router';
import { useAuth, authUserFromSupabase } from '@/auth/AuthContext';
import { useTranslation } from '@/context/LanguageContext';

const Login = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuth();
    const { t } = useTranslation();

    const handleLogin = async () => {
        setErrorMsg('');

        if (!email || !password) {
            setErrorMsg(t('auth.enterEmailPass'));
            return;
        }

        try {
            setLoading(true);

            const { data, error: authError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            // ❌ Supabase error handling
            if (authError) {
                const msg = authError.message?.toLowerCase();

                if (
                    msg.includes("email not confirmed") ||
                    authError.code === "email_not_confirmed"
                ) {
                    setErrorMsg(t('auth.verifyEmail'));
                } else {
                    setErrorMsg(authError.message);
                }

                setLoading(false);
                return;
            }

            // ❌ No session = invalid login
            if (!data?.session) {
                setErrorMsg(t('auth.loginFailed'));
                setLoading(false);
                return;
            }

            // ✅ SUCCESS
            ToastAndroid.show(t('auth.loginSuccess'), ToastAndroid.SHORT);

            if (data.user) {
                login(authUserFromSupabase(data.user));
            }

            setErrorMsg('');
            setLoading(false);

            router.replace('/Screens/Profile');

        } catch (err: any) {
            setErrorMsg(err?.message || t('auth.somethingWrong'));
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                {t('auth.loginTitle')}
            </Text>


            <TextInput
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={theme.textSecondary}
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.bgCard,
                        borderColor: theme.border,
                        color: theme.text,
                    },
                ]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={theme.textSecondary}
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.bgCard,
                        borderColor: theme.border,
                        color: theme.text,
                    },
                ]}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* 🔴 Error */}
            {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}

            <Pressable
                style={[
                    styles.button,
                    { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 },
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? t('common.loading') : t('auth.loginBtn')}
                </Text>
            </Pressable>

            <Pressable onPress={() => router.push('/Registration/Signup')}>
                <Text style={[styles.linkText, { color: theme.primary }]}>
                    {t('auth.dontHaveAccount')}
                </Text>
            </Pressable>
        </View>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: theme.fontWeightBold,
            marginBottom: 20,
            textAlign: 'center',
        },
        input: {
            borderWidth: 1,
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
        },
        button: {
            backgroundColor: '#000',
            padding: 15,
            borderRadius: 8,
            marginTop: 10,
        },
        buttonText: {
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
        },
        errorText: {
            color: 'red',
            textAlign: 'center',
            marginBottom: 10,
        },
        linkText: {
            textAlign: 'center',
            marginTop: 20,
            fontSize: 16,
        },
    });
};

export default Login;