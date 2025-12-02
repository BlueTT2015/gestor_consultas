// src/pages/Consulta.jsx

import { useState } from "react";

export default function AppointmentForm() {
    const [motivo, setMotivo] = useState("");
    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");
    const [medico, setMedico] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!motivo || !data || !horario || !medico) {
            alert("Preenche tudo antes de enviares.");
            return;
        }

        const consulta = {
            motivo,
            data,
            horario,
            medico,
        };

        console.log("Consulta enviada:", consulta);
        alert("Consulta marcada.");
    }

    return (
        <div>
            <h1>Marcar Consulta</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Motivo:</label><br />
                    <textarea
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        rows={3}
                    />
                </div>

                <div>
                    <label>Data:</label><br />
                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                </div>

                <div>
                    <label>Horário:</label><br />
                    <input
                        type="time"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                    />
                </div>

                <div>
                    <label>Médico:</label><br />
                    <select value={medico} onChange={(e) => setMedico(e.target.value)}>
                        <option value="">Escolhe um médico</option>
                        <option value="Dr. Ana Silva">Dr. Ana Silva</option>
                        <option value="Dr. João Ramos">Dr. João Ramos</option>
                        <option value="Dr. Marta Costa">Dr. Marta Costa</option>
                    </select>
                </div>

                <button type="submit">Marcar Consulta</button>
            </form>
        </div>
    );
}
