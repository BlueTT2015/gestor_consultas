// src/pages/Home.jsx

export default function Home() {
    return (
        <>
            <div>
                <h1>MedHub</h1>
                <h2>
                    Bem-vindo à MedHub, a plataforma onde qualquer pessoa
                    pode gerir consultas de forma simples e organizada.
                </h2>

                <section>
                    <h3>O que pode fazer aqui?</h3>
                    <ul>
                        📅 Marcar consultas<br/>
                        🔍 Ver consultas agendadas<br/>
                        🩺 Médicos podem gerir a sua agenda<br/>
                        📁 Acesso ao perfil e informações de cada utilizador<br/>
                        📨 Consultas histórico<br/>
                    </ul>
                </section>

                <section>
                    <h2>Como funciona?</h2>
                    <p>
                        Dependendo do tipo de utilizador, a MedHub adapta-se às suas necessidades:
                    </p>
                    <ul>
                        <strong>Paciente:</strong> marca consultas, vê as suas marcações e
                        acede ao seu perfil completo.<br/>
                        <strong>Assistente:</strong> gere consultas de vários pacientes e
                        apoia a organização do consultório.<br/>
                        <strong>Médico:</strong> controla as consultas marcadas, acede aos
                        detalhes dos pacientes e organiza a sua agenda clínica.<br/>
                    </ul>
                </section>

                <section>
                    <h2>Começar</h2>
                    <p>
                        Use o menu acima para navegar. Caso não tenha conta, crie uma. Se já tem,
                        faça login e continue o que estava a fazer. Qualquer dúvida pode nos contactar através
                        dos nossos contactos a baixo.
                    </p>
                </section>
            </div>
        </>
    );
}
