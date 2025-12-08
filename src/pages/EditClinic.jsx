// src/pages/EditClinic.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import InputField from "../components/forms/InputField";
import PageWrapper from "../components/PageWrapper";
import { Building, MapPin, Mail, Phone, ArrowLeft, Pencil } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE, API_PAPI } from '../utils/constants';
import { DetailedLoadingState, ErrorMessage } from '../components/common/LoadingState';

export default function EditClinic() {
    const navigate = useNavigate();
    const { clinicId } = useParams(); // Obtém o clinicId da URL

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postal_code: '',
        district: '',
        latitude: '',
        longitude: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(true); // Começa como true para carregar dados
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const numericClinicId = parseInt(clinicId);

    // Efeito para carregar os dados da clínica
    useEffect(() => {
        if (isNaN(numericClinicId)) {
            setMessage("ID de clínica inválido.");
            setIsError(true);
            setLoading(false);
            return;
        }

        const fetchClinicData = async () => {
            try {
                // Fetch de todas as clínicas para encontrar a clínica específica (usando API_BASE para GET)
                const response = await fetch(`${API_BASE}/clinics`);
                if (!response.ok) throw new Error("Falha ao carregar a lista de clínicas.");
                const clinicsData = await response.json();

                const clinic = clinicsData.find(c => c.clinic_id === numericClinicId);

                if (!clinic) {
                    throw new Error(`Clínica com ID ${clinicId} não encontrada.`);
                }

                // Popula o formulário com os dados existentes
                setFormData({
                    name: clinic.name || '',
                    phone: clinic.phone || '',
                    email: clinic.email || '',
                    address: clinic.address || '',
                    city: clinic.city || '',
                    postal_code: clinic.postal_code || '',
                    district: clinic.district || '',
                    // Converte para string para InputField type="number"
                    latitude: clinic.latitude !== undefined ? String(clinic.latitude) : '',
                    longitude: clinic.longitude !== undefined ? String(clinic.longitude) : '',
                    // Normaliza para booleano
                    is_active: clinic.is_active === true || String(clinic.is_active).toLowerCase() === 'true',
                });

            } catch (err) {
                console.error("Erro ao carregar dados da clínica:", err);
                setMessage(err.message);
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchClinicData();
    }, [numericClinicId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação simples para campos obrigatórios
        const requiredFields = ['name', 'email', 'address', 'city', 'postal_code', 'district', 'latitude', 'longitude'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setMessage(`O campo '${field}' é obrigatório.`);
                setIsError(true);
                return;
            }
        }

        setLoading(true);
        setMessage(null);
        setIsError(false);

        const clinicUpdateData = {
            // O ID é incluído no corpo para consistência, mas o PATCH usa a URL.
            clinic_id: numericClinicId,
            name: formData.name,
            phone: formData.phone || "",
            email: formData.email,
            location: {
                lat: parseFloat(formData.latitude),
                lon: parseFloat(formData.longitude),
            },
            address: formData.address,
            city: formData.city,
            postal_code: formData.postal_code,
            district: formData.district,
            is_active: formData.is_active,
        };

        try {
            // Requisição PATCH para o endpoint PAPI, usando o ID na URL
            const response = await fetch(`${API_PAPI}/clinics/${numericClinicId}`, {
                method: 'PATCH', // Alterado para PATCH
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clinicUpdateData),
            });

            if (!response.ok) {
                let errorDetails = `Falha ao atualizar clínica. Código: ${response.status}.`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    // Ignora se não houver corpo JSON
                }
                throw new Error(errorDetails);
            }

            setMessage(`Clínica "${formData.name}" atualizada com sucesso! A redirecionar...`);
            setIsError(false);

            // Redirecionar para o dashboard de clínicas após 3 segundos
            setTimeout(() => {
                navigate('/dashboard-clinics');
            }, 3000);

        } catch (err) {
            console.error("Erro ao atualizar clínica:", err);
            setMessage(err.message || "Erro desconhecido ao tentar atualizar a clínica.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading && numericClinicId) return <DetailedLoadingState message="A carregar dados da clínica..." />;
    if (isError && !loading) return <ErrorMessage message={message} onBack={() => navigate('/dashboard-clinics')} backLabel="Voltar ao Dashboard" />;

    return (
        <PageWrapper maxWidth="max-w-3xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.secondary }}
            >
                <ArrowLeft size={16} /> Voltar
            </button>

            <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: colors.secondary }}>
                Editar Clínica (ID: {clinicId})
            </h1>

            <Card>
                <CardHeader spacing="medium" borderBottom>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                            Detalhes da Clínica
                        </h2>
                    </div>
                </CardHeader>

                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Nome e Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                id="name"
                                label="Nome da Clínica"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                icon={Building}
                                placeholder="Ex: Clínica Boa Saúde"
                                name="name"
                            />
                            <InputField
                                id="email"
                                label="Email *"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                icon={Mail}
                                placeholder="exemplo@clinica.com"
                                name="email"
                            />
                        </div>

                        {/* Telefone e Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                id="phone"
                                label="Telefone (Opcional)"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                icon={Phone}
                                placeholder="Ex: 212345678"
                                name="phone"
                            />
                            <div className="flex items-center pt-8">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="h-5 w-5 rounded border-gray-300"
                                    style={{ color: colors.primary, accentColor: colors.primary }}
                                />
                                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                                    Clínica Ativa no Sistema
                                </label>
                            </div>
                        </div>

                        <Card variant="light" padding="small">
                            <h3 className="text-lg font-semibold mb-3" style={{ color: colors.secondary }}>
                                Morada
                            </h3>
                            <div className="space-y-4">
                                <InputField
                                    id="address"
                                    label="Rua / Endereço *"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    icon={MapPin}
                                    placeholder="Ex: Rua da Saúde, 123"
                                    name="address"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        id="city"
                                        label="Cidade *"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: Porto"
                                        name="city"
                                    />
                                    <InputField
                                        id="district"
                                        label="Distrito *"
                                        type="text"
                                        value={formData.district}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: Porto"
                                        name="district"
                                    />
                                </div>
                                <InputField
                                    id="postal_code"
                                    label="Código Postal *"
                                    type="text"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: 4000-001"
                                    name="postal_code"
                                />
                            </div>
                        </Card>

                        <Card variant="light" padding="small">
                            <h3 className="text-lg font-semibold mb-3" style={{ color: colors.secondary }}>
                                Coordenadas (Para Mapa)
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    id="latitude"
                                    label="Latitude *"
                                    type="number"
                                    step="any"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: 41.1579"
                                    name="latitude"
                                />
                                <InputField
                                    id="longitude"
                                    label="Longitude *"
                                    type="number"
                                    step="any"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: -8.6291"
                                    name="longitude"
                                />
                            </div>
                        </Card>

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
                            disabled={loading}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
                            style={{
                                backgroundColor: loading ? '#9CA3AF' : colors.accent1,
                                color: colors.white,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.secondary)}
                            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.accent1)}
                        >
                            {loading ? 'A Atualizar...' : <><Pencil size={20} /> Atualizar Clínica</>}
                        </button>
                    </form>
                </CardBody>
            </Card>
        </PageWrapper>
    );
}