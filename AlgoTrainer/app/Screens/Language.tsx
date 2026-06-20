import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    ToastAndroid,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';
import { Language as LanguageType } from '@/lib/i18n';

const LANGUAGES: { code: LanguageType; label: string; native: string; flag: string }[] = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: 'Chinese', native: '中文', flag: '🇨🇳' },
    { code: 'ja', label: 'Japanese', native: '日本語', flag: '🇯🇵' },
    { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
];

const Language = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { language, setLanguage, t } = useTranslation();
    const selected = language;

    const handleSave = () => {
        const lang = LANGUAGES.find((l) => l.code === selected);
        const message = `${t('languageScreen.toast')} ${lang?.label} ${lang?.flag}`;

        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('Language Updated', message);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>{t('languageScreen.heading')}</Text>
            <Text style={styles.subheading}>
                {t('languageScreen.subheading')}
            </Text>

            <View style={styles.list}>
                {LANGUAGES.map((lang) => {
                    const isSelected = selected === lang.code;
                    return (
                        <Pressable
                            key={lang.code}
                            style={[
                                styles.row,
                                isSelected && styles.rowSelected,
                            ]}
                            onPress={() => setLanguage(lang.code)}
                        >
                            <Text style={styles.flag}>{lang.flag}</Text>
                            <View style={styles.rowText}>
                                <Text style={[styles.langLabel, isSelected && { color: theme.primary }]}>
                                    {lang.label}
                                </Text>
                                <Text style={styles.langNative}>{lang.native}</Text>
                            </View>
                            {isSelected && (
                                <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                            )}
                        </Pressable>
                    );
                })}
            </View>

            <Pressable style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>{t('languageScreen.save')}</Text>
            </Pressable>
        </ScrollView>
    );
};

export default Language;

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
            marginBottom: 24,
            lineHeight: 22,
        },
        list: {
            gap: 10,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 14,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: theme.border,
            backgroundColor: theme.bgCard,
        },
        rowSelected: {
            borderColor: theme.primary,
            backgroundColor: theme.bgSecondary,
        },
        flag: {
            fontSize: 26,
        },
        rowText: {
            flex: 1,
            gap: 2,
        },
        langLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.text,
        },
        langNative: {
            fontSize: 13,
            color: theme.textSecondary,
        },
        saveBtn: {
            marginTop: 28,
            backgroundColor: theme.primary,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
        },
        saveBtnText: {
            color: theme.textInverse,
            fontSize: 16,
            fontWeight: '700',
        },
    });
