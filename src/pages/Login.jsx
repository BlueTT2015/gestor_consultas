// src/pages/Login.jsx

import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { Mail, Key, LogIn, ArrowRight } from 'lucide-react';

const colors = {
    primary: '#54CC90',
    secondary: '#2514BE',
    accent2: '#BCB5F7',
    background: '#F3F7F2',
    white: '#FFFFFF',
    gray: '#6B7280'
};

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center py-10" style={{ backgroundColor: colors.background }}>
            <Card className="max-w-md w-full" shadow="lg">
                <CardHeader align="center" borderBottom>
                    <LogIn size={40} className="mx-auto mb-3" style={{ color: colors.primary }} />
                    <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                        Login
                    </h1>
                </CardHeader>

                <CardBody spacing="large">
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

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="password"
                                    required
                                    className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-opacity-50 transition duration-150"
                                    style={{ borderColor: colors.accent2, outlineColor: colors.primary }}
                                />
                                <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Remember Me / Forgot Password */}
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

                        {/* Submit Button */}
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
                </CardBody>

                <div className="mt-4 pt-4 border-t text-center text-sm" style={{ borderColor: colors.accent2 + '30' }}>
                    <p className="text-gray-600">Não tem uma conta?{' '}
                        <a href="/auth/register" className="font-semibold hover:underline flex items-center justify-center gap-1 mt-2" style={{ color: colors.primary }}>
                            Criar Conta <ArrowRight size={16} />
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    );
}