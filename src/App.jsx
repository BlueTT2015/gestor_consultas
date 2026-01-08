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
                    <Route path="/doctors/:doctorId" element={<DoctorProfile/>} />
                    <Route path="/clinics" element={<Clinics />} />
                    <Route path="/clinic/:clinicId" element={<ClinicDoctors />} />


                    {/* --- ROTAS PROTEGIDAS (Por Função) --- */}
                    {/* Nota: O Admin tem acesso a todas estas rotas automaticamente devido à lógica no ProtectedRoute */}

                    {/* 1. PACIENTES */}
                    {/* Apenas pacientes marcam consultas pela interface principal */}
                    <Route path="/appointment" element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Appointment/>
                        </ProtectedRoute>
                    } />

                    {/* Perfil e Histórico: Paciente vê o seu, Médicos e Staff veem para trabalhar */}
                    <Route path="/patient/:patientId" element={
                        <ProtectedRoute allowedRoles={['patient', 'doctor', 'manager', 'assistant']}>
                            <PatientProfile/>
                        </ProtectedRoute>
                    } />
                    <Route path="/patient-appointments/:patientId" element={
                        <ProtectedRoute allowedRoles={['patient', 'doctor', 'manager', 'assistant']}>
                            <PatientAppointments/>
                        </ProtectedRoute>
                    } />


                    {/* 2. GESTORES E ASSISTENTES (CLÍNICA) */}
                    {/* Staff da Clínica: Apenas Gestores (Assistentes não gerem staff) */}
                    <Route path="/dashboard-clinic-staff/:managerId" element={
                        <ProtectedRoute allowedRoles={['manager']}>
                            <DashboardClinicStaff/>
                        </ProtectedRoute>
                    } />

                    {/* Consultas da Clínica: Gestores e Assistentes precisam ver */}
                    <Route path="/dashboard-clinic-appointment/:managerId" element={
                        <ProtectedRoute allowedRoles={['manager', 'assistant']}>
                            <DashboardClinicAppointments />
                        </ProtectedRoute>
                    } />


                    {/* 3. MÉDICOS */}
                    {/* Dashboard pessoal do médico */}
                    <Route path="/dashboard-doctor-appointment/:doctorId" element={
                        <ProtectedRoute allowedRoles={['doctor']}>
                            <DashboardDoctorAppointment/>
                        </ProtectedRoute>
                    } />


                    {/* 4. ADMINISTRADOR (Rotas Exclusivas) */}
                    {/* Dashboards Globais de Gestão */}
                    <Route path="/dashboard-appointments" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <DashboardAppointments/>
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard-users" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <DashboardUsers />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard-clinics" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <DashboardClinics />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard-specialties" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <DashboardSpecialties/>
                        </ProtectedRoute>
                    } />

                    {/* Criação e Edição de Entidades */}
                    <Route path="/create-clinic" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <CreateClinic />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-clinic/:clinicId" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <EditClinic />
                        </ProtectedRoute>
                    } />
                    <Route path="/create-specialty" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <CreateSpecialty />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-specialty/:specialtyId" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <EditSpecialty />
                        </ProtectedRoute>
                    } />
                    <Route path="/create-user" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <CreateUser />
                        </ProtectedRoute>
                    } />

                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}