import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Award, Shield, Mail, Calendar, Phone, CheckCircle } from 'lucide-react';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import { colors } from "../config/colors";
import { API_BASE } from "../utils/constants";
import { getAvatarColor, getInitials } from "../utils/helpers";
import { DetailedLoadingState, ErrorMessage } from "../components/common/LoadingState";
import PageWrapper from "../components/PageWrapper";

export default function DoctorProfile() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctorData, setDoctorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorsRes = await fetch(`${API_BASE}/doctors`, {
                    method: "GET",
                    headers: {
                        client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                        client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                    }
                });
                if (!doctorsRes.ok) throw new Error("Falha ao carregar lista de médicos");
                const doctorsList = await doctorsRes.json();
                const doctor = doctorsList.find(d => String(d.doctor_id) === doctorId);

                if (!doctor) {
                    throw new Error("Médico não encontrado");
                }

                const isGeneralActive = doctor.is_active === true || String(doctor.is_active).toLowerCase() === 'true';
                if (!isGeneralActive) {
                    throw new Error("Este médico está inativo no sistema e não pode ser visualizado.");
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
                const user = usersData.find(u => u.user_id === doctor.user_id && u.role === "doctor");

                const mockSpecialties = [
                    { specialty_id: 1, name: "Cardiologia" },
                    { specialty_id: 2, name: "Dermatologia" },
                    { specialty_id: 3, name: "Pediatria" },
                    { specialty_id: 4, name: "Oftalmologia" },
                    { specialty_id: 5, name: "Neurologia" },
                ];
                const specialtiesMap = new Map(mockSpecialties.map(s => [s.specialty_id, s.name]));

                const docSpecialtiesRes = await fetch(`${API_BASE}/doctors-specialties`, {
                    method: "GET",
                    headers: {
                        client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                        client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                    }
                });
                if (!docSpecialtiesRes.ok) throw new Error("Falha ao carregar especialidades dos médicos");
                const docSpecialtiesData = await docSpecialtiesRes.json();

                const doctorSpecialties = docSpecialtiesData
                    .filter(ds => String(ds.doctor_id) === doctorId)
                    .map(ds => ({
                        ...ds,
                        specialty_name: specialtiesMap.get(ds.specialty_id) || 'Especialista Desconhecida',
                    }));

                const primarySpecialty = doctorSpecialties.find(s => s.is_primary) || doctorSpecialties[0];
                const specialtyDisplay = primarySpecialty ? primarySpecialty.specialty_name : (doctor.specialty || "Especialista");
                const yearsExperience = primarySpecialty ? primarySpecialty.years_experience : (doctor.years_experience || 0);
                const certifications = primarySpecialty ? primarySpecialty.certifications : null;

                const full_name = user
                    ? `${user.first_name} ${user.last_name}`
                    : `Médico #${doctor.doctor_id}`;

                setDoctorData({
                    ...doctor,
                    user_data: user,
                    full_name: full_name,
                    email: user ? user.email : 'Não disponível',
                    phone: user ? user.phone : 'Não disponível',
                    birth_date: user ? user.birth_date : null,
                    specialties: doctorSpecialties,
                    primary_specialty_name: specialtyDisplay,
                    years_experience: yearsExperience,
                    certifications: certifications,
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (doctorId) {
            fetchData();
        }
    }, [doctorId]);

    const handleBookAppointment = () => {
        navigate('/appointment', { state: { doctorId: doctorId } });
    };

    if (loading) return <DetailedLoadingState message="A carregar perfil do médico..." />;

    if (error) return <ErrorMessage message={error} onBack={() => navigate('/doctors')} backLabel="Voltar para Médicos" />;

    const doctor = doctorData;
    const initials = getInitials(doctor.full_name);
    const avatarBackground = getAvatarColor(doctor.doctor_id);

    return (
        <PageWrapper maxWidth="max-w-4xl" className="space-y-0">
            <button
                onClick={() => navigate('/doctors')}
                className="mb-6 flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.secondary }}
            >
                ← Voltar para todos os médicos
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
                            Dr. {doctor.full_name}
                        </h1>
                    </div>
                </div>

                <CardBody padding="large" spacing="large">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-3" style={{ color: colors.secondary }}>
                                Sobre o Médico
                            </h2>
                            <p className="text-gray-700 mb-6 border-l-4 pl-4 italic" style={{borderColor: colors.primary}}>
                                {doctor.bio || "Médico dedicado ao cuidado integral dos pacientes."}
                            </p>

                            {doctor.specialties && doctor.specialties.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3 border-b pb-2" style={{ color: colors.accent1, borderColor: colors.accent2}}>
                                        Especialidades
                                    </h3>
                                    <ul className="space-y-2">
                                        {doctor.specialties.map((s, index) => (
                                            <li key={index} className="flex items-center gap-2 text-gray-700">
                                                <CheckCircle size={16} className={s.is_primary ? "text-green-500" : "text-gray-400"} />
                                                <span className={`text-base ${s.is_primary ? 'font-semibold' : 'font-normal'}`}>
                                                    {s.specialty_name} {s.is_primary ? "(Principal)" : ''}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                onClick={handleBookAppointment}
                                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                                style={{
                                    backgroundColor: colors.primary,
                                    color: colors.white,
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45b87d'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                            >
                                <Calendar size={20} />
                                Marcar Consulta
                            </button>
                        </div>

                        <div className="space-y-4 p-4 rounded-xl border border-gray-100">
                            <h3 className="text-xl font-semibold mb-3 border-b pb-2" style={{ color: colors.accent1, borderColor: colors.accent2}}>
                                Detalhes Profissionais
                            </h3>

                            <div className="flex items-center gap-4 p-2">
                                <Award size={20} className="text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Anos de Experiência (Principal)</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {doctor.years_experience} anos
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-2">
                                <Shield size={20} className="text-blue-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Número de Licença</p>
                                    <p className="text-base font-mono text-gray-800">
                                        {doctor.license_number || "Não informada"}
                                    </p>
                                </div>
                            </div>

                            {doctor.certifications && (
                                <div className="flex items-start gap-4 p-2 border-t pt-4">
                                    <Shield size={20} className="text-yellow-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Certificações (Primária)</p>
                                        <p className="text-base text-gray-800">
                                            {doctor.certifications}
                                        </p>
                                    </div>
                                </div>
                            )}


                            <h3 className="text-xl font-semibold mb-3 border-b pt-4 pb-2" style={{ color: colors.accent1, borderColor: colors.accent2}}>
                                Contactos
                            </h3>

                            <div className="flex items-center gap-4 p-2">
                                <Mail size={20} className="text-gray-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Email</p>
                                    <p className="text-base text-gray-800 break-words">{doctor.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-2">
                                <Phone size={20} className="text-gray-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Telefone</p>
                                    <p className="text-base text-gray-800">{doctor.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </PageWrapper>
    );
}