// src/pages/DashboardClinicStaff.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import StatusBadge from "../components/Common/StatusBadge";
import PageWrapper from "../components/PageWrapper";
import { Users, Building, Stethoscope, User } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE } from "../utils/constants";
import { SimpleLoadingState, ErrorMessage } from "../components/Common/LoadingState";
import { formatStatusUser, formatDateDisplay } from "../utils/helpers";

export default function DashboardClinicStaff() {
    const { managerId } = useParams();
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
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

        const fetchClinicStaff = async () => {
            try {
                setLoading(true);

                const [
                    managersRes,
                    clinicsRes,
                    doctorsClinicsRes,
                    doctorsRes,
                    assistantsRes,
                    usersRes,
                ] = await Promise.all([
                    fetch(`${API_BASE}/clinic-managers`),
                    fetch(`${API_BASE}/clinics`),
                    fetch(`${API_BASE}/doctors-clinics`),
                    fetch(`${API_BASE}/doctors`),
                    fetch(`${API_BASE}/assistants`),
                    fetch(`${API_BASE}/users`),
                ]);

                if (!managersRes.ok || !clinicsRes.ok || !doctorsClinicsRes.ok || !doctorsRes.ok || !assistantsRes.ok || !usersRes.ok) {
                    throw new Error("Falha ao carregar dados essenciais para o dashboard.");
                }

                const [
                    managersData,
                    clinicsData,
                    doctorsClinicsData,
                    doctorsData,
                    assistantsData,
                    usersData,
                ] = await Promise.all([
                    managersRes.json(),
                    clinicsRes.json(),
                    doctorsClinicsRes.json(),
                    doctorsRes.json(),
                    assistantsRes.json(),
                    usersRes.json(),
                ]);

                const manager = managersData.find(m => m.manager_id === numericManagerId);
                if (!manager) {
                    throw new Error(`Gerente com ID ${managerId} não encontrado.`);
                }
                const clinicId = manager.clinic_id;

                const clinic = clinicsData.find(c => c.clinic_id === clinicId);
                setClinicInfo(clinic || { name: `Clínica #${clinicId}` });

                const userMap = new Map(usersData.map(u => [u.user_id, u]));
                const doctorMap = new Map(doctorsData.map(d => [d.doctor_id, d]));

                const clinicStaff = [];

                const clinicDoctorsAssociations = doctorsClinicsData.filter(dc => dc.clinic_id === clinicId);
                clinicDoctorsAssociations.forEach(assoc => {
                    const doctor = doctorMap.get(assoc.doctor_id);
                    if (doctor) {
                        const user = userMap.get(doctor.user_id);
                        if (user) {
                            clinicStaff.push({
                                ...user,
                                role: 'Doctor',
                                roleDisplay: 'Médico',
                                // Status combinado: ativo no sistema de usuário E ativo na associação da clínica
                                is_active: user.is_active && assoc.is_active,
                                hire_date: assoc.start_date,
                            });
                        }
                    }
                });

                const clinicAssistants = assistantsData.filter(a => a.clinic_id === clinicId);
                clinicAssistants.forEach(assistant => {
                    const user = userMap.get(assistant.user_id);
                    if (user) {
                        clinicStaff.push({
                            ...user,
                            role: 'Assistant',
                            roleDisplay: 'Assistente',
                            // Status combinado: ativo no sistema de usuário E ativo como assistente
                            is_active: user.is_active && assistant.is_active,
                            hire_date: assistant.hire_date,
                        });
                    }
                });

                const formattedStaff = clinicStaff.map(member => ({
                    ...member,
                    fullName: `${member.first_name} ${member.last_name}`,
                    createdAtDisplay: formatDateDisplay(member.created_at.split('T')[0], member.created_at),
                    hireDateDisplay: formatDateDisplay(member.hire_date),
                    statusDetails: formatStatusUser(member.is_active),
                }));

                formattedStaff.sort((a, b) => {
                    if (a.roleDisplay < b.roleDisplay) return -1;
                    if (a.roleDisplay > b.roleDisplay) return 1;
                    if (a.fullName < b.fullName) return -1;
                    if (a.fullName > b.fullName) return 1;
                    return 0;
                });

                setStaff(formattedStaff);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao carregar dados do Dashboard de Staff:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchClinicStaff();
    }, [numericManagerId]);

    if (loading) return <SimpleLoadingState />;

    if (error) return <ErrorMessage message={error} onBack={() => navigate(-1)} />;

    return (
        <PageWrapper maxWidth="max-w-7xl">
            <Card variant="secondary" className="text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)` }}>
                <Users size={36} className="mx-auto mb-2 text-white" />
                <h1 className="text-3xl font-extrabold mb-1">
                    Dashboard de Staff da Clínica
                </h1>
                <p className="text-lg font-light opacity-90">
                    <Building size={20} className="inline mr-2" />
                    {clinicInfo?.name || "Clínica Desconhecida"}
                </p>
                <p className="text-sm font-light opacity-80 mt-2">
                    Total de {staff.length} staff (Médicos e Assistentes) associados.
                </p>
            </Card>

            <Card variant="light" className="p-0 overflow-hidden">
                <CardHeader spacing="none" className="p-6">
                    <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                        Registo Detalhado de Staff
                    </h2>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Completo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status (Geral/Clínica)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Início</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {staff.map((member) => (
                            <tr key={member.user_id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.accent1 }}>
                                    {member.user_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span className="flex items-center gap-2" style={{ color: member.role === 'Doctor' ? colors.primary : colors.accent3 }}>
                                        {member.role === 'Doctor' ? <Stethoscope size={16} /> : <User size={16} />}
                                        {member.roleDisplay}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{member.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.phone || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={member.is_active} type="user" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.hireDateDisplay}</td>
                            </tr>
                        ))}
                        {staff.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Nenhum staff (médicos/assistentes) encontrado para esta clínica.
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