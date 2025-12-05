// src/pages/Consulta.jsx

import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import { Send, Calendar, User, Clock, Building } from 'lucide-react';

export default function Consulta() {
    const navigate = useNavigate();
    const location = useLocation();

    // Obter o ID do médico da rota (se vier de DoctorProfile)
    const doctorIdFromState = location.state?.doctorId || null;

    const [formData, setFormData] = useState({
        clinic_id: '',
        doctor_id: doctorIdFromState || '',
        date: '',
        time: '',
        status: 'Agendada', // Status inicial
        reason: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [doctorName, setDoctorName] = useState("Médico Selecionado");
    const [associatedClinics, setAssociatedClinics] = useState([]);

    // Paleta de cores
    const colors = {
        primary: '#54CC90',
        secondary: '#2514BE',
        background: '#F3F7F2',
        white: '#FFFFFF',
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!doctorIdFromState) {
                return;
            }

            setLoading(true);

            try {
                // 1. Fetch Doctor Details (Name)
                const doctorsRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/doctors");
                const doctorsList = await doctorsRes.json();
                const doctor = doctorsList.find(d => String(d.doctor_id) === String(doctorIdFromState));

                if (doctor) {
                    const usersRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/users");
                    const usersData = await usersRes.json();
                    const user = usersData.find(u => u.user_id === doctor.user_id && u.role === "doctor");

                    setDoctorName(user ? `Dr. ${user.first_name} ${user.last_name}` : `Médico #${doctor.doctor_id}`);
                }

                // 2. Fetch Doctor-Clinic Associations
                const docClinicsRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/doctors-clinics");
                if (!docClinicsRes.ok) throw new Error("Falha ao carregar associações médico-clínica.");
                const docClinicsData = await docClinicsRes.json();

                // Filtrar associações pelo ID do médico
                const clinicIds = docClinicsData
                    .filter(dc => String(dc.doctor_id) === String(doctorIdFromState))
                    .map(dc => dc.clinic_id);

                // 3. Fetch All Clinics
                const clinicsRes = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/clinics");
                if (!clinicsRes.ok) throw new Error("Falha ao carregar lista de clínicas.");
                const allClinics = await clinicsRes.json();

                // 4. Filtrar e definir o estado das clínicas
                const filteredClinics = allClinics.filter(clinic => clinicIds.includes(clinic.clinic_id));

                setAssociatedClinics(filteredClinics);

                // Se houver apenas 1 clínica, pré-seleciona
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

        // Prepara os dados a enviar
        const appointmentData = {
            clinic_id: parseInt(formData.clinic_id),
            patient_id: 1, // Valor hardcoded para teste (era 'simulado')
            doctor_id: parseInt(formData.doctor_id),
            date: formData.date,
            time: formData.time,
            duration: 60, // Valor hardcoded para teste (era 'fixo')
            status: formData.status,
            reason: formData.reason,
        };

        try {
            // Chamada POST para o endpoint da API de appointments
            const response = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/appointments", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                // Tenta ler o erro do corpo da resposta, se possível
                let errorDetails = `Falha ao agendar consulta. Código: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) {
                    // Ignora se não for JSON
                }
                throw new Error(errorDetails);
            }

            const result = await response.json();
            setMessage(`Consulta agendada com sucesso! ID da Consulta: ${result.appointment_id || 'N/A'}`);
            setIsError(false);

            // Limpa o formulário (mantendo doctor_id e clinic_id)
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

    // Se o médico não for fornecido, mostra uma mensagem de erro
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

    // Se o carregamento estiver ativo
    if (loading && associatedClinics.length === 0) {
        return (
            <div className="min-h-screen py-10 p-6" style={{ backgroundColor: colors.background }}>
                <Card variant="light" className="max-w-3xl mx-auto h-96">
                    <div className="animate-pulse flex flex-col justify-center items-center h-full">
                        <Calendar size={48} className="mb-4" style={{ color: colors.secondary }} />
                        <div className="h-6 rounded mb-2 w-1/3 bg-gray-200"></div>
                        <div className="h-4 rounded w-1/4 bg-gray-200"></div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10" style={{ backgroundColor: colors.background }}>
            <div className="max-w-3xl mx-auto px-4">

                {/* Cabeçalho */}
                <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: colors.secondary }}>
                    Marcar Nova Consulta
                </h1>

                <Card>
                    <CardHeader spacing="medium" borderBottom>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                                Agendamento
                            </h2>
                            {/* REMOVIDO o indicador de passo (Passo 1 de 2) */}
                        </div>
                    </CardHeader>

                    <CardBody>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Informação do Médico (apenas exibição) */}
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

                            {/* Campo Clínica */}
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

                            {/* Campos Data e Hora */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Data *
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]} // Data mínima hoje
                                        className="w-full p-3 border rounded-lg focus:ring-2"
                                        style={{ borderColor: colors.accent2, focusColor: colors.primary }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                        Hora *
                                    </label>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        step="1"
                                        className="w-full p-3 border rounded-lg focus:ring-2"
                                        style={{ borderColor: colors.accent2, focusColor: colors.primary }}
                                    />
                                </div>
                            </div>

                            {/* Campos Motivo e Duração/ID (Anteriormente visível/simulado) - Duração e ID Removidos */}
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                    Motivo da Consulta *
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    placeholder="Descreva brevemente o motivo da sua consulta..."
                                    className="w-full p-3 border rounded-lg focus:ring-2 resize-none"
                                    style={{ borderColor: colors.accent2, focusColor: colors.primary }}
                                />
                            </div>

                            {/* Mensagem de Feedback */}
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