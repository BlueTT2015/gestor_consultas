import PropTypes from 'prop-types';
import { colors } from "../../config/colors";

export default function InputField({
                                       id,
                                       label,
                                       type = 'text',
                                       placeholder,
                                       required = false,
                                       icon: Icon,
                                       className = '',
                                       containerClassName = '',
                                       inputClassName = '',
                                       ...props
                                   }) {
    const inputClasses = `w-full p-3 border rounded-lg ${Icon ? 'pl-10' : ''} focus:ring-2 focus:ring-opacity-50 transition duration-150 ${inputClassName}`;
    const style = {
        borderColor: colors.accent2,
        outlineColor: colors.primary,
        ...props.style
    };

    return (
        <div className={containerClassName}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && '*'}
            </label>
            <div className="relative">
                {type === 'textarea' ? (
                    <textarea
                        id={id}
                        name={id}
                        placeholder={placeholder}
                        required={required}
                        rows={props.rows || "3"}
                        className={`${inputClasses} resize-none`}
                        style={style}
                        {...props}
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={id}
                        placeholder={placeholder}
                        required={required}
                        className={inputClasses}
                        style={style}
                        {...props}
                    />
                )}
                {Icon && (
                    <Icon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                )}
            </div>
        </div>
    );
}

InputField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'email', 'password', 'date', 'time', 'number', 'textarea']),
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    icon: PropTypes.elementType,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    inputClassName: PropTypes.string,
};