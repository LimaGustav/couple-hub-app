import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await authService.login(username, password);
            login(response.token, response.user, rememberMe);
            navigate("/");
        } catch (err: any) {
            console.error("Erro na autenticação:", err);
            setError(
                "Credenciais inválidas."
            );
        } finally {
            setIsSubmitting(false);
        }
    };





    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-background text-foreground overflow-hidden font-dm-sans">

            {/* --- FORMAS ABSTRATAS DE FUNDO --- */}
            <div className="absolute top-[-150px] right-[-100px] w-[400px] height-[400px] h-[400px] rounded-full bg-[#fcebef] opacity-70 z-1" />
            <div className="absolute bottom-[-50px] left-[-50px] w-[250px] h-[250px] rounded-full bg-[#fcebef] opacity-50 z-1" />
            <div className="absolute top-[30%] left-[15%] w-5 h-5 rounded-full bg-secondary z-1" />
            <div className="absolute bottom-[25%] right-[15%] w-3 h-3 rounded-full bg-secondary z-1" />

            {/* --- CARD DE LOGIN --- */}
            <div className="relative z-10 w-full max-w-[440px] p-6">
                <div className="bg-card rounded-[24px] px-8 py-10 shadow-[0_12px_40px_rgba(181,23,75,0.04)] border border-border text-center">

                    {/* Logo & Cabeçalho */}
                    <div className="mb-8">
                        <h1 className="text-[26px] font-bold text-primary flex items-center justify-center gap-1.5 font-playfair">
                            ❤️ Couple Hub
                        </h1>
                        <span className="text-[11px] uppercase tracking-[1.5px] text-muted-foreground block mt-1 font-dm-mono">
                            O Hub do Casal
                        </span>
                    </div>

                    {/* Boas-vindas */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-foreground">Bem-vindo!</h2>
                        <p className="text-js text-[13px] text-muted-foreground mt-1">
                            Entre para se conectar com o seu amor
                        </p>
                    </div>



                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="text-left">

                        {/* Input de E-mail */}
                        <div className="mb-5">
                            <label htmlFor="username" className="block text-[13px] font-medium text-foreground mb-2">
                                Usuario de acesso
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-base text-muted-foreground">✉️</span>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-border bg-input-background text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
                                    placeholder="Usuario"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Input de Senha */}
                        <div className="mb-5">
                            <label htmlFor="password" className="block text-[13px] font-medium text-foreground mb-2">
                                Sua senha
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-base text-muted-foreground">🔒</span>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-border bg-input-background text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
                                    placeholder="••••••••"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Mensagem de Erro */}
                        {error && (
                            <div className="mb-5 p-3.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
                                {error}
                            </div>
                        )}

                        {/* Opções Extras (Lembrar-me / Esqueci a senha) */}
                        <div className="flex items-center justify-between text-[13px] mb-7">
                            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded accent-primary border-border cursor-pointer"
                                    disabled={isSubmitting}
                                />
                                Lembrar de mim
                            </label>
                            <a
                                href="#forgot"
                                onClick={(e) => { e.preventDefault(); alert("Funcionalidade de esqueci a senha em desenvolvimento."); }}
                                className="text-primary font-medium hover:underline transition-all"
                            >
                                Esqueceu a senha?
                            </a>
                        </div>

                        {/* Botão Principal */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground font-semibold text-base py-3.5 rounded-xl shadow-[0_4px_12px_rgba(181,23,75,0.2)] hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                "Entrar no Hub"
                            )}
                        </button>
                    </form>

                    {/* Rodapé do Card */}
                    <div className="mt-7 text-[13px] text-muted-foreground">
                        Ainda não tem conta?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="text-primary font-semibold hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
                        >
                            Cadastre-se
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );


}
