// src/pages/Doctors.jsx

import { useEffect, useState } from "react";
import { Award, Star, Mail, Stethoscope, User } from 'lucide-react';
import Card from "../components/Card";
import CardBody from "../components/CardBody";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Paleta de cores do Coolors
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
                const doctorsRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/doctors");
                if (!doctorsRes.ok) throw new Error("Falha ao carregar médicos");
                const doctorsData = await doctorsRes.json();

                const usersRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/users");
                if (!usersRes.ok) throw new Error("Falha ao carregar usuários");
                const usersData = await usersRes.json();

                const userMap = {};
                usersData.forEach(user => {
                    userMap[user.user_id] = user;
                });

                const combinedDoctors = doctorsData.map(doctor => {
                    const user = userMap[doctor.user_id];
                    const isDoctor = user && user.role === "doctor";

                    return {
                        ...doctor,
                        user_data: isDoctor ? user : null,
                        full_name: isDoctor
                            ? `${user.first_name} ${user.last_name}`
                            : `Médico #${doctor.doctor_id}`,
                        email: isDoctor ? user.email : ''
                    };
                });

                setDoctors(combinedDoctors);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        // navigate(`/doctor/${doctor.doctor_id}`);
    };

    if (loading) return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-10 rounded mb-8" style={{ backgroundColor: colors.accent2, width: '280px' }}></div>
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
            </CardBody>
        </Card>
    );

    const doctorsWithCompleteProfile = doctors.filter(d => d.user_data).length;

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto p-4 md:p-6">

                {/* Cabeçalho usando Card */}
                <Card variant="light" className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: colors.secondary }}>
                        Nossos Médicos Especialistas
                    </h1>
                    <p className="text-lg" style={{ color: colors.accent1 }}>
                        Profissionais qualificados dedicados ao seu bem-estar
                    </p>
                </Card>

                {/* Grid de Cards */}
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

                                {/* Informações */}
                                <div>
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

                                {/* Status */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    {/* CORREÇÃO: Normaliza o valor para garantir que 'false' (string) seja tratado como inativo */}
                                    {(() => {
                                        const isActive = doctor.is_active === true || String(doctor.is_active).toLowerCase() === 'true';
                                        return (
                                            <div className="flex items-center gap-2">
                                                <Star size={16} className={isActive ? "text-green-500" : "text-yellow-500"} />
                                                <span className={`text-sm font-medium ${isActive ? "text-green-600" : "text-yellow-600"}`}>
                                                    {isActive ? 'Ativo' : 'Inativo'}
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
                {doctors.length > 0 && (
                    <div className="mt-12">
                        <Card
                            variant="secondary"
                            className="text-white text-center"
                            style={{
                                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)`
                            }}
                        >
                            <div className="text-4xl font-bold mb-2">{doctors.length}</div>
                            <p className="opacity-90">Médicos Cadastrados</p>
                        </Card>

                        {/* Nota sobre perfis incompletos */}
                        {doctors.length > doctorsWithCompleteProfile && (
                            <Card variant="warning" className="mt-6">
                                <div className="flex items-center gap-3">
                                    <User size={20} />
                                    <p className="text-sm">
                                        {doctors.length - doctorsWithCompleteProfile} médico(s) sem perfil completo no sistema.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}