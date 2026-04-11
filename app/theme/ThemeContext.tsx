import { createContext, useState } from "react"
import { ColorValue } from "react-native/Libraries/StyleSheet/StyleSheet";

interface ThemeType {
    [x: string]: ColorValue | undefined;
    mode: 'light' | 'dark';
    bg: string;
    text: string;
}

interface ThemeContextProps {
    children?: React.ReactNode;
}

interface ThemeContextType {
    theme: ThemeType
    setTheme: (theme: ThemeType) => void
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: { mode: 'light', bg: '#ffffff', text: '#000000' },
    setTheme: () => { },
    toggleTheme: () => { },
})

export const ThemeProvider: React.FC<ThemeContextProps> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeType>({ mode: 'light', bg: '#ffffff', text: '#000000' })
    const toggleTheme = () => {
        setTheme(prevTheme => ({
            mode: prevTheme.mode === 'light' ? 'dark' : 'light',
            bg: prevTheme.mode === 'light' ? '#000000' : '#ffffff',
            text: prevTheme.mode === 'light' ? '#ffffff' : '#000000'
        }))
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}