import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const USERS: Record<string, { pass: string; level: number }> = {
  admin: { pass: "DPA-2027", level: 3 },
  daniel: { pass: "research01", level: 2 },
  ingrid: { pass: "bio-secure", level: 1 },
};

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text]);
  return displayed;
}

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const header = useTypewriter("SISTEMA DE AUTENTICAÇÃO — DPA/SEC-7", 40);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const u = user.toLowerCase();
      if (USERS[u] && USERS[u].pass === pass) {
        sessionStorage.setItem("auth", "true");
        sessionStorage.setItem("level", String(USERS[u].level));
        sessionStorage.setItem("user", u);
        navigate("/dashboard");
      } else {
        setAttempts((a) => a + 1);
        setError(`ACESSO NEGADO — ID OU CREDENCIAL INVÁLIDA [ERR_${String(attempts + 1).padStart(3, "0")}]`);
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="scanlines min-h-screen bg-background font-mono flex items-center justify-center p-4 crt-vignette">
      {/* Moving scanline */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 h-8 w-full opacity-10"
        style={{
          background: "linear-gradient(to bottom, transparent, hsl(187 100% 80% / 0.15), transparent)",
          animation: "scanline 8s linear infinite",
        }}
      />

      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md relative">
        {/* Corner decorations */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary" />
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary" />

        <div className="bg-card border border-border p-8 space-y-6">
          {/* Logo & Title */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={logo}
                  alt="DPA"
                  className="h-16 w-16 opacity-90"
                  style={{ filter: "drop-shadow(0 0 8px hsl(187 100% 50% / 0.4))" }}
                />
                <div className="absolute inset-0 rounded-full animate-pulse-cyan" />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground tracking-widest mb-1">
                {header}<span className="animate-blink text-primary">█</span>
              </div>
              <h1 className="text-primary font-bold text-lg tracking-widest">ACESSO RESTRITO</h1>
              <p className="text-xs text-muted-foreground tracking-wider">Diretoria de Pesquisa Avançada</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground tracking-widest uppercase block">
                {">"} ID do Usuário
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
                placeholder="identificador..."
                autoComplete="off"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground tracking-widest uppercase block">
                {">"} Senha de Acesso
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="border border-alert-red bg-card p-3">
                <p className="text-xs text-alert-red font-bold tracking-wide animate-flicker">{error}</p>
                {attempts >= 3 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ⚠ Múltiplas falhas registradas. Atividade monitorada.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 font-bold text-xs tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ animation: loading ? "none" : "" }}
            >
              {loading ? "► AUTENTICANDO..." : "► AUTENTICAR"}
            </button>
          </form>

          {/* Warning */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Todas as atividades são monitoradas e registradas.<br />
              <span className="text-alert-red">Acesso não autorizado será investigado.</span>
            </p>
          </div>
        </div>

        {/* Attempt counter */}
        {attempts > 0 && (
          <div className="mt-2 text-right">
            <span className="text-xs text-muted-foreground">
              TENTATIVAS: <span className="text-alert-red">{attempts}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
