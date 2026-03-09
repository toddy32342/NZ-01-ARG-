import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const BOOT_LINES = [
  "INICIALIZANDO SISTEMA...",
  "VERIFICANDO INTEGRIDADE DO KERNEL...... OK",
  "CARREGANDO MÓDULOS DE SEGURANÇA...... OK",
  "CONEXÃO COM SERVIDOR ESTABELECIDA",
  "AUTENTICAÇÃO DE REDE...... OK",
  "PROTOCOLO 17-B ATIVO",
  "CARREGANDO INTERFACE...",
];

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        i++;
      } else {
        clearInterval(timer);
        setDone(true);
        setTimeout(onComplete, 600);
      }
    }, 350);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center font-mono">
      <div className="w-full max-w-md px-6 space-y-6">
        <div className="flex justify-center">
          <img
            src={logo}
            alt="NSL"
            className="h-12 w-12 opacity-70"
            style={{ filter: "drop-shadow(0 0 8px hsl(187 100% 50% / 0.4))" }}
          />
        </div>

        <div className="space-y-1">
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-xs text-primary tracking-wider animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {">"} {line}
            </div>
          ))}
          {!done && (
            <span className="text-xs text-primary animate-pulse">█</span>
          )}
        </div>

        <div className="space-y-1">
          <div className="h-1 w-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 8px hsl(187 100% 50% / 0.6)",
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground text-right">{progress}%</div>
        </div>

        {done && (
          <div className="text-xs text-primary text-center tracking-widest animate-pulse">
            SISTEMA PRONTO
          </div>
        )}
      </div>
    </div>
  );
}
