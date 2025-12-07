// src/pages/DashboardClinicAppointments.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import StatusBadge from "../components/common/StatusBadge";
import PageWrapper from "../components/PageWrapper";
import { CalendarCheck, Building, Clock, AlertTriangle } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE } from "../utils/constants";
import { SimpleLoadingState, ErrorMessage } from "../components/common/LoadingState";
import { formatDateDisplay } from "../utils/helpers";

export default function DashboardClinicAppointments() {
    const { managerId } = useParams();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [clinicInfo, setClinicInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const numericManagerId = parseInt(managerId);

    useEffect(() => {
        if (isNaN(numericManagerId)) {
            setError("ID de gerente inválido.");
            setLoading(false);
            return;
        }

        const fetchClinicAppointments = async () => {
            try {
                setLoading(true);

                // 1. Encontrar o Clinic ID usando o Manager ID
                const managersRes = await fetch(`${API_BASE}/clinic-managers`);
                if (!managersRes.ok) throw new Error("Falha ao carregar gerentes.");
                const managersData = await managersRes.json();

                const manager = managersData.find(m => m.manager_id === numericManagerId);
                if (!manager) {
                    throw new Error(`Gerente com ID ${managerId} não encontrado.`);
                }
                const clinicId = manager.clinic_id;

                // 2. Buscar todas as outras informações necessárias em paralelo
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

                // 3. Mapear dados
                const clinic = clinicsData.find(c => c.clinic_id === clinicId);
                setClinicInfo(clinic || { name: `Clínica #${clinicId}` });

                const userMap = new Map(usersData.map(u => [u.user_id, {
                    name: `${u.first_name} ${u.last_name}`,
                    role: u.role
                }]));
                const doctorUserIds = new Map(doctorsData.map(d => [d.doctor_id, d.user_id]));

                // 4. Filtrar e formatar consultas da clínica
                const filteredAppointments = appointmentsData
                    .filter(apt => apt.clinic_id === clinicId)
                    .map(apt => {

                        // Get Patient Name
                        const patientDetails = userMap.get(apt.patient_id);
                        const patientName = patientDetails?.name || `Paciente #${apt.patient_id}`;

                        // Get Doctor Name
                        const doctorUserId = doctorUserIds.get(apt.doctor_id);
                        const doctorDetails = doctorUserId ? userMap.get(doctorUserId) : null;
                        const doctorName = doctorDetails?.name ? `Dr. ${doctorDetails.name}` : `Médico #${apt.doctor_id}`;

                        return {
                            ...apt,
                            patientName,
                            doctorName,
                            formattedDateTime: formatDateDisplay(apt.date, apt.time),
                        };
                    });

                // Ordenar por data mais recente primeiro
                filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

                setAppointments(filteredAppointments);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao carregar dados do Dashboard de Consultas da Clínica:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchClinicAppointments();
    }, [numericManagerId]);

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

            <Card variant="secondary" className="text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)` }}>
                <CalendarCheck size={36} className="mx-auto mb-2 text-white" />
                <h1 className="text-3xl font-extrabold mb-1">
                    Dashboard de Consultas da Clínica
                </h1>
                <p className="text-lg font-light opacity-90">
                    <Building size={20} className="inline mr-2" />
                    {clinicInfo?.name || "Clínica Desconhecida"}
                </p>
                <p className="text-sm font-light opacity-80 mt-2">
                    Total de {appointments.length} consultas agendadas e históricas.
                </p>
            </Card>

            <Card variant="light" className="p-0 overflow-hidden">
                <CardHeader spacing="none" className="p-6">
                    <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                        Registo Detalhado de Consultas
                    </h2>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data / Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.doctorName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.patientName}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">{apt.reason}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">{apt.diagnosis || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Nenhuma consulta encontrada para esta clínica.
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