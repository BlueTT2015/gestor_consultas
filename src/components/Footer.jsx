// src/components/Footer.jsx

import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Stethoscope } from 'lucide-react';


export default function Footer() {
    const currentYear = new Date().getFullYear();

    // Usando paleta para consistência
    const colors = {
        primary: '#54CC90',
        grayDark: '#374151'
    };


    return (
        <footer className="mt-12 py-10" style={{ backgroundColor: colors.grayDark }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-600 pb-8 mb-8">
                    {/* Coluna 1: Logo e Missão */}
                    <div>
                        <Link to="/" className="flex items-center text-xl font-bold mb-3">
                            <Stethoscope size={24} style={{ color: colors.primary }} className="mr-2"/>
                            MedHub
                        </Link>
                        <p className="text-sm text-gray-400">
                            A plataforma dedicada à gestão simples e organizada de consultas.
                        </p>
                    </div>

                    {/* Coluna 2: Navegação Rápida */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                            Navegação
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                            <li><Link to="/clinics" className="text-gray-400 hover:text-white transition">Clínicas</Link></li>
                            <li><Link to="/doctors" className="text-gray-400 hover:text-white transition">Médicos</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition">Sobre Nós</Link></li>
                            <li><Link to="/forum" className="text-gray-400 hover:text-white transition">Fórum</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 3: Contactos */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                            Contactos
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center">
                                <Mail size={16} className="mr-2 flex-shrink-0" style={{ color: colors.primary }} />
                                medhub@gmail.com
                            </li>
                            <li className="flex items-center">
                                <Phone size={16} className="mr-2 flex-shrink-0" style={{ color: colors.primary }} />
                                +351 923 124 687
                            </li>
                            <li className="flex items-start">
                                <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                                <span>Portugal (Sede)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 4: Dashboard Links (Auth required) */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                            Área Pessoal
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/auth/login" className="text-gray-400 hover:text-white transition">Login</Link></li>
                            <li><Link to="/auth/register" className="text-gray-400 hover:text-white transition">Registar</Link></li>
                            <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Direitos de Autor */}
                <div className="text-center text-sm text-gray-400">
                    <p>&copy; {currentYear} MedHub. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}