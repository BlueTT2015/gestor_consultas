// src/pages/DashboardUsers.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { Users, Trash2, Pencil, PlusCircle } from 'lucide-react'; // Adicionado PlusCircle
import { colors } from "../config/colors";
import { API_PAPI } from "../utils/constants";
import { formatStatusUser, formatRole, formatDateDisplay } from "../utils/helpers";
import { SimpleLoadingState, ErrorMessage } from "../components/common/LoadingState";
import StatusBadge from "../components/common/StatusBadge";
import PageWrapper from "../components/PageWrapper";

export default function DashboardUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [isDeleteError, setIsDeleteError] = useState(false);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            setDeleteMessage(null);

            const response = await fetch(`${API_PAPI}/users`, {
                method: "GET",
                headers: {
                    client_id: import.meta.env.VITE_PAPI_CLIENT_ID,
                    client_secret: import.meta.env.VITE_PAPI_CLIENT_SECRET
                }
            });

            if (!response.ok) throw new Error("Falha ao carregar lista de Utilizadores");

            const usersData = await response.json();
            const formattedUsers = usersData.map(user => {
                const statusDetails = formatStatusUser(user.is_active);
                const roleDisplay = formatRole(user.role);
                const createdAtDisplay = formatDateDisplay(user.created_at.split('T')[0], user.created_at);

                return {
                    ...user,
                    statusDetails,
                    roleDisplay,
                    createdAtDisplay,
                    fullName: `${user.first_name} ${user.last_name}`,
                };
            });

            setUsers(formattedUsers);

        } catch (err) {
            setError(err.message);
            console.error("Erro ao carregar dados do Dashboard de Utilizadores:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Tem a certeza que deseja eliminar o utilizador "${userName}" (ID: ${userId})? Esta ação é irreversível.`)) {
            return;
        }

        setIsDeleting(true);
        setDeleteMessage(`A eliminar utilizador "${userName}"...`);
        setIsDeleteError(false);

        try {
            const response = await fetch(`${API_PAPI}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    client_id: import.meta.env.VITE_PAPI_CLIENT_ID,
                    client_secret: import.meta.env.VITE_PAPI_CLIENT_SECRET
                }
            });

            if (!response.ok) {
                let errorDetails = `Falha ao eliminar utilizador. Código: ${response.status}.`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    // Ignora se não houver body JSON
                }
                throw new Error(errorDetails);
            }

            setDeleteMessage(`Utilizador "${userName}" eliminado com sucesso.`);
            setIsDeleteError(false);

            await fetchAllUsers();

        } catch (err) {
            console.error("Erro ao eliminar utilizador:", err);
            setDeleteMessage(err.message || "Erro desconhecido ao tentar eliminar o utilizador.");
            setIsDeleteError(true);
        } finally {
            setIsDeleting(false);
        }
    };

    // Função para navegar para a página de edição (rota simulada)
    const handleEditUser = (userId) => {
        // NOTA: Esta rota é simulada para consistência de design, assumindo uma futura implementação
        navigate(`/edit-user/${userId}`);
    };

    if (loading) return <SimpleLoadingState />;

    if (error) return <ErrorMessage message={error} />;


    return (
        <PageWrapper maxWidth="max-w-7xl">
            {/* NOVO BOTÃO: Criar Novo Utilizador */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => navigate('/create-user')}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45b87d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    <PlusCircle size={20} className="mr-1" />
                    Criar Novo Utilizador
                </button>
            </div>

            <Card variant="secondary" className="text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)` }}>
                <Users size={36} className="mx-auto mb-2 text-white" />
                <h1 className="text-3xl font-extrabold mb-1">
                    Dashboard Global de Utilizadores
                </h1>
                <p className="text-lg font-light opacity-90">
                    Total de {users.length} utilizadores registados no sistema.
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

            <Card variant="light" className="p-0 overflow-hidden">
                <CardHeader spacing="none" className="p-6">
                    <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                        Registo Detalhado de Utilizador
                    </h2>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Completo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado Em</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.user_id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.accent1 }}>
                                    {user.user_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{user.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.secondary }}>{user.roleDisplay}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phone || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={user.is_active} type="user" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.createdAtDisplay}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <div className="flex items-center space-x-2">
                                        {/* Botão de Edição (Rota Simulada) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditUser(user.user_id);
                                            }}
                                            disabled={isDeleting}
                                            className="flex items-center justify-center p-2 rounded-full text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={`Editar Utilizador ${user.fullName}`}
                                            style={{ backgroundColor: colors.accent1 }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent1}
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        {/* Botão de Deleção - Atualizado para ter estilo consistente */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteUser(user.user_id, user.fullName);
                                            }}
                                            disabled={isDeleting}
                                            className="flex items-center justify-center p-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{backgroundColor: "red"}}
                                            title={`Eliminar Utilizador ${user.fullName}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="8" className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Nenhum utilizador encontrado no sistema.
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