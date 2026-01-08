import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import PageWrapper from "../components/PageWrapper";
import InputField from "../components/forms/InputField";
import { Send, User, Building } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE, API_PAPI, API_UXAPI } from '../utils/constants';
import { DetailedLoadingState } from '../components/common/LoadingState';
import { useAuth } from "../contexts/AuthContext";

export default function Appointment() {
    const navigate = useNavigate();
    const location = useLocation();
    // 2. Obter o utilizador logado do contexto
    const { user, token } = useAuth();

    const doctorIdFromState = location.state?.doctorId || null;

    const [formData, setFormData] = useState({
        clinic_id: '',
        doctor_id: doctorIdFromState || '',
        date: '',
        time: '',
        status: 'scheduled',
        reason: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [doctorName, setDoctorName] = useState("Médico Selecionado");
    const [associatedClinics, setAssociatedClinics] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!doctorIdFromState) {
                return;
            }

            setLoading(true);

            try {
                // Fetch Doctor Info
                const doctorsRes = await fetch(`${API_BASE}/doctors`, {
                    method: "GET",
                    headers: {
                        client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                        client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                    }
                });
                const doctorsList = await doctorsRes.json();
                const doctor = doctorsList.find(d => String(d.doctor_id) === String(doctorIdFromState));

                if (doctor) {
                    const usersRes = await fetch(`${API_BASE}/users`, {
                        method: "GET",
                        headers: {
                            client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                            client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                        }
                    });
                    const usersData = await usersRes.json();
                    const userDoctor = usersData.find(u => u.user_id === doctor.user_id && u.role === "doctor");

                    setDoctorName(userDoctor ? `Dr. ${userDoctor.first_name} ${userDoctor.last_name}` : `Médico #${doctor.doctor_id}`);
                }

                // Fetch Clinics associated with the doctor
                const docClinicsRes = await fetch(`${API_BASE}/doctors-clinics`, {
                    method: "GET",
                    headers: {
                        client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                        client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                    }
                });
                if (!docClinicsRes.ok) throw new Error("Falha ao carregar associações médico-clínica.");
                const docClinicsData = await docClinicsRes.json();

                const clinicIds = docClinicsData
                    .filter(dc => String(dc.doctor_id) === String(doctorIdFromState))
                    .map(dc => dc.clinic_id);

                // Fetch All Clinics details
                const clinicsRes = await fetch(`${API_BASE}/clinics`, {
                    method: "GET",
                    headers: {
                        client_id: import.meta.env.VITE_SAPI_CLIENT_ID,
                        client_secret: import.meta.env.VITE_SAPI_CLIENT_SECRET
                    }
                });
                if (!clinicsRes.ok) throw new Error("Falha ao carregar lista de clínicas.");
                const allClinics = await clinicsRes.json();

                const filteredClinics = allClinics.filter(clinic => clinicIds.includes(clinic.clinic_id));

                setAssociatedClinics(filteredClinics);

                // Auto-select if only one clinic
                if (filteredClinics.length === 1) {
                    setFormData(prev => ({ ...prev, clinic_id: filteredClinics[0].clinic_id }));
                }

            } catch (err) {
                console.error("Erro ao carregar dados de agendamento:", err);
                setMessage("Erro ao carregar informações necessárias para o agendamento.");
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [doctorIdFromState]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.doctor_id) {
            setMessage("Por favor, selecione um médico.");
            setIsError(true);
            return;
        }

        if (!formData.clinic_id) {
            setMessage("Por favor, selecione uma clínica.");
            setIsError(true);
            return;
        }

        // Validação de segurança: garantir que temos um utilizador
        if (!user || !user.user_id) {
            setMessage("Erro de autenticação: Não foi possível identificar o utilizador logado.");
            setIsError(true);
            return;
        }

        setLoading(true);
        setMessage(null);
        setIsError(false);

        // Mapeamento para a estrutura exigida pela UXAPI
        const appointmentData = {
            id: 0, // Placeholder, normalmente gerado pelo servidor
            patientId: parseInt(user.user_id),
            doctorId: parseInt(formData.doctor_id),
            clinicId: parseInt(formData.clinic_id),
            slotId: 0, // Placeholder, sem sistema de slots implementado
            date: formData.date || "",
            time: formData.time ? (formData.time.length === 5 ? `${formData.time}:00` : formData.time) : "",
            status: "confirmed", // Conforme solicitado no exemplo
            reason: formData.reason || "",
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_UXAPI}/booking/reserve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                let errorDetails = `Falha ao agendar consulta. Código: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    // Ignora
                }
                throw new Error(errorDetails);
            }

            const result = await response.json();
            setMessage(`Consulta agendada com sucesso!`);
            setIsError(false);

            setFormData(prev => ({
                ...prev,
                date: '',
                time: '',
                reason: ''
            }));

        } catch (err) {
            console.error("Erro ao agendar consulta:", err);
            setMessage(err.message || "Erro desconhecido ao tentar agendar a consulta.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    // Estado de Erro: Sem ID do médico
    if (!doctorIdFromState) {
        return (
            <PageWrapper>
                <Card variant="error" className="max-w-md mx-auto text-center">
                    <CardBody>
                        <h2 className="text-xl font-bold mb-2">Médico Não Selecionado</h2>
                        <p>Por favor, selecione um médico na página de perfis antes de agendar uma consulta.</p>
                        <button
                            onClick={() => navigate('/doctors')}
                            className="mt-4 px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: colors.secondary }}
                        >
                            Ver Médicos
                        </button>
                    </CardBody>
                </Card>
            </PageWrapper>
        );
    }

    // Estado de Carregamento Inicial
    if (loading && associatedClinics.length === 0) {
        return <DetailedLoadingState message="A carregar clínicas associadas..." />;
    }

    // Renderização Principal
    return (
        <PageWrapper maxWidth="max-w-3xl">
            <h1 className="text-4xl font-bold text-center" style={{ color: colors.secondary }}>
                Marcar Nova Consulta
            </h1>

            <Card>
                <CardHeader spacing="medium" borderBottom>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                            Dados do Agendamento
                        </h2>
                    </div>
                </CardHeader>

                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Informação do Médico */}
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                            <p className="font-medium text-gray-600 mb-1">Médico:</p>
                            <div className="flex items-center gap-3">
                                <User size={20} className="text-blue-500" />
                                <span className="text-lg font-bold" style={{ color: colors.secondary }}>
                                    {doctorName}
                                </span>
                            </div>
                            <input type="hidden" name="doctor_id" value={formData.doctor_id} />
                        </div>

                        {/* Seleção de Clínica */}
                        <div>
                            <label htmlFor="clinic_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Clínica *
                            </label>
                            <div className="relative">
                                <select
                                    id="clinic_id"
                                    name="clinic_id"
                                    value={formData.clinic_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 appearance-none"
                                    style={{ borderColor: colors.accent2 }}
                                    disabled={associatedClinics.length === 0}
                                >
                                    <option value="">
                                        {associatedClinics.length > 0 ? "Selecione a Clínica" : "A carregar clínicas..."}
                                    </option>
                                    {associatedClinics.map(clinic => (
                                        <option key={clinic.clinic_id} value={clinic.clinic_id}>{clinic.name}</option>
                                    ))}
                                </select>
                                <Building size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            {associatedClinics.length === 0 && !loading && (
                                <p className="text-xs text-red-500 mt-1">Nenhuma clínica associada encontrada para este médico.</p>
                            )}
                        </div>

                        {/* Data e Hora */}
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                id="date"
                                name="date"
                                label="Data"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <InputField
                                id="time"
                                name="time"
                                label="Hora"
                                type="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                step="1"
                            />
                        </div>

                        {/* Motivo */}
                        <div className="space-y-2">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                Motivo da Consulta *
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                placeholder="Descreva brevemente o motivo da sua consulta..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                            />
                        </div>

                        {/* Mensagens de Feedback */}
                        {message && (
                            <Card
                                variant={isError ? 'error' : 'success'}
                                padding="small"
                                className="text-center"
                            >
                                {message}
                            </Card>
                        )}

                        {/* Botão de Submissão */}
                        <button
                            type="submit"
                            disabled={loading || associatedClinics.length === 0}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
                            style={{
                                backgroundColor: (loading || associatedClinics.length === 0) ? '#9CA3AF' : colors.secondary,
                                color: colors.white,
                                cursor: (loading || associatedClinics.length === 0) ? 'not-allowed' : 'pointer'
                            }}
                            onMouseEnter={(e) => !(loading || associatedClinics.length === 0) && (e.currentTarget.style.backgroundColor = '#1e109d')}
                            onMouseLeave={(e) => !(loading || associatedClinics.length === 0) && (e.currentTarget.style.backgroundColor = colors.secondary)}
                        >
                            {loading ? 'A Agendar...' : <><Send size={20} /> Agendar Consulta</>}
                        </button>
                    </form>
                </CardBody>
            </Card>

            <div className="text-center">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm font-medium px-4 py-2 rounded-lg hover:underline"
                    style={{ color: colors.secondary }}
                >
                    Cancelar e Voltar
                </button>
            </div>
        </PageWrapper>
    );
}