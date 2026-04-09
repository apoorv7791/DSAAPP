import { createContext, useState, useContext } from "react";


interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, SetIsLoggedIn] = useState(false);

    const login = () => {
        SetIsLoggedIn(true);
    }
    const logout = () => {
        SetIsLoggedIn(false);
    }
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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