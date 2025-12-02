// src/pages/Doctors.jsx

import { useEffect, useState } from "react";

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch("https://db-sapi-i6d0cd.5sc6y6-4.usa-e2.cloudhub.io/api/doctors");
                if (!res.ok) throw new Error("Falha ao carregar médicos");
                const data = await res.json();
                setDoctors(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (loading) return <div className="p-4 text-lg">A carregar médicos...</div>;
    if (error) return <div className="p-4 text-red-600">Erro: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Lista de Médicos</h1>

            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Licença</th>
                    <th className="border p-2">Bio</th>
                    <th className="border p-2">Experiência</th>
                    <th className="border p-2">Aceita</th>
                    <th className="border p-2">Ativo</th>
                    <th className="border p-2">Criado</th>
                    <th className="border p-2">Atualizado</th>
                </tr>
                </thead>
                <tbody>
                {doctors.map((doc) => (
                    <tr key={doc.doctor_id} className="text-center">
                        <td className="border p-2">{doc.doctor_id}</td>
                        <td className="border p-2">{doc.license_number}</td>
                        <td className="border p-2">{doc.bio}</td>
                        <td className="border p-2">{doc.years_experience} anos</td>
                        <td className="border p-2">{doc.is_accepting_patients ? "Sim" : "Não"}</td>
                        <td className="border p-2">{doc.is_active ? "Sim" : "Não"}</td>
                        <td className="border p-2">{new Date(doc.created_at).toLocaleDateString()}</td>
                        <td className="border p-2">{new Date(doc.updated_at).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

