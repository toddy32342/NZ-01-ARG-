import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import daniel from "@/assets/daniel.png";
import heinz from "@/assets/heinz1.png";
import ingrid from "@/assets/ingrid.png";
import vulk from "@/assets/vulk1.png";
import ida from "@/assets/ida.png"

const employees = [
  { id: "daniel", name: "Daniel V.", sector: "Biosegurança", status: "ATIVO", statusClass: "badge-ativo", img: daniel },
  { id: "ingrid", name: "Ingrid S.", sector: "Biotecnologia", status: "EM LICENÇA", statusClass: "badge-licenca", img: ingrid },
  { id: "volk", name: "Volk", sector: "Diretor", status: "INATIVO", statusClass: "badge-inativo", img: vulk },
  { id: "redacted", name: "████████", sector: "—", status: "ARQUIVADO", statusClass: "badge-arquivado", img: null, redacted: true },
  { id: "heinz", name: "Heinz K.", sector: "Biosegurança", status: "ATIVO", statusClass: "badge-ativo", img: heinz },
  { id: "ida", name: "Ida S.", sector: "Pesquisa", status: "ATIVO", statusClass: "badge-ativo", img: ida },
]
function useTypewriter(text: string, speed = 40) {
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

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

export default function Index() {
  const [stage, setStage] = useState<'boot' | 'transition' | 'portal'>('boot');
  const [periodicGlitch, setPeriodicGlitch] = useState(false);
  const typed = useTypewriter("NORDSTERNLAB — PORTAL PÚBLICO DE PESQUISA ESTRATÉGICA", 35);

  useEffect(() => {
    const timerBoot = setTimeout(() => setStage('transition'), 1200);
    const timerPortal = setTimeout(() => setStage('portal'), 2000);
    return () => {
      clearTimeout(timerBoot);
      clearTimeout(timerPortal);
    };
  }, []);

  // Periodic glitch every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setPeriodicGlitch(true);
      setTimeout(() => setPeriodicGlitch(false), 400);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const timestamp = `${now.toISOString().replace("T", " ").slice(0, 19)} UTC`;

  if (stage === 'boot' || stage === 'transition') {
    return (
      <div className={`glitch-overlay flex-col items-start p-12 font-mono overflow-hidden transition-all duration-700
        ${stage === 'transition' ? 'opacity-0 scale-110 blur-xl brightness-[5]' : 'opacity-100'}`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none noise" />

        <div className="z-10 space-y-2 uppercase tracking-tight">
          <p className="text-primary opacity-90 text-sm">NordStern BIOS v.4.0.19</p>
          <p className="text-primary opacity-90 text-sm">CPU: NS-STRATOS @ 2.40GHz</p>
          <p className="text-primary opacity-90 text-sm">MEMORY TEST: 65536KB OK</p>
          <p className="text-primary opacity-90 text-sm">STORAGE: encrypted_drive_01 DETECTED</p>
          <br />
          
          <div className="glitch text-4xl md:text-6xl text-primary font-black mb-4" data-text="BOOTING SYSTEM...">
            BOOTING SYSTEM...
          </div>

          <div className="flex items-center gap-3">
             <span className="inline-block w-3 h-6 bg-primary animate-pulse" />
             <p className="text-sm text-primary/70 font-bold">ESTABLISHING SECURE CONNECTION...</p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/30 shadow-[0_0_20px_rgba(0,255,255,0.6)] animate-scanline-fast" />
      </div>
    );
  }

  return (
    <div className={`scanlines min-h-screen bg-background font-mono crt-vignette animate-power-on ${periodicGlitch ? 'periodic-glitch' : ''}`}>
      {/* Moving scanline */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 h-8 w-full opacity-10"
        style={{
          background: "linear-gradient(to bottom, transparent, hsl(187 100% 80% / 0.15), transparent)",
          animation: "scanline 8s linear infinite",
        }}
      />

      {/* HEADER */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center gap-4 px-6 py-3">
          <img src={logo} alt="NordSternLab" className="h-10 w-10 opacity-90 animate-rotate-slow" />
          <div className="flex-1">
            <div className="text-primary font-bold text-sm tracking-widest">NordSternLab</div>
            <div className="text-muted-foreground text-xs tracking-wider">LABORATÓRIO DE PESQUISA ESTRATÉGICA E BIOSSEGURANÇA</div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs text-muted-foreground">{timestamp}</div>
            <div className="text-xs text-muted-foreground">CONEXÃO: <span className="text-primary">ESTABELECIDA</span></div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
      </header>

      {/* MAIN */}
      <main className="container mx-auto max-w-5xl px-4 py-8 space-y-8">

        {/* Typewriter title */}
        <div className="terminal-box p-4">
          <div className="text-xs text-muted-foreground mb-1">{">"} SISTEMA INICIALIZADO — PROTOCOLO 17-B ATIVO</div>
          <div className="text-primary text-sm tracking-widest cursor-blink">{typed}</div>
        </div>

        {/* CLASSIFICAÇÃO */}
        <div className="border border-border bg-card p-4 border-l-4 hover-glow" style={{ borderLeftColor: "hsl(var(--cyan))" }}>
          <div className="flex items-start gap-3">
            <span className="stamp shrink-0">RESTRITO</span>
            <div>
              <div className="text-xs font-bold tracking-widest text-foreground">
                CLASSIFICAÇÃO: <span className="text-primary">ACESSO PÚBLICO LIMITADO</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Dados sensíveis foram removidos conforme protocolo 17-B. Qualquer tentativa de acesso não autorizado será registrada e investigada.
              </div>
            </div>
          </div>
        </div>

        {/* Status & descrição */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-fade">
          <div className="terminal-box p-4 space-y-2 hover-glow">
            <div className="text-xs text-muted-foreground tracking-widest uppercase">Sobre o Laboratório</div>
            {/* EDITÁVEL: Descrição pública do laboratório */}
            <p className="text-xs text-foreground leading-relaxed">
              O NordSternLab é uma instituição de pesquisa científica avançada, especializada em biossegurança, biotecnologia e defesa estratégica. Fundado em 2019 sob decreto classificado.
            </p>
          </div>
          <div className="terminal-box p-4 space-y-2 hover-glow">
            <div className="text-xs text-muted-foreground tracking-widest uppercase">Status do Sistema</div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--red-alert))] animate-pulse" />
              <span className="text-xs text-foreground">Status: <span className="text-[hsl(var(--red-alert))] font-bold">INATIVO</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-xs text-muted-foreground">Acessos recentes: <span className="text-foreground">29</span></span>
            </div>
            <Link
              to="/login"
              className="inline-block mt-2 px-4 py-2 text-xs font-bold tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 animate-pulse-cyan"
            >
              ► ACESSAR ÁREA RESTRITA
            </Link>
          </div>
        </div>

        {/* FUNCIONÁRIOS */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-primary">Quadro de Funcionários</h2>
            <div className="flex-1 h-px bg-border" />
            <div className="text-xs text-muted-foreground">
              TOTAL: <span className="text-foreground">6</span> — EXIBIDOS: <span className="text-foreground">5</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 stagger-fade">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="terminal-box p-4 group hover-glow transition-all duration-200 relative overflow-hidden"
              >
                {/* ÁREA DA FOTO */}
                <div className="w-full h-28 bg-[hsl(var(--background))] border border-border mb-3 flex items-center justify-center overflow-hidden relative">
                  {'redacted' in emp && emp.redacted ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <span className="text-2xl text-[hsl(var(--red-alert))] font-bold animate-pulse">?</span>
                      <span className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase">REMOVIDO</span>
                    </div>
                  ) : emp.img ? (
                    <img 
                      src={emp.img} 
                      alt={emp.name} 
                      className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <span className="text-3xl font-bold text-muted-foreground opacity-30 font-mono">
                        {initials(emp.name)}
                      </span>
                      <span className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tighter">No Signal</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-scanline-pattern opacity-5 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                </div>

                <div className="space-y-1">
                  {'redacted' in emp && emp.redacted ? (
                    <h3 className="redacted text-sm tracking-widest">{emp.name}</h3>
                  ) : (
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{emp.name}</h3>
                  )}
                  <p className="text-xs text-muted-foreground uppercase tracking-tighter">SETOR: {emp.sector}</p>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider border ${emp.statusClass}`}>
                    {emp.status}
                  </span>
                </div>

                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary opacity-30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary opacity-30" />
              </div>
            ))}
          </div>
        </section>

        {/* Nota rodapé */}
        <div className="terminal-box p-3 text-center">
          <p className="text-xs text-muted-foreground">
            ⚠ Um registro de funcionário foi suprimido por ordem interna. Referência: <span className="text-[hsl(var(--red-alert))]">████████</span>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border mt-8 py-4 px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">© 2027 NordSternLab — TODOS OS DIREITOS RESERVADOS</p>
          <p className="text-xs text-muted-foreground animate-flicker">TODOS OS DADOS SÃO MONITORADOS E REGISTRADOS.</p>
        </div>
        {/* Easter egg: Rickroll button */}
        <a
          href="https://youtu.be/fC7oUOUEEi4?si=nFqGb8nIdqMGCpcN"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1 right-1 text-[50px] text-muted-foreground opacity-5 hover:opacity-30 transition-opacity cursor-default"
          title=" "
        >●</a>
      </footer>
    </div>
  );
}
