import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica se há token no localStorage
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

            // Guarda no localStorage
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Atualiza o estado
            setToken(response.accessToken);
            setUser(response.user);

            return { success: true, data: response };
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                error: error?.message || 'Erro ao fazer login. Verifique as credenciais.'
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

    const isAuthenticated = () => {
        return !!token;
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

