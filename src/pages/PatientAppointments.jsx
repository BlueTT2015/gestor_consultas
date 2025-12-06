// src/pages/PatientAppointments.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import StatusBadge from "../components/Common/StatusBadge";
import PageWrapper from "../components/PageWrapper";
import { Calendar, Stethoscope, Clock, FileText } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE } from "../utils/constants";
import { SimpleLoadingState, ErrorMessage } from "../components/Common/LoadingState";
import { formatDateDisplay } from "../utils/helpers";

export default function PatientAppointments() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [patientInfo, setPatientInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const numericPatientId = parseInt(patientId);

    useEffect(() => {
        if (isNaN(numericPatientId)) {
            setError("ID de paciente inválido.");
            setLoading(false);
            return;
        }

        const fetchAllData = async () => {
            try {
                setLoading(true);

                const [
                    appointmentsRes,
                    clinicsRes,
                    doctorsRes,
                    usersRes,
                    patientsRes,
                ] = await Promise.all([
                    fetch(`${API_BASE}/appointments`),
                    fetch(`${API_BASE}/clinics`),
                    fetch(`${API_BASE}/doctors`),
                    fetch(`${API_BASE}/users`),
                    fetch(`${API_BASE}/patients`),
                ]);

                if (!appointmentsRes.ok) throw new Error("Falha ao carregar consultas");
                if (!clinicsRes.ok) throw new Error("Falha ao carregar clínicas");
                if (!doctorsRes.ok) throw new Error("Falha ao carregar médicos");
                if (!usersRes.ok) throw new Error("Falha ao carregar usuários");
                if (!patientsRes.ok) throw new Error("Falha ao carregar pacientes");

                const appointmentsData = await appointmentsRes.json();
                const clinicsData = await clinicsRes.json();
                const doctorsData = await doctorsRes.json();
                const usersData = await usersRes.json();
                const patientsData = await patientsRes.json();

                const clinicMap = new Map(clinicsData.map(c => [c.clinic_id, c.name]));
                const userMap = new Map(usersData.map(u => [u.user_id, {
                    name: `${u.first_name} ${u.last_name}`,
                    role: u.role
                }]));
                const doctorUserIds = new Map(doctorsData.map(d => [d.doctor_id, d.user_id]));

                const currentPatientData = patientsData.find(p => p.patient_id === numericPatientId);
                const patientUser = currentPatientData ? userMap.get(currentPatientData.user_id) : null;
                const patientName = patientUser?.name || `Paciente #${numericPatientId}`;
                setPatientInfo({ name: patientName, id: numericPatientId });

                const filteredAppointments = appointmentsData
                    .filter(apt => apt.patient_id === numericPatientId)
                    .map(apt => {
                        const clinicName = clinicMap.get(apt.clinic_id) || 'Clínica Desconhecida';
                        const doctorUserId = doctorUserIds.get(apt.doctor_id);
                        const doctorDetails = doctorUserId ? userMap.get(doctorUserId) : null;
                        const doctorName = doctorDetails?.name ? `Dr. ${doctorDetails.name}` : `Médico #${apt.doctor_id}`;

                        return {
                            ...apt,
                            clinicName,
                            doctorName,
                            formattedDateTime: formatDateDisplay(apt.date, apt.time),
                        };
                    });

                // Ordenar por data mais recente primeiro
                filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

                setAppointments(filteredAppointments);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao carregar dados do Histórico:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [numericPatientId]);

    if (loading) return <SimpleLoadingState />;

    if (error) return <ErrorMessage message={error} onBack={() => navigate(-1)} />;

    const completedAppointments = appointments.filter(a => a.status?.toLowerCase() === 'completed');

    return (
        <PageWrapper maxWidth="max-w-7xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.secondary }}
            >
                ← Voltar ao Perfil do Paciente
            </button>

            <Card variant="secondary" className="text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)` }}>
                <FileText size={36} className="mx-auto mb-2 text-white" />
                <h1 className="text-3xl font-extrabold mb-1">
                    Histórico de Consultas
                </h1>
                <p className="text-lg font-light opacity-90">
                    {patientInfo ? `Paciente: ${patientInfo.name}` : 'A carregar nome...'}
                </p>
                <p className="text-sm font-light opacity-80 mt-2">
                    Total de {appointments.length} consultas registadas. ({completedAppointments.length} concluídas)
                </p>
            </Card>

            <Card variant="light" className="p-0 overflow-hidden">
                <CardHeader spacing="none" className="p-6">
                    <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                        Detalhes das Consultas
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.doctorName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.clinicName}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">{apt.reason}</td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">{apt.diagnosis || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Nenhuma consulta encontrada para este paciente.
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