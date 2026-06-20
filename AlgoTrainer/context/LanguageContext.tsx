import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform, NativeModules } from 'react-native';
import { Language, t } from '@/lib/i18n';

// Safe AsyncStorage handling to prevent crash when native module is missing
let AsyncStorage: any;
try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
    console.warn('AsyncStorage could not be loaded:', e);
}

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (path: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_STORAGE_KEY = '@app_language';

// In-memory fallback if AsyncStorage is unavailable
const memoryStorage = new Map<string, string>();

const safeGetItem = async (key: string): Promise<string | null> => {
    if (AsyncStorage) {
        try {
            return await AsyncStorage.getItem(key);
        } catch (e) {
            console.warn('AsyncStorage.getItem failed:', e);
        }
    }
    return memoryStorage.get(key) || null;
};

const safeSetItem = async (key: string, value: string): Promise<void> => {
    if (AsyncStorage) {
        try {
            await AsyncStorage.setItem(key, value);
            return;
        } catch (e) {
            console.warn('AsyncStorage.setItem failed:', e);
        }
    }
    memoryStorage.set(key, value);
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        // Load persisted language on mount
        const loadLanguage = async () => {
            try {
                const savedLanguage = await safeGetItem(LANGUAGE_STORAGE_KEY);
                if (savedLanguage) {
                    setLanguageState(savedLanguage as Language);
                }
            } catch (error) {
                console.error('Failed to load language:', error);
            }
        };
        loadLanguage();
    }, []);

    const setLanguage = async (newLang: Language) => {
        try {
            setLanguageState(newLang);
            await safeSetItem(LANGUAGE_STORAGE_KEY, newLang);
        } catch (error) {
            console.error('Failed to save language:', error);
        }
    };

    const translate = (path: string) => {
        return t(language, path);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};

// Default export to satisfy expo-router if it stays in app/
export default LanguageProvider;
