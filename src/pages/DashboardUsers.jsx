// src/pages/DashboardUsers.jsx

import { useEffect, useState } from "react";
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { Users, AlertTriangle, Loader, CheckCircle, XCircle } from 'lucide-react';

const API_BASE = "https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api";

// Paleta de cores para consistência
const colors = {
    primary: '#54CC90', // Green
    secondary: '#2514BE', // Dark Blue
    accent1: '#5256CB', // Purple/Blue
    accent3: '#F2721C', // Orange
    background: '#F3F7F2',
    white: '#FFFFFF',
    gray: '#6B7280'
};

// Funções de formatação
const formatStatusBadge = (isActive) => {
    // Normaliza o valor para boolean, tratando strings como 'true'
    const status = isActive === true || String(isActive).toLowerCase() === 'true';

    if (status) {
        return { text: 'Ativo', color: '#065F46', bg: '#D1FAE5', icon: CheckCircle };
    }
    return { text: 'Inativo', color: '#991B1B', bg: '#FEE2E2', icon: XCircle };
};

const formatRole = (role) => {
    if (!role) return 'Desconhecido';
    return role.charAt(0).toUpperCase() + role.slice(1);
};

const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp);
        // Formata para dd/mm/aaaa
        const datePart = date.toLocaleDateString('pt-PT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        // Formata para HH:MM
        const timePart = date.toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${datePart} às ${timePart}`;
    } catch (e) {
        return timestamp.split('T')[0]; // Fallback to YYYY-MM-DD
    }
};


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

                // Formatar e enriquecer dados
                const formattedUsers = usersData.map(user => {
                    const statusDetails = formatStatusBadge(user.is_active);
                    const roleDisplay = formatRole(user.role);
                    const createdAtDisplay = formatTimestamp(user.created_at);

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

    const renderStatusBadge = (statusDetails) => {
        const Icon = statusDetails.icon;
        return (
            <span
                className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1"
                style={{ backgroundColor: statusDetails.bg, color: statusDetails.color }}
            >
                <Icon size={14} />
                {statusDetails.text}
            </span>
        );
    };

    if (loading) return (
        <div className="min-h-screen py-10 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
            <div className="flex items-center gap-3 text-lg font-medium" style={{ color: colors.secondary }}>
                <Loader size={24} className="animate-spin" />
                A carregar dados dos utilizadores...
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <Card variant="error" className="max-w-xl mx-auto my-10">
                <CardBody>
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold">Erro ao carregar o Dashboard de Utilizadores</h2>
                    </div>
                    <p className="mt-2">{error}</p>
                </CardBody>
            </Card>
        </div>
    );


    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto px-4 space-y-8">

                {/* Cabeçalho do Dashboard */}
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

                {/* Tabela de Utilizador */}
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
                                        {renderStatusBadge(user.statusDetails)}
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
            </div>
        </div>
    );
}