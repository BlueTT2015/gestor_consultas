// src/App.jsx

import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

import './App.css';

import MainLayout from "./layouts/MainLayout";

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

                    {/* --- ROTAS PÚBLICAS (Acessíveis a qualquer pessoa) --- */}
                    <Route path="/" index element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/forum" element={<Forum />} />

                    {/* Autenticação */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                    {/* Listagens Públicas */}
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/doctors/:doctorId" element={<DoctorProfile/>} /> {/* O perfil público do médico continua visível */}
                    <Route path="/clinics" element={<Clinics />} />
                    <Route path="/clinic/:clinicId" element={<ClinicDoctors />} /> {/* Ver detalhes da clínica continua visível */}


                    {/* --- ROTAS PROTEGIDAS (Apenas utilizadores autenticados) --- */}

                    {/* Dashboards e Agendamentos */}
                    <Route path="/dashboard-appointments" element={<ProtectedRoute><DashboardAppointments/></ProtectedRoute>} />
                    <Route path="/appointment" element={<ProtectedRoute><Appointment/></ProtectedRoute>} />

                    {/* Gestão de Utilizadores e Pacientes */}
                    <Route path="/dashboard-users" element={<ProtectedRoute><DashboardUsers /> </ProtectedRoute>} /> {/* Delete funciona */}
                    <Route path="/patient/:patientId" element={<ProtectedRoute><PatientProfile/></ProtectedRoute>} />
                    <Route path="/patient-appointments/:patientId" element={<ProtectedRoute><PatientAppointments/></ProtectedRoute>} />

                    {/* Gestão de Clínicas e Staff */}
                    <Route path="/dashboard-clinic-staff/:managerId" element={<ProtectedRoute><DashboardClinicStaff/></ProtectedRoute>} />
                    <Route path="/dashboard-clinics" element={<ProtectedRoute><DashboardClinics /></ProtectedRoute>} />
                    <Route path="/dashboard-clinic-appointment/:managerId" element={<ProtectedRoute><DashboardClinicAppointments /></ProtectedRoute>} /> {/* Não dá para dar delete*/}
                    <Route path="/dashboard-doctor-appointment/:doctorId" element={<ProtectedRoute><DashboardDoctorAppointment/></ProtectedRoute>} />

                    {/* Criação e Edição (Admin/Gestão) */}
                    <Route path="/create-clinic" element={<ProtectedRoute><CreateClinic /></ProtectedRoute>} />
                    <Route path="/edit-clinic/:clinicId" element={<ProtectedRoute><EditClinic /></ProtectedRoute>} />
                    <Route path="/dashboard-specialties" element={<ProtectedRoute><DashboardSpecialties/></ProtectedRoute>} /> {/*DELETE funciona*/}
                    <Route path="/create-specialty" element={<ProtectedRoute><CreateSpecialty /></ProtectedRoute>} />
                    <Route path="/edit-specialty/:specialtyId" element={<ProtectedRoute><EditSpecialty /></ProtectedRoute>} />
                    <Route path="/create-user" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />

                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}