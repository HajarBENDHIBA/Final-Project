import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userData = apiService.getUserData();
            if (userData) {
                setUser(userData);
            } else {
                const authData = await apiService.checkAuth();
                if (authData?.user) {
                    setUser(authData.user);
                    apiService.setAuthData({ user: authData.user, token: authData.token });
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const data = await apiService.login(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const data = await apiService.signup(userData);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
            setUser(null);
            router.push('/account');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear state even if request fails
            setUser(null);
            router.push('/account');
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7FA15A]"></div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext; 