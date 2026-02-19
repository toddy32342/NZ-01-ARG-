import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "@/assets/logo.png";

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

const NotFound = () => {
  const location = useLocation();
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    console.error("404 — ACESSO NEGADO: rota inexistente ou deletada:", location.pathname);
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const typed = useTypewriter("ARQUIVO NÃO LOCALIZADO — PROTOCOLO 17-B ATIVO", 40);

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

      <div className="w-full max-w-lg relative text-center space-y-6">
        {/* Corner decorations */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />

        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="NordSternLab" className="h-14 w-14 opacity-60" style={{ filter: "drop-shadow(0 0 10px hsl(0 80% 55% / 0.5))" }} />
        </div>

        {/* 404 glitch number */}
        <div className="relative inline-block">
          <div
            className={`text-8xl font-bold text-alert-red leading-none select-none ${glitching ? "glitch" : ""}`}
            data-text="404"
            style={glitching ? {
              textShadow: "2px 0 hsl(187 100% 50%), -2px 0 hsl(0 80% 55%)",
              transform: "translate(-2px, 1px)",
            } : {}}
          >
            404
          </div>
        </div>

        {/* Typewriter line */}
        <div className="terminal-box p-3 text-left mx-auto">
          <span className="text-xs text-primary tracking-widest">{typed}</span>
          <span className="animate-blink text-primary">█</span>
        </div>

        {/* Classification stamp */}
        <div className="flex justify-center">
          <span className="stamp text-sm">DELETADO</span>
        </div>

        {/* Info box */}
        <div className="border border-alert-red bg-card p-4 text-left space-y-2">
          <div className="text-xs font-bold text-alert-red tracking-widest animate-flicker">
            ⚠ ERRO DE ACESSO — ARQUIVO NÃO ENCONTRADO
          </div>
          {/* EDITÁVEL: Mensagem de erro da página 404 */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            O recurso solicitado em{" "}
            <span className="text-primary font-bold">{location.pathname}</span>{" "}
            não existe, foi deletado ou está sob restrição do{" "}
            <span className="text-alert-red font-bold">PROTOCOLO 17-B</span>.
          </p>
          <p className="text-xs text-muted-foreground">
            Esta tentativa de acesso foi registrada e será investigada pelo setor de segurança interna do NordSternLab.
          </p>
        </div>

        {/* Warning lines */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>REF: NSL-404-{location.pathname.replace(/\//g, "").toUpperCase() || "INDEX"}</div>
          <div>TIMESTAMP: {new Date().toISOString().replace("T", " ").slice(0, 19)} UTC</div>
        </div>

        {/* Return button */}
        <Link
          to="/"
          className="inline-block px-6 py-2 text-xs font-bold tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150"
        >
          ← RETORNAR AO PORTAL PÚBLICO
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
