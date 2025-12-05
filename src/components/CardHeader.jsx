// src/components/CardHeader.jsx

import PropTypes from 'prop-types';

export default function CardHeader({
                                       children,
                                       className = '',
                                       align = 'left',
                                       spacing = 'medium',
                                       borderBottom = false,
                                       ...props
                                   }) {
    const alignments = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        between: 'flex justify-between items-center'
    };

    const spacings = {
        none: 'mb-0',
        small: 'mb-2',
        medium: 'mb-4',
        large: 'mb-6'
    };

    const baseClasses = `
        ${alignments[align]}
        ${spacings[spacing]}
        ${borderBottom ? 'pb-4 border-b' : ''}
        ${className}
    `;

    return (
        <div className={baseClasses.trim()} {...props}>
            {children}
        </div>
    );
}

CardHeader.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    align: PropTypes.oneOf(['left', 'center', 'right', 'between']),
    spacing: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
    borderBottom: PropTypes.bool,
};