import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import InputField from "../components/forms/InputField";
import PageWrapper from "../components/PageWrapper";
import { Send, Building, MapPin, Mail, Phone, ClipboardCheck, ArrowLeft } from 'lucide-react';
import { colors } from "../config/colors";
import {API_PAPI, API_UXAPI} from '../utils/constants';
import { DetailedLoadingState, ErrorMessage } from '../components/common/LoadingState';

export default function CreateClinic() {
    const navigate = useNavigate();

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
        is_active: true, // Default to active
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        const clinicData = {
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
            id: 100,
            createdAt: new Date(),
        };

        try {
            const response = await fetch(`${API_UXAPI}/clinic`, {
                method: 'POST',
                'Content-Type': 'application/json',
                headers: {
                    client_id: import.meta.env.VITE_PAPI_CLIENT_ID,
                    client_secret: import.meta.env.VITE_PAPI_CLIENT_SECRET
                },
                body: JSON.stringify(clinicData),
            });

            if (!response.ok) {
                let errorDetails = `Falha ao criar clínica. Código: ${response.status}.`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    throw new Error(errorDetails);
                }
            }

            setMessage(`Clínica criada com sucesso! A redirecionar...`);
            setIsError(false);

            // Limpar formulário
            setFormData({
                name: '', phone: '', email: '', address: '', city: '', postal_code: '', district: '', latitude: '', longitude: '', is_active: true,
            });

            // Redirecionar para o dashboard de clínicas após 3 segundos
            setTimeout(() => {
                navigate('/dashboard-clinics');
            }, 3000);

        } catch (err) {
            console.error("Erro ao criar clínica:", err);
            setMessage(err.message || "Erro desconhecido ao tentar criar a clínica.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

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
                Criar Nova Clínica
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
                            {loading ? 'A Criar...' : <><ClipboardCheck size={20} /> Criar Clínica</>}
                        </button>
                    </form>
                </CardBody>
            </Card>
        </PageWrapper>
    );
}