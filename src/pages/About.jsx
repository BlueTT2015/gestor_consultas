// src/pages/About.jsx

import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { HeartPulse, Target, ClipboardCheck, Users, Calendar, Stethoscope, Clock, ShieldCheck } from 'lucide-react';

// Paleta de cores para consistência
const colors = {
    primary: '#54CC90',
    secondary: '#2514BE',
    accent1: '#5256CB',
    background: '#F3F7F2',
    white: '#FFFFFF',
    grayDark: '#374151'
};

export default function About() {
    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-4xl mx-auto px-4 space-y-8">

                {/* Cabeçalho */}
                <Card variant="light" className="text-center">
                    <CardHeader align="center">
                        <HeartPulse size={48} className="mx-auto mb-3" style={{ color: colors.secondary }} />
                        <h1 className="text-4xl font-bold" style={{ color: colors.secondary }}>
                            Sobre a MedHub
                        </h1>
                    </CardHeader>
                    <CardBody spacing="small">
                        <p className="text-gray-700 text-lg">
                            A MedHub nasceu com um objetivo simples: acabar com a confusão na marcação
                            e gestão de consultas. Uma plataforma clara, direta e feita para facilitar a vida de todos os envolvidos.
                        </p>
                    </CardBody>
                </Card>

                {/* A Nossa Missão */}
                <Card variant="default">
                    <CardBody>
                        <div className="flex items-center gap-3 mb-4">
                            <Target size={24} style={{ color: colors.primary }} />
                            <h2 className="text-2xl font-bold" style={{ color: colors.accent1 }}>
                                A Nossa Missão
                            </h2>
                        </div>
                        <p className="text-gray-700">
                            Tornar o processo de marcação, organização e acompanhamento de consultas
                            o mais simples possível, independentemente de quem está a usar — paciente,
                            assistente ou médico.
                        </p>
                    </CardBody>
                </Card>

                {/* O que Oferecemos */}
                <Card variant="primary">
                    <CardBody spacing="medium">
                        <div className="flex items-center gap-3 mb-4">
                            <ClipboardCheck size={24} style={{ color: colors.secondary }} />
                            <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                                O que Oferecemos
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            {[
                                { icon: Calendar, text: 'Plataforma unificada para gestão de consultas' },
                                { icon: Clock, text: 'Ferramentas rápidas para marcação e visualização' },
                                { icon: Stethoscope, text: 'Gestão intuitiva da agenda dos médicos' },
                                { icon: Users, text: 'Acesso ao histórico e informações essenciais' },
                                { icon: ClipboardCheck, text: 'Interface simples e preparada para qualquer tipo de utilizador' },
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700">
                                    <item.icon size={18} className="mt-0.5 flex-shrink-0" style={{ color: colors.secondary }} />
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>


                {/* Para Quem É? */}
                <Card variant="light">
                    <CardBody>
                        <div className="flex items-center gap-3 mb-4">
                            <Users size={24} style={{ color: colors.accent1 }} />
                            <h2 className="text-2xl font-bold" style={{ color: colors.accent1 }}>
                                Para quem é?
                            </h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="p-3 rounded-lg border border-gray-200">
                                <p>
                                    <strong style={{ color: colors.primary }}>Pacientes:</strong> marcam e acompanham consultas sem stress.
                                </p>
                            </li>
                            <li className="p-3 rounded-lg border border-gray-200">
                                <p>
                                    <strong style={{ color: colors.accent1 }}>Assistentes:</strong> organizam a rotina clínica com eficiência.
                                </p>
                            </li>
                            <li className="p-3 rounded-lg border border-gray-200">
                                <p>
                                    <strong style={{ color: colors.secondary }}>Médicos:</strong> controlam horários e veem rapidamente quem vão atender.
                                </p>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Porquê a MedHub? */}
                <Card variant="success" className="text-center">
                    <CardBody>
                        <ShieldCheck size={32} className="mx-auto mb-3 text-green-700" />
                        <h2 className="text-2xl font-bold mb-4 text-green-800">
                            Porquê a MedHub?
                        </h2>
                        <p className="text-xl font-medium text-green-900 italic">
                            Porque a saúde não precisa de sistemas complicados. Precisa de ferramentas que ajudem.
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}