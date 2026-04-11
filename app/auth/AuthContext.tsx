import { createContext, useState, useContext } from "react";


interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    user: {
        name: string;
        email: string;
    } | null;
}


const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, SetIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    const login = () => {
        SetIsLoggedIn(true);
        // Set a default user for now - this should be updated with actual user data
        setUser({ name: 'User', email: 'user@example.com' });
    }
    const logout = () => {
        SetIsLoggedIn(false);
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext, AuthProvider }
export default AuthProvider;