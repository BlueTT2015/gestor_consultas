// src/pages/CreateUser.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import InputField from "../components/forms/InputField";
import PageWrapper from "../components/PageWrapper";
import { UserPlus, ArrowLeft, User, Mail, Key, Phone } from 'lucide-react';
import { colors } from "../config/colors";
import { API_PAPI } from '../utils/constants';
import { DetailedLoadingState, ErrorMessage } from '../components/common/LoadingState';

export default function CreateUser() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'patient', // Default role
        phone: '',
        is_active: true,
    });
    // Estado para o próximo ID calculado
    const [nextUserId, setNextUserId] = useState(null);
    // Loading inicial para carregar o ID
    const [loadingId, setLoadingId] = useState(true);
    // Flag para loading apenas do POST
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // Efeito para calcular o próximo ID disponível
    useEffect(() => {
        const fetchMaxId = async () => {
            setLoadingId(true);
            try {
                // Fetch de todos os utilizadores para encontrar o ID máximo
                const response = await fetch(`${API_PAPI}/users`);
                if (!response.ok) throw new Error("Falha ao carregar utilizadores para preparar o formulário.");

                const usersData = await response.json();

                // Encontrar o ID máximo existente (usando 'user_id' se existir, senão 0)
                const maxId = usersData.reduce((max, user) => {
                    return Math.max(max, user.user_id || user.id || 0);
                }, 0);

                setNextUserId(maxId + 1);
            } catch (err) {
                console.error("Erro ao calcular ID:", err);
                setMessage(err.message || "Erro ao tentar preparar o formulário.");
                setIsError(true);
            } finally {
                setLoadingId(false);
            }
        };

        fetchMaxId();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nextUserId === null) {
            setMessage("Ainda a preparar formulário. Por favor, aguarde.");
            setIsError(true);
            return;
        }

        // Validação simples
        const requiredFields = ['first_name', 'last_name', 'email', 'password', 'role'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setMessage(`O campo '${field}' é obrigatório.`);
                setIsError(true);
                return;
            }
        }

        if (formData.password.length < 6) {
            setMessage("A password deve ter pelo menos 6 caracteres.");
            setIsError(true);
            return;
        }


        setIsSubmitting(true);
        setMessage(null);
        setIsError(false);

        const userData = {
            id: nextUserId, // ID CALCULADO
            email: formData.email,
            fullName: `${formData.first_name} ${formData.last_name}`, // fullName COMBINADO
            role: formData.role.toLowerCase(),
            password: formData.password,
            phone: formData.phone || "", // Phone é opcional, mas enviamos string vazia se nulo
        };

        try {
            // Requisição POST para o endpoint da PAPI: users
            const response = await fetch(`${API_PAPI}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                let errorDetails = `Falha ao criar utilizador. Código: ${response.status}.`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    throw new Error(errorDetails);
                }
            }

            setMessage(`Utilizador "${userData.fullName}" criado com sucesso! A redirecionar...`);
            setIsError(false);

            // Limpar formulário e incrementar o ID para a próxima criação
            setFormData(prev => ({
                ...prev,
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                phone: '',
            }));
            setNextUserId(prevId => prevId + 1);


            // Redirecionar para o dashboard de utilizadores após 3 segundos
            setTimeout(() => {
                navigate('/dashboard-users');
            }, 3000);

        } catch (err) {
            console.error("Erro ao criar utilizador:", err);
            setMessage(err.message || "Erro desconhecido ao tentar criar o utilizador.");
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingId) return <DetailedLoadingState message="A preparar formulário..." />;

    if (isError && !loadingId && nextUserId === null) return <ErrorMessage message={message} onBack={() => navigate('/dashboard-users')} backLabel="Voltar ao Dashboard" />;


    return (
        <PageWrapper maxWidth="max-w-3xl">
            <button
                onClick={() => navigate('/dashboard-users')}
                className="mb-6 flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.secondary }}
            >
                <ArrowLeft size={16} /> Voltar ao Dashboard
            </button>

            <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: colors.secondary }}>
                Criar Novo Utilizador
            </h1>

            <Card>
                <CardHeader spacing="medium" borderBottom>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                            Detalhes de Acesso e Perfil
                        </h2>
                    </div>
                </CardHeader>

                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Nome e Apelido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                id="first_name"
                                label="Nome Próprio *"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                icon={User}
                                placeholder="Primeiro nome"
                                name="first_name"
                            />
                            <InputField
                                id="last_name"
                                label="Apelido *"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                icon={User}
                                placeholder="Último nome"
                                name="last_name"
                            />
                        </div>

                        {/* Email e Telefone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                id="email"
                                label="Email *"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                icon={Mail}
                                placeholder="exemplo@mail.com"
                                name="email"
                            />
                            <InputField
                                id="phone"
                                label="Telefone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                icon={Phone}
                                placeholder="Opcional: 91xxxxxxx"
                                name="phone"
                            />
                        </div>

                        {/* Password */}
                        <InputField
                            id="password"
                            label="Password *"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            icon={Key}
                            placeholder="Mínimo 6 caracteres"
                            name="password"
                        />

                        {/* Role e Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nível de Acesso (Role) *
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 appearance-none"
                                    style={{ borderColor: colors.accent2, focusColor: colors.primary }}
                                >
                                    <option value="patient">Paciente</option>
                                    <option value="doctor">Médico</option>
                                    <option value="assistant">Assistente</option>
                                    <option value="manager">Gestor de Clínica</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-8">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="h-5 w-5 rounded border-gray-300"
                                    style={{ color: colors.primary, accentColor: colors.primary }}
                                />
                                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                                    Utilizador Ativo no Sistema
                                </label>
                            </div>
                        </div>


                        {message && (
                            <Card
                                variant={isError ? 'error' : 'success'}
                                padding="small"
                                className="text-center"
                            >
                                {message}
                            </Card>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || nextUserId === null}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
                            style={{
                                backgroundColor: (isSubmitting || nextUserId === null) ? colors.gray : colors.secondary,
                                color: colors.white,
                                cursor: (isSubmitting || nextUserId === null) ? 'not-allowed' : 'pointer'
                            }}
                            onMouseEnter={(e) => !(isSubmitting || nextUserId === null) && (e.currentTarget.style.backgroundColor = colors.accent1)}
                            onMouseLeave={(e) => !(isSubmitting || nextUserId === null) && (e.currentTarget.style.backgroundColor = colors.secondary)}
                        >
                            {isSubmitting ? 'A Criar...' : <><UserPlus size={20} /> Criar Utilizador</>}
                        </button>
                    </form>
                </CardBody>
            </Card>
        </PageWrapper>
    );
}