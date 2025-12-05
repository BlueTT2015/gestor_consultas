// src/pages/Home.jsx

import Card from "../components/Card";
import CardBody from "../components/CardBody";
import { Stethoscope, Calendar, Users, Check, HeartPulse, Clock, FileText } from 'lucide-react';

// Paleta de cores para consistência
const colors = {
    primary: '#54CC90',
    secondary: '#2514BE',
    accent1: '#5256CB',
    accent3: '#F2721C',
    background: '#F3F7F2',
    white: '#FFFFFF',
};

export default function Home() {
    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                {/* Cabeçalho Principal */}
                <Card variant="secondary" className="text-white text-center"
                      style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)` }}>
                    <h1 className="text-5xl font-extrabold mb-2 flex items-center justify-center gap-3">
                        <HeartPulse size={48} className="text-white" />
                        MedHub
                    </h1>
                    <h2 className="text-xl font-light opacity-90">
                        Bem-vindo à MedHub, a plataforma onde qualquer pessoa
                        pode gerir consultas de forma simples e organizada.
                    </h2>
                </Card>

                {/* Secção 1: O que pode fazer aqui? */}
                <Card variant="light">
                    <CardBody spacing="large">
                        <h3 className="text-2xl font-bold border-b pb-2 mb-4" style={{ color: colors.secondary }}>
                            O que pode fazer aqui?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: Calendar, text: 'Marcar consultas', color: colors.primary },
                                { icon: Clock, text: 'Ver consultas agendadas', color: colors.accent1 },
                                { icon: Stethoscope, text: 'Médicos podem gerir a sua agenda', color: colors.secondary },
                                { icon: Users, text: 'Acesso ao perfil e informações de cada utilizador', color: colors.accent3 },
                                { icon: FileText, text: 'Consultar histórico', color: colors.primary },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start p-3 rounded-lg border" style={{ borderColor: item.color + '30', backgroundColor: item.color + '10'}}>
                                    <item.icon size={20} className="mt-0.5 flex-shrink-0" style={{ color: item.color }} />
                                    <p className="ml-3 text-gray-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Secção 2: Como funciona? */}
                <Card variant="default">
                    <CardBody spacing="large">
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4" style={{ color: colors.secondary }}>
                            Como funciona?
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Dependendo do tipo de utilizador, a MedHub adapta-se às suas necessidades:
                        </p>
                        <ul className="space-y-4">
                            <li className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: colors.primary + '10' }}>
                                <p>
                                    <strong style={{ color: colors.primary }}>Paciente:</strong> marca consultas, vê as suas marcações e
                                    acede ao seu perfil completo.
                                </p>
                            </li>
                            <li className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: colors.accent1 + '10' }}>
                                <p>
                                    <strong style={{ color: colors.accent1 }}>Assistente:</strong> gere consultas de vários pacientes e
                                    apoia a organização do consultório.
                                </p>
                            </li>
                            <li className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: colors.secondary + '10' }}>
                                <p>
                                    <strong style={{ color: colors.secondary }}>Médico:</strong> controla as consultas marcadas, acede aos
                                    detalhes dos pacientes e organiza a sua agenda clínica.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Secção 3: Começar */}
                <Card variant="info" className="text-center">
                    <CardBody>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
                            Começar
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Use o menu acima para navegar. Caso não tenha conta, crie uma. Se já tem,
                            faça login e continue o que estava a fazer. Qualquer dúvida pode nos contactar através
                            dos nossos contactos.
                        </p>
                        {/* Links de navegação (melhorados com classes de botão) */}
                        <div className="flex justify-center space-x-4">
                            <a href="/auth/register" className="px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                               style={{ backgroundColor: colors.primary, color: colors.white }}>
                                Criar Conta
                            </a>
                            <a href="/auth/login" className="px-6 py-3 rounded-lg font-semibold transition-colors shadow-md border hover:shadow-lg"
                               style={{ borderColor: colors.secondary, color: colors.secondary, backgroundColor: colors.white }}>
                                Login
                            </a>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}