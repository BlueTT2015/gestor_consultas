import PropTypes from 'prop-types';
import { colors } from "../config/colors";

export default function PageWrapper({ children, maxWidth = 'max-w-4xl', className = '' }) {
    return (
        <div className={`min-h-screen py-10 ${className}`} style={{ backgroundColor: colors.background }}>
            <div className={`${maxWidth} mx-auto px-4 space-y-8`}>
                {children}
            </div>
        </div>
    );
}

PageWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.string,
    className: PropTypes.string,
};