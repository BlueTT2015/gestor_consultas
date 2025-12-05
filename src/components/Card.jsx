// src/components/Card.jsx

import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// Paleta de cores padrão (você pode personalizar)
const colors = {
    primary: '#54CC90',
    secondary: '#2514BE',
    accent1: '#5256CB',
    accent2: '#BCB5F7',
    accent3: '#F2721C',
    background: '#F3F7F2',
    white: '#FFFFFF',
    gray: '#6B7280',
    grayLight: '#F9FAFB',
    grayDark: '#374151'
};

const Card = forwardRef(function Card({
                                          children,
                                          className = '',
                                          onClick,
                                          hoverable = true,
                                          variant = 'default',
                                          padding = 'medium',
                                          border = true,
                                          shadow = 'medium',
                                          backgroundColor,
                                          borderColor,
                                          maxWidth,
                                          minHeight,
                                          fullHeight = false,
                                          ...props
                                      }, ref) {

    // Variantes de estilo
    const variants = {
        default: {
            bg: colors.white,
            border: `${colors.accent2}30`,
            text: colors.grayDark
        },
        primary: {
            bg: `${colors.primary}10`,
            border: `${colors.primary}30`,
            text: colors.secondary
        },
        secondary: {
            bg: `${colors.secondary}10`,
            border: `${colors.secondary}30`,
            text: colors.secondary
        },
        accent: {
            bg: `${colors.accent1}10`,
            border: `${colors.accent1}30`,
            text: colors.accent1
        },
        success: {
            bg: '#D1FAE5',
            border: '#10B98130',
            text: '#065F46'
        },
        warning: {
            bg: '#FEF3C7',
            border: '#F59E0B30',
            text: '#92400E'
        },
        error: {
            bg: '#FEE2E2',
            border: '#EF444430',
            text: '#991B1B'
        },
        info: {
            bg: '#DBEAFE',
            border: '#3B82F630',
            text: '#1E40AF'
        },
        dark: {
            bg: colors.grayDark,
            border: `${colors.grayDark}50`,
            text: colors.white
        },
        light: {
            bg: colors.grayLight,
            border: `${colors.gray}20`,
            text: colors.grayDark
        }
    };

    // Tamanhos de padding
    const paddings = {
        none: 'p-0',
        small: 'p-4',
        medium: 'p-6',
        large: 'p-8',
        xlarge: 'p-10'
    };

    // Níveis de sombra
    const shadows = {
        none: 'shadow-none',
        sm: 'shadow-sm',
        medium: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl'
    };

    const selectedVariant = variants[variant] || variants.default;
    const selectedPadding = paddings[padding] || paddings.medium;
    const selectedShadow = shadows[shadow] || shadows.medium;

    const baseClasses = `
        rounded-2xl 
        transition-all 
        duration-300 
        overflow-hidden
        ${selectedPadding}
        ${selectedShadow}
        ${border ? 'border' : ''}
        ${hoverable ? 'hover:-translate-y-1' : ''}
        ${hoverable && shadow !== 'none' ? 'hover:shadow-xl' : ''}
        ${fullHeight ? 'h-full' : ''}
        ${className}
    `;

    const style = {
        backgroundColor: backgroundColor || selectedVariant.bg,
        borderColor: borderColor || selectedVariant.border,
        color: selectedVariant.text,
        maxWidth: maxWidth,
        minHeight: minHeight,
        cursor: onClick ? 'pointer' : 'default',
        ...props.style
    };

    return (
        <div
            ref={ref}
            className={baseClasses.trim()}
            style={style}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
});

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    hoverable: PropTypes.bool,
    variant: PropTypes.oneOf([
        'default', 'primary', 'secondary', 'accent',
        'success', 'warning', 'error', 'info', 'dark', 'light'
    ]),
    padding: PropTypes.oneOf(['none', 'small', 'medium', 'large', 'xlarge']),
    border: PropTypes.bool,
    shadow: PropTypes.oneOf(['none', 'sm', 'medium', 'lg', 'xl', '2xl']),
    backgroundColor: PropTypes.string,
    borderColor: PropTypes.string,
    maxWidth: PropTypes.string,
    minHeight: PropTypes.string,
    fullHeight: PropTypes.bool,
};

export default Card;

