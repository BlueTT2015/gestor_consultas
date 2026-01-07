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
        console.log(storedUser);
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

                // --- PASSO NOVO: Buscar os dados do utilizador (Role e ID) ---
                // Assumindo que a API de users permite filtrar por email
                const userRes = await fetch(`${API_BASE}/users?email=${email}`, {
                    method: "GET",
                    headers: {
                        client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                        client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                    }
                });
                const usersFound = await userRes.json();

                let userData;

                if (usersFound && usersFound.length > 0) {
                    // Utilizador encontrado na BD
                    userData = usersFound[0];
                    // userData deve ter: { user_id, role, first_name, etc... }
                } else {
                    // Fallback se a API não encontrar (apenas para evitar crash)
                    userData = { email: email, role: 'patient' };
                }

                // Guardar tudo
                localStorage.setItem('token', accessToken);
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(accessToken);
                setUser(userData);

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