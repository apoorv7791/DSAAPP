import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform, NativeModules } from 'react-native';
import { Language, t } from '@/lib/i18n';
import { storage } from '@/lib/storage';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (path: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_STORAGE_KEY = '@app_language';

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        // Load persisted language on mount
        const loadLanguage = async () => {
            try {
                const savedLanguage = await storage.get<Language>(LANGUAGE_STORAGE_KEY, 'en');
                setLanguageState(savedLanguage);
            } catch (error) {
                console.error('Failed to load language:', error);
            }
        };
        loadLanguage();
    }, []);

    const setLanguage = async (newLang: Language) => {
        try {
            setLanguageState(newLang);
            await storage.set(LANGUAGE_STORAGE_KEY, newLang);
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
