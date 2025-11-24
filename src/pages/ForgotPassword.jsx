export default function ForgotPassword() {
    return (
        <>
            <h1>Recuperar Password</h1>

            <form>
                <div>
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        placeholder="seu@gmail.com"
                        required
                    />
                </div>

                <button type="submit">Enviar link de recuperação</button>
            </form>

            <p>Lembrou-se? <a href="/auth/login">Voltar ao Login</a></p>
        </>
    );
}




