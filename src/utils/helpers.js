import { colors } from "../config/colors";
import { CheckCircle, XCircle } from "lucide-react";

export const getAvatarColor = (id) => {
    const gradients = [
        `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
        `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent1} 100%)`,
        `linear-gradient(135deg, ${colors.accent1} 0%, ${colors.accent2} 100%)`,
        `linear-gradient(135deg, ${colors.accent3} 0%, #FF9A3D 100%)`,
    ];
    return gradients[id % gradients.length];
};

export const getInitials = (fullName) => {
    if (!fullName || fullName.startsWith('Médico #') || fullName.startsWith('Paciente #')) return 'MD';
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
};

export const formatDateDisplay = (dateString, timeString = null) => {
    if (!dateString) return 'N/A';

    const [year, month, day] = dateString.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    let formattedTime = '';
    if (timeString) {
        try {
            const parts = timeString.split('T');
            if (parts.length > 1) {
                formattedTime = parts[1].substring(0, 5);
            } else if (timeString.length >= 5) {
                formattedTime = timeString.substring(0, 5);
            }
        } catch (e) {
            formattedTime = '';
        }
    }

    return `${formattedDate}${formattedTime ? ` às ${formattedTime}` : ''}`;
};

export const formatStatusAppointment = (status) => {
    switch (status?.toLowerCase()) {
        case 'scheduled':
            return { text: 'Agendada', color: colors.primary, bg: '#D1FAE5', textColor: '#065F46' };
        case 'completed':
            return { text: 'Concluída', color: colors.accent1, bg: '#DBEAFE', textColor: '#1E40AF' };
        case 'cancelled':
            return { text: 'Cancelada', color: colors.accent3, bg: '#FEF3C7', textColor: '#92400E' };
        default:
            return { text: 'Pendente', color: colors.gray, bg: '#F3F4F6', textColor: '#4B5563' };
    }
};

export const formatStatusUser = (isActive) => {
    const status = isActive === true || String(isActive).toLowerCase() === 'true';

    if (status) {
        return { text: 'Ativo', color: '#065F46', bg: '#D1FAE5', icon: CheckCircle };
    }
    return { text: 'Inativo', color: '#991B1B', bg: '#FEE2E2', icon: XCircle };
};

export const formatRole = (role) => {
    if (!role) return 'Desconhecido';
    return role.charAt(0).toUpperCase() + role.slice(1);
};

