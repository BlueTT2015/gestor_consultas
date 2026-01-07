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

            // Verifica se a API retornou o accessToken conforme o esperado
            if (response && response.accessToken) {
                const token = response.accessToken;
                const userData = { email: email }; // Objeto básico para a UI

                // Guarda no localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // Atualiza estados globais
                setToken(token);
                setUser(userData);

                return { success: true };
            } else {
                return { success: false, error: 'Falha na resposta: Token não encontrado.' };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message // Mostrará "Credenciais inválidas (401)" se falhar
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

