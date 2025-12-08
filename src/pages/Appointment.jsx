import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import InputField from "../components/forms/InputField";
import { Send, User, Building } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE, API_PAPI } from '../utils/constants'; // MODIFICADO: Importado API_PAPI
import { DetailedLoadingState } from '../components/common/LoadingState';

export default function Appointment() {
    const navigate = useNavigate();
    const location = useLocation();

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
                const doctorsRes = await fetch(`${API_BASE}/doctors`);
                const doctorsList = await doctorsRes.json();
                const doctor = doctorsList.find(d => String(d.doctor_id) === String(doctorIdFromState));

                if (doctor) {
                    const usersRes = await fetch(`${API_BASE}/users`);
                    const usersData = await usersRes.json();
                    const user = usersData.find(u => u.user_id === doctor.user_id && u.role === "doctor");

                    setDoctorName(user ? `Dr. ${user.first_name} ${user.last_name}` : `Médico #${doctor.doctor_id}`);
                }

                const docClinicsRes = await fetch(`${API_BASE}/doctors-clinics`);
                if (!docClinicsRes.ok) throw new Error("Falha ao carregar associações médico-clínica.");
                const docClinicsData = await docClinicsRes.json();

                const clinicIds = docClinicsData
                    .filter(dc => String(dc.doctor_id) === String(doctorIdFromState))
                    .map(dc => dc.clinic_id);

                const clinicsRes = await fetch(`${API_BASE}/clinics`);
                if (!clinicsRes.ok) throw new Error("Falha ao carregar lista de clínicas.");
                const allClinics = await clinicsRes.json();

                const filteredClinics = allClinics.filter(clinic => clinicIds.includes(clinic.clinic_id));

                setAssociatedClinics(filteredClinics);

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

        setLoading(true);
        setMessage(null);
        setIsError(false);

        // 1. Calcular start e end (no formato ISO, com 60 min de duração)
        // Cria um objeto Date combinando a data e hora do formulário
        // A string gerada é 'YYYY-MM-DDTHH:MM:00' e o construtor Date() a interpreta como hora local
        const startDateTime = new Date(`${formData.date}T${formData.time}:00`);

        if (isNaN(startDateTime.getTime())) {
            setMessage("Data ou hora de consulta inválida.");
            setIsError(true);
            setLoading(false);
            return;
        }

        // Adiciona 60 minutos (60 * 60 * 1000 milissegundos) para calcular o 'end'
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        // 2. Construir o payload com os nomes de campos esperados pela API (camelCase/ID)
        const appointmentData = {
            // Campos esperados pela API (ID é mockado seguindo o padrão de CreateClinic)
            id: Math.floor(Math.random() * 1000) + 100,
            patientId: 1, // Paciente hardcoded para o exemplo
            doctorId: parseInt(formData.doctor_id),
            clinicId: parseInt(formData.clinic_id),
            slotId: null, // Não está no formulário, opcional
            start: startDateTime.toISOString(), // Data/hora de início (ISO 8601)
            end: endDateTime.toISOString(),     // Data/hora de fim (ISO 8601)
            status: 'scheduled',
            reason: formData.reason,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };


        try {
            // MODIFICADO: Utilização do API_PAPI para a requisição POST
            const response = await fetch(`${API_PAPI}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                let errorDetails = `Falha ao agendar consulta. Código: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                }
                throw new Error(errorDetails);
            }

            const result = await response.json();
            setMessage(`Consulta agendada com sucesso! ID da Consulta: ${result.appointment_id || 'N/A'}`);
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

    if (!doctorIdFromState) {
        return (
            <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
                <Card variant="error" className="max-w-md mx-auto my-10">
                    <CardBody className="text-center">
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
            </div>
        );
    }

    if (loading && associatedClinics.length === 0) {
        return <DetailedLoadingState message="A carregar clínicas associadas..." />;
    }

    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-3xl mx-auto px-4">

                <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: colors.secondary }}>
                    Marcar Nova Consulta
                </h1>

                <Card>
                    <CardHeader spacing="medium" borderBottom>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                                Agendamento
                            </h2>
                        </div>
                    </CardHeader>

                    <CardBody>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                <p className="font-medium text-gray-600 mb-1">Médico:</p>
                                <div className="flex items-center gap-3">
                                    <User size={20} className="text-blue-500" />
                                    <span className="text-lg font-bold" style={{ color: colors.secondary }}>
                                        {doctorName}
                                    </span>
                                </div>
                                <input
                                    type="hidden"
                                    name="doctor_id"
                                    value={formData.doctor_id}
                                />
                            </div>

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
                                        style={{ borderColor: colors.accent2, focusColor: colors.primary }}
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

                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    id="date"
                                    label="Data"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <InputField
                                    id="time"
                                    label="Hora"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    step="1"
                                />
                            </div>

                            <InputField
                                id="reason"
                                label="Motivo da Consulta"
                                type="textarea"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                placeholder="Descreva brevemente o motivo da sua consulta..."
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

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm font-medium px-4 py-2 rounded-lg"
                        style={{ color: colors.secondary, backgroundColor: colors.white }}
                    >
                        Cancelar e Voltar
                    </button>
                </div>

            </div>
        </div>
    );
}