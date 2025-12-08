// src/pages/DashboardClinics.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import CardBody from "../components/CardBody";
import { Building, MapPin, Phone, Mail, Trash2, Pencil } from 'lucide-react'; // Adicionado Pencil
import { colors } from "../config/colors";
import { API_BASE, API_PAPI } from "../utils/constants";
import { formatStatusUser } from "../utils/helpers";
import { SimpleLoadingState, ErrorMessage } from "../components/common/LoadingState";
import StatusBadge from "../components/common/StatusBadge";
import PageWrapper from "../components/PageWrapper";

export default function DashboardClinics() {
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [isDeleteError, setIsDeleteError] = useState(false);

    const fetchAllClinics = async () => {
        try {
            setLoading(true);
            setDeleteMessage(null);

            const response = await fetch(`${API_BASE}/clinics`);

            if (!response.ok) throw new Error("Falha ao carregar lista de Clínicas");

            const clinicsData = await response.json();

            const formattedClinics = clinicsData.map(clinic => {
                const statusDetails = formatStatusUser(clinic.is_active);

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

    useEffect(() => {
        fetchAllClinics();
    }, []);

    const handleDeleteClinic = async (clinicId, clinicName) => {
        if (!window.confirm(`Tem a certeza que deseja eliminar a clínica "${clinicName}" (ID: ${clinicId})? Esta ação é irreversível.`)) {
            return;
        }

        setIsDeleting(true);
        setDeleteMessage(`A eliminar clínica "${clinicName}"...`);
        setIsDeleteError(false);

        try {
            const response = await fetch(`${API_PAPI}/clinics/${clinicId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                let errorDetails = `Falha ao eliminar clínica. Código: ${response.status}.`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    // Ignora se não houver body JSON
                }
                throw new Error(errorDetails);
            }

            setDeleteMessage(`Clínica "${clinicName}" eliminada com sucesso.`);
            setIsDeleteError(false);

            await fetchAllClinics();

        } catch (err) {
            console.error("Erro ao eliminar clínica:", err);
            setDeleteMessage(err.message || "Erro desconhecido ao tentar eliminar a clínica.");
            setIsDeleteError(true);
        } finally {
            setIsDeleting(false);
        }
    };

    // FUNÇÃO NOVO: Navegar para a página de edição
    const handleEditClinic = (clinicId) => {
        navigate(`/edit-clinic/${clinicId}`);
    };


    if (loading) return <SimpleLoadingState />;

    if (error) return <ErrorMessage message={error} />;


    return (
        <PageWrapper maxWidth="max-w-7xl">
            {/* NOVO BOTÃO: Criar Nova Clínica */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => navigate('/create-clinic')}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45b87d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    <Building size={20} className="mr-1" />
                    Criar Nova Clínica
                </button>
            </div>
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

            {/* Message Display */}
            {deleteMessage && (
                <Card variant={isDeleteError ? 'error' : 'success'}>
                    <CardBody padding="small" className="text-center">
                        {deleteMessage}
                    </CardBody>
                </Card>
            )}

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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {clinics.map((clinic) => (
                            <tr key={clinic.clinic_id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.accent1 }}>
                                    {clinic.clinic_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{clinic.name}</td>

                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">{clinic.address}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <div className="flex items-center gap-1 font-semibold text-gray-800">
                                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                        <span>{clinic.city} ({clinic.district})</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{clinic.postal_code}</p>
                                </td>

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

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={clinic.is_active} type="user" />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <p>Lat: <span className="font-mono text-xs">{clinic.latitude}</span></p>
                                    <p>Lon: <span className="font-mono text-xs">{clinic.longitude}</span></p>
                                </td>

                                {/* Ações (Edit and Delete Buttons) - ATUALIZADO */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <div className="flex items-center space-x-2">
                                        {/* Botão de Edição - OK */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClinic(clinic.clinic_id);
                                            }}
                                            disabled={isDeleting}
                                            className="flex items-center justify-center p-2 rounded-full text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={`Editar Clínica ${clinic.name}`}
                                            style={{ backgroundColor: colors.accent1 }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent1}
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        {/* Botão de Deleção - CORRIGIDO PARA TER text-white E COR VERMELHA CONSISTENTE */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClinic(clinic.clinic_id, clinic.name);
                                            }}
                                            disabled={isDeleting}
                                            className="flex items-center justify-center p-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{backgroundColor: "red"}} // Corrigido para ser consistente com o design do specialties
                                            title={`Eliminar Clínica ${clinic.name}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {clinics.length === 0 && (
                            <tr>
                                <td colSpan="8" className="px-6 py-10 text-center text-gray-500 text-lg">
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