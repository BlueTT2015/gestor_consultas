// src/pages/DashboardAppointments.jsx

import { useEffect, useState } from "react";
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { CalendarCheck, AlertTriangle, Loader, Clock } from 'lucide-react';

const API_BASE = "https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api";

// Paleta de cores para consistência
const colors = {
    primary: '#54CC90', // Green
    secondary: '#2514BE', // Dark Blue
    accent1: '#5256CB', // Purple/Blue
    accent3: '#F2721C', // Orange
    background: '#F3F7F2',
    white: '#FFFFFF',
    gray: '#6B7280'
};

// Funções de formatação
const formatStatus = (status) => {
    switch (status?.toLowerCase()) {
        case 'scheduled':
            return { text: 'Agendada', color: colors.primary, bg: '#D1FAE5', textColor: '#065F46' };
        case 'completed':
            return { text: 'Concluída', color: colors.accent1, bg: '#DBEAFE', textColor: '#1E40AF' };
        case 'cancelled':
            return { text: 'Cancelada', color: colors.accent3, bg: '#FEF3C7', textColor: '#92400E' };
        default:
            return { text: 'Pendente', color: colors.gray, bg: '#F3F4F6', textColor: '#4B5563' };
    }
};

const formatDate = (dateString, timeString) => {
    if (!dateString) return 'N/A';

    // Formata a data para dd/mm/aaaa
    const [year, month, day] = dateString.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    // Extrai a hora do timestamp (formato da API: "1970-01-01T09:00:00")
    let formattedTime = 'N/A';
    if (timeString) {
        try {
            // Assume que o formato é ISO 8601 (e.g., "YYYY-MM-DDTXX:YY:ZZ")
            const parts = timeString.split('T');
            if (parts.length > 1) {
                formattedTime = parts[1].substring(0, 5); // Pega apenas HH:MM
            } else if (timeString.length === 8) {
                formattedTime = timeString.substring(0, 5); // Se for HH:MM:SS
            }
        } catch (e) {
            console.error("Erro ao formatar hora:", e);
            formattedTime = 'N/A';
        }
    }

    return `${formattedDate} ${formattedTime !== 'N/A' ? `às ${formattedTime}` : ''}`;
};


export default function DashboardAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // 1. Fetch All Data Concurrently
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

                if (!appointmentsRes.ok) throw new Error("Falha ao carregar consultas");
                if (!clinicsRes.ok) throw new Error("Falha ao carregar clínicas");
                if (!doctorsRes.ok) throw new Error("Falha ao carregar médicos");
                if (!usersRes.ok) throw new Error("Falha ao carregar usuários");

                const appointmentsData = await appointmentsRes.json();
                const clinicsData = await clinicsRes.json();
                const doctorsData = await doctorsRes.json();
                const usersData = await usersRes.json();

                // 2. Create Lookup Maps
                const clinicMap = new Map(clinicsData.map(c => [c.clinic_id, c.name]));
                const userMap = new Map(usersData.map(u => [u.user_id, {
                    name: `${u.first_name} ${u.last_name}`,
                    role: u.role
                }]));

                const doctorUserIds = new Map(doctorsData.map(d => [d.doctor_id, d.user_id]));

                // 3. Combine Data and Format Appointments
                const combinedAppointments = appointmentsData.map(apt => {
                    const clinicName = clinicMap.get(apt.clinic_id) || 'Clínica Desconhecida';

                    // Get Patient Name
                    const patientDetails = userMap.get(apt.patient_id);
                    const patientName = patientDetails?.name || `Paciente #${apt.patient_id}`;

                    // Get Doctor Name
                    const doctorUserId = doctorUserIds.get(apt.doctor_id);
                    const doctorDetails = doctorUserId ? userMap.get(doctorUserId) : null;
                    const doctorName = doctorDetails?.name ? `Dr. ${doctorDetails.name}` : `Médico #${apt.doctor_id}`;

                    return {
                        ...apt,
                        clinicName,
                        patientName,
                        doctorName,
                        formattedDateTime: formatDate(apt.date, apt.time),
                        statusDetails: formatStatus(apt.status)
                    };
                });

                setAppointments(combinedAppointments);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao carregar dados do Dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const renderStatusBadge = (statusDetails) => (
        <span
            className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            style={{ backgroundColor: statusDetails.bg, color: statusDetails.textColor }}
        >
            {statusDetails.text}
        </span>
    );

    if (loading) return (
        <div className="min-h-screen py-10 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
            <div className="flex items-center gap-3 text-lg font-medium" style={{ color: colors.secondary }}>
                <Loader size={24} className="animate-spin" />
                A carregar dados do sistema...
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <Card variant="error" className="max-w-xl mx-auto my-10">
                <CardBody>
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold">Erro ao carregar o Dashboard</h2>
                    </div>
                    <p className="mt-2">{error}</p>
                </CardBody>
            </Card>
        </div>
    );


    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto px-4 space-y-8">

                {/* Cabeçalho do Dashboard */}
                <Card variant="secondary" className="text-white text-center"
                      style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)` }}>
                    <CalendarCheck size={36} className="mx-auto mb-2 text-white" />
                    <h1 className="text-3xl font-extrabold mb-1">
                        Dashboard Global de Consultas
                    </h1>
                    <p className="text-lg font-light opacity-90">
                        Total de {appointments.length} consultas registadas no sistema.
                    </p>
                </Card>

                {/* Tabela de Consultas */}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clínica</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((apt) => (
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.doctorName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.clinicName}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">{apt.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {renderStatusBadge(apt.statusDetails)}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-lg">
                                        Nenhuma consulta encontrada no sistema.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}