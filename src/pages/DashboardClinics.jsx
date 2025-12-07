// src/pages/DashboardClinics.jsx

import { useEffect, useState } from "react";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import { Building, MapPin, Phone, Mail } from 'lucide-react'; // 'Clock' e 'Loader' removidos pois não são mais necessários
import { colors } from "../config/colors";
import { API_BASE } from "../utils/constants";
import { formatStatusUser } from "../utils/helpers"; // 'formatDateDisplay' removido
import { SimpleLoadingState, ErrorMessage } from "../components/Common/LoadingState";
import StatusBadge from "../components/Common/StatusBadge";
import PageWrapper from "../components/PageWrapper";

export default function DashboardClinics() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllClinics = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_BASE}/clinics`);

                if (!response.ok) throw new Error("Falha ao carregar lista de Clínicas");

                const clinicsData = await response.json();

                const formattedClinics = clinicsData.map(clinic => {
                    const statusDetails = formatStatusUser(clinic.is_active);

                    // As lógicas de formatação de data de criação e atualização foram removidas.

                    return {
                        ...clinic,
                        statusDetails,
                    };
                });

                setClinics(formattedClinics);

            } catch (err) {
                setError(err.message);
                console.error("Erro ao carregar dados do Dashboard de Clínicas:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllClinics();
    }, []);

    if (loading) return <SimpleLoadingState />;

    if (error) return <ErrorMessage message={error} />;


    return (
        <PageWrapper maxWidth="max-w-7xl">
            {/* Header do Dashboard */}
            <Card variant="secondary" className="text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)` }}>
                <Building size={36} className="mx-auto mb-2 text-white" />
                <h1 className="text-3xl font-extrabold mb-1">
                    Dashboard Global de Clínicas
                </h1>
                <p className="text-lg font-light opacity-90">
                    Total de {clinics.length} clínicas registadas no sistema.
                </p>
            </Card>

            {/* Tabela de Clínicas */}
            <Card variant="light" className="p-0 overflow-hidden">
                <CardHeader spacing="none" className="p-6">
                    <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                        Registo Detalhado de Clínicas
                    </h2>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço (Rua)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade / C. Postal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordenadas</th>
                            {/* Coluna 'Datas' removida */}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {clinics.map((clinic) => (
                            <tr key={clinic.clinic_id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.accent1 }}>
                                    {clinic.clinic_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{clinic.name}</td>

                                {/* Endereço (Rua) */}
                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">{clinic.address}</td>

                                {/* Cidade / Distrito / Código Postal */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <div className="flex items-center gap-1 font-semibold text-gray-800">
                                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                        <span>{clinic.city} ({clinic.district})</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{clinic.postal_code}</p>
                                </td>

                                {/* Contacto (Phone / Email) */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <div className="flex items-center gap-1">
                                        <Phone size={14} className="text-gray-400" />
                                        <span>{clinic.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Mail size={14} className="text-gray-400" />
                                        <span className="truncate max-w-[150px]">{clinic.email}</span>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={clinic.is_active} type="user" />
                                </td>

                                {/* Coordenadas (Latitude / Longitude) */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <p>Lat: <span className="font-mono text-xs">{clinic.latitude}</span></p>
                                    <p>Lon: <span className="font-mono text-xs">{clinic.longitude}</span></p>
                                </td>

                                {/* Célula 'Datas' removida */}
                            </tr>
                        ))}
                        {clinics.length === 0 && (
                            <tr>
                                {/* colSpan ajustado de 8 para 7 */}
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Nenhuma clínica encontrada no sistema.
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