// src/components/Header.jsx (versão com dropdown)

import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const colors = {
        primary: '#54CC90',
        secondary: '#2514BE',
        white: '#FFFFFF'
    };

    // --- ADIÇÃO: Mapeamento dos cargos para português ---
    const roleLabels = {
        "admin": 'Administrador',
        "patient": 'Paciente',
        "doctor": 'Médico',
        "assistant": 'Assistente',
        "clinic_manager": 'Gestor de Clínica'
    };

    // --- ADIÇÃO: Lógica para obter o nome do cargo ---
    const displayRole = user?.role ? (roleLabels[user.role] || user.role) : '';
    // ----------------------------------------------------
    console.log("user: ", user);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/');
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

                        <Link
                            to="/doctors"
                            className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                        >
                            Médicos
                        </Link>
                    </nav>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated() && user ? (
                            <div className="relative" ref={dropdownRef}>
                                {/* Botão do utilizador com dropdown */}
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                         style={{ backgroundColor: colors.primary + '20' }}>
                                        <User size={16} style={{ color: colors.primary }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                                        {/* Pequena alteração: agora usa displayRole se disponível */}
                                        <p className="text-xs text-gray-500 capitalize">{displayRole || user.role}</p>
                                    </div>
                                    <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>

                                            {/* --- ADIÇÃO: Cargo destacado --- */}
                                            {displayRole && (
                                                <p className="text-xs font-bold mt-1 uppercase tracking-wide" style={{ color: colors.secondary }}>
                                                    {displayRole}
                                                </p>
                                            )}
                                            {/* ------------------------------- */}
                                        </div>

                                        {user.role === 'admin' && (
                                            <>
                                                <Link
                                                    to="/dashboard-users"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <span>Utilizadores</span>
                                                </Link>

                                                <Link
                                                    to="/dashboard-clinics"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <span>Clínicas</span>
                                                </Link>

                                                <Link
                                                    to="/dashboard-specialties"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <span>Especialidades</span>
                                                </Link>

                                                <Link
                                                    to="/dashboard-appointments"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <span>Consultas</span>
                                                </Link>
                                            </>

                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Botões Login/Registo quando não autenticado */
                            <div className="flex items-center space-x-4">
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
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}