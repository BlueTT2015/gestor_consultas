// src/App.jsx

import {Route, Routes} from "react-router-dom";


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
import DashboardGlobalConsultas from "./pages/DashboardGlobalConsultas.jsx";
import DashboardUser from "./pages/DashboardUsers.jsx";
import Appointment from "./pages/Appointment.jsx";
import ClinicDoctors from "./pages/ClinicDoctors.jsx";
import DashboardUsers from "./pages/DashboardUsers.jsx";
import PatientProfile from "./pages/PatientProfile.jsx";
import PatientAppointments from "./pages/PatientAppointments.jsx";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />}>

                    <Route path="/" index element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />


                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/doctors/:doctorId" element={<DoctorProfile/>} />
                    <Route path="/doctor/me" element={<DoctorProfile/>} />
                    <Route path="/clinics" element={<Clinics />} />
                    <Route path="/dashboard-appointments" element={<DashboardGlobalConsultas/>} />
                    <Route path="/dashboard/me" element={<DashboardUser />} />
                    <Route path="/appointment" element={<Appointment/>} />
                    <Route path="/clinic/:clinicId" element={<ClinicDoctors />} />
                    <Route path="/dashboard-users" element={<DashboardUsers />} />
                    <Route path="/patient/:patientId" element={<PatientProfile/>} />
                    <Route path="/patient-appointments/:patientId" element={<PatientAppointments/>} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}