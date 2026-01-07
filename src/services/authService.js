// src/services/authService.js
const API_BASE_URL = 'https://es-uxapi-i6d0cd.5sc6y6-3.usa-e2.cloudhub.io/api';

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, { //
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', // Adicionado para garantir compatibilidade
                },
                body: JSON.stringify({
                    email: email.trim(), // Limpa espaços acidentais
                    password: password
                })
            });

            if (!response.ok) {
                // Se der 401 aqui, as credenciais estão erradas na base de dados da API
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Credenciais inválidas (401)');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro no serviço:', error);
            throw error;
        }
    }
};