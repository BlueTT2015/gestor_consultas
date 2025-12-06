import PropTypes from 'prop-types';
import { formatStatusAppointment, formatStatusUser } from "../../utils/helpers";

export default function StatusBadge({ status, type = 'appointment', className = '' }) {
    let statusDetails;

    if (type === 'appointment') {
        statusDetails = formatStatusAppointment(status);
    } else if (type === 'user') {
        statusDetails = formatStatusUser(status);
    } else {
        return null;
    }

    const Icon = statusDetails.icon;

    return (
        <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${className}`}
            style={{ backgroundColor: statusDetails.bg, color: statusDetails.color }}
        >
            {Icon && <Icon size={14} />}
            {statusDetails.text}
        </span>
    );
}

StatusBadge.propTypes = {
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    type: PropTypes.oneOf(['appointment', 'user']),
    className: PropTypes.string,
};