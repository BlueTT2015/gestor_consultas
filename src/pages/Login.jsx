import { Mail, Key, LogIn, ArrowRight } from 'lucide-react';
import { colors } from "../config/colors";
import InputField from "../components/forms/InputField";
import AuthWrapper from "../components/auth/AuthWrapper";

export default function Login() {
    const footerLink = {
        to: "/auth/register",
        text: "Criar Conta",
        Icon: ArrowRight,
        color: colors.primary
    };

    const footerText = {
        preLink: "Não tem uma conta?",
    };

    return (
        <AuthWrapper
            title="Login"
            Icon={LogIn}
            iconColor={colors.primary}
            footerLink={footerLink}
            footerText={footerText}
        >
            <form className="space-y-5">
                <InputField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="seu@gmail.com"
                    required
                    icon={Mail}
                />

                <InputField
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="password"
                    required
                    icon={Key}
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
                    className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                    style={{
                        backgroundColor: colors.secondary,
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e109d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                >
                    <LogIn size={20} className="mr-2" />
                    Login
                </button>
            </form>
        </AuthWrapper>
    );
}