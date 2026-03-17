import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoFallback from "@/assets/logo.png"

type Section = "home" | "func" | "relatorios" | "arquivos" | "videos" | "nz01" | "plano";

const EMPLOYEES = [
  { name: "Daniel V.", sector: "Biosegurança", status: "ATIVO", statusClass: "badge-ativo", note: null },
  { name: "Ingrid S.", sector: "Biotecnologia", status: "LICENÇA", statusClass: "badge-licenca", note: "⚠ Afastamento médico — Gestação em curso. Ver ARQ-003." },
  { name: "Volk L.", sector: "Diretoria", status: "INATIVO", statusClass: "badge-inativo", note: null },
  { name: "████████", sector: "—", status: "ARQUIVADO", statusClass: "badge-arquivado", note: "COFEE-0: Identidade suprimida. [INFILTRAÇÃO DETECTADA]." },
  { name: "Heinz K.", sector: "Biosegurança", status: "ATIVO", statusClass: "badge-ativo", note: null },
  { name: "Ida S.", sector: "Pesquisa", status: "ATIVO", statusClass: "badge-ativo", note: null },
];

const REPORTS = [
  { id: "REL-001", title: "Relatório de Biossegurança — Setor 7", date: "2027-03-26", level: 1, content: "Início da guerra. Estado de emergência declarado." },
  { id: "REL-002", title: "Avaliação de Campo — Projeto VOLK", date: "2029-03-12", level: 2, content: "Testes em campo real. Resultados inconsistentes e sinais de evolução autônoma." },
  { id: "ERRO-001", title: "Registro de Erro — COFEE", date: "2029-07-18", level: 1, content: "Funcionário removido dos registros. Considerado traidor (Atuação USRF)." },
  { id: "REL-003", title: "Incidente DL-09", date: "2028-02-11", level: 3, content: "Morte de Ingrid e [-]. Quebra psicológica do agente Cofee às 03h47." },
];

const ARCHIVES: { id: string; name: string; type: string; size: string; status: string; level: number; pdfUrl: string; description: string }[] = [
  { id: "ARQ-001", name: "Protocolo 17-B", type: "PDF", size: "2.3 MB", status: "ACESSÍVEL", level: 1, pdfUrl: "ProtocoloB", description: "Protocolo de biossegurança global (2027)." },
  { id: "ARQ-002", name: "Arquivo VOLK — Fase 2", type: "ENC", size: "█████", status: "CRIPTOGRAFADO", level: 3, pdfUrl: "VolkFin", description: "Dados dos testes em campo de 2029." },
  { id: "ARQ-003", name: "Laudo Médico — Ing. S.", type: "MED", size: "1.1 MB", status: "ACESSÍVEL", level: 2, pdfUrl: "https://drive.google.com/file/d/1ZEDjUKdUscGbxKWz38neGZJjvTgxA-Qj/preview", description: "Histórico clínico: Exposição ao A-01 e gestação (2027)." },
  { id: "ARQ-004", name: "████████ — Dossiê COFEE", type: "███", size: "█████", status: "REMOVIDO", level: 99, pdfUrl: "", description: "Suprimido após 18/07/2029." },
  { id: "ARQ-005", name: "NZ-01 — Falhas", type: "ENC", size: "█████", status: "CRIPTOGRAFADO", level: 3, pdfUrl: "NZ-01", description: "Relatório de falhas estruturais das versões A e B." },
  { id: "ARQ-006", name: "A-00 / A-01", type: "BIO", size: "4.7 MB", status: "ACESSÍVEL", level: 2, pdfUrl: "", description: "Dados técnicos do primeiro protótipo (08/05/2027)." },
  { id: "ARQ-007", name: "Incidente DL-09", type: "PDF", size: "█████", status: "ACESSÍVEL", level: 3, pdfUrl: "nem tente.", description: "Laudo detalhado do incidente em 11/02/2028." },
];

