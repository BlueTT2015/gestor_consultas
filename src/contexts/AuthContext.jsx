import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { API_BASE } from '../utils/constants'; //

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await authService.login(email, password);

            if (response && response.accessToken) {
                const accessToken = response.accessToken;
                // Guardar tudo
                localStorage.setItem('token', accessToken);
                localStorage.setItem('user', JSON.stringify(response.user));

                setToken(accessToken);
                setUser(response.user);

                return { success: true };
            } else {
                return { success: false, error: 'Token não encontrado.' };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = () => !!token;

    // Helper para verificar se o user tem permissão
    const hasRole = (allowedRoles) => {
        if (!user || !user.role) return false;
        // Admin tem acesso a tudo, por isso retorna sempre true se for admin
        if (user.role === 'admin') return true;
        return allowedRoles.includes(user.role);
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        hasRole, // Exportamos esta função nova
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};