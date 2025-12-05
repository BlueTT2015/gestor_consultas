// src/pages/ClinicDoctors.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Award,
    Shield,
    Star,
    Mail,
    Stethoscope,
    Building,
    MapPin,
    Phone,
    Navigation,
    Calendar,
    DollarSign
} from 'lucide-react';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";

export default function ClinicDoctors() {
    const { clinicId } = useParams();
    const navigate = useNavigate();
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [doctorClinics, setDoctorClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Paleta de cores do Coolors (mantendo a mesma das outras páginas)
    const colors = {
        primary: '#54CC90',
        secondary: '#2514BE',
        accent1: '#5256CB',
        accent2: '#BCB5F7',
        accent3: '#F2721C',
        background: '#F3F7F2',
        white: '#FFFFFF'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Buscar dados da clínica
                const clinicsRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/clinics");
                if (!clinicsRes.ok) throw new Error("Falha ao carregar clínicas");
                const clinicsData = await clinicsRes.json();

                const foundClinic = clinicsData.find(c => c.clinic_id === parseInt(clinicId));
                if (!foundClinic) {
                    throw new Error("Clínica não encontrada");
                }
                setClinic(foundClinic);

                // Buscar associações médicos-clínicas
                const doctorClinicsRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/doctors-clinics");
                if (!doctorClinicsRes.ok) throw new Error("Falha ao carregar associações médicos-clínicas");
                const doctorClinicsData = await doctorClinicsRes.json();

                // Filtrar apenas os médicos desta clínica
                const clinicAssociations = doctorClinicsData.filter(dc => dc.clinic_id === parseInt(clinicId));
                setDoctorClinics(clinicAssociations);

                // Buscar todos os médicos
                const doctorsRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/doctors");
                if (!doctorsRes.ok) throw new Error("Falha ao carregar médicos");
                const doctorsData = await doctorsRes.json();

                // Buscar dados dos usuários
                const usersRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/users");
                if (!usersRes.ok) throw new Error("Falha ao carregar usuários");
                const usersData = await usersRes.json();

                // Criar mapa de usuários
                const userMap = {};
                usersData.forEach(user => {
                    userMap[user.user_id] = user;
                });

                // Combinar dados
                const combinedDoctors = clinicAssociations.map(association => {
                    const doctor = doctorsData.find(d => d.doctor_id === association.doctor_id);
                    const user = doctor ? userMap[doctor.user_id] : null;
                    const isDoctor = user && user.role === "doctor";

                    return {
                        ...doctor,
                        association_data: association,
                        user_data: user,
                        full_name: isDoctor
                            ? `${user.first_name} ${user.last_name}`
                            : `Médico #${association.doctor_id}`,
                        email: isDoctor ? user.email : ''
                    };
                }).filter(doctor => doctor !== null);

                // FILTRO: Filtrar para mostrar APENAS os doutores que estão ativos no sistema
                const activeSystemDoctors = combinedDoctors.filter(doctor => {
                    // Checa a atividade geral (lida com inconsistência string/boolean)
                    const isGeneralActive = doctor.is_active === true || String(doctor.is_active).toLowerCase() === 'true';

                    // O médico deve estar ativo no sistema para aparecer
                    return isGeneralActive;
                });

                setDoctors(activeSystemDoctors);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoading(false);
            }
        };

        if (clinicId) {
            fetchData();
        }
    }, [clinicId]);

    const getAvatarColor = (id) => {
        const gradients = [
            `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
            `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)`,
            `linear-gradient(135deg, ${colors.accent1} 0%, ${colors.accent2} 100%)`,
            `linear-gradient(135deg, ${colors.accent3} 0%, #FF9A3D 100%)`,
        ];
        return gradients[id % gradients.length];
    };

    const getInitials = (doctor) => {
        if (!doctor.user_data) return 'MD';
        const name = doctor.full_name;
        if (name.startsWith('Médico #')) return 'MD';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleDoctorClick = (doctor) => {
        console.log('Médico clicado:', doctor);
        // Navega para o novo perfil
        navigate(`/doctors/${doctor.doctor_id}`);
    };

    const openGoogleMaps = () => {
        if (clinic?.latitude && clinic?.longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}&query_place_id=${encodeURIComponent(clinic.name)}`;
            window.open(url, '_blank');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Presente';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT');
    };

    if (loading) return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-10 rounded mb-8" style={{ backgroundColor: colors.accent2, width: '300px' }}></div>
                    <div className="h-40 rounded mb-8" style={{ backgroundColor: colors.white }}></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl shadow-lg p-6 h-72" style={{ backgroundColor: colors.white }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <Card variant="error" className="max-w-md mx-auto my-10">
            <CardBody>
                <h2 className="text-xl font-bold mb-2">Erro ao carregar</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/clinics')}
                    className="mt-4 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary, color: colors.white }}
                >
                    Voltar para Clínicas
                </button>
            </CardBody>
        </Card>
    );

    if (!clinic) return (
        <Card variant="warning" className="max-w-md mx-auto my-10">
            <CardBody>
                <h2 className="text-xl font-bold mb-2">Clínica não encontrada</h2>
                <p>A clínica solicitada não existe ou foi removida.</p>
                <button
                    onClick={() => navigate('/clinics')}
                    className="mt-4 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary, color: colors.white }}
                >
                    Voltar para Clínicas
                </button>
            </CardBody>
        </Card>
    );

    const activeInClinicCount = doctors.filter(d =>
        d.association_data && (d.association_data.is_active === true || d.association_data.is_active !== false)
    ).length;

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto p-4 md:p-6">

                {/* Botão Voltar */}
                <button
                    onClick={() => navigate('/clinics')}
                    className="mb-6 flex items-center gap-2 text-sm font-medium"
                    style={{ color: colors.secondary }}
                >
                    ← Voltar para todas as clínicas
                </button>

                {/* Cabeçalho da Clínica */}
                <Card variant="light" className="mb-10">
                    <CardBody spacing="large">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.secondary }}>
                                    {clinic.name}
                                </h1>
                                <div className="flex items-center gap-2 text-lg" style={{ color: colors.accent1 }}>
                                    <Building size={20} />
                                    <span>{clinic.city}</span>
                                    <span className="mx-2">•</span>
                                    <MapPin size={20} />
                                    <span>{clinic.district}</span>
                                </div>
                            </div>

                            <button
                                onClick={openGoogleMaps}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                                style={{
                                    backgroundColor: colors.primary,
                                    color: colors.white
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45b87d'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                            >
                                <Navigation size={16} />
                                Ver no mapa
                            </button>
                        </div>

                        {/* Informações de Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <Phone size={18} className="text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Telefone</p>
                                    <p className="text-gray-800">{clinic.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <Mail size={18} className="text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Email</p>
                                    <p className="text-gray-800 truncate">{clinic.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-2">Endereço</p>
                            <p className="text-gray-800">{clinic.address}</p>
                            <p className="text-gray-800">{clinic.postal_code} {clinic.city}</p>
                        </div>
                    </CardBody>
                </Card>

                {/* Título dos Médicos */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: colors.secondary }}>
                        Médicos desta Clínica
                    </h2>
                    <p className="text-gray-600">
                        {doctors.length} médico(s) ativo(s) no sistema associado(s) a esta clínica.
                    </p>
                </div>

                {/* Grid de Médicos */}
                {doctors.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {doctors.map((doctor) => (
                                <Card
                                    key={doctor.doctor_id}
                                    hoverable
                                    onClick={() => handleDoctorClick(doctor)}
                                    className="overflow-hidden"
                                >
                                    {/* Cabeçalho do card com gradiente */}
                                    <div
                                        className="h-32 relative -mx-6 -mt-6 mb-6"
                                        style={{ background: getAvatarColor(doctor.doctor_id) }}
                                    >
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute bottom-4 left-6 flex items-center gap-3">
                                            <div
                                                className="rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    backdropFilter: 'blur(10px)'
                                                }}
                                            >
                                                {getInitials(doctor)}
                                            </div>
                                            <div className="text-white">
                                                <h3 className="font-bold text-lg">Dr. {doctor.full_name}</h3>
                                                <div className="flex items-center gap-2 text-sm opacity-90">
                                                    <Stethoscope size={14} />
                                                    <span>{doctor.specialty || "Especialista"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <CardBody spacing="medium">
                                        {/* Bio */}
                                        <p className="text-gray-600 line-clamp-3 text-sm">
                                            {doctor.bio || "Médico dedicado ao cuidado integral dos pacientes."}
                                        </p>

                                        {/* Email se disponível */}
                                        {doctor.email && (
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                                                <Mail size={16} className="text-gray-500" />
                                                <span className="text-sm text-gray-600">{doctor.email}</span>
                                            </div>
                                        )}

                                        {/* Informações específicas desta clínica (Taxa de Consulta) */}
                                        {doctor.association_data && (
                                            <div className="p-3 rounded-lg border border-gray-200">
                                                {/* Estrutura ajustada para ter apenas a Taxa de Consulta */}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <DollarSign size={14} className="text-green-500" />
                                                        <span className="text-xs font-medium text-gray-600">Taxa de Consulta</span>
                                                    </div>
                                                    <p className="text-sm font-bold" style={{ color: colors.primary }}>
                                                        €{doctor.association_data.consultation_fee}
                                                    </p>
                                                </div>

                                                {/* Médico Principal Tag */}
                                                {doctor.association_data.is_primary && (
                                                    <div className="mt-2">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Médico Principal
                            </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Informações gerais (Experiência) */}
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Removida Licença */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Award size={16} className="text-green-500" />
                                                    <span className="text-sm font-medium text-gray-700">Experiência</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {doctor.years_experience || 0} anos
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status na Clínica */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                            {(() => {
                                                const isClinicActive = doctor.association_data && (doctor.association_data.is_active === true || doctor.association_data.is_active !== false);

                                                const statusText = isClinicActive ? 'Ativo na Clínica' : 'Inativo na Clínica';
                                                const statusColor = isClinicActive ? 'text-green-600' : 'text-yellow-600';
                                                const iconColor = isClinicActive ? 'text-green-500' : 'text-yellow-500';

                                                return (
                                                    <div className="flex items-center gap-2">
                                                        <Star size={16} className={iconColor} />
                                                        <span className={`text-sm font-medium ${statusColor}`}>
                                                            {statusText}
                                                        </span>
                                                    </div>
                                                );
                                            })()}

                                            {!doctor.user_data && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                                    Perfil incompleto
                                                </span>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>

                        {/* Estatísticas */}
                        <div className="mt-12">
                            <Card
                                variant="secondary"
                                className="text-white"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)`
                                }}
                            >
                                <CardBody>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold mb-2">{doctors.length}</div>
                                            <p className="opacity-90">Médicos Associados (Ativos no Sistema)</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-4xl font-bold mb-2">
                                                {doctors.filter(d => d.association_data?.is_primary).length}
                                            </div>
                                            <p className="opacity-90">Médicos Principais</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-4xl font-bold mb-2">
                                                {activeInClinicCount}
                                            </div>
                                            <p className="opacity-90">Ativos na Clínica</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </>
                ) : (
                    <Card variant="info" className="max-w-2xl mx-auto">
                        <CardBody className="text-center">
                            <Stethoscope size={48} className="mx-auto mb-4" style={{ color: colors.accent1 }} />
                            <h2 className="text-xl font-bold mb-2">Nenhum médico ativo encontrado</h2>
                            <p className="text-gray-600">
                                Esta clínica não possui médicos ativos no sistema associados no momento.
                            </p>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
}