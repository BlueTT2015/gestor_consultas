// src/components/CardFooter.jsx

import PropTypes from 'prop-types';

export default function CardFooter({
                                       children,
                                       className = '',
                                       align = 'right',
                                       borderTop = false,
                                       ...props
                                   }) {
    const alignments = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        between: 'flex justify-between items-center'
    };

    const baseClasses = `
        ${alignments[align]}
        ${borderTop ? 'pt-4 border-t' : ''}
        ${className}
    `;

    return (
        <div className={baseClasses.trim()} {...props}>
            {children}
        </div>
    );
}

CardFooter.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    align: PropTypes.oneOf(['left', 'center', 'right', 'between']),
    borderTop: PropTypes.bool,
};