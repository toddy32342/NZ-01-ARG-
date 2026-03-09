// ═══════════════════════════════════════════════════════════════════
// COMPONENTE: BootSequence — Sequência de boot usada na SecretCofee
// EDITÁVEL: Altere as mensagens de boot abaixo para personalizar
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  // ─────────────────────────────────────────────────────────────────
  // EDITÁVEL: Mensagens de boot — adicione ou altere livremente
  // ─────────────────────────────────────────────────────────────────
  const bootMessages = [
    "NORDSTERN_OS v4.0.2 STARTING...",
    "INITIALIZING MEMORY SECTORS...",
    "CHECKING SECTOR 0x004 (COFEE-0)...",
    "DECRYPTING CORE DATA...",
    "CRITICAL: DATA FRAGMENTATION DETECTED",
    "BYPASSING DANIEL M. SECURITY PROTOCOLS...",
    "RECOVERING SECRETS FROM VOID...",
    "RECONSTRUCTING TIMELINE...",
    "SUCCESS: FILE READY FOR VIEWING."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootMessages.length) {
        setLogs(prev => [...prev, bootMessages[currentLine]]);
        setProgress(Math.round(((currentLine + 1) / bootMessages.length) * 100));
        currentLine++;
      } else {
        clearInterval(interval);
        setDone(true);
        setTimeout(() => onComplete(), 800);
      }
    }, 350);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center font-mono p-6 crt-vignette">
      {/* Scanline rápida */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-[3px] opacity-60"
        style={{
          background: "linear-gradient(to right, transparent, hsl(var(--primary)), transparent)",
          animation: "scanline-fast 0.8s linear infinite",
        }}
      />

      <div className="max-w-md w-full space-y-6">
        {/* Logo area */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground tracking-widest mb-2">NORDSTERN_OS</div>
          <div className="text-primary text-sm font-bold tracking-widest glitch" data-text="BOOT SEQUENCE">
            BOOT SEQUENCE
          </div>
        </div>

        {/* Linhas de log */}
        <div className="space-y-1 min-h-[200px] terminal-box p-4">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`text-xs animate-fade-in-up ${
                log.includes("CRITICAL") ? "text-alert-red font-bold" :
                log.includes("SUCCESS") ? "text-primary font-bold" :
                "text-primary/80"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {`> ${log}`}
            </div>
          ))}
          {!done && (
            <span className="text-xs text-primary animate-blink">█</span>
          )}
        </div>

        {/* Barra de progresso */}
        <div className="space-y-1">
          <div className="h-1 w-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 8px hsl(var(--primary) / 0.6)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>DECRYPTING...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {done && (
          <div className="text-xs text-primary text-center tracking-widest animate-pulse">
            ACESSO CONCEDIDO — CARREGANDO ARQUIVO
          </div>
        )}
      </div>
    </div>
  );
}
