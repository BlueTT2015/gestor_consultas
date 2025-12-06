import { useEffect, useState } from "react";
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { Users, Loader } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE } from "../utils/constants";
import { formatStatusUser, formatRole, formatDateDisplay } from "../utils/helpers";
import { SimpleLoadingState, ErrorMessage } from "../components/Common/LoadingState";
import StatusBadge from "../components/Common/StatusBadge";
import PageWrapper from "../components/PageWrapper";

export default function DashboardUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_BASE}/users`);

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

        fetchAllUsers();
    }, []);

    if (loading) return <SimpleLoadingState />;

    if (error) return <ErrorMessage message={error} />;


    return (
        <PageWrapper maxWidth="max-w-7xl">
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
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-lg">
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