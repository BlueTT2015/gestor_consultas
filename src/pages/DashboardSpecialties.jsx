// src/pages/DashboardSpecialties.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { Award, Loader, Trash2, Pencil, PlusCircle } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE, API_PAPI } from "../utils/constants";
import { formatDateDisplay } from "../utils/helpers";
import { SimpleLoadingState, ErrorMessage } from "../components/common/LoadingState";
import PageWrapper from "../components/PageWrapper";

export default function DashboardSpecialties() {
    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Estados para o DELETE e mensagens
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const fetchAllSpecialties = async () => {
        try {
            setLoading(true);
            setMessage(null);

            // API_BASE para leitura
            const response = await fetch(`${API_BASE}/specialties`);

            if (!response.ok) throw new Error("Falha ao carregar lista de Especialidades");

            const specialtiesData = await response.json();

            const formattedSpecialties = specialtiesData.map(specialty => ({
                ...specialty,
                // Ajudantes formatam a data para exibição
                createdAtDisplay: formatDateDisplay(specialty.created_at.split('T')[0], specialty.created_at),
                updatedAtDisplay: formatDateDisplay(specialty.updated_at.split('T')[0], specialty.updated_at),
            }));

            setSpecialties(formattedSpecialties);

        } catch (err) {
            setError(err.message);
            console.error("Erro ao carregar dados do Dashboard de Especialidades:", err);
        } finally {
            setLoading(false);
        }
    };

    // Função para Eliminar Especialidade (Usando PAPI Real)
    const handleDeleteSpecialty = async (specialtyId, specialtyName) => {
        if (!window.confirm(`Tem a certeza que deseja ELIMINAR a especialidade "${specialtyName}" (ID: ${specialtyId})? Esta ação é irreversível.`)) {
            return;
        }

        setIsDeleting(true);
        setMessage(`A eliminar especialidade "${specialtyName}"...`);
        setIsError(false);

        try {
            // Requisição DELETE para o endpoint PAPI real:
            const response = await fetch(`${API_PAPI}/specialties/${specialtyId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                let errorDetails = `Falha ao eliminar especialidade. Código: ${response.status}.`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    // Ignora se não houver body JSON
                }
                throw new Error(errorDetails);
            }

            setMessage(`Especialidade "${specialtyName}" eliminada com sucesso.`);
            setIsError(false);

            // Recarregar a lista
            await fetchAllSpecialties();
        } catch (err) {
            console.error("Erro ao eliminar especialidade:", err);
            setMessage(err.message || "Erro desconhecido ao tentar eliminar a especialidade.");
            setIsError(true);
        } finally {
            setIsDeleting(false);
        }
    };

    // Função Simulada para navegar para Edição
    const handleEditSpecialty = (specialtyId) => {
        // NOTA: A rota e página '/edit-specialty/:specialtyId' são simuladas.
        navigate(`/edit-specialty/${specialtyId}`);
    };

    useEffect(() => {
        fetchAllSpecialties();
    }, []);

    if (loading) return <SimpleLoadingState />;
    if (error) return <ErrorMessage message={error} />;


    return (
        <PageWrapper maxWidth="max-w-7xl">
            {/* Botão de Ação: Criar Nova Especialidade */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => navigate('/create-specialty')} // Rota simulada
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45b87d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    <PlusCircle size={20} className="mr-1" />
                    Criar Nova Especialidade
                </button>
            </div>

            {/* Header do Dashboard */}
            <Card variant="secondary" className="text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)` }}>
                <Award size={36} className="mx-auto mb-2 text-white" />
                <h1 className="text-3xl font-extrabold mb-1">
                    Dashboard Global de Especialidades
                </h1>
                <p className="text-lg font-light opacity-90">
                    Total de {specialties.length} especialidades registadas no sistema.
                </p>
            </Card>

            {/* Message Display */}
            {message && (
                <Card variant={isError ? 'error' : 'success'} className="mt-6">
                    <CardBody padding="small" className="text-center">
                        {message}
                    </CardBody>
                </Card>
            )}

            {/* Tabela de Especialidades */}
            <Card variant="light" className="p-0 overflow-hidden">
                <CardHeader spacing="none" className="p-6">
                    <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                        Registo Detalhado de Especialidades
                    </h2>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado Em</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {specialties.map((spec) => (
                            <tr key={spec.specialty_id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.accent1 }}>
                                    {spec.specialty_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{spec.name}</td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">{spec.description || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{spec.createdAtDisplay}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{spec.updatedAtDisplay}</td>

                                {/* Ações (Edit and Delete Buttons) */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <div className="flex items-center space-x-2">
                                        {/* Botão de Edição (Rota Simulada) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditSpecialty(spec.specialty_id);
                                            }}
                                            disabled={isDeleting}
                                            className="flex items-center justify-center p-2 rounded-full text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={`Editar Especialidade ${spec.name}`}
                                            style={{ backgroundColor: colors.accent1 }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent1}
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        {/* Botão de Deleção (PAPI Real) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSpecialty(spec.specialty_id, spec.name);
                                            }}
                                            disabled={isDeleting}
                                            className="flex items-center justify-center p-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={`Eliminar Especialidade ${spec.name}`}
                                            style={{backgroundColor: "red"}}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {specialties.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Nenhuma especialidade encontrada no sistema.
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