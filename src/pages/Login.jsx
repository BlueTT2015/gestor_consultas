// src/pages/Login.jsx

export default function Login() {
    return (
        <>
            <h1>Login</h1>

            <form>
                <div>
                    <label email="email">Email</label>
                </div>
                <div>
                    <input type="email" id="email" placeholder="seu@gmail.com" required />
                </div>
                <div>
                    <label password="password">Password</label>
                </div>
                <div>
                    <input type="password" id="password" placeholder="password" required />
                </div>
                <div>
                    <label for="remember">Lembrar-me</label>
                    <input type="checkbox" id="remember" /><br/>
                    <a href="/auth/forgot-password">Esqueci-me da password</a>
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Não tem uma conta? <a href="/auth/register">Criar Conta</a></p>
    </>
    );
}