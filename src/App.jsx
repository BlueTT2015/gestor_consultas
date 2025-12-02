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
import PerfilMedico from "./pages/PerfilMedico.jsx";
import PerfilClient from "./pages/PerfilClient.jsx";
import Clinics from "./pages/Clinics.jsx";
import DashboardDoctor from "./pages/DashboardDoctor.jsx";
import DashboardClient from "./pages/DashboardClient.jsx";
import DashboardGlobal from "./pages/DashboardGlobal.jsx";
import DashboardUser from "./pages/DashboardUser.jsx";
import Consulta from "./pages/Consulta.jsx";
import MedicoDisponibilidade from "./pages/MedicoDisponibilidade.jsx";
import DashboardClinic from "./pages/DashboardClinic.jsx";

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
              <Route path="/doctor/me" element={<PerfilMedico/>} />
              <Route path="/client/me" element={<PerfilClient />} />
              <Route path="/clinics" element={<Clinics />} />
              <Route path="/doctor/dashboard/me" element={<DashboardDoctor />} />
              <Route path="/client/dashboard/me" element={<DashboardClient />} />
              <Route path="/dashboard" element={<DashboardGlobal/>} />
              <Route path="/dashboard/me" element={<DashboardUser />} />
              <Route path="/consulta" element={<Consulta/>} />
              <Route path="/doctor/avaliability" element={<MedicoDisponibilidade/>} />
              <Route path="/clinic/dashboard" element={<DashboardClinic/>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
  );
}
