import { createContext, useState } from "react"
import { ColorValue } from "react-native/Libraries/StyleSheet/StyleSheet";

export interface ThemeType {
    card: ColorValue | undefined;
    subText: ColorValue | undefined;
    mode: 'light' | 'dark' | 'custom';
    name: string;
    // Core colors
    primary: string;
    secondary: string;
    accent: string;
    // Background colors
    bg: string;
    bgSecondary: string;
    bgTertiary: string;
    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    // UI elements
    border: string;
    shadow: string;
    // Semantic colors
    success: string;
    warning: string;
    error: string;
    info: string;
}

interface ThemeContextProps {
    children?: React.ReactNode;
}

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    toggleTheme: () => void;
    createCustomTheme: (customTheme: Partial<ThemeType>) => ThemeType;
    resetToDefault: () => void;
}

// Default light theme
const defaultLightTheme: ThemeType = {
    mode: 'light',
    name: 'Light',
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#FF9500',
    bg: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#e9ecef',
    text: '#000000',
    textSecondary: '#6c757d',
    textTertiary: '#adb5bd',
    border: '#dee2e6',
    shadow: '#000000',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    card: undefined,
    subText: undefined
};

// Default dark theme
const defaultDarkTheme: ThemeType = {
    mode: 'dark',
    name: 'Dark',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    accent: '#FF9F0A',
    bg: '#000000',
    bgSecondary: '#1c1c1e',
    bgTertiary: '#2c2c2e',
    text: '#ffffff',
    textSecondary: '#8e8e93',
    textTertiary: '#636366',
    border: '#38383a',
    shadow: '#000000',
    success: '#30d158',
    warning: '#ff9f0a',
    error: '#ff453a',
    info: '#32d74b',
    card: undefined,
    subText: undefined
};

export const ThemeContext = createContext<ThemeContextType>({
    theme: defaultLightTheme,
    setTheme: () => { },
    toggleTheme: () => { },
    createCustomTheme: () => defaultLightTheme,
    resetToDefault: () => { },
});

export const ThemeProvider: React.FC<ThemeContextProps> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeType>(defaultLightTheme);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            if (prevTheme.mode === 'light') {
                return defaultDarkTheme;
            } else if (prevTheme.mode === 'dark') {
                return defaultLightTheme;
            } else {
                // If custom, toggle to light
                return defaultLightTheme;
            }
        });
    };

    const createCustomTheme = (customTheme: Partial<ThemeType>): ThemeType => {
        return {
            ...defaultLightTheme,
            mode: 'custom',
            name: customTheme.name || 'Custom',
            ...customTheme
        };
    };

    const resetToDefault = () => {
        setTheme(defaultLightTheme);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            toggleTheme,
            createCustomTheme,
            resetToDefault
        }}>
            {children}
        </ThemeContext.Provider>
    )
}