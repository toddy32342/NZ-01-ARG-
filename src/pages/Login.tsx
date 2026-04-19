import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"

// ─────────────────────────────────────────────────────────────────
// EDITÁVEL: Logo — altere o caminho se necessário
// ─────────────────────────────────────────────────────────────────
let logo: string;
try { logo = new URL("@/assets/logos.png", import.meta.url).href; } catch { logo = ""; }
// fallback
import logoFallback from "@/assets/logo.png";

// ─────────────────────────────────────────────────────────────────
// EDITÁVEL: Adicione ou altere credenciais aqui.
// level: 1 = acesso básico | 2 = acesso intermediário | 3 = acesso total
// blocked: true = login causa glitch e bloqueio (como Volk)
// ─────────────────────────────────────────────────────────────────
const USERS: Record<string, { pass: string; level: number; blocked?: boolean }> = {
  toddy:  { pass: "salvationofgerman1", level: 3 },   // EDITÁVEL: Diretor — acesso total
  admin:  { pass: "DPA-2027", level: 3 },              // EDITÁVEL: Admin — acesso total
  daniel: { pass: "research01", level: 2 },             // EDITÁVEL: Pesquisador
  ingrid: { pass: "Fritz", level: 1 },             // EDITÁVEL: Biotec
  volk:   { pass: "volk2027", level: 2, blocked: true },// EDITÁVEL: Volk — BLOQUEADO (glitch + travamento)
  premiere: {pass: "nordstern2026", level: 0}
};

// ─────────────────────────────────────────────────────────────────
// EDITÁVEL: Quantidade de tentativas antes do lockout total
// ─────────────────────────────────────────────────────────────────
const MAX_ATTEMPTS = 7;

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
  }, [text, speed]);
  return displayed;
}

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [backLoading, setBackLoading] = useState(false);
  const [locked, setLocked] = useState(false);        // lockout total
  const [volkGlitch, setVolkGlitch] = useState(false); // glitch do Volk
  const [periodicGlitch, setPeriodicGlitch] = useState(false);
  const navigate = useNavigate();
  const logoSrc = logo || logoFallback;
  const glitchTimerRef = useRef<ReturnType<typeof setInterval>>();

  const header = useTypewriter("SISTEMA DE AUTENTICAÇÃO — NordSternLab/SEC-7", 40);

  // Glitch periódico a cada 5 minutos
  useEffect(() => {
    glitchTimerRef.current = setInterval(() => {
      setPeriodicGlitch(true);
      setTimeout(() => setPeriodicGlitch(false), 400);
    }, 5 * 60 * 1000);
    return () => clearInterval(glitchTimerRef.current);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked || volkGlitch) return;
    setError("");
    setLoading(true);

    setTimeout(() => {
      const u = user.toLowerCase();
      const entry = USERS[u];

      // Volk bloqueado — glitch permanente
      if (entry && entry.pass === pass && entry.blocked) {
        setVolkGlitch(true);
        setError("⚠ ACESSO REVOGADO — IDENTIDADE COMPROMETIDA. REINICIE O TERMINAL.");
        setLoading(false);
        return;
      }

      if (entry && entry.pass === pass) {
        sessionStorage.setItem("auth", "true");
        sessionStorage.setItem("level", String(entry.level));
        sessionStorage.setItem("user", u);

        // ─────────────────────────────────────────────────────────────────
        // LÓGICA DE REDIRECIONAMENTO ESPECÍFICO
        // ─────────────────────────────────────────────────────────────────
        if (u === "premiere") {
          navigate("/Anuncio"); // Certifique-se que esta rota existe no seu Router
        } else {
          navigate("/dashboard");
        }
        
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setLocked(true);
          setError(`⚠ TERMINAL BLOQUEADO — ${MAX_ATTEMPTS} TENTATIVAS EXCEDIDAS. ATUALIZE A PÁGINA PARA REINICIAR.`);
        } else {
          setError(`ACESSO NEGADO — ID OU CREDENCIAL INVÁLIDA [ERR_${String(newAttempts).padStart(3, "0")}]`);
        }
      }
      setLoading(false);
    }, 1200);
  };

  const isGlitching = volkGlitch || periodicGlitch;

  return (
    <div className={`scanlines min-h-screen bg-background font-mono flex items-center justify-center p-4 crt-vignette ${isGlitching ? "system-glitch" : ""}`}>
      {/* Volk glass crack */}
      {volkGlitch && <div className="glass-crack-overlay" />}

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
                  src={logoSrc}
                  alt="NordSternLab"
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
              <p className="text-xs text-muted-foreground tracking-wider">NordSternLab — Setor de Segurança Interna</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

          {/* Lockout screen */}
          {locked ? (
            <div className="space-y-4">
              <div className="border border-alert-red bg-card p-4 text-center space-y-2">
                <div className="text-3xl text-alert-red animate-flicker">⛔</div>
                <div className="text-xs text-alert-red font-bold tracking-widest animate-flicker">
                  TERMINAL BLOQUEADO
                </div>
                <p className="text-xs text-muted-foreground">
                  Múltiplas tentativas de acesso não autorizado detectadas.<br />
                  Este incidente foi registrado. Atualize a página para reiniciar.
                </p>
              </div>
            </div>
          ) : (
            /* Form */
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
                  disabled={volkGlitch}
                  className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground disabled:opacity-30"
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
                  disabled={volkGlitch}
                  className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground disabled:opacity-30"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="border border-alert-red bg-card p-3">
                  <p className="text-xs text-alert-red font-bold tracking-wide animate-flicker">{error}</p>
                  {attempts >= 3 && attempts < MAX_ATTEMPTS && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ⚠ {MAX_ATTEMPTS - attempts} tentativa(s) restante(s) antes do bloqueio.
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || volkGlitch}
                className="w-full py-2 px-4 font-bold text-xs tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "► AUTENTICANDO..." : "► AUTENTICAR"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setBackLoading(true);
                  setTimeout(() => navigate("/"), 500);
                }}
                disabled={backLoading || volkGlitch}
                className="w-full py-2 px-4 font-bold text-xs tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {backLoading ? "◄ RETORNANDO..." : "◄ SAIR DO TERMINAL"}
              </button>
            </form>
          )}

          {/* Warning */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Todas as atividades são monitoradas e registradas.<br />
              <span className="text-alert-red">Acesso não autorizado será investigado.</span>
            </p>
          </div>
        </div>

        {/* Attempt counter */}
        {attempts > 0 && !locked && (
          <div className="mt-2 text-right">
            <span className="text-xs text-muted-foreground">
              TENTATIVAS: <span className="text-alert-red">{attempts}/{MAX_ATTEMPTS}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
