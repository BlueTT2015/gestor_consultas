import { AlertCircle } from 'lucide-react';

export default function InputField({
                                       id,
                                       label,
                                       type = 'text',
                                       placeholder,
                                       value,
                                       onChange,
                                       required = false,
                                       icon: Icon,
                                       error
                                   }) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon size={20} className="text-gray-400" />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`
                        block w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 
                        border rounded-lg text-gray-900 
                        placeholder-gray-400 
                        focus:ring-2 focus:ring-offset-1 focus:outline-none
                        transition-all duration-200
                        ${error
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                    `}
                />
                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle size={20} className="text-red-500" />
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle size={16} className="mr-1" />
                    {error}
                </p>
            )}
        </div>
    );
}

