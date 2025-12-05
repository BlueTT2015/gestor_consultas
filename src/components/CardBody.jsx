// src/components/CardBody.jsx

import PropTypes from 'prop-types';

export default function CardBody({
                                     children,
                                     className = '',
                                     spacing = 'medium',
                                     ...props
                                 }) {
    const spacings = {
        none: 'space-y-0',
        small: 'space-y-3',
        medium: 'space-y-4',
        large: 'space-y-6'
    };

    const baseClasses = `
        ${spacings[spacing]}
        ${className}
    `;

    return (
        <div className={baseClasses.trim()} {...props}>
            {children}
        </div>
    );
}

CardBody.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    spacing: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
};