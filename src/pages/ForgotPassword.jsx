// src/pages/ForgotPassword.jsx

import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { Mail, LockOpen, ArrowLeft } from 'lucide-react';

const colors = {
    primary: '#54CC90',
    secondary: '#2514BE',
    accent2: '#BCB5F7',
    accent3: '#F2721C',
    background: '#F3F7F2',
    white: '#FFFFFF',
    gray: '#6B7280'
};

export default function ForgotPassword() {
    return (
        <div className="min-h-screen flex items-center justify-center py-10" style={{ backgroundColor: colors.background }}>
            <Card className="max-w-md w-full" shadow="lg">
                <CardHeader align="center" borderBottom>
                    <LockOpen size={40} className="mx-auto mb-3" style={{ color: colors.accent3 }} />
                    <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                        Recuperar Password
                    </h1>
                </CardHeader>

                <CardBody spacing="large">
                    <p className="text-center text-gray-600 mb-6">
                        Insira o seu endereço de email para receber o link de recuperação de password.
                    </p>
                    <form className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="seu@gmail.com"
                                    required
                                    className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-opacity-50 transition duration-150"
                                    style={{ borderColor: colors.accent2, outlineColor: colors.primary }}
                                />
                                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                            style={{
                                backgroundColor: colors.accent3,
                                color: colors.white,
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d66217'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent3}
                        >
                            <Mail size={20} />
                            Enviar link de recuperação
                        </button>
                    </form>
                </CardBody>

                <div className="mt-4 pt-4 border-t text-center text-sm" style={{ borderColor: colors.accent2 + '30' }}>
                    <p className="text-gray-600">Lembrou-se?{' '}
                        <a href="/auth/login" className="font-semibold hover:underline flex items-center justify-center gap-1 mt-2" style={{ color: colors.secondary }}>
                            <ArrowLeft size={16} />
                            Voltar ao Login
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    );
}