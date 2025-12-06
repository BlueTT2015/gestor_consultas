// src/pages/Forum.jsx

import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import {
    MessageSquare,
    Folder,
    TrendingUp,
    PlusCircle,
    HeartPulse,
    Stethoscope,
    Lightbulb,
    Hash,
    Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Paleta de cores para consistência
const colors = {
    primary: '#54CC90',
    secondary: '#2514BE',
    accent1: '#5256CB',
    accent2: '#BCB5F7',
    accent3: '#F2721C',
    background: '#F3F7F2',
    white: '#FFFFFF',
    grayDark: '#374151'
};

// Dados simulados para as categorias do fórum
const forumCategories = [
    { id: 1, name: 'Dúvidas Gerais', description: 'Questões e ajuda sobre a plataforma MedHub.', topics: 45, posts: 210, icon: MessageSquare, color: colors.primary },
    { id: 2, name: 'Saúde & Bem-Estar', description: 'Tópicos de saúde geral, nutrição e estilo de vida.', topics: 120, posts: 890, icon: HeartPulse, color: colors.accent1 },
    { id: 3, name: 'Especialidades Médicas', description: 'Discussões aprofundadas sobre áreas clínicas específicas.', topics: 78, posts: 450, icon: Stethoscope, color: colors.secondary },
    { id: 4, name: 'Feedback & Sugestões', description: 'Ajude-nos a melhorar! Deixe as suas críticas construtivas.', topics: 30, posts: 150, icon: Lightbulb, color: colors.accent3 },
];

export default function Forum() {
    const totalTopics = forumCategories.reduce((sum, cat) => sum + cat.topics, 0);
    const totalPosts = forumCategories.reduce((sum, cat) => sum + cat.posts, 0);
    const totalUsers = 1250; // Dado simulado

    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-6xl mx-auto px-4 space-y-8">

                {/* Cabeçalho Principal e Botão de Ação */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-left">
                        <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ color: colors.secondary }}>
                            Fórum Comunitário
                        </h1>
                        <p className="text-lg" style={{ color: colors.accent1 }}>
                            Um espaço para partilha de dúvidas e conhecimento.
                        </p>
                    </div>

                    <Link
                        to="/forum/new-topic" // Rota simulada
                        className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.white,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45b87d'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                    >
                        <PlusCircle size={20} />
                        Criar Tópico
                    </Link>
                </div>

                {/* Grid de Conteúdo: Categorias e Estatísticas */}
                <div className="grid grid-cols-1 gap-8">

                    {/* Secção de Estatísticas (Topo) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Card variant="info" padding="small" className="text-center bg-white">
                            <Hash size={24} className="mx-auto mb-1" style={{ color: colors.accent1 }} />
                            <div className="text-2xl font-bold mb-1" style={{ color: colors.secondary }}>{totalTopics}</div>
                            <p className="text-sm text-gray-600">Tópicos Ativos</p>
                        </Card>
                        <Card variant="secondary" padding="small" className="text-center bg-white">
                            <MessageSquare size={24} className="mx-auto mb-1" style={{ color: colors.primary }} />
                            <div className="text-2xl font-bold mb-1" style={{ color: colors.secondary }}>{totalPosts}</div>
                            <p className="text-sm text-gray-600">Total de Respostas</p>
                        </Card>
                        <Card variant="default" padding="small" className="text-center bg-white">
                            <Users size={24} className="mx-auto mb-1" style={{ color: colors.accent3 }} />
                            <div className="text-2xl font-bold mb-1" style={{ color: colors.secondary }}>{totalUsers}+</div>
                            <p className="text-sm text-gray-600">Membros</p>
                        </Card>
                    </div>

                    {/* Secção de Categorias */}
                    <Card variant="light" className="p-0">
                        <CardHeader spacing="medium" className="px-6 pt-6 pb-4" borderBottom>
                            <div className="flex items-center gap-3">
                                <Folder size={24} style={{ color: colors.secondary }} />
                                <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                                    Categorias Principais
                                </h2>
                            </div>
                        </CardHeader>

                        {/* Lista de Categorias */}
                        <div className="divide-y divide-gray-200">
                            {forumCategories.map((category, index) => (
                                <Link
                                    key={category.id}
                                    to={`/forum/category/${category.id}`} // Rota simulada
                                    className="block p-6 transition-colors hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            {/* Ícone da Categoria */}
                                            <div
                                                className="p-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: category.color + '15' }}
                                            >
                                                <category.icon size={24} style={{ color: category.color }} />
                                            </div>

                                            {/* Nome e Descrição */}
                                            <div>
                                                <h3 className="text-xl font-semibold" style={{ color: colors.grayDark }}>
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Estatísticas da Categoria */}
                                        <div className="hidden sm:block text-right flex-shrink-0">
                                            <div className="text-lg font-bold" style={{ color: colors.accent1 }}>
                                                {category.topics}
                                            </div>
                                            <p className="text-xs text-gray-500">Tópicos</p>
                                        </div>
                                        <div className="hidden sm:block text-right flex-shrink-0 ml-6">
                                            <div className="text-lg font-bold" style={{ color: colors.primary }}>
                                                {category.posts}
                                            </div>
                                            <p className="text-xs text-gray-500">Respostas</p>
                                        </div>

                                    </div>
                                </Link>
                            ))}
                        </div>
                        <CardBody spacing="none" className="p-6 text-sm text-center text-gray-500 border-t">
                            Última atividade: 5 minutos atrás em <a href="#" style={{color: colors.secondary}} className="font-medium hover:underline">Saúde & Bem-Estar</a>.
                        </CardBody>
                    </Card>

                    {/* Secção de Tópicos Populares (Simulada) */}
                    <Card variant="default">
                        <CardHeader spacing="medium" borderBottom>
                            <div className="flex items-center gap-3">
                                <TrendingUp size={24} style={{ color: colors.accent3 }} />
                                <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                                    Tópicos Populares
                                </h2>
                            </div>
                        </CardHeader>
                        <CardBody spacing="small">
                            <ul className="space-y-4">
                                {/* Tópico 1 */}
                                <li className="border-l-4 pl-3" style={{ borderColor: colors.accent3 }}>
                                    <p className="font-medium text-gray-800 hover:text-gray-900 transition"><a href="#">Como agendar uma consulta com um especialista?</a></p>
                                    <p className="text-xs text-gray-500 mt-0.5">Por João M. • 15 respostas • 2 dias atrás</p>
                                </li>
                                {/* Tópico 2 */}
                                <li className="border-l-4 pl-3" style={{ borderColor: colors.primary }}>
                                    <p className="font-medium text-gray-800 hover:text-gray-900 transition"><a href="#">O impacto da hidratação na saúde da pele</a></p>
                                    <p className="text-xs text-gray-500 mt-0.5">Por Dra. Ana P. • 42 respostas • 1 semana atrás</p>
                                </li>
                                {/* Tópico 3 */}
                                <li className="border-l-4 pl-3" style={{ borderColor: colors.accent1 }}>
                                    <p className="font-medium text-gray-800 hover:text-gray-900 transition"><a href="#">Melhores práticas para a gestão da dor crónica</a></p>
                                    <p className="text-xs text-gray-500 mt-0.5">Por Utilizador Anónimo • 28 respostas • 3 semanas atrás</p>
                                </li>
                            </ul>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}