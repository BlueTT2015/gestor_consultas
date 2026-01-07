import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Aceita uma prop "allowedRoles" que é um array, ex: ['admin', 'manager']
export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">A verificar permissões...</p>
                </div>
            </div>
        );
    }

    // 1. Verifica se está logado
    if (!isAuthenticated()) {
        return <Navigate to="/auth/login" replace />;
    }

    // 2. Se houver restrição de cargos, verifica se o user tem o cargo
    // Nota: Se o user for 'admin', passa sempre (lógica pode estar aqui ou no contexto)
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user?.role;

        // Se não tiver cargo definido ou não estiver na lista permitida (e não for admin)
        if (!userRole || (!allowedRoles.includes(userRole) && userRole !== 'admin')) {
            // Podes criar uma página /unauthorized ou mandar para a home
            return <Navigate to="/" replace />;
        }
    }

    return children;
}