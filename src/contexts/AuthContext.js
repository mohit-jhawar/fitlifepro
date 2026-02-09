import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setLoading(false);
                return;
            }

            const response = await authAPI.getMe();
            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);

            if (response.success) {
                const { user, accessToken, refreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));

                setUser(user);
                setIsAuthenticated(true);

                return { success: true, user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);

            if (response.success) {
                const { user, accessToken, refreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));

                setUser(user);
                setIsAuthenticated(true);

                return { success: true, user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
                data: error.response?.data?.data // Return the verification data if present
            };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await authAPI.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateProfile = async (updates) => {
        try {
            const response = await authAPI.updateProfile(updates);

            if (response.success) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return { success: true, user: response.data.user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const changePassword = async (passwords) => {
        try {
            const response = await authAPI.changePassword(passwords);
            return { success: response.success, message: response.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password change failed'
            };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
