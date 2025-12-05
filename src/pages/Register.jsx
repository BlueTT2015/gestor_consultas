// src/pages/Register.jsx

import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { Mail, Key, User, UserPlus, ArrowLeft } from 'lucide-react';

const colors = {
    primary: '#54CC90',
    secondary: '#2514BE',
    accent2: '#BCB5F7',
    background: '#F3F7F2',
    white: '#FFFFFF',
    gray: '#6B7280'
};

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center py-10" style={{ backgroundColor: colors.background }}>
            <Card className="max-w-md w-full" shadow="lg">
                <CardHeader align="center" borderBottom>
                    <UserPlus size={40} className="mx-auto mb-3" style={{ color: colors.primary }} />
                    <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                        Registar
                    </h1>
                </CardHeader>

                <CardBody spacing="large">
                    <form className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nome
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="O teu nome"
                                    required
                                    className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-opacity-50 transition duration-150"
                                    style={{ borderColor: colors.accent2, outlineColor: colors.primary }}
                                />
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="exemplo@gmail.com"
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

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="confirmar password"
                                    required
                                    className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-opacity-50 transition duration-150"
                                    style={{ borderColor: colors.accent2, outlineColor: colors.primary }}
                                />
                                <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Submit Button */}
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
                </CardBody>

                <div className="mt-4 pt-4 border-t text-center text-sm" style={{ borderColor: colors.accent2 + '30' }}>
                    <p className="text-gray-600">Já tem conta?{' '}
                        <a href="/auth/login" className="font-semibold hover:underline flex items-center justify-center gap-1 mt-2" style={{ color: colors.secondary }}>
                            <ArrowLeft size={16} />
                            Login
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    );
}

