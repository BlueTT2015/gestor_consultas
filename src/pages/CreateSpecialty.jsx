// src/pages/CreateSpecialty.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import InputField from "../components/forms/InputField";
import PageWrapper from "../components/PageWrapper";
import { Award, ArrowLeft, PlusCircle } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE, API_PAPI } from '../utils/constants';
import { DetailedLoadingState, ErrorMessage } from '../components/common/LoadingState';

export default function CreateSpecialty() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    // Estado para o próximo ID calculado (mantido, mas não exibido)
    const [nextSpecialtyId, setNextSpecialtyId] = useState(null);
    // Loading inicial para carregar o ID
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // Flag para loading apenas do POST
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efeito para calcular o próximo ID disponível
    useEffect(() => {
        const fetchMaxId = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE}/specialties`);
                if (!response.ok) throw new Error("Falha ao carregar especialidades para preparar o formulário.");

                const specialtiesData = await response.json();

                // Encontrar o ID máximo existente
                const maxId = specialtiesData.reduce((max, specialty) => {
                    // Assume que o campo 'specialty_id' existe nos dados retornados
                    return Math.max(max, specialty.specialty_id || 0);
                }, 0);

                setNextSpecialtyId(maxId + 1);
            } catch (err) {
                console.error("Erro ao calcular ID:", err);
                setMessage(err.message || "Erro ao tentar preparar o formulário.");
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchMaxId();
    }, []); // Executa apenas no primeiro render

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nextSpecialtyId === null) {
            setMessage("Ainda a preparar formulário. Por favor, aguarde.");
            setIsError(true);
            return;
        }

        // Validação simples para campos obrigatórios
        const requiredFields = ['name', 'description'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setMessage(`O campo '${field}' é obrigatório.`);
                setIsError(true);
                return;
            }
        }

        setIsSubmitting(true);
        setMessage(null);
        setIsError(false);

        const specialtyData = {
            id: nextSpecialtyId,
            name: formData.name,
            description: formData.description,
        };

        try {
            // Requisição POST para o endpoint da PAPI
            const response = await fetch(`${API_PAPI}/specialties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(specialtyData),
            });

            if (!response.ok) {
                let errorDetails = `Falha ao criar especialidade. Código: ${response.status}.`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    // Ignora se não houver corpo JSON
                }
                throw new Error(errorDetails);
            }

            setMessage(`Especialidade "${formData.name}" criada com sucesso! A redirecionar...`);
            setIsError(false);

            // Limpar formulário e preparar para a próxima submissão (se necessário)
            setFormData({ name: '', description: '' });
            // Incrementa o ID para a próxima criação
            setNextSpecialtyId(prevId => prevId + 1);

            // Redirecionar para o dashboard de especialidades após 3 segundos
            setTimeout(() => {
                navigate('/dashboard-specialties');
            }, 3000);

        } catch (err) {
            console.error("Erro ao criar especialidade:", err);
            setMessage(err.message || "Erro desconhecido ao tentar criar a especialidade.");
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Apenas mostra o loading se o ID ainda estiver a ser calculado
    if (loading) return <DetailedLoadingState message="A preparar formulário..." />;

    // Se houve erro ao carregar/calcular o ID e o loading terminou
    if (isError && !loading && nextSpecialtyId === null) return <ErrorMessage message={message} onBack={() => navigate('/dashboard-specialties')} backLabel="Voltar ao Dashboard" />;


    return (
        <PageWrapper maxWidth="max-w-2xl">
            <button
                onClick={() => navigate('/dashboard-specialties')}
                className="mb-6 flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.secondary }}
            >
                <ArrowLeft size={16} /> Voltar ao Dashboard
            </button>

            <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: colors.secondary }}>
                Criar Nova Especialidade
            </h1>

            <Card>
                <CardHeader spacing="medium" borderBottom>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                            Detalhes da Especialidade
                        </h2>
                    </div>
                </CardHeader>

                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">


                        {/* Nome */}
                        <InputField
                            id="name"
                            label="Nome *"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            icon={Award}
                            placeholder="Ex: Cardiologia"
                            name="name"
                        />

                        {/* Descrição */}
                        <InputField
                            id="description"
                            label="Descrição *"
                            type="textarea"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Descreva brevemente o foco desta especialidade."
                            name="description"
                        />

                        {message && (
                            <Card
                                variant={isError ? 'error' : 'success'}
                                padding="small"
                                className="text-center"
                            >
                                {message}
                            </Card>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || nextSpecialtyId === null}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
                            style={{
                                backgroundColor: (isSubmitting || nextSpecialtyId === null) ? colors.gray : colors.accent1,
                                color: colors.white,
                                cursor: (isSubmitting || nextSpecialtyId === null) ? 'not-allowed' : 'pointer'
                            }}
                            onMouseEnter={(e) => !(isSubmitting || nextSpecialtyId === null) && (e.currentTarget.style.backgroundColor = colors.secondary)}
                            onMouseLeave={(e) => !(isSubmitting || nextSpecialtyId === null) && (e.currentTarget.style.backgroundColor = colors.accent1)}
                        >
                            {isSubmitting ? 'A Criar...' : <><PlusCircle size={20} /> Criar Especialidade</>}
                        </button>
                    </form>
                </CardBody>
            </Card>
        </PageWrapper>
    );
}