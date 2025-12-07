import { Mail, Key, User, UserPlus, ArrowLeft } from 'lucide-react';
import { colors } from "../config/colors";
import InputField from "../components/forms/InputField";
import AuthWrapper from "../components/auth/AuthWrapper";

export default function Register() {
    const footerLink = {
        to: "/auth/login",
        text: "Login",
        Icon: ArrowLeft,
        color: colors.secondary
    };

    const footerText = {
        preLink: "Já tem conta?",
    };

    return (
        <AuthWrapper
            title="Registar"
            Icon={UserPlus}
            iconColor={colors.primary}
            footerLink={footerLink}
            footerText={footerText}
        >
            <form className="space-y-5">
                <InputField
                    id="name"
                    label="Nome"
                    type="text"
                    placeholder="O teu nome"
                    required
                    icon={User}
                />

                <InputField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="exemplo@gmail.com"
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

                <InputField
                    id="confirmPassword"
                    label="Confirmar Password"
                    type="password"
                    placeholder="confirmar password"
                    required
                    icon={Key}
                />

                <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45b87d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    <UserPlus size={20} className="mr-2" />
                    Criar Conta
                </button>
            </form>
        </AuthWrapper>
    );
}