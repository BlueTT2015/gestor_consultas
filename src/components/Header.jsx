// src/components/Header.jsx

import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

export default function Header() {
    const colors = {
        primary: '#54CC90',
        secondary: '#2514BE',
        white: '#FFFFFF'
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center text-2xl font-bold" style={{ color: colors.secondary }}>
                            <Stethoscope size={24} style={{ color: colors.primary }} className="mr-2"/>
                            MedHub
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex space-x-6 text-base font-medium">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                        >
                            Home
                        </Link>
                        <Link
                            to="/clinics"
                            className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                        >
                            Clínicas
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                        >
                            About
                        </Link>
                        <Link
                            to="/forum"
                            className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                        >
                            Forum
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/auth/login"
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ backgroundColor: colors.primary, color: colors.white, borderColor: colors.primary }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45b87d'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth/register"
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                            Registar
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}