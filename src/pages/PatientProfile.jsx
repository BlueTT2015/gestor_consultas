// src/pages/PatientProfile.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    User,
    Calendar,
    Mail,
    Phone,
    MapPin,
    AlertTriangle,
    Heart,
    Clipboard,
    Shield,
    FileText,
    Loader
} from 'lucide-react';
import Card from "../components/Card";
import CardBody from "../components/CardBody";

const API_BASE = "https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api";

export default function PatientProfile() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Paleta de cores (consistente com Card.jsx)
    const colors = {
        primary: '#54CC90',
        secondary: '#2514BE',
        accent1: '#5256CB',
        accent2: '#BCB5F7',
        accent3: '#F2721C',
        background: '#F3F7F2',
        white: '#FFFFFF',
        gray: '#6B7280',
    };

    // --- Helper Functions ---
    const getAvatarColor = (id) => {
        const gradients = [
            `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
            `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)`,
            `linear-gradient(135deg, ${colors.accent1} 0%, ${colors.accent2} 100%)`,
            `linear-gradient(135deg, ${colors.accent3} 0%, '#FF9A3D' 100%)`,
        ];
        // Usa módulo para ciclar cores de forma segura
        return gradients[id % gradients.length];
    };

    const getInitials = (patient) => {
        if (!patient?.user_data) return 'P';
        const name = patient.full_name;
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            // Formata para dd/mm/aaaa
            return date.toLocaleDateString('pt-PT', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            return dateString.split('T')[0]; // Fallback to YYYY-MM-DD
        }
    };
    // --------------------------------------------------------

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Fetch all patients
                const patientsRes = await fetch(`${API_BASE}/patients`);
                if (!patientsRes.ok) throw new Error("Falha ao carregar lista de pacientes");
                const patientsList = await patientsRes.json();
                // Procura pelo paciente com o ID da rota (API retorna ID como Integer, useParams como String)
                const patient = patientsList.find(p => String(p.patient_id) === patientId);

                if (!patient) {
                    throw new Error(`Paciente com ID ${patientId} não encontrado.`);
                }

                // 2. Fetch all users
                const usersRes = await fetch(`${API_BASE}/users`);
                if (!usersRes.ok) throw new Error("Falha ao carregar usuários");
                const usersData = await usersRes.json();
                // Encontra o utilizador associado ao patient.user_id
                const user = usersData.find(u => u.user_id === patient.user_id);

                // Construção final dos dados
                const full_name = user
                    ? `${user.first_name} ${user.last_name}`
                    : `Paciente #${patient.patient_id}`;

                setPatientData({
                    ...patient,
                    user_data: user,
                    full_name: full_name,
                    // Assume-se que o email e telefone estão no objeto user, se disponível
                    email: user ? user.email : 'Não disponível',
                    phone: user ? user.phone : 'Não disponível',
                    display_dob: patient.date_of_birth ? formatDate(patient.date_of_birth) : 'N/A',
                    display_created_at: patient.created_at ? formatDate(patient.created_at.split('T')[0]) : 'N/A',
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchData();
        }
    }, [patientId]);

    if (loading) return (
        <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
            <Card variant="light" className="max-w-4xl mx-auto h-96 w-full">
                <div className="animate-pulse flex flex-col items-center justify-center h-full">
                    <Loader size={48} className="animate-spin mb-4" style={{ color: colors.secondary }} />
                    <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>A carregar perfil...</h2>
                </div>
            </Card>
        </div>
    );

    if (error) return (
        <Card variant="error" className="max-w-md mx-auto my-10">
            <CardBody>
                <div className="flex items-center gap-3">
                    <AlertTriangle size={24} />
                    <h2 className="text-xl font-bold">Erro ao carregar perfil</h2>
                </div>
                <p className="mt-2">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: colors.primary }}
                >
                    Voltar
                </button>
            </CardBody>
        </Card>
    );

    const patient = patientData;

    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Botão Voltar (Simulado para navegação anterior) */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium"
                    style={{ color: colors.secondary }}
                >
                    ← Voltar
                </button>

                <Card variant="light" className="overflow-hidden p-0">
                    {/* Cabeçalho do Perfil com Gradiente */}
                    <div
                        className="h-48 relative flex items-center justify-center p-6"
                        style={{ background: getAvatarColor(patient.patient_id) }}
                    >
                        <div className="absolute inset-0 bg-black/20"></div>

                        <div className="flex flex-col items-center justify-center relative z-10">
                            <div
                                className="rounded-full w-24 h-24 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    borderColor: colors.white,
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                {getInitials(patient)}
                            </div>
                            <h1 className="text-4xl font-extrabold mt-3 text-white text-shadow-md">
                                {patient.full_name}
                            </h1>
                        </div>
                    </div>

                    <CardBody padding="large" spacing="large">
                        {/* Seção 1: Informações Pessoais e de Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Detalhes de Contacto e Pessoais */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: colors.secondary, borderColor: colors.accent2}}>
                                    Detalhes Pessoais
                                </h2>

                                {/* Data de Nascimento */}
                                <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50">
                                    <Calendar size={20} className="text-primary flex-shrink-0" style={{ color: colors.primary }}/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Data de Nascimento</p>
                                        <p className="text-base font-bold text-gray-800">
                                            {patient.display_dob}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50">
                                    <Mail size={20} className="text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Email</p>
                                        <p className="text-base text-gray-800 break-words">{patient.email}</p>
                                    </div>
                                </div>

                                {/* Telefone */}
                                <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50">
                                    <Phone size={20} className="text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Telefone</p>
                                        <p className="text-base text-gray-800">{patient.phone || 'Não disponível'}</p>
                                    </div>
                                </div>

                                {/* Contacto de Emergência */}
                                <div className="flex items-start gap-4 p-2 border-t pt-4">
                                    <Shield size={20} className="text-red-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Contacto de Emergência</p>
                                        <p className="text-base text-gray-800">
                                            {patient.emergency_contact || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* Detalhes de Endereço */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: colors.secondary, borderColor: colors.accent2}}>
                                    Morada
                                </h2>
                                <div className="flex items-start gap-4 p-2 rounded-lg border">
                                    <MapPin size={20} className="text-accent1 flex-shrink-0" style={{ color: colors.accent1 }}/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Endereço Completo</p>
                                        <p className="text-base text-gray-800">{patient.address || 'N/A'}</p>
                                        <p className="text-base text-gray-800">{patient.postal_code || 'N/A'} {patient.city || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Data de Registo */}
                                <div className="p-2 rounded-lg bg-gray-50 border-l-4" style={{ borderColor: colors.primary }}>
                                    <p className="text-sm font-medium text-gray-600">Registado desde</p>
                                    <p className="text-base text-gray-800">{patient.display_created_at}</p>
                                </div>

                                {/* Botão para Histórico (Simulado) */}
                                <button
                                    onClick={() => alert("Navegação para Histórico de Consultas não implementada.")}
                                    className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg mt-6"
                                    style={{
                                        backgroundColor: colors.accent3,
                                        color: colors.white,
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d66217'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent3}
                                >
                                    <FileText size={20} />
                                    Ver Histórico de Consultas
                                </button>
                            </div>
                        </div>

                        {/* Seção 2: Informações Médicas e de Identificação */}
                        <div className="mt-8 space-y-4 p-6 rounded-xl border-4" style={{ borderColor: colors.accent2, backgroundColor: colors.white}}>
                            <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: colors.secondary, borderColor: colors.accent2}}>
                                Informação Médica & Identificação
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Grupo Sanguíneo */}
                                <div className="flex items-center gap-4 p-2 rounded-lg bg-red-50 border-l-4 border-red-300">
                                    <Heart size={20} className="text-red-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Grupo Sanguíneo</p>
                                        <p className="text-lg font-bold text-red-800">{patient.blood_type || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Alergias */}
                                <div className="flex items-center gap-4 p-2 rounded-lg bg-yellow-50 border-l-4 border-yellow-300">
                                    <Clipboard size={20} className="text-yellow-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Alergias</p>
                                        <p className="text-base font-bold text-yellow-800">
                                            {patient.allergies && patient.allergies.toLowerCase() !== 'nenhuma'
                                                ? patient.allergies : 'Nenhuma Conhecida'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                                {/* NIF */}
                                <div className="p-2 rounded-lg border">
                                    <p className="text-xs font-medium text-gray-600">NIF</p>
                                    <p className="text-sm font-mono text-gray-800">{patient.nif || 'N/A'}</p>
                                </div>

                                {/* NUS (Número de Utente de Saúde) */}
                                <div className="p-2 rounded-lg border">
                                    <p className="text-xs font-medium text-gray-600">N. Utente de Saúde (NUS)</p>
                                    <p className="text-sm font-mono text-gray-800">{patient.nus || 'N/A'}</p>
                                </div>

                                {/* NSS (Número de Segurança Social) */}
                                <div className="p-2 rounded-lg border">
                                    <p className="text-xs font-medium text-gray-600">N. Segurança Social (NSS)</p>
                                    <p className="text-sm font-mono text-gray-800">{patient.nss || 'N/A'}</p>
                                </div>
                            </div>

                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}