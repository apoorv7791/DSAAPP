import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import { Language, t, tArray } from '@/lib/i18n';
import { storage } from '@/lib/storage';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (path: string) => string;
    tArray: (path: string) => string[];
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_STORAGE_KEY = '@app_language';

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await storage.get<Language | null>(
                    LANGUAGE_STORAGE_KEY,
                    null,
                );
                if (savedLanguage) {
                    setLanguageState(savedLanguage);
                }
            } catch (error) {
                console.error('Failed to load language:', error);
            }
        };
        void loadLanguage();
    }, []);

    const setLanguage = useCallback(async (newLang: Language) => {
        try {
            setLanguageState(newLang);
            await storage.set(LANGUAGE_STORAGE_KEY, newLang);
        } catch (error) {
            console.error('Failed to save language:', error);
        }
    }, []);

    const translate = useCallback(
        (path: string) => {
            return t(language, path);
        },
        [language],
    );

    const translateArray = useCallback(
        (path: string): string[] => {
            return tArray(language, path);
        },
        [language],
    );

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t: translate,
            tArray: translateArray,
        }),
        [language, setLanguage, translate, translateArray],
    );

    return (
        <LanguageContext.Provider value={value}>
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
