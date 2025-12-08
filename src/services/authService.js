const API_BASE_URL = 'https://es-papi-i6d0cd.5sc6y6-2.usa-e2.cloudhub.io/api';

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro no serviço de autenticação:', error);
            throw error;
        }
    }
};

