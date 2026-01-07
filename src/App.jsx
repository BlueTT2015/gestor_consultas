import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import './App.css';
import MainLayout from "./layouts/MainLayout";

// Importação das páginas (Mantive as tuas importações originais)
import Home from './pages/Home';
import About from './pages/About';
import Forum from './pages/Forum';
import NotFound from './pages/NotFound';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import Clinics from "./pages/Clinics.jsx";
import DashboardAppointments from "./pages/DashboardAppointments.jsx";
import Appointment from "./pages/Appointment.jsx";
import ClinicDoctors from "./pages/ClinicDoctors.jsx";
import DashboardUsers from "./pages/DashboardUsers.jsx";
import PatientProfile from "./pages/PatientProfile.jsx";
import PatientAppointments from "./pages/PatientAppointments.jsx";
import DashboardClinicStaff from "./pages/DashboardClinicStaff.jsx";
import DashboardClinics from "./pages/DashboardClinics.jsx";
import DashboardClinicAppointments from "./pages/DashboardClinicAppointments.jsx";
import DashboardDoctorAppointment from "./pages/DashboardDoctorAppointment.jsx";
import CreateClinic from "./pages/CreateClinic.jsx";
import EditClinic from "./pages/EditClinic.jsx";
import DashboardSpecialties from "./pages/DashboardSpecialties.jsx";
import CreateSpecialty from "./pages/CreateSpecialty.jsx";
import EditSpecialty from "./pages/EditSpecialty.jsx";
import CreateUser from "./pages/CreateUser.jsx";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />}>

                    {/* === ROTAS PÚBLICAS === */}
                    <Route path="/" index element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                    {/* Listagens Públicas (Medicos e Clinicas) */}
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/doctors/:doctorId" element={<DoctorProfile/>} />
                    <Route path="/clinics" element={<Clinics />} />
                    <Route path="/clinic/:clinicId" element={<ClinicDoctors />} />


                    {/* === ÁREA DO PACIENTE (Patient + Admin) === */}
                    {/* Acesso: Paciente, Admin. (Médicos e Assistentes tb podem marcar para si mesmos? Se sim, adiciona-os) */}
                    <Route
                        path="/appointment"
                        element={
                            <ProtectedRoute allowedRoles={['patient', 'admin']}>
                                <Appointment/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient-appointments/:patientId"
                        element={
                            <ProtectedRoute allowedRoles={['patient', 'admin']}>
                                <PatientAppointments/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient/:patientId"
                        element={
                            // Médicos também podem ver perfil do paciente
                            <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                                <PatientProfile/>
                            </ProtectedRoute>
                        }
                    />


                    {/* === ÁREA DO MÉDICO (Doctor + Admin) === */}
                    <Route
                        path="/dashboard-doctor-appointment/:doctorId"
                        element={
                            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                                <DashboardDoctorAppointment/>
                            </ProtectedRoute>
                        }
                    />


                    {/* === ÁREA DO ASSISTENTE / GESTOR DE CLÍNICA (Manager + Admin) === */}
                    <Route
                        path="/dashboard-clinic-staff/:managerId"
                        element={
                            <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                <DashboardClinicStaff/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard-clinic-appointment/:managerId"
                        element={
                            <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                <DashboardClinicAppointments />
                            </ProtectedRoute>
                        }
                    />
                    {/* Assumo que o Gestor pode ver DashboardClinics mas apenas da sua? Ou lista de clínicas para editar? */}
                    <Route
                        path="/dashboard-clinics"
                        element={
                            <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                <DashboardClinics />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-clinic/:clinicId"
                        element={
                            <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                <EditClinic />
                            </ProtectedRoute>
                        }
                    />


                    {/* === ÁREA DO ADMINISTRADOR (Apenas Admin) === */}
                    <Route
                        path="/dashboard-users"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <DashboardUsers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard-appointments"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <DashboardAppointments/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create-clinic"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <CreateClinic />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard-specialties"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <DashboardSpecialties/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create-specialty"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <CreateSpecialty />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-specialty/:specialtyId"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <EditSpecialty />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create-user"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <CreateUser />
                            </ProtectedRoute>
                        }
                    />

                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}