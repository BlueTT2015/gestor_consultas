// src/pages/Register.jsx

export default function Register() {
    return (
        <>
            <h1>Register</h1>

            <form>
                <div>
                    <label htmlFor="name">Nome</label>
                </div>
                <div>
                    <input
                        type="text"
                        id="name"
                        placeholder="O teu nome"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        placeholder="exemplo@gmail.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        placeholder="password"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirmar Password</label>
                </div>
                <div>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="confirmar password"
                        required
                    />
                </div>

                <button type="submit">Criar Conta</button>
            </form>

            <p>Já tem conta? <a href="/auth/login">Login</a></p>
        </>
    );
}
