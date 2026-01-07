import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from "../components/Card";
import CardBody from "../components/CardBody";
import CardHeader from "../components/CardHeader";
import InputField from "../components/forms/InputField";
import { Send, User, Building } from 'lucide-react';
import { colors } from "../config/colors";
import { API_BASE } from '../utils/constants';
import { DetailedLoadingState } from '../components/common/LoadingState';

export default function Appointment() {
    const navigate = useNavigate();
    const location = useLocation();

    // Se vier redirecionado com estado, usamos esse ID como valor inicial
    const doctorIdFromState = location.state?.doctorId || '';

    const [formData, setFormData] = useState({
        clinic_id: '',
        doctor_id: doctorIdFromState, // Inicia com o valor do state ou vazio
        date: '',
        time: '',
        status: 'confirmed',
        reason: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // Listas para os dropdowns
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [associatedClinics, setAssociatedClinics] = useState([]);

    // 1. Carregar a lista de médicos ao entrar na página
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Buscamos users e doctors para cruzar os dados (nome + id)
                const [usersRes, doctorsRes] = await Promise.all([
                    fetch(`${API_BASE}/users`),
                    fetch(`${API_BASE}/doctors`)
                ]);

                if (!usersRes.ok || !doctorsRes.ok) throw new Error("Erro ao carregar lista de médicos.");

                const usersData = await usersRes.json();
                const doctorsData = await doctorsRes.json();

                // Mapear para criar uma lista limpa: { id: doctor_id, name: "Dr. João Silva" }
                const formattedDoctors = doctorsData.map(doc => {
                    const userProfile = usersData.find(u => u.user_id === doc.user_id);
                    return {
                        id: doc.doctor_id,
                        name: userProfile ? `Dr. ${userProfile.first_name} ${userProfile.last_name}` : `Médico #${doc.doctor_id}`,
                        specialty: doc.specialty_id // Opcional, se quiseres filtrar por especialidade depois
                    };
                });

                setAvailableDoctors(formattedDoctors);

            } catch (err) {
                console.error("Erro ao carregar médicos:", err);
                setMessage("Não foi possível carregar a lista de médicos.");
                setIsError(true);
            }
        };

        fetchDoctors();
    }, []);

    // 2. Sempre que o médico selecionado mudar (formData.doctor_id), carregar as clínicas dele
    useEffect(() => {
        const fetchDoctorClinics = async () => {
            // Se não houver médico selecionado, limpa as clínicas e retorna
            if (!formData.doctor_id) {
                setAssociatedClinics([]);
                setFormData(prev => ({ ...prev, clinic_id: '' }));
                return;
            }

            setLoading(true);
            try {
                // Buscar associações
                const docClinicsRes = await fetch(`${API_BASE}/doctors-clinics`);
                const docClinicsData = await docClinicsRes.json();

                // Filtrar clínicas deste médico
                const clinicIds = docClinicsData
                    .filter(dc => String(dc.doctor_id) === String(formData.doctor_id))
                    .map(dc => dc.clinic_id);

                if (clinicIds.length === 0) {
                    setAssociatedClinics([]);
                    setLoading(false);
                    return;
                }

                // Buscar detalhes das clínicas
                const clinicsRes = await fetch(`${API_BASE}/clinics`);
                const allClinics = await clinicsRes.json();

                const filteredClinics = allClinics.filter(clinic => clinicIds.includes(clinic.clinic_id));
                setAssociatedClinics(filteredClinics);

                // Se só houver uma clínica, seleciona-a automaticamente
                if (filteredClinics.length === 1) {
                    setFormData(prev => ({ ...prev, clinic_id: filteredClinics[0].clinic_id }));
                } else {
                    // Se mudar de médico e a clínica anterior não for válida, resetar
                    setFormData(prev => ({ ...prev, clinic_id: '' }));
                }

            } catch (err) {
                console.error("Erro ao carregar clínicas do médico:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorClinics();
    }, [formData.doctor_id]);

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

        const formattedTime = formData.time.length === 5 ? `${formData.time}:00` : formData.time;

        const appointmentData = {
            id: Math.floor(Math.random() * 100000),
            patientId: 4, // Exemplo hardcoded, depois deves usar auth.user.id
            doctorId: parseInt(formData.doctor_id),
            clinicId: parseInt(formData.clinic_id),
            slotId: Math.floor(Math.random() * 1000),
            date: formData.date || "",
            time: formattedTime,
            status: formData.status || "confirmed",
            reason: formData.reason || "",
            createdAt: new Date().toISOString()
        };

        try {
            // Nova API URL
            const response = await fetch('https://es-uxapi-i6d0cd.5sc6y6-3.usa-e2.cloudhub.io/api/booking/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                let errorDetails = `Falha ao agendar. Código: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (e) { }
                throw new Error(errorDetails);
            }

            const result = await response.json();

            if (result.success) {
                setMessage(`Consulta agendada com sucesso!`);
                setIsError(false);
                setFormData(prev => ({
                    ...prev,
                    date: '',
                    time: '',
                    reason: ''
                }));
            } else {
                throw new Error("A API retornou sucesso: false");
            }

        } catch (err) {
            console.error("Erro ao agendar consulta:", err);
            setMessage(err.message || "Erro desconhecido ao tentar agendar.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

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

                            {/* SELEÇÃO DE MÉDICO */}
                            <div>
                                <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Selecione o Médico *
                                </label>
                                <div className="relative">
                                    <select
                                        id="doctor_id"
                                        name="doctor_id"
                                        value={formData.doctor_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border rounded-lg focus:ring-2 appearance-none"
                                        style={{ borderColor: colors.accent2 }}
                                    >
                                        <option value="">-- Escolha um Médico --</option>
                                        {availableDoctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>
                                                {doc.name}
                                            </option>
                                        ))}
                                    </select>
                                    <User size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* SELEÇÃO DE CLÍNICA (Depende do médico) */}
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
                                        className="w-full p-3 border rounded-lg focus:ring-2 appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                                        style={{ borderColor: colors.accent2 }}
                                        disabled={!formData.doctor_id || associatedClinics.length === 0}
                                    >
                                        <option value="">
                                            {!formData.doctor_id
                                                ? "Selecione um médico primeiro"
                                                : associatedClinics.length === 0
                                                    ? "Nenhuma clínica disponível para este médico"
                                                    : "Selecione a Clínica"}
                                        </option>
                                        {associatedClinics.map(clinic => (
                                            <option key={clinic.clinic_id} value={clinic.clinic_id}>{clinic.name}</option>
                                        ))}
                                    </select>
                                    <Building size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

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
                                disabled={loading || !formData.doctor_id || !formData.clinic_id}
                                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
                                style={{
                                    backgroundColor: (loading || !formData.doctor_id || !formData.clinic_id) ? '#9CA3AF' : colors.secondary,
                                    color: colors.white,
                                    cursor: (loading || !formData.doctor_id || !formData.clinic_id) ? 'not-allowed' : 'pointer'
                                }}
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
                        Voltar
                    </button>
                </div>

            </div>
        </div>
    );
}