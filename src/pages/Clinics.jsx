// src/pages/Clinics.jsx

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Building, Navigation, Users } from 'lucide-react';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import {useNavigate} from "react-router-dom";

export default function Clinics() {
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Paleta de cores do Coolors (mantendo a mesma do Doctors.jsx)
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
        const fetchClinics = async () => {
            try {
                const response = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/clinics");
                if (!response.ok) throw new Error("Falha ao carregar clínicas");
                const data = await response.json();
                setClinics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, []);

    const getClinicColor = (id) => {
        const gradients = [
            `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
            `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)`,
            `linear-gradient(135deg, ${colors.accent1} 0%, ${colors.accent2} 100%)`,
            `linear-gradient(135deg, ${colors.accent3} 0%, #FF9A3D 100%)`,
        ];
        return gradients[id % gradients.length];
    };

    const getDistrictColor = (district) => {
        const colorMap = {
            'Lisboa': colors.accent1,
            'Porto': colors.secondary,
            'Setúbal': colors.primary,
            'Aveiro': colors.accent3,
            'Braga': '#7C3AED',
            'Coimbra': '#059669',
            'Faro': '#DC2626',
        };
        return colorMap[district] || colors.accent2;
    };

    const handleClinicClick = (clinic) => {
        console.log('Clínica clicada:', clinic);
        navigate(`/clinic/${clinic.clinic_id}`);
    };

    const openGoogleMaps = (latitude, longitude, name) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`;
        window.open(url, '_blank');
    };

    if (loading) return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-10 rounded mb-8 mx-auto" style={{ backgroundColor: colors.accent2, width: '280px' }}></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl shadow-lg p-6 h-80" style={{ backgroundColor: colors.white }}></div>
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

    const uniqueDistricts = [...new Set(clinics.map(c => c.district))];
    const uniqueCities = [...new Set(clinics.map(c => c.city))];

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto p-4 md:p-6">

                {/* Cabeçalho centralizado */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: colors.secondary }}>
                        Nossas Clínicas
                    </h1>
                    <p className="text-lg" style={{ color: colors.accent1 }}>
                        Encontre a clínica mais próxima de si
                    </p>
                </div>

                {/* Grid de Cards das Clínicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {clinics.map((clinic) => (
                        <Card
                            key={clinic.clinic_id}
                            hoverable
                            onClick={() => handleClinicClick(clinic)}
                            className="overflow-hidden"
                        >
                            {/* Cabeçalho do card com gradiente */}
                            <div
                                className="h-32 relative -mx-6 -mt-6 mb-6"
                                style={{ background: getClinicColor(clinic.clinic_id) }}
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
                                        <Building size={24} />
                                    </div>
                                    <div className="text-white">
                                        <h3 className="font-bold text-lg">{clinic.name}</h3>
                                        <div className="flex items-center gap-2 text-sm opacity-90">
                                            <MapPin size={14} />
                                            <span>{clinic.city}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CardBody spacing="medium">
                                {/* Informações de Contacto */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                                        <Phone size={16} className="text-gray-500" />
                                        <span className="text-sm text-gray-600">{clinic.phone}</span>
                                    </div>

                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                                        <Mail size={16} className="text-gray-500" />
                                        <span className="text-sm text-gray-600 truncate">{clinic.email}</span>
                                    </div>
                                </div>

                                {/* Endereço Completo */}
                                <div className="p-4 rounded-lg border border-gray-100">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={18} className="text-red-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 mb-1">Endereço</p>
                                            <p className="text-sm text-gray-600">{clinic.address}</p>
                                            <p className="text-sm text-gray-600">
                                                {clinic.postal_code} {clinic.city}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Distrito */}
                                    <div className="mt-3">
                                        <span
                                            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: `${getDistrictColor(clinic.district)}20`,
                                                color: getDistrictColor(clinic.district)
                                            }}
                                        >
                                            {clinic.district}
                                        </span>
                                    </div>
                                </div>

                                {/* Botão do Mapa */}
                                <div className="flex justify-center pt-4 border-t">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openGoogleMaps(clinic.latitude, clinic.longitude, clinic.name);
                                        }}
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
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Estatísticas */}
                {clinics.length > 0 && (
                    <div className="mt-12">
                        <Card
                            variant="secondary"
                            className="text-white text-center"
                            style={{
                                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)`
                            }}
                        >
                            <div className="text-4xl font-bold mb-2">{clinics.length}</div>
                            <p className="opacity-90">Clínicas Disponíveis</p>
                        </Card>

                        {/* Estatísticas adicionais */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <Card variant="light" className="text-center">
                                <div className="flex flex-col items-center">
                                    <MapPin size={24} className="mb-2" style={{ color: colors.primary }} />
                                    <div className="text-2xl font-bold mb-1">{uniqueDistricts.length}</div>
                                    <p className="text-sm text-gray-600">Distritos</p>
                                </div>
                            </Card>

                            <Card variant="light" className="text-center">
                                <div className="flex flex-col items-center">
                                    <Building size={24} className="mb-2" style={{ color: colors.accent1 }} />
                                    <div className="text-2xl font-bold mb-1">{uniqueCities.length}</div>
                                    <p className="text-sm text-gray-600">Cidades</p>
                                </div>
                            </Card>

                            <Card variant="light" className="text-center">
                                <div className="flex flex-col items-center">
                                    <Users size={24} className="mb-2" style={{ color: colors.accent3 }} />
                                    <div className="text-2xl font-bold mb-1">Portugal</div>
                                    <p className="text-sm text-gray-600">Cobertura Nacional</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Mensagem quando não há clínicas */}
                {clinics.length === 0 && !loading && (
                    <Card variant="info" className="max-w-2xl mx-auto mt-10">
                        <CardBody className="text-center">
                            <Building size={48} className="mx-auto mb-4" style={{ color: colors.accent1 }} />
                            <h2 className="text-xl font-bold mb-2">Nenhuma clínica encontrada</h2>
                            <p className="text-gray-600">
                                No momento não temos clínicas disponíveis. Tente novamente mais tarde.
                            </p>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
}