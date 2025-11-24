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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
  );
}
