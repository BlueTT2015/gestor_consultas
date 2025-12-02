// src/pages/Doctors.jsx

import { useEffect, useState } from "react";

export default function DoctorsTable({ apiUrl }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error("Erro ao carregar dados.");
                }

                const json = await response.json();
                if (!Array.isArray(json)) {
                    throw new Error("A API não devolveu um array.");
                }

                // remover password caso venha
                const sanitized = json.map((item) => {
                    const copy = { ...item };
                    delete copy.password;
                    return copy;
                });

                setData(sanitized);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [apiUrl]);

    if (loading) return <p>A carregar...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (data.length === 0) return <p>Sem dados.</p>;

    const columns = Object.keys(data[0]);

    return (
        <table border="1" cellPadding="8">
            <thead>
            <tr>
                {columns.map((col) => (
                    <th key={col}>{col}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row, i) => (
                <tr key={i}>
                    {columns.map((col) => (
                        <td key={col}>{String(row[col])}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
