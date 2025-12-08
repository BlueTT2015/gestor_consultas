import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import { colors } from "../config/colors";
import InputField from "../components/forms/InputField";
import AuthWrapper from "../components/auth/AuthWrapper";
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const footerLink = {
        to: "/auth/register",
        text: "Criar Conta",
        Icon: ArrowRight,
        color: colors.primary
    };

    const footerText = {
        preLink: "Não tem uma conta?",
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Limpa o erro do campo quando o usuário começa a digitar
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
        if (apiError) setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'Password é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password deve ter pelo menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setApiError('');

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Redireciona para a página inicial após login bem-sucedido
                navigate('/');
            } else {
                setApiError(result.error || 'Erro ao fazer login');
            }
        } catch (error) {
            setApiError('Erro de conexão com o servidor');
            console.error('Erro no login:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper
            title="Login"
            Icon={LogIn}
            iconColor={colors.primary}
            footerLink={footerLink}
            footerText={footerText}
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                {apiError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                        <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">{apiError}</p>
                    </div>
                )}

                <InputField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="seu@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    icon={Mail}
                    error={errors.email}
                />

                <InputField
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    icon={Key}
                    error={errors.password}
                />

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 rounded border-gray-300"
                            style={{ color: colors.primary, accentColor: colors.primary }}
                        />
                        <label htmlFor="remember" className="ml-2 text-gray-600">
                            Lembrar-me
                        </label>
                    </div>
                    <a href="/auth/forgot-password" className="font-medium hover:underline" style={{ color: colors.secondary }}>
                        Esqueci-me da password
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: colors.secondary,
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#1e109d')}
                    onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = colors.secondary)}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            A processar...
                        </>
                    ) : (
                        <>
                            <LogIn size={20} className="mr-2" />
                            Login
                        </>
                    )}
                </button>
            </form>
        </AuthWrapper>
    );
}