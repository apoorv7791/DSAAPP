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
    bgCard: string;
    bgSurface: string;
    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    // UI elements
    border: string;
    borderLight: string;
    shadow: string;
    // Semantic colors
    success: string;
    warning: string;
    error: string;
    info: string;
    // Learning category colors
    algorithms: string;
    dataStructures: string;
    practice: string;
    visual: string;
    // Gradients
    primaryGradient: string[];
    secondaryGradient: string[];
    surfaceGradient: string[];
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
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    bg: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    bgCard: '#ffffff',
    bgSurface: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    textInverse: '#ffffff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    shadow: '#000000',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    algorithms: '#6366f1',
    dataStructures: '#8b5cf6',
    practice: '#10b981',
    visual: '#f59e0b',
    primaryGradient: ['#6366f1', '#8b5cf6'],
    secondaryGradient: ['#8b5cf6', '#ec4899'],
    surfaceGradient: ['#ffffff', '#f8fafc'],
    card: undefined,
    subText: undefined
};

// Default dark theme
const defaultDarkTheme: ThemeType = {
    mode: 'dark',
    name: 'Dark',
    primary: '#818cf8',
    secondary: '#a78bfa',
    accent: '#fbbf24',
    bg: '#0f172a',
    bgSecondary: '#1e293b',
    bgTertiary: '#334155',
    bgCard: '#1e293b',
    bgSurface: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textInverse: '#0f172a',
    border: '#334155',
    borderLight: '#475569',
    shadow: '#000000',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#22d3ee',
    algorithms: '#818cf8',
    dataStructures: '#a78bfa',
    practice: '#34d399',
    visual: '#fbbf24',
    primaryGradient: ['#818cf8', '#a78bfa'],
    secondaryGradient: ['#a78bfa', '#f472b6'],
    surfaceGradient: ['#1e293b', '#0f172a'],
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

export default ThemeProvider;