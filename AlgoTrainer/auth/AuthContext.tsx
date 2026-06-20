import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type AuthUser = {
    id: string;
    name: string;
    email: string;
};

interface AuthContextType {
    isLoggedIn: boolean;
    login: (userData: AuthUser) => void;
    logout: () => void;
    user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function authUserFromSupabase(user: User): AuthUser {
    return {
        id: user.id,
        name:
            (user.user_metadata?.full_name as string | undefined) ||
            user.email ||
            'User',
        email: user.email ?? '',
    };
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);

    const login = useCallback((userData: AuthUser) => {
        setIsLoggedIn(true);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUser(null);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                login(authUserFromSupabase(session.user));
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                login(authUserFromSupabase(session.user));
            } else {
                logout();
            }
        });

        return () => subscription.unsubscribe();
    }, [login, logout]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext, AuthProvider }
export default AuthProvider;