const YOUTUBE_VIDEOS = [
  { 
    id: "VID-002", 
    title: "Incidente — CAM-03", 
    description: "Registro: falha crítica.", 
    youtubeId: "", 
    date: "2028-02-11", // <-- ESTA É A MUDANÇA MAIS IMPORTANTE
    level: 3 
  },
];

const NEWS = [
  { id: "NSL-NEWS-001", date: "2030-03-05", level: 1, tag: "ALERTA", tagClass: "badge-inativo", title: "INCIDENTE GLOBAL", body: "Satélite interceptado em órbita. Dispersão global não controlada." },
  { id: "NSL-NEWS-002", date: "2027-03-26", level: 1, tag: "GUERRA", tagClass: "badge-ativo", title: "CONFLITO GLOBAL", body: "Estado de emergência e aceleração de projetos biológicos." },
  { id: "NSL-NEWS-003", date: "2028-01-20", level: 2, tag: "INFO", tagClass: "badge-licenca", title: "Nascimento Registrado", body: "Filha de Ingrid S. nascida sem alterações genéticas detectadas." },
];

const NZ01_VERSIONS = [
  { 
    id: "A-00", 
    label: "PROTÓTIPO A-00", 
    date: "2027-05-05", 
    level: 2, 
    statusLabel: "FALHA CATASTRÓFICA", 
    statusClass: "badge-arquivado", 
    borderClass: "border-l-alert-red", 
    labelClass: "text-alert-red", 
    content: "Primeira tentativa de síntese. O agente apresentou necrose acelerada em tecidos orgânicos. Suspenso após falha crítica de contenção no Setor 7." 
  },
  { 
    id: "A-01", 
    label: "PROTÓTIPO A-01", 
    date: "2027-08-02", 
    level: 2, 
    statusLabel: "FALHA — DISPERSÃO", 
    statusClass: "badge-inativo", 
    borderClass: "border-l-alert-yellow", 
    labelClass: "text-alert-yellow", 
    content: "Implementação do Vetor Aerossol V1. Durou até 72H antes de degradar. Dois técnicos da equipe de contenção foram expostos. Área isolada para descontaminação." 
  },
  { 
    id: "DL-09", 
    label: "PROTÓTIPO DL-09", 
    date: "2028-02-11", 
    level: 2, 
    statusLabel: "FALHA — DISPERSÃO", 
    statusClass: "badge-inativo", 
    borderClass: "border-l-alert-yellow", 
    labelClass: "text-alert-yellow", 
    content: "Implementação de vetor aerossol. Falha no controle de densidade resultou na contaminação da ventilação primária. Projeto movido para subníveis pós incidente. Técnico e cobaia mortos durante testes de agressividade." 
  },
  { 
    id: "RP-10", 
    label: "CALIBRAÇÃO RP-10", 
    date: "2028-10-30", 
    level: 3, 
    statusLabel: "INSTABILIDADE MENTAL", 
    statusClass: "badge-licenca", 
    borderClass: "border-l-alert-yellow", 
    labelClass: "text-alert-yellow", 
    content: "Foco em interface neural. 73% de precisão nos comandos. Efeitos colaterais severos incluem perda de memória episódica e surtos psicóticos violentos." 
  },
  { 
    id: "NZ-00", 
    label: "ESTÁGIO NZ-00", 
    date: "2029-12-15", 
    level: 3, 
    statusLabel: "SUCESSO TÉCNICO", 
    statusClass: "badge-ativo", 
    borderClass: "border-l-primary", 
    labelClass: "text-primary", 
    content: "A 'Versão Perfeita'. Estabilização total do genoma e submissão completa do hospedeiro. Serviu como matriz absoluta para a codificação do NZ-01." 
  },
  { 
    id: "NZ-01", 
    label: "VERSÃO FINAL NZ-01", 
    date: "2030-02-28", 
    level: 3, 
    statusLabel: "PRONTA PARA USO", 
    statusClass: "badge-ativo", 
    borderClass: "border-l-alert-red", 
    labelClass: "text-alert-red", 
    content: "Culminação do projeto. Agente biológico estabilizado para dispersão orbital. Capacidade de adaptação autônoma confirmada em simulações. Lançada via Satélite." 
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("home");
  const [user, setUser] = useState("");
  const [level, setLevel] = useState(0);
  const [time, setTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedArchive, setSelectedArchive] = useState<(typeof ARCHIVES)[0] | null>(null);
  const [ingridModal, setIngridModal] = useState(false);
  const [isCorrupted, setIsCorrupted] = useState(false);
  const [cofeeClicks, setCofeeClicks] = useState(0);
  const [periodicGlitch, setPeriodicGlitch] = useState(false);
  const glitchTimerRef = useRef<ReturnType<typeof setInterval>>();
  const COFEE_SECRET_THRESHOLD = 5;

  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    if (auth !== "true") { navigate("/login"); return; }
    setUser(sessionStorage.getItem("user") || "");
    setLevel(Number(sessionStorage.getItem("level")) || 0);
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, [navigate]);

  useEffect(() => {
    glitchTimerRef.current = setInterval(() => {
      setPeriodicGlitch(true);
      setTimeout(() => setPeriodicGlitch(false), 400);
    }, 5 * 60 * 1000);
    return () => clearInterval(glitchTimerRef.current);
  }, []);

  const logout = () => { sessionStorage.clear(); navigate("/login"); };

  const handleCofeeClick = () => {
    const next = cofeeClicks + 1;
    setCofeeClicks(next);
    setIsCorrupted(true);
    setTimeout(() => setIsCorrupted(false), 1500);
    if (next >= COFEE_SECRET_THRESHOLD) {
      setTimeout(() => navigate("/arquivo-cofee"), 2000);
    }
  };

  const navLinks: { id: Section; label: string; minLevel: number }[] = [
    { id: "home", label: "PAINEL", minLevel: 0 },
    { id: "func", label: "FUNCIONÁRIOS", minLevel: 0 },
    { id: "relatorios", label: "RELATÓRIOS", minLevel: 1 },
    { id: "arquivos", label: "ARQUIVOS", minLevel: 1 },
    { id: "nz01", label: "PROJ. NZ-01", minLevel: 2 },
    { id: "videos", label: "REGISTROS", minLevel: 2 },
    ...(user === "toddy" ? [{ id: "plano" as Section, label: "▓ PLANO ORBITAL", minLevel: 3 }] : []),
  ];

  const isGlitching = isCorrupted || periodicGlitch;

  return (
    <div className={`scanlines min-h-screen bg-background font-mono flex flex-col crt-vignette ${isGlitching ? "system-glitch" : ""}`}>
      {isCorrupted && <div className="glass-crack-overlay" />}
      <div className="pointer-events-none fixed left-0 top-0 z-50 h-8 w-full opacity-10" style={{ background: "linear-gradient(to bottom, transparent, hsl(187 100% 80% / 0.15), transparent)", animation: "scanline 8s linear infinite" }} />

      <div className="border-b border-border bg-card flex items-center px-4 py-2 gap-4 z-30 sticky top-0">
        <button onClick={() => setSidebarOpen((o) => !o)} className="text-muted-foreground hover:text-primary text-xs px-2 py-1 border border-border hover:border-primary transition-colors">☰</button>
        <img src={logoFallback} alt="NSL" className="h-7 w-7 opacity-80" />
        <div className="flex-1">
          <span className="text-primary font-bold text-xs tracking-widest">NordSternLab</span>
          <span className="text-muted-foreground text-xs ml-2">// PAINEL INTERNO</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground hidden md:block">{time.toISOString().replace("T"," ").slice(0,19)} UTC</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">USUÁRIO:</span>
            <span className="text-primary font-bold uppercase">{user}</span>
            <span className="text-muted-foreground">NV-{level}</span>
          </div>
          <button onClick={logout} className="text-xs px-3 py-1 border border-alert-red text-alert-red hover:bg-alert-red hover:text-background transition-all tracking-widest">SAIR</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-52 border-r border-border bg-card flex flex-col shrink-0 pt-4">
            <div className="px-4 pb-4 border-b border-border">
              <div className="text-xs text-muted-foreground tracking-widest">NÍVEL DE ACESSO</div>
              <div className="flex gap-1 mt-1">
                {[1,2,3].map((l) => (
                  <div key={l} className="h-2 w-8 rounded-sm" style={{ background: level >= l ? "hsl(var(--primary))" : "hsl(var(--border))", boxShadow: level >= l ? "0 0 4px hsl(var(--primary))" : "none" }} />
                ))}
              </div>
              <div className="text-xs text-primary mt-1 font-bold">{level === 3 ? "DIRETOR" : level === 2 ? "PESQUISADOR" : "BÁSICO"}</div>
            </div>
            <nav className="flex-1 py-2">
              {navLinks.map((link) => {
                if (level < link.minLevel) return null;
                return (<button key={link.id} onClick={() => setSection(link.id)} className={`sidebar-link w-full text-left ${section === link.id ? "active" : ""} ${link.id === "plano" ? "text-alert-red" : ""}`}>{">"} {link.label}</button>);
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" /> MONITORAMENTO ATIVO
              </div>
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-auto p-6">
          {section === "home" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4"><h2 className="text-xs font-bold tracking-widest text-primary uppercase">Painel Geral</h2><div className="flex-1 h-px bg-border" /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[{l:"STATUS",v:"ATIVO",p:true},{l:"MONITORAMENTO",v:"ONLINE",p:true},{l:"ACESSOS",v:"29",p:false}].map((s,i) => (
                  <div key={i} className="terminal-box p-4 space-y-1">
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                    <div className="flex items-center gap-2">{s.p && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}<span className={`font-bold text-sm ${s.p?"text-primary":"text-foreground"}`}>{s.v}</span></div>
                  </div>
                ))}
              </div>
              <div className="border border-alert-yellow bg-card p-4">
                <div className="text-xs font-bold text-alert-yellow tracking-widest">⚠ INCONSISTÊNCIA — COFEE-0</div>
                <p className="text-xs text-muted-foreground mt-2">Registros com inconsistências. Investigação pendente.</p>
              </div>
              <div className="terminal-box p-4"><div className="text-xs text-muted-foreground tracking-widest uppercase mb-2">IMAGEM DO LABORATÓRIO</div><div className="aspect-[21/9] bg-secondary border border-border flex items-center justify-center"><div className="text-xs text-muted-foreground opacity-40"><img src="../assets/Lab.png"/></div></div></div>
              <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-widest text-primary uppercase">Boletins Internos</h3>
                {NEWS.filter(n => level >= n.level).map(n => (
                  <div key={n.id} className="terminal-box p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap"><div className="flex items-center gap-2"><span className={`text-xs px-2 py-0.5 font-bold ${n.tagClass}`}>{n.tag}</span><span className="text-xs font-bold text-foreground">{n.title}</span></div><span className="text-xs text-muted-foreground">{n.date}</span></div>
                    <p className="text-xs text-muted-foreground">{n.body}</p>
                  </div>
                ))}
              </div>
              {(user==="toddy"||user==="admin") && (<div className="border border-alert-red bg-card p-4"><div className="text-xs text-alert-red font-bold tracking-widest animate-flicker">[ACESSO TOTAL — DIRETOR]</div><p className="text-xs text-muted-foreground mt-2">Incidente DL-09 aguarda revisão.</p></div>)}
              {user==="daniel" && (<div className="border border-alert-red bg-card p-4"><div className="text-xs text-alert-red font-bold animate-flicker">[REGISTROS PESSOAIS]</div><p className="text-xs text-muted-foreground mt-2">Cofee, você não deveria ter invadido novamente.</p></div>)}
            </div>
          )}

          {section === "func" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4"><h2 className="text-xs font-bold tracking-widest text-primary uppercase">Funcionários</h2><div className="flex-1 h-px bg-border" /></div>
              <div className="border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-border bg-secondary"><th className="text-left px-4 py-2 text-muted-foreground font-normal">NOME</th><th className="text-left px-4 py-2 text-muted-foreground font-normal">SETOR</th><th className="text-left px-4 py-2 text-muted-foreground font-normal">STATUS</th>{level>=2&&<th className="text-left px-4 py-2 text-muted-foreground font-normal">OBS.</th>}</tr></thead>
                  <tbody>
                    {EMPLOYEES.map((emp,i) => {
                      const isCofee = emp.name==="████████", isIngrid = emp.name==="Ingrid S.";
                      return (
                        <tr key={i} className={`border-b border-border hover:bg-secondary/50 transition-colors ${isIngrid&&level>=2?"cursor-pointer":""} ${isCofee?"cursor-pointer hover:bg-alert-red/10":""}`}
                          onClick={() => { if(isIngrid&&level>=2) setIngridModal(true); if(isCofee) handleCofeeClick(); }}>
                          <td className={`px-4 py-3 font-bold ${isCofee?"redacted text-alert-red":"text-foreground"}`}>
                            {emp.name}
                            {isIngrid&&level>=2&&<span className="ml-2 text-muted-foreground font-normal">[laudo]</span>}
                            {isCofee&&cofeeClicks>0&&<span className="ml-2 text-alert-red font-normal animate-flicker">[{cofeeClicks}/{COFEE_SECRET_THRESHOLD}]</span>}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{emp.sector}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-bold ${emp.statusClass}`}>{emp.status}</span></td>
                          {level>=2&&<td className="px-4 py-3 text-muted-foreground max-w-xs">{emp.note?<span className={`text-xs ${isCofee?"text-alert-red":"text-alert-yellow"}`}>{emp.note}</span>:<span className="opacity-30">—</span>}</td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {cofeeClicks>0&&cofeeClicks<COFEE_SECRET_THRESHOLD&&<div className="terminal-box p-3 border-l-alert-red animate-flicker"><span className="text-xs text-alert-red">ERRO: Tentativa {cofeeClicks}/{COFEE_SECRET_THRESHOLD}...</span></div>}
            </div>
          )}

          {section === "relatorios" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4"><h2 className="text-xs font-bold tracking-widest text-primary uppercase">Relatórios</h2><div className="flex-1 h-px bg-border" /></div>
              <div className="space-y-3">
                {REPORTS.filter(r=>level>=r.level).map(r => (
                  <div key={r.id} className={`terminal-box p-4 space-y-2 ${r.level>=3?"border-l-alert-red":""}`}>
                    <div className="flex items-center justify-between"><span className={`text-xs font-bold tracking-widest ${r.level>=3?"text-alert-red animate-flicker":"text-primary"}`}>{r.id}</span><span className="text-xs text-muted-foreground">{r.date}</span></div>
                    <div className="text-sm font-bold text-foreground">{r.title}</div>
                    <p className="text-xs text-muted-foreground">{r.content}</p>
                    {r.level>=3&&<span className="stamp text-xs">CLASSIFICADO</span>}
                  </div>
                ))}
                {REPORTS.filter(r=>level<r.level).length>0&&<div className="terminal-box p-4 opacity-60"><span className="text-xs text-muted-foreground">{REPORTS.filter(r=>level<r.level).length} oculto(s).</span></div>}
              </div>
            </div>
          )}

          {section === "arquivos" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4"><h2 className="text-xs font-bold tracking-widest text-primary uppercase">Arquivos</h2><div className="flex-1 h-px bg-border" /></div>
              <div className="space-y-2">
                {ARCHIVES.map(a => {
                  const ok = level>=a.level&&a.status!=="REMOVIDO";
                  return (
                    <div key={a.id} onClick={()=>{if(a.id==="ARQ-004")handleCofeeClick();else if(ok)setSelectedArchive(a);}}
                      className={`terminal-box p-4 flex items-center justify-between gap-4 ${!ok?"opacity-40 cursor-not-allowed":"hover:border-primary cursor-pointer transition-colors"} ${a.level>=3&&ok?"border-l-alert-red":""}`}>
                      <div className="flex items-center gap-4 min-w-0"><span className="text-xs text-muted-foreground shrink-0">[{a.type}]</span><div className="min-w-0"><div className={`text-xs font-bold truncate ${!ok?"text-muted-foreground":"text-foreground"}`}>{a.name}</div><div className="text-xs text-muted-foreground">{a.id} — {a.size}</div></div></div>
                      <span className={`text-xs px-2 py-0.5 font-bold shrink-0 ${!ok?"badge-arquivado":a.status==="ACESSÍVEL"?"badge-ativo":"badge-inativo"}`}>{level<a.level?"BLOQUEADO":a.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === "nz01" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4"><h2 className="text-xs font-bold tracking-widest text-primary uppercase">Projeto NZ-01</h2><div className="flex-1 h-px bg-border" /><span className="stamp text-xs">CONFIDENCIAL</span></div>
              <div className="border border-alert-red bg-card p-4"><div className="text-xs font-bold text-alert-red tracking-widest animate-flicker">⚠ PROTOCOLO BIO-7 ATIVO</div><p className="text-xs text-muted-foreground mt-2">Agente biológico de supressão seletiva.</p></div>
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground tracking-widest uppercase mb-2">— {NZ01_VERSIONS.length} iterações —</div>
                {NZ01_VERSIONS.map(v => {
                  const vis = level>=v.level;
                  return (
                    <div key={v.id} className={`terminal-box p-4 border-l-4 space-y-2 ${vis?v.borderClass:"border-l-border opacity-50"}`}>
                      <div className="flex items-center justify-between"><span className={`text-xs font-bold tracking-widest ${vis?v.labelClass:"text-muted-foreground"} ${v.id==="NZ-01"&&vis?"animate-flicker":""}`}>{v.id} — {v.label}</span><span className="text-xs text-muted-foreground">{vis?v.date:"████████"}</span></div>
                      {vis?<><p className="text-xs text-muted-foreground">{v.content}</p><span className={`${v.statusClass} text-xs px-2 py-0.5 font-bold`}>{v.statusLabel}</span></>:<><div className="text-xs redacted">████████████████████████████</div><div className="text-xs text-alert-red">🔒 NÍVEL {v.level}</div></>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === "plano" && user === "toddy" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4"><h2 className="text-xs font-bold tracking-widest text-alert-red uppercase animate-flicker">▓ PLANO ORBITAL</h2><div className="flex-1 h-px bg-alert-red opacity-30" /><span className="stamp text-xs">CONFIDENCIAL</span></div>
              <div className="border border-alert-red bg-card p-4"><div className="text-xs font-bold text-alert-red tracking-widest">⚠ ACESSO EXCLUSIVO — PRESIDENTE</div><p className="text-xs text-muted-foreground mt-2">Dispersão do NZ-01 via satélite NSL-SAT-7 (450km LEO). Microcápsulas pressurizadas durante reentrada controlada.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="terminal-box p-4 space-y-2 border-l-alert-red"><div className="text-xs text-alert-red font-bold tracking-widest">PARÂMETROS</div><div className="text-xs text-muted-foreground space-y-1"><div>SATÉLITE: <span className="text-foreground">NSL-SAT-7</span></div><div>ALTITUDE: <span className="text-foreground">450 km</span></div><div>VETOR: <span className="text-foreground">Aerossol</span></div><div>ZONA-ALVO: <span className="text-alert-red">Russia</span></div><div>COBERTURA: <span className="text-foreground">~200 km²</span></div></div></div>
                <div className="terminal-box p-4 space-y-2 border-l-alert-red"><div className="text-xs text-alert-red font-bold tracking-widest">STATUS</div><div className="text-xs text-muted-foreground space-y-1"><div>AGENTE: <span className="badge-ativo px-1 py-0.5 text-xs">NZ-01 PRONTO</span></div><div>SATÉLITE: <span className="text-alert-yellow">Falha</span></div><div>APROVAÇÃO: <span className="text-alert-green">PERMITIDO</span></div></div></div>
              </div>
              <div className="terminal-box p-4"><div className="text-xs text-alert-red font-bold tracking-widest mb-2">VÍDEO DE BRIEFING</div><div className="aspect-video bg-secondary border border-border flex items-center justify-center"><div className="text-xs text-muted-foreground opacity-40">SLOT PARA VÍDEO</div></div></div>
              <div className="terminal-box p-4 border-l-alert-red"><div className="text-xs text-alert-red font-bold tracking-widest">NOTAS DO PRESIDENTE</div><p className="text-xs text-muted-foreground mt-2">Precisamos de suporte maior, o Japão está intensificando a sua luta contra os EUA. Precisamos evitar problemas com a defesa dos EUA.</p></div>
            </div>
          )}

          {section === "videos" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4"><h2 className="text-xs font-bold tracking-widest text-primary uppercase">Registros</h2><div className="flex-1 h-px bg-border" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{name:"CAM-01 — CORREDOR B7",live:true},{name:"CAM-02 — LAB 7",live:true},{name:"CAM-03 — [FALHA]",live:false},{name:"CAM-04 — SERVIDORES",live:true}].map((c,i)=>(
                  <div key={i} className="terminal-box aspect-video flex flex-col">
                    <div className="px-3 py-1 border-b border-border flex items-center justify-between"><span className="text-xs text-primary font-bold">{c.name}</span><span className={`text-xs ${!c.live?"text-alert-red animate-flicker":"text-primary"}`}>{!c.live?"● SEM SINAL":"● AO VIVO"}</span></div>
                    <div className="flex-1 bg-secondary flex items-center justify-center">{!c.live?<div className="text-center"><div className="text-alert-red text-2xl animate-flicker">⚠</div><div className="text-xs text-muted-foreground">SINAL PERDIDO</div></div>:<div className="text-xs text-muted-foreground opacity-30">{Array(6).fill("█░▓▒").join("")}</div>}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-widest text-primary uppercase">Arquivos de Vídeo</h3>
                {YOUTUBE_VIDEOS.filter(v=>level>=v.level).map(v=>(
                  <div key={v.id} className="terminal-box p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2"><div><div className="text-xs font-bold text-foreground">{v.title}</div><div className="text-xs text-muted-foreground">{v.id}</div></div><span className="stamp text-xs">RESTRITO</span></div>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                    {v.youtubeId?<div className="aspect-video bg-secondary"><iframe className="w-full h-full" src={`https://www.youtube.com/embed/${v.youtubeId}`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>:<div className="aspect-video bg-secondary border border-border flex items-center justify-center"><div className="text-xs text-muted-foreground opacity-40">SLOT PARA VÍDEO</div></div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {ingridModal && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4" onClick={()=>setIngridModal(false)}>
          <div className="terminal-box w-full max-w-2xl max-h-[85vh] overflow-auto p-0 animate-scale-in" onClick={e=>e.stopPropagation()}>
            <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-secondary">
              <div><div className="text-xs font-bold text-primary tracking-widest">ARQ-003 — LAUDO MÉDICO</div><div className="text-xs text-muted-foreground">Medicina Interna</div></div>
              <button onClick={()=>setIngridModal(false)} className="text-xs text-muted-foreground hover:text-alert-red border border-border px-2 py-1 hover:border-alert-red transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-xs border border-border p-4">
                <div><span className="text-muted-foreground">PACIENTE:</span> <span className="text-foreground font-bold">INGRID S.</span></div>
                <div><span className="text-muted-foreground">ID:</span> <span className="text-foreground">NSL-MED-0029</span></div>
                <div><span className="text-muted-foreground">SETOR:</span> <span className="text-foreground">Biotecnologia</span></div>
                <div><span className="text-muted-foreground">DATA:</span> <span className="text-foreground">2027-10-14</span></div>
                <div><span className="text-muted-foreground">MÉDICO:</span> <span className="text-foreground">DR. Ricardo Fischer</span></div>
                <div><span className="text-muted-foreground">CLASSIFICAÇÃO:</span> <span className="text-alert-red font-bold">CONFIDENCIAL</span></div>
              </div>
              {[
                {t:"1. Afastamento",p:"Gravidez confirmada (~14 semanas). Protocolo NSL-MED-07."},
                {t:"2. Avaliação Clínica",p:"Evolução normal. Monitoramento por exposição ao A-01."},
                {t:"3. Segurança",p:"Histórico de exposição em sigilo. Gestante não informada sobre agentes."},
                {t:"4. Prognóstico",p:"Retorno: INDEFINIDO. Licença remunerada."},
              ].map((s,i)=><div key={i} className="space-y-1"><div className="text-xs font-bold text-primary tracking-widest uppercase">{s.t}</div><p className="text-xs text-muted-foreground">{s.p}</p></div>)}
              {level>=3&&<div className="space-y-1"><div className="text-xs font-bold text-alert-red tracking-widest uppercase">5. Incidente DL-09 [NV-3]</div><p className="text-xs text-muted-foreground">Óbito em 2028-02-11 às 03h47. Exposição DL-09. Falência neurológica. CAM-03 suprimida.</p></div>}
              <div className="border border-alert-red p-3"><div className="text-xs font-bold text-alert-red tracking-widest">⚠ NOTA INTERNA</div><p className="text-xs text-muted-foreground">Biomarcadores anômalos. Ref: DL-09 / NSL-CLASSIFIED-039.</p></div>
              <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border pt-3"><span>ARQ-003</span><span className="stamp">CONFIDENCIAL</span></div>
            </div>
          </div>
        </div>
      )}

      {selectedArchive && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4" onClick={()=>setSelectedArchive(null)}>
          <div className="terminal-box w-full max-w-lg p-0 animate-scale-in" onClick={e=>e.stopPropagation()}>
            <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-secondary">
              <div><div className="text-xs font-bold text-primary tracking-widest">{selectedArchive.id} — [{selectedArchive.type}]</div><div className="text-xs text-muted-foreground">{selectedArchive.name}</div></div>
              <button onClick={()=>setSelectedArchive(null)} className="text-xs text-muted-foreground hover:text-alert-red border border-border px-2 py-1 hover:border-alert-red transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">TIPO:</span> <span className="text-foreground">{selectedArchive.type}</span></div>
                <div><span className="text-muted-foreground">TAMANHO:</span> <span className="text-foreground">{selectedArchive.size}</span></div>
                <div><span className="text-muted-foreground">STATUS:</span> <span className={selectedArchive.status==="ACESSÍVEL"?"text-primary":"text-alert-red"}>{selectedArchive.status}</span></div>
              </div>
              <p className="text-xs text-muted-foreground border-t border-border pt-3">{selectedArchive.description}</p>
              {selectedArchive.pdfUrl?<a href={selectedArchive.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 text-xs font-bold tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">► ABRIR</a>:<div className="text-xs text-muted-foreground border border-border p-3">Arquivo não vinculado ou <span className="text-primary">não</span> encontrado</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
