// src/pages/PatientProfile.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar,
    Mail,
    Phone,
    MapPin,
    Heart,
    Clipboard,
    Shield,
    FileText,
} from 'lucide-react';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import { colors } from "../config/colors";
import { API_BASE } from "../utils/constants";
import { getAvatarColor, getInitials, formatDateDisplay } from "../utils/helpers";
import { DetailedLoadingState, ErrorMessage } from "../components/common/LoadingState";
import PageWrapper from "../components/PageWrapper";

export default function PatientProfile() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const patientsRes = await fetch(`${API_BASE}/patients`, {
                    method: "GET",
                    headers: {
                        client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                        client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                    }
                });
                if (!patientsRes.ok) throw new Error("Falha ao carregar lista de pacientes");
                const patientsList = await patientsRes.json();
                const patient = patientsList.find(p => String(p.patient_id) === patientId);

                if (!patient) {
                    throw new Error(`Paciente com ID ${patientId} não encontrado.`);
                }

                const usersRes = await fetch(`${API_BASE}/users`, {
                    method: "GET",
                    headers: {
                        client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                        client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                    }
                });
                if (!usersRes.ok) throw new Error("Falha ao carregar usuários");
                const usersData = await usersRes.json();
                const user = usersData.find(u => u.user_id === patient.user_id);

                const full_name = user
                    ? `${user.first_name} ${user.last_name}`
                    : `Paciente #${patient.patient_id}`;

                setPatientData({
                    ...patient,
                    user_data: user,
                    full_name: full_name,
                    email: user ? user.email : 'Não disponível',
                    phone: user ? user.phone : 'Não disponível',
                    display_dob: patient.date_of_birth ? formatDateDisplay(patient.date_of_birth) : 'N/A',
                    display_created_at: patient.created_at ? formatDateDisplay(patient.created_at.split('T')[0]) : 'N/A',
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

    const handleViewAppointments = () => {
        if (patientId) {
            navigate(`/patient-appointments/${patientId}`);
        }
    };

    if (loading) return <DetailedLoadingState message="A carregar perfil do paciente..." />;

    if (error) return <ErrorMessage message={error} onBack={() => navigate(-1)} />;

    const patient = patientData;
    const initials = getInitials(patient.full_name);
    const avatarBackground = getAvatarColor(patient.patient_id);

    return (
        <PageWrapper maxWidth="max-w-6xl" className="space-y-0">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.secondary }}
            >
                ← Voltar
            </button>

            <Card variant="light" className="overflow-hidden p-0">
                <div
                    className="h-48 relative flex items-center justify-center p-6"
                    style={{ background: avatarBackground }}
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
                            {initials}
                        </div>
                        <h1 className="text-4xl font-extrabold mt-3 text-white text-shadow-md">
                            {patient.full_name}
                        </h1>
                    </div>
                </div>

                <CardBody padding="large" spacing="large">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: colors.secondary, borderColor: colors.accent2}}>
                                Detalhes Pessoais
                            </h2>

                            <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50">
                                <Calendar size={20} className="text-primary flex-shrink-0" style={{ color: colors.primary }}/>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Data de Nascimento</p>
                                    <p className="text-base font-bold text-gray-800">
                                        {patient.display_dob}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50">
                                <Mail size={20} className="text-gray-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Email</p>
                                    <p className="text-base text-gray-800 break-words">{patient.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50">
                                <Phone size={20} className="text-gray-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Telefone</p>
                                    <p className="text-base text-gray-800">{patient.phone || 'N/A'}</p>
                                </div>
                            </div>

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

                            <div className="p-2 rounded-lg bg-gray-50 border-l-4" style={{ borderColor: colors.primary }}>
                                <p className="text-sm font-medium text-gray-600">Registado desde</p>
                                <p className="text-base text-gray-800">{patient.display_created_at}</p>
                            </div>

                            <button
                                onClick={handleViewAppointments}
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

                    <div className="mt-8 space-y-4 p-6 rounded-xl border-4" style={{ borderColor: colors.accent2, backgroundColor: colors.white}}>
                        <h2 className="text-2xl font-bold mb-3 border-b pb-2" style={{ color: colors.secondary, borderColor: colors.accent2}}>
                            Informação Médica & Identificação
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="flex items-center gap-4 p-2 rounded-lg bg-red-50 border-l-4 border-red-300">
                                <Heart size={20} className="text-red-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Grupo Sanguíneo</p>
                                    <p className="text-lg font-bold text-red-800">{patient.blood_type || 'N/A'}</p>
                                </div>
                            </div>

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
                            <div className="p-2 rounded-lg border">
                                <p className="text-xs font-medium text-gray-600">NIF</p>
                                <p className="text-sm font-mono text-gray-800">{patient.nif || 'N/A'}</p>
                            </div>

                            <div className="p-2 rounded-lg border">
                                <p className="text-xs font-medium text-gray-600">N. Utente de Saúde (NUS)</p>
                                <p className="text-sm font-mono text-gray-800">{patient.nus || 'N/A'}</p>
                            </div>

                            <div className="p-2 rounded-lg border">
                                <p className="text-xs font-medium text-gray-600">N. Segurança Social (NSS)</p>
                                <p className="text-sm font-mono text-gray-800">{patient.nss || 'N/A'}</p>
                            </div>
                        </div>

                    </div>
                </CardBody>
            </Card>
        </PageWrapper>
    );
}