// src/pages/DoctorProfile.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Award, Shield, Mail, Stethoscope, User, Calendar, Phone, CheckCircle } from 'lucide-react';
import Card from "../components/Card";
import CardBody from "../components/CardBody";

export default function DoctorProfile() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctorData, setDoctorData] = useState(null);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch all doctors
                const doctorsRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/doctors");
                if (!doctorsRes.ok) throw new Error("Falha ao carregar lista de médicos");
                const doctorsList = await doctorsRes.json();
                const doctor = doctorsList.find(d => String(d.doctor_id) === doctorId);

                if (!doctor) {
                    throw new Error("Médico não encontrado");
                }

                // Check if doctor is active in the system (only active doctors should have a public profile)
                const isGeneralActive = doctor.is_active === true || String(doctor.is_active).toLowerCase() === 'true';
                if (!isGeneralActive) {
                    throw new Error("Este médico está inativo no sistema e não pode ser visualizado.");
                }

                // 2. Fetch all users
                const usersRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/users");
                if (!usersRes.ok) throw new Error("Falha ao carregar usuários");
                const usersData = await usersRes.json();
                const user = usersData.find(u => u.user_id === doctor.user_id && u.role === "doctor");

                // 3. Fetch Specialties data (Mocked as per assumption)
                // É necessário ter os nomes, visto que a API doctors-specialties só retorna o ID.
                const mockSpecialties = [
                    { specialty_id: 1, name: "Cardiologia" },
                    { specialty_id: 2, name: "Dermatologia" },
                    { specialty_id: 3, name: "Pediatria" },
                    { specialty_id: 4, name: "Oftalmologia" },
                    { specialty_id: 5, name: "Neurologia" },
                ];
                const specialtiesMap = new Map(mockSpecialties.map(s => [s.specialty_id, s.name]));

                // 4. Fetch Doctors-Specialties data
                const docSpecialtiesRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/doctors-specialties");
                if (!docSpecialtiesRes.ok) throw new Error("Falha ao carregar especialidades dos médicos");
                const docSpecialtiesData = await docSpecialtiesRes.json();

                const doctorSpecialties = docSpecialtiesData
                    .filter(ds => String(ds.doctor_id) === doctorId)
                    .map(ds => ({
                        ...ds,
                        specialty_name: specialtiesMap.get(ds.specialty_id) || 'Especialista Desconhecida',
                    }));

                // Encontra a especialidade primária ou a primeira para usar como display principal
                const primarySpecialty = doctorSpecialties.find(s => s.is_primary) || doctorSpecialties[0];
                const specialtyDisplay = primarySpecialty ? primarySpecialty.specialty_name : (doctor.specialty || "Especialista");
                const yearsExperience = primarySpecialty ? primarySpecialty.years_experience : (doctor.years_experience || 0);
                const certifications = primarySpecialty ? primarySpecialty.certifications : null;

                // Construção final dos dados
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
                    specialties: doctorSpecialties, // Lista completa de especialidades
                    primary_specialty_name: specialtyDisplay, // Apenas o nome para o cabeçalho
                    years_experience: yearsExperience, // Usa anos de experiência da especialidade primária se disponível
                    certifications: certifications, // Usa certificações da especialidade primária se disponível
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

    // ... (funções getAvatarColor, getInitials, handleBookAppointment)
    const getAvatarColor = (id) => {
        const gradients = [
            `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
            `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)`,
            `linear-gradient(135deg, ${colors.accent1} 0%, ${colors.accent2} 100%)`,
            `linear-gradient(135deg, ${colors.accent3} 0%, #FF9A3D 100%)`,
        ];
        // Use modulus to cycle colors safely
        return gradients[id % gradients.length];
    };

    const getInitials = (doctor) => {
        if (!doctor?.user_data) return 'MD';
        const name = doctor.full_name;
        if (name.startsWith('Médico #')) return 'MD';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // NOVA FUNÇÃO: Lida com a navegação para marcar consulta
    const handleBookAppointment = () => {
        navigate('/consulta', { state: { doctorId: doctorId } });
    };

    if (loading) return (
        <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
            <Card variant="light" className="max-w-4xl mx-auto h-96">
                <div className="animate-pulse">
                    <div className="h-10 rounded mb-4 w-3/4 bg-gray-200 mx-auto"></div>
                    <div className="h-4 rounded mb-2 w-1/2 bg-gray-200 mx-auto"></div>
                    <div className="space-y-4 mt-8">
                        <div className="h-4 rounded w-full bg-gray-100"></div>
                        <div className="h-4 rounded w-11/12 bg-gray-100"></div>
                        <div className="h-4 rounded w-full bg-gray-100"></div>
                        <div className="h-4 rounded w-2/3 bg-gray-100"></div>
                    </div>
                </div>
            </Card>
        </div>
    );

    if (error) return (
        <Card variant="error" className="max-w-md mx-auto my-10">
            <CardBody>
                <h2 className="text-xl font-bold mb-2">Erro</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/doctors')}
                    className="mt-4 px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: colors.primary }}
                >
                    Voltar para Médicos
                </button>
            </CardBody>
        </Card>
    );

    const doctor = doctorData;
    // Pega o primarySpecialty das propriedades combinadas
    // const primarySpecialty = doctor.specialties?.find(s => s.is_primary) || doctor.specialties?.[0]; // Já está no estado

    const hasCompleteProfile = !!doctor.user_data;

    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-4xl mx-auto px-4">
                {/* Botão Voltar */}
                <button
                    onClick={() => navigate('/doctors')}
                    className="mb-6 flex items-center gap-2 text-sm font-medium"
                    style={{ color: colors.secondary }}
                >
                    ← Voltar para todos os médicos
                </button>

                <Card variant="light" className="overflow-hidden p-0">
                    {/* Cabeçalho do Perfil com Gradiente */}
                    <div
                        className="h-40 relative flex items-center justify-center p-6"
                        style={{ background: getAvatarColor(doctor.doctor_id) }}
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
                                {getInitials(doctor)}
                            </div>
                            <h1 className="text-4xl font-extrabold mt-3 text-white text-shadow-md">
                                Dr. {doctor.full_name}
                            </h1>
                            {/* ATUALIZADO: Mostrar Especialidade Principal */}
                            <span className="text-sm text-white opacity-80 mt-1">
                                <Stethoscope size={14} className="inline mr-1" />
                                {doctor.primary_specialty_name || "Especialista"}
                            </span>
                        </div>
                    </div>

                    <CardBody padding="large" spacing="large">
                        {/* Seção Principal de Informações */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Especialidade e Bio */}
                            <div>
                                <h2 className="text-2xl font-bold mb-3" style={{ color: colors.secondary }}>
                                    Sobre o Médico
                                </h2>
                                <p className="text-gray-700 mb-6 border-l-4 pl-4 italic" style={{borderColor: colors.primary}}>
                                    {doctor.bio || "Médico dedicado ao cuidado integral dos pacientes."}
                                </p>

                                {/* Lista de Especialidades */}
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


                                {/* Botão Marcar Consulta ATUALIZADO */}
                                <button
                                    onClick={handleBookAppointment} // Chama a nova função
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

                            {/* Detalhes Técnicos e Contacto */}
                            <div className="space-y-4 p-4 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2" style={{ color: colors.accent1, borderColor: colors.accent2}}>
                                    Detalhes Profissionais
                                </h3>

                                {/* Experiência ATUALIZADO: Usa os anos de experiência combinados/prioritários */}
                                <div className="flex items-center gap-4 p-2">
                                    <Award size={20} className="text-green-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Anos de Experiência (Principal)</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {doctor.years_experience} anos
                                        </p>
                                    </div>
                                </div>

                                {/* Licença */}
                                <div className="flex items-center gap-4 p-2">
                                    <Shield size={20} className="text-blue-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Número de Licença</p>
                                        <p className="text-base font-mono text-gray-800">
                                            {doctor.license_number || "Não informada"}
                                        </p>
                                    </div>
                                </div>

                                {/* Certificações (da especialidade primária) */}
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

                                {/* Email */}
                                <div className="flex items-center gap-4 p-2">
                                    <Mail size={20} className="text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Email</p>
                                        <p className="text-base text-gray-800 break-words">{doctor.email}</p>
                                    </div>
                                </div>

                                {/* Telefone */}
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
            </div>
        </div>
    );
}