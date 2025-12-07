// src/pages/DashboardDoctorAppointments.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import StatusBadge from "../components/Common/StatusBadge";
import PageWrapper from "../components/PageWrapper";
import { Stethoscope, Clock, CalendarCheck } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE } from "../utils/constants";
import { SimpleLoadingState, ErrorMessage } from "../components/Common/LoadingState";
import { formatDateDisplay } from "../utils/helpers";

export default function DashboardDoctorAppointments() {
    const { doctorId } = useParams(); // ID do médico (tabela 'doctors')
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const numericDoctorId = parseInt(doctorId);

    useEffect(() => {
        if (isNaN(numericDoctorId)) {
            setError("ID de médico inválido.");
            setLoading(false);
            return;
        }

        const fetchDoctorAppointments = async () => {
            try {
                setLoading(true);

                // 1. Buscar todos os dados essenciais em paralelo
                const [
                    appointmentsRes,
                    clinicsRes,
                    doctorsRes,
                    usersRes,
                ] = await Promise.all([
                    fetch(`${API_BASE}/appointments`),
                    fetch(`${API_BASE}/clinics`),
                    fetch(`${API_BASE}/doctors`),
                    fetch(`${API_BASE}/users`),
                ]);

                if (!appointmentsRes.ok || !clinicsRes.ok || !doctorsRes.ok || !usersRes.ok) {
                    throw new Error("Falha ao carregar dados essenciais para as consultas.");
                }

                const [
                    appointmentsData,
                    clinicsData,
                    doctorsData,
                    usersData,
                ] = await Promise.all([
                    appointmentsRes.json(),
                    clinicsRes.json(),
                    doctorsRes.json(),
                    usersRes.json(),
                ]);

                // 2. Mapear dados auxiliares
                const userMap = new Map(usersData.map(u => [u.user_id, {
                    name: `${u.first_name} ${u.last_name}`,
                    role: u.role
                }]));

                const clinicMap = new Map(clinicsData.map(c => [c.clinic_id, c.name]));

                const currentDoctor = doctorsData.find(d => d.doctor_id === numericDoctorId);
                if (!currentDoctor) {
                    throw new Error(`Médico com ID ${doctorId} não encontrado.`);
                }

                const doctorUserDetails = userMap.get(currentDoctor.user_id);
                const doctorName = doctorUserDetails?.name || `Médico #${doctorId}`;

                // Apenas o nome do médico é necessário agora
                setDoctorInfo({
                    name: doctorName,
                    // specialization e clinicName removidos para simplificar
                });

                // 3. Filtrar e formatar appointments
                const filteredAppointments = appointmentsData
                    .filter(apt => apt.doctor_id === numericDoctorId)
                    .map(apt => {

                        // Obter Nome do Paciente
                        const patientDetails = userMap.get(apt.patient_id);
                        const patientName = patientDetails?.name || `Paciente #${apt.patient_id}`;

                        // Obter Nome da Clínica (necessário para a tabela)
                        const clinicName = clinicMap.get(apt.clinic_id) || 'N/A';

                        return {
                            ...apt,
                            patientName,
                            clinicName,
                            formattedDateTime: formatDateDisplay(apt.date, apt.time),
                        };
                    });

                // Ordenar por data (mais recente primeiro)
                filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

                setAppointments(filteredAppointments);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao carregar dados do Dashboard de Consultas do Médico:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorAppointments();
    }, [numericDoctorId]);

    if (loading) return <SimpleLoadingState />;

    if (error) return <ErrorMessage message={error} onBack={() => navigate(-1)} />;

    return (
        <PageWrapper maxWidth="max-w-7xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.secondary }}
            >
                ← Voltar
            </button>

            {/* Cabeçalho do Dashboard simplificado */}
            <Card variant="secondary" className="text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)` }}>
                <Stethoscope size={36} className="mx-auto mb-2 text-white" />
                <h1 className="text-3xl font-extrabold mb-1">
                    Dashboard de Consultas
                </h1>
                <p className="text-lg font-light opacity-90">
                    Dr(a). {doctorInfo?.name || "Médico Desconhecido"}
                </p>
                {/* Especialização e Clínica foram removidas daqui */}
                <p className="text-sm font-light opacity-80 mt-2">
                    Total de {appointments.length} consultas associadas.
                </p>
            </Card>

            {/* Tabela de Consultas (mantida como estava) */}
            <Card variant="light" className="p-0 overflow-hidden">
                <CardHeader spacing="none" className="p-6">
                    <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                        Consultas Agendadas e Históricas
                    </h2>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data / Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clínica</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <tr key={apt.appointment_id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.accent1 }}>
                                        {apt.appointment_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold">
                                            <Clock size={16} className="text-gray-400" />
                                            {apt.formattedDateTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={apt.status} type="appointment" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.clinicName}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">{apt.reason}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">{apt.diagnosis || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Nenhuma consulta encontrada para este médico.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </PageWrapper>
    );
}