import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const employees = [
  { id: "daniel", name: "Daniel M.", sector: "Biosegurança", status: "ATIVO", statusClass: "badge-ativo", img: null },
  { id: "ingrid", name: "Ingrid S.", sector: "Biotecnologia", status: "EM LICENÇA", statusClass: "badge-licenca", img: null },
  { id: "volk", name: "Volk", sector: "Pesquisa", status: "INATIVO", statusClass: "badge-inativo", img: null },
  { id: "redacted", name: "████████", sector: "—", status: "ARQUIVADO", statusClass: "badge-arquivado", img: null, redacted: true },
  { id: "heinz", name: "Heinz K.", sector: "Biosegurança", status: "ATIVO", statusClass: "badge-ativo", img: null },
  { id: "ida", name: "Ida S.", sector: "Pesquisa", status: "ATIVO", statusClass: "badge-ativo", img: null },
];

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
  const [tick, setTick] = useState(0);
  const typed = useTypewriter("NORDSTERNLAB — PORTAL PÚBLICO DE PESQUISA ESTRATÉGICA", 35);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const timestamp = `${now.toISOString().replace("T", " ").slice(0, 19)} UTC`;

  return (
    <div className="scanlines min-h-screen bg-background font-mono crt-vignette">
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
          <img src={logo} alt="NordSternLab" className="h-10 w-10 opacity-90 animate-rotate-slow" style={{ animationDuration: "30s" }} />
          <div className="flex-1">
            <div className="text-primary font-bold text-sm tracking-widest">NordSternLab</div>
            <div className="text-muted-foreground text-xs tracking-wider">LABORATÓRIO DE PESQUISA ESTRATÉGICA E BIOSSEGURANÇA</div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs text-muted-foreground">{timestamp}</div>
            <div className="text-xs text-muted-foreground">CONEXÃO: <span className="text-primary">ESTABELECIDA</span></div>
          </div>
        </div>

        {/* Header bar bottom */}
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
        <div className="border border-border bg-card p-4 border-l-4" style={{ borderLeftColor: "hsl(var(--cyan))" }}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="terminal-box p-4 space-y-2">
            <div className="text-xs text-muted-foreground tracking-widest uppercase">Sobre o Laboratório</div>
            {/* EDITÁVEL: Descrição pública do laboratório */}
            <p className="text-xs text-foreground leading-relaxed">
              O NordSternLab é uma instituição de pesquisa científica avançada, especializada em biossegurança, biotecnologia e defesa estratégica. Fundado em 2019 sob decreto classificado.
            </p>
          </div>
          <div className="terminal-box p-4 space-y-2">
            <div className="text-xs text-muted-foreground tracking-widest uppercase">Status do Sistema</div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-alert-red animate-pulse" />
              <span className="text-xs text-foreground">Status: <span className="text-alert-red font-bold">INATIVO</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-xs text-muted-foreground">Acessos recentes: <span className="text-foreground">17</span></span>
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="terminal-box p-4 group hover:border-primary transition-all duration-200 relative overflow-hidden"
              >
                {/* Photo placeholder */}
                <div className="w-full h-28 bg-secondary border border-border mb-3 flex items-center justify-center overflow-hidden relative">
                  {emp.redacted ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <span className="text-2xl text-alert-red font-bold">?</span>
                      <span className="text-xs text-muted-foreground mt-1 tracking-widest">REMOVIDO</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <span className="text-3xl font-bold text-muted-foreground opacity-30 font-mono">
                        {initials(emp.name)}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">SEM FOTO</span>
                    </div>
                  )}
                  {/* Scan line effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-5 transition-opacity" />
                </div>

                <div className="space-y-1">
                  {emp.redacted ? (
                    <h3 className="redacted text-sm tracking-widest">{emp.name}</h3>
                  ) : (
                    <h3 className="text-sm font-bold text-foreground">{emp.name}</h3>
                  )}
                  <p className="text-xs text-muted-foreground">SETOR: {emp.sector}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-bold tracking-wider ${emp.statusClass}`}>
                    {emp.status}
                  </span>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary opacity-30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary opacity-30" />
              </div>
            ))}
          </div>
        </section>

        {/* Nota rodapé */}
        <div className="terminal-box p-3 text-center">
          <p className="text-xs text-muted-foreground">
            ⚠ Um registro de funcionário foi suprimido por ordem interna. Referência: <span className="text-alert-red">COFEE-0</span>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border mt-8 py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">© 2027 NordSternLab — TODOS OS DIREITOS RESERVADOS</p>
          <p className="text-xs text-muted-foreground animate-flicker">TODOS OS DADOS SÃO MONITORADOS E REGISTRADOS.</p>
        </div>
      </footer>
    </div>
  );
}
