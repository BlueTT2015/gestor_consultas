// src/pages/EditSpecialty.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import InputField from "../components/forms/InputField";
import PageWrapper from "../components/PageWrapper";
import { Award, ArrowLeft, Save } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE, API_PAPI } from '../utils/constants';
import { DetailedLoadingState, ErrorMessage } from '../components/common/LoadingState';

export default function EditSpecialty() {
    const navigate = useNavigate();
    const { specialtyId } = useParams();
    const numericSpecialtyId = parseInt(specialtyId);

    const [formData, setFormData] = useState({
        specialty_id: null,
        name: '',
        description: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // Efeito para carregar dados da Especialidade existente
    useEffect(() => {
        if (isNaN(numericSpecialtyId)) {
            setMessage("ID de especialidade inválido.");
            setIsError(true);
            setLoading(false);
            return;
        }

        const fetchSpecialtyData = async () => {
            setLoading(true);
            try {
                // Fetch de TODAS as especialidades (SAPI) e filtra a desejada
                const response = await fetch(`${API_BASE}/specialties`);

                if (!response.ok) {
                    throw new Error(`Falha ao carregar lista de especialidades.`);
                }

                const specialtiesData = await response.json();
                const specialty = specialtiesData.find(s => s.specialty_id === numericSpecialtyId);

                if (!specialty) {
                    throw new Error(`Especialidade com ID ${specialtyId} não encontrada.`);
                }

                setFormData({
                    specialty_id: specialty.specialty_id,
                    name: specialty.name || '',
                    description: specialty.description || '',
                });

            } catch (err) {
                console.error("Erro ao carregar especialidade:", err);
                setMessage(err.message || "Erro desconhecido ao carregar os dados da especialidade.");
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialtyData();
    }, [numericSpecialtyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Função para Submeter Edição (PUT na PAPI)
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            id: formData.specialty_id,
            name: formData.name,
            description: formData.description,
        };

        try {
            // Requisição ALTERADA para PUT, em vez de PUT
            const response = await fetch(`${API_BASE}/specialties/${specialtyId}`, {
                method: 'PUT', // <--- CORREÇÃO AQUI
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(specialtyData),
            });

            if (!response.ok) {
                let errorDetails = `Falha ao atualizar especialidade. Código: ${response.status}.`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    // Ignora se não houver corpo JSON
                }
                throw new Error(errorDetails);
            }

            setMessage(`Especialidade "${formData.name}" (ID: ${specialtyId}) atualizada com sucesso! A redirecionar...`);
            setIsError(false);

            setTimeout(() => {
                navigate('/dashboard-specialties');
            }, 3000);

        } catch (err) {
            console.error("Erro ao atualizar especialidade:", err);
            setMessage(err.message || "Erro desconhecido ao tentar atualizar a especialidade.");
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <DetailedLoadingState message={`A carregar dados da Especialidade ${specialtyId}...`} />;

    if (isError && !loading) return <ErrorMessage message={message} onBack={() => navigate('/dashboard-specialties')} backLabel="Voltar ao Dashboard" />;


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
                Editar Especialidade: ID {specialtyId}
            </h1>

            <Card>
                <CardHeader spacing="medium" borderBottom>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                            Informações da Especialidade
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
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
                            style={{
                                backgroundColor: isSubmitting ? colors.gray : colors.primary,
                                color: colors.white,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = colors.secondary)}
                            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = colors.primary)}
                        >
                            {isSubmitting ? 'A Atualizar...' : <><Save size={20} /> Guardar Alterações</>}
                        </button>
                    </form>
                </CardBody>
            </Card>
        </PageWrapper>
    );
}