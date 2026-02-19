import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

// ═══════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════
type Section = "home" | "func" | "relatorios" | "arquivos" | "videos" | "nz01";

// ═══════════════════════════════════════════════════════════════════
// EDITÁVEL: FUNCIONÁRIOS
// Campos: name, sector, status, statusClass, note (obs. internas nível 2+)
// statusClass: "badge-ativo" | "badge-licenca" | "badge-inativo" | "badge-arquivado"
// ═══════════════════════════════════════════════════════════════════
const EMPLOYEES = [
  {
    name: "Daniel M.",
    sector: "Biosegurança",
    status: "ATIVO",
    statusClass: "badge-ativo",
    note: null,
  },
  {
    name: "Ingrid S.",
    sector: "Biotecnologia",
    status: "LICENÇA",
    statusClass: "badge-licenca",
    // EDITÁVEL: Observação interna da Ingrid
    note: "⚠ Afastamento médico — Gestação em curso. Retorno previsto: INDEFINIDO. Ver ARQ-003 para laudo completo.",
  },
  {
    name: "Volk",
    sector: "Pesquisa",
    status: "INATIVO",
    statusClass: "badge-inativo",
    note: null,
  },
  {
    name: "████████",
    sector: "—",
    status: "ARQUIVADO",
    statusClass: "badge-arquivado",
    // EDITÁVEL: Observação interna COFEE
    note: "COFEE-0: Identidade suprimida por protocolo interno. Motivo real: [INFILTRAÇÃO DETECTADA — NÃO DIVULGAR]. Acesso ao dossiê: REVOGADO.",
  },
  {
    name: "Heinz K.",
    sector: "Biosegurança",
    status: "ATIVO",
    statusClass: "badge-ativo",
    note: null,
  },
];

// ═══════════════════════════════════════════════════════════════════
// EDITÁVEL: RELATÓRIOS
// level: 1 = qualquer logado | 2 = daniel/toddy/admin | 3 = toddy/admin apenas
// ═══════════════════════════════════════════════════════════════════
const REPORTS = [
  {
    id: "REL-001",
    title: "Relatório de Biossegurança — Setor 7",
    date: "2027-03-14",
    level: 1,
    // EDITÁVEL: Conteúdo do relatório REL-001
    content: "Análise de contenção realizadas no perímetro interno. Nenhuma anomalia detectada. Protocolo 7-C mantido.",
  },
  {
    id: "REL-002",
    title: "Avaliação de Campo — Projeto VOLK",
    date: "2027-01-28",
    level: 2,
    // EDITÁVEL: Conteúdo do relatório REL-002
    content:
      "Registros do sujeito Volk foram marcados como inconclusivos. Arquivos de acompanhamento transferidos para protocolo fechado. Investigação interna em andamento.",
  },
  {
    id: "ERRO-001",
    title: "Registro de Erro — COFEE",
    date: "2026-12-05",
    level: 1,
    // EDITÁVEL: Conteúdo do relatório ERRO-001
    content:
      "Inconsistência detectada no banco de dados de pessoal. Funcionário ID: COFEE-0 foi removido do sistema por ordem interna. Motivo: [REDACTED]. Investigação em andamento.",
  },
  {
    id: "REL-003",
    title: "Incidente DL-09 — Relatório Classificado",
    date: "2027-02-11",
    level: 3,
    // EDITÁVEL: Conteúdo do incidente DL-09 (apenas Toddy/Admin vê)
    content:
      "Incidente de contenção nível crítico registrado no Laboratório 4, Ala Biotecnologia. Vítima: INGRID S. Causa: exposição não controlada ao agente NZ-01/A-00. Morte declarada às 03h47. Registro de câmera CAM-03 foi suprimido por protocolo interno. Este relatório está sob sigilo absoluto. Acesso restrito ao Diretor.",
  },
  // ─────────────────────────────────────────────────────────────────
  // EDITÁVEL: Adicione novos relatórios copiando o modelo abaixo:
  // {
  //   id: "REL-004",
  //   title: "Título do relatório",
  //   date: "2027-XX-XX",
  //   level: 1, // 1, 2 ou 3
  //   content: "Conteúdo do relatório aqui.",
  // },
  // ─────────────────────────────────────────────────────────────────
];

// ═══════════════════════════════════════════════════════════════════
// EDITÁVEL: ARQUIVOS
// type: "PDF" | "BIO" | "ENC" | "MED" | "VID" | "███"
// status: "ACESSÍVEL" | "CRIPTOGRAFADO" | "REMOVIDO"
// level: 1, 2, 3 ou 99 (inacessível a todos)
// pdfUrl: link externo para PDF ou arquivo (deixe "" para nenhum)
// ═══════════════════════════════════════════════════════════════════
const ARCHIVES: {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  level: number;
  pdfUrl: string;
  description: string;
}[] = [
  {
    id: "ARQ-001",
    name: "Protocolo 17-B",
    type: "PDF",
    size: "2.3 MB",
    status: "ACESSÍVEL",
    level: 1,
    // EDITÁVEL: Cole aqui o link do PDF do Protocolo 17-B
    pdfUrl: "",
    description: "Protocolo interno de biossegurança e contenção.",
  },
  {
    id: "ARQ-002",
    name: "Arquivo VOLK — Fase 2",
    type: "ENC",
    size: "█████",
    status: "CRIPTOGRAFADO",
    level: 3,
    pdfUrl: "",
    description: "Dados da fase 2 do experimento VOLK. Criptografado.",
  },
  {
    id: "ARQ-003",
    name: "Laudos Médicos — Ing. S. [GESTAÇÃO]",
    type: "MED",
    size: "1.1 MB",
    status: "ACESSÍVEL",
    level: 2,
    // EDITÁVEL: Cole aqui o link do PDF do laudo médico da Ingrid
    pdfUrl: "",
    description: "Laudo médico completo de Ingrid S.",
  },
  {
    id: "ARQ-004",
    name: "████████ — Dossiê COFEE",
    type: "███",
    size: "█████",
    status: "REMOVIDO",
    level: 99,
    pdfUrl: "",
    description: "Arquivo suprimido.",
  },
  {
    id: "ARQ-005",
    name: "NZ-01 — Relatório de Falhas Completo",
    type: "ENC",
    size: "█████",
    status: "CRIPTOGRAFADO",
    level: 3,
    // EDITÁVEL: Cole aqui o link do relatório final do NZ-01
    pdfUrl: "",
    description: "Relatório completo de todas as iterações e falhas do NZ-01.",
  },
  {
    id: "ARQ-006",
    name: "NZ-01 / A-00 — Protótipo Inicial",
    type: "BIO",
    size: "4.7 MB",
    status: "ACESSÍVEL",
    level: 2,
    // EDITÁVEL: Cole aqui o link do arquivo BIO do A-00
    pdfUrl: "",
    description: "Documentação do protótipo inicial A-00.",
  },
  {
    id: "ARQ-007",
    name: "Incidente DL-09 — Laudo Oficial",
    type: "PDF",
    size: "█████",
    status: "ACESSÍVEL",
    level: 3,
    // EDITÁVEL: Cole aqui o link do PDF do incidente DL-09
    pdfUrl: "",
    description: "Laudo oficial do Incidente DL-09 — ACESSO RESTRITO AO DIRETOR.",
  },
  // ─────────────────────────────────────────────────────────────────
  // EDITÁVEL: Adicione novos arquivos copiando o modelo abaixo:
  // {
  //   id: "ARQ-008",
  //   name: "Nome do arquivo",
  //   type: "PDF",
  //   size: "X.X MB",
  //   status: "ACESSÍVEL",
  //   level: 1,
  //   pdfUrl: "", // cole o link aqui
  //   description: "Descrição curta do arquivo.",
  // },
  // ─────────────────────────────────────────────────────────────────
];

// ═══════════════════════════════════════════════════════════════════
// EDITÁVEL: VÍDEOS DO YOUTUBE (não-listados)
// youtubeId: o código após "?v=" no link do YouTube
// Ex: https://www.youtube.com/watch?v=XXXXXXXXXXX → youtubeId: "XXXXXXXXXXX"
// level: nível de acesso mínimo para ver
// ═══════════════════════════════════════════════════════════════════
const YOUTUBE_VIDEOS: {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  date: string;
  level: number;
}[] = [
  // EDITÁVEL: Adicione vídeos do YouTube (não-listados) abaixo:
  // {
  //   id: "VID-001",
  //   title: "Título do vídeo",
  //   description: "Descrição ou contexto do registro.",
  //   youtubeId: "XXXXXXXXXXX", // código do vídeo
  //   date: "2027-XX-XX",
  //   level: 2,
  // },
  // {
  //   id: "VID-002",
  //   title: "Incidente DL-09 — Registro de Câmera",
  //   description: "Última gravação disponível antes da supressão do sinal. CAM-03.",
  //   youtubeId: "XXXXXXXXXXX",
  //   date: "2027-02-11",
  //   level: 3,
  // },
];

// ═══════════════════════════════════════════════════════════════════
// EDITÁVEL: NOTÍCIAS / DESTAQUES DO LABORATÓRIO (Painel Home)
// Aparecem como cards de notícia no painel principal.
// ═══════════════════════════════════════════════════════════════════
const NEWS = [
  {
    id: "NSL-NEWS-001",
    date: "2027-03-01",
    level: 1,
    tag: "PESQUISA",
    tagClass: "badge-ativo",
    // EDITÁVEL: Título e corpo da notícia NSL-NEWS-001
    title: "Armadura Resistente a Armas Russas Desenvolvida no Lab. 9",
    body: "A equipe do Laboratório 9, Andar 10, concluiu com êxito os testes de uma armadura experimental capaz de resistir a impactos de armamentos de infantaria russos de última geração. O material composto ainda aguarda aprovação para produção em escala.",
  },
  {
    id: "NSL-NEWS-002",
    date: "2027-02-20",
    level: 1,
    tag: "BIOSSEGURANÇA",
    tagClass: "badge-licenca",
    // EDITÁVEL: Título e corpo da notícia NSL-NEWS-002
    title: "Protocolo 7-C Renovado — Contenção Reforçada no Setor Biotec",
    body: "Após revisão interna, o Protocolo 7-C de contenção foi atualizado para incluir verificação biométrica dupla no Setor de Biotecnologia. Todos os colaboradores devem atualizar seus crachás até 2027-03-15.",
  },
  {
    id: "NSL-NEWS-003",
    date: "2027-02-11",
    level: 2,
    tag: "ALERTA",
    tagClass: "badge-arquivado",
    // EDITÁVEL: Título e corpo da notícia NSL-NEWS-003 (nível 2+)
    title: "Sinal da CAM-03 Perdido — Investigação em Andamento",
    body: "O feed da câmera CAM-03 (Laboratório 4) foi perdido às 03h47 do dia 2027-02-11. A área foi isolada por precaução. Relatório de ocorrência disponível para Nível 2 ou superior.",
  },
  // ─────────────────────────────────────────────────────────────────
  // EDITÁVEL: Adicione novas notícias copiando o modelo abaixo:
  // {
  //   id: "NSL-NEWS-004",
  //   date: "2027-XX-XX",
  //   level: 1, // nível mínimo para ver
  //   tag: "PESQUISA", // rótulo do card
  //   tagClass: "badge-ativo",
  //   title: "Título da notícia",
  //   body: "Texto da notícia aqui.",
  // },
  // ─────────────────────────────────────────────────────────────────
];

// ═══════════════════════════════════════════════════════════════════
// EDITÁVEL: VERSÕES DO PROJETO NZ-01
// status: "FALHA" | "OPERACIONAL" | "BLOQUEADO"
// ═══════════════════════════════════════════════════════════════════
const NZ01_VERSIONS = [
  {
    id: "A-00",
    label: "PROTÓTIPO INICIAL",
    date: "2024-07-02",
    level: 2,
    statusLabel: "FALHA — DESCONTINUADO",
    statusClass: "badge-inativo",
    borderClass: "border-l-alert-yellow",
    labelClass: "text-alert-yellow",
    // EDITÁVEL: Descrição da versão A-00
    content:
      "Primeira iteração do agente. Falha catastrófica na fase de estabilização — agente mostrou comportamento imprevisível em ambientes controlados. Responsável: Ingrid S. Projeto suspenso por 4 meses para revisão de protocolos.",
  },
  // ─────────────────────────────────────────────────────────────────
  // EDITÁVEL: Adicione versões intermediárias copiando o modelo abaixo:
  // {
  //   id: "A-01",
  //   label: "NOME DA VERSÃO",
  //   date: "2024-XX-XX",
  //   level: 2,
  //   statusLabel: "FALHA — DESCONTINUADO",
  //   statusClass: "badge-inativo",
  //   borderClass: "border-l-alert-yellow",
  //   labelClass: "text-alert-yellow",
  //   content: "Descrição da versão aqui.",
  // },
  // ─────────────────────────────────────────────────────────────────
  {
    id: "NZ-01",
    label: "VERSÃO FINAL",
    date: "2027-01-15",
    level: 3,
    statusLabel: "OPERACIONAL — ATIVO",
    statusClass: "badge-ativo",
    borderClass: "border-l-alert-red",
    labelClass: "text-alert-red",
    // EDITÁVEL: Descrição da versão final NZ-01 (apenas Nível 3 vê)
    content:
      "Iteração final considerada operacional pelo comitê interno. Composição: agente de supressão neurológica seletiva, vetor aerossol. Testes em campo realizados em ambiente controlado. Implantação: [REDACTED]. Status: ATIVO. Responsável: [REDACTED].",
  },
];

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("home");
  const [user, setUser] = useState("");
  const [level, setLevel] = useState(0);
  const [time, setTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedArchive, setSelectedArchive] = useState<(typeof ARCHIVES)[0] | null>(null);
  const [ingridModal, setIngridModal] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    if (auth !== "true") {
      navigate("/login");
      return;
    }
    setUser(sessionStorage.getItem("user") || "");
    setLevel(Number(sessionStorage.getItem("level")) || 0);
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, [navigate]);

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const navLinks: { id: Section; label: string; minLevel: number }[] = [
    { id: "home", label: "PAINEL", minLevel: 0 },
    { id: "func", label: "FUNCIONÁRIOS", minLevel: 0 },
    { id: "relatorios", label: "RELATÓRIOS", minLevel: 1 },
    { id: "arquivos", label: "ARQUIVOS", minLevel: 1 },
    { id: "nz01", label: "PROJ. NZ-01", minLevel: 2 },
    { id: "videos", label: "REGISTROS", minLevel: 2 },
  ];

  return (
    <div className="scanlines min-h-screen bg-background font-mono flex flex-col crt-vignette">
      {/* Moving scanline */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 h-8 w-full opacity-10"
        style={{
          background: "linear-gradient(to bottom, transparent, hsl(187 100% 80% / 0.15), transparent)",
          animation: "scanline 8s linear infinite",
        }}
      />

      {/* ══════════════ TOP BAR ══════════════ */}
      <div className="border-b border-border bg-card flex items-center px-4 py-2 gap-4 z-30 sticky top-0">
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="text-muted-foreground hover:text-primary text-xs px-2 py-1 border border-border hover:border-primary transition-colors"
        >
          ☰
        </button>
        <img src={logo} alt="NordSternLab" className="h-7 w-7 opacity-80" />
        <div className="flex-1">
          {/* EDITÁVEL: Nome e subtítulo do painel */}
          <span className="text-primary font-bold text-xs tracking-widest">NordSternLab</span>
          <span className="text-muted-foreground text-xs ml-2">// PAINEL INTERNO CLASSIFICADO</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground hidden md:block">
            {time.toISOString().replace("T", " ").slice(0, 19)} UTC
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">USUÁRIO:</span>
            <span className="text-primary font-bold uppercase">{user}</span>
            <span className="text-muted-foreground">NV-{level}</span>
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1 border border-alert-red text-alert-red hover:bg-alert-red hover:text-background transition-all tracking-widest"
          >
            SAIR
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ══════════════ SIDEBAR ══════════════ */}
        {sidebarOpen && (
          <aside className="w-52 border-r border-border bg-card flex flex-col shrink-0 pt-4">
            <div className="px-4 pb-4 border-b border-border">
              <div className="text-xs text-muted-foreground tracking-widest">NÍVEL DE ACESSO</div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3].map((l) => (
                  <div
                    key={l}
                    className="h-2 w-8 rounded-sm"
                    style={{
                      background: level >= l ? "hsl(var(--primary))" : "hsl(var(--border))",
                      boxShadow: level >= l ? "0 0 4px hsl(var(--primary))" : "none",
                    }}
                  />
                ))}
              </div>
              <div className="text-xs text-primary mt-1 font-bold">
                {level === 3 ? "DIRETOR" : level === 2 ? "PESQUISADOR" : "BÁSICO"}
              </div>
            </div>

            <nav className="flex-1 py-2">
              {navLinks.map((link) => {
                const accessible = level >= link.minLevel;
                if (!accessible) return null;
                return (
                  <button
                    key={link.id}
                    onClick={() => setSection(link.id)}
                    className={`sidebar-link w-full text-left ${section === link.id ? "active" : ""}`}
                  >
                    {">"} {link.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
                  MONITORAMENTO ATIVO
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* ══════════════ CONTEÚDO PRINCIPAL ══════════════ */}
        <main className="flex-1 overflow-auto p-6">

          {/* ════════ HOME ════════ */}
          {section === "home" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Painel Geral</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Status cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="terminal-box p-4 space-y-1">
                  <div className="text-xs text-muted-foreground">STATUS DO SISTEMA</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-primary font-bold text-sm">ATIVO</span>
                  </div>
                </div>
                <div className="terminal-box p-4 space-y-1">
                  <div className="text-xs text-muted-foreground">MONITORAMENTO</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-primary font-bold text-sm">ONLINE</span>
                  </div>
                </div>
                <div className="terminal-box p-4 space-y-1">
                  {/* EDITÁVEL: Contador de acessos */}
                  <div className="text-xs text-muted-foreground">ACESSOS REGISTRADOS</div>
                  <div className="text-foreground font-bold text-sm">17</div>
                </div>
              </div>

              {/* Alert COFEE */}
              <div className="border border-alert-yellow bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-alert-yellow tracking-widest">
                  ⚠ ALERTA — INCONSISTÊNCIA EM REGISTROS DETECTADA
                </div>
                {/* EDITÁVEL: Mensagem de alerta principal do painel */}
                <p className="text-xs text-muted-foreground mt-2">
                  Um ou mais registros de pessoal apresentam inconsistências. Referência: COFEE-0. Investigação pendente por autoridade superior.
                </p>
              </div>

              {/* ══ NOTÍCIAS DO LABORATÓRIO ══ */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <h3 className="text-xs font-bold tracking-widest text-primary uppercase">Boletins Internos</h3>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {NEWS.filter((n) => level >= n.level).map((news) => (
                  <div key={news.id} className="terminal-box p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 font-bold ${news.tagClass}`}>{news.tag}</span>
                        <span className="text-xs font-bold text-foreground">{news.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{news.date}</span>
                    </div>
                    {/* EDITÁVEL: Corpo da notícia — encontre pela variável NEWS acima */}
                    <p className="text-xs text-muted-foreground leading-relaxed">{news.body}</p>
                    <div className="text-xs text-muted-foreground opacity-50">{news.id}</div>
                  </div>
                ))}
              </div>

              {/* Mensagens por usuário */}
              {user === "daniel" && (
                <div className="border border-alert-red bg-card p-4">
                  <div className="text-xs text-alert-red font-bold tracking-widest animate-flicker">
                    [REGISTROS PESSOAIS DISPONÍVEIS]
                  </div>
                  {/* EDITÁVEL: Mensagem privada do Daniel */}
                  <p className="text-xs text-muted-foreground mt-2 animate-flicker" style={{ animationDelay: "0.5s" }}>
                    Não deixe eles verem.
                  </p>
                </div>
              )}
              {user === "ingrid" && (
                <div className="border border-alert-yellow bg-card p-4">
                  <div className="text-xs text-alert-yellow font-bold">Acesso limitado.</div>
                  {/* EDITÁVEL: Mensagem privada da Ingrid */}
                  <p className="text-xs text-muted-foreground mt-1">Alguns arquivos foram removidos da sua visualização.</p>
                </div>
              )}
              {(user === "toddy" || user === "admin") && (
                <div className="border border-alert-red bg-card p-4">
                  <div className="text-xs text-alert-red font-bold tracking-widest animate-flicker">
                    [ACESSO TOTAL — DIRETOR]
                  </div>
                  {/* EDITÁVEL: Mensagem privada do Toddy/Admin */}
                  <p className="text-xs text-muted-foreground mt-2">
                    Todos os arquivos classificados estão disponíveis. O Incidente DL-09 aguarda sua revisão final.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ════════ FUNCIONÁRIOS ════════ */}
          {section === "func" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Funcionários</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left px-4 py-2 text-muted-foreground tracking-widest font-normal">NOME</th>
                      <th className="text-left px-4 py-2 text-muted-foreground tracking-widest font-normal">SETOR</th>
                      <th className="text-left px-4 py-2 text-muted-foreground tracking-widest font-normal">STATUS</th>
                      {level >= 2 && <th className="text-left px-4 py-2 text-muted-foreground tracking-widest font-normal">OBS. INTERNAS</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {EMPLOYEES.map((emp, i) => (
                      <tr
                        key={i}
                        className={`border-b border-border hover:bg-secondary/50 transition-colors ${emp.name === "Ingrid S." && level >= 2 ? "cursor-pointer" : ""}`}
                        onClick={() => { if (emp.name === "Ingrid S." && level >= 2) setIngridModal(true); }}
                      >
                        <td className={`px-4 py-3 font-bold ${emp.name === "████████" ? "redacted text-alert-red" : "text-foreground"}`}>
                          {emp.name}
                          {emp.name === "Ingrid S." && level >= 2 && (
                            <span className="ml-2 text-xs text-muted-foreground font-normal">[ver laudo]</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{emp.sector}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-bold ${emp.statusClass}`}>
                            {emp.status}
                          </span>
                        </td>
                        {level >= 2 && (
                          <td className="px-4 py-3 text-muted-foreground max-w-xs">
                            {emp.note ? (
                              <span className={`text-xs leading-relaxed ${emp.name === "████████" ? "text-alert-red" : "text-alert-yellow"}`}>
                                {emp.note}
                              </span>
                            ) : (
                              <span className="opacity-30">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-alert-red">
                ⚠ Registro incompleto detectado. Um funcionário foi suprimido do banco de dados. Ref: COFEE-0.
              </div>
            </div>
          )}

          {/* ════════ RELATÓRIOS ════════ */}
          {section === "relatorios" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Relatórios</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-3">
                {REPORTS.filter((r) => level >= r.level).map((r) => (
                  <div key={r.id} className={`terminal-box p-4 space-y-2 ${r.level >= 3 ? "border-l-alert-red" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold tracking-widest ${r.level >= 3 ? "text-alert-red animate-flicker" : "text-primary"}`}>
                        {r.id}
                      </span>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="text-sm font-bold text-foreground">{r.title}</div>
                    {/* EDITÁVEL: Conteúdo — encontre por id na constante REPORTS acima */}
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.content}</p>
                    {r.level >= 3 && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="stamp text-xs">CLASSIFICADO</span>
                        <span className="text-xs text-alert-red font-bold">ACESSO RESTRITO — DIRETOR</span>
                      </div>
                    )}
                  </div>
                ))}
                {REPORTS.filter((r) => level < r.level).length > 0 && (
                  <div className="terminal-box p-4 border-alert-red opacity-60">
                    <span className="text-xs text-muted-foreground">
                      {REPORTS.filter((r) => level < r.level).length} relatório(s) oculto(s) — nível de acesso insuficiente.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════ ARQUIVOS ════════ */}
          {section === "arquivos" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Arquivos</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <p className="text-xs text-muted-foreground">
                Clique em um arquivo acessível para abrir. Arquivos com link PDF abrirão em nova aba.
              </p>

              <div className="space-y-2">
                {ARCHIVES.map((a) => {
                  const accessible = level >= a.level && a.status !== "REMOVIDO";
                  return (
                    <div
                      key={a.id}
                      onClick={() => accessible && setSelectedArchive(a)}
                      className={`terminal-box p-4 flex items-center justify-between gap-4 ${
                        !accessible ? "opacity-40 cursor-not-allowed" : "hover:border-primary transition-colors cursor-pointer"
                      } ${a.level >= 3 && accessible ? "border-l-alert-red" : ""}`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="text-xs text-muted-foreground font-mono shrink-0">[{a.type}]</span>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${!accessible ? "text-muted-foreground" : "text-foreground"}`}>
                            {a.name}
                          </div>
                          <div className="text-xs text-muted-foreground">{a.id} — {a.size}</div>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 font-bold tracking-wider shrink-0 ${
                          !accessible
                            ? "badge-arquivado"
                            : a.status === "ACESSÍVEL"
                            ? "badge-ativo"
                            : a.status === "CRIPTOGRAFADO"
                            ? "badge-inativo"
                            : "badge-arquivado"
                        }`}
                      >
                        {level < a.level ? "BLOQUEADO" : a.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════ PROJ. NZ-01 ════════ */}
          {section === "nz01" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Projeto NZ-01 — Arma Biológica</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="stamp text-xs">CONFIDENCIAL</span>
              </div>

              <div className="border border-alert-red bg-card p-4">
                <div className="text-xs font-bold text-alert-red tracking-widest animate-flicker">
                  ⚠ NÍVEL DE RISCO: EXTREMO — PROTOCOLO BIO-7 ATIVO
                </div>
                {/* EDITÁVEL: Descrição geral do projeto NZ-01 */}
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  O Projeto NZ-01 consiste no desenvolvimento de um agente biológico de supressão seletiva. Todas as iterações
                  anteriores ao modelo final resultaram em falhas críticas de contenção. O histórico de versões está documentado
                  abaixo em ordem cronológica de desenvolvimento.
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-muted-foreground tracking-widest uppercase mb-2">— Histórico de Iterações —</div>

                {NZ01_VERSIONS.map((v) => {
                  const visible = level >= v.level;
                  return (
                    <div
                      key={v.id}
                      className={`terminal-box p-4 border-l-4 space-y-2 ${visible ? v.borderClass : "border-l-border opacity-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold tracking-widest ${visible ? v.labelClass : "text-muted-foreground"} ${v.id === "NZ-01" && visible ? "animate-flicker" : ""}`}>
                          {v.id} — {v.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {visible ? v.date : "████████"}
                        </span>
                      </div>
                      {visible ? (
                        <>
                          {/* EDITÁVEL: Conteúdo — encontre por id na constante NZ01_VERSIONS acima */}
                          <p className="text-xs text-muted-foreground leading-relaxed">{v.content}</p>
                          <span className={`${v.statusClass} text-xs px-2 py-0.5 font-bold`}>{v.statusLabel}</span>
                        </>
                      ) : (
                        <>
                          <div className="text-xs text-muted-foreground redacted">████████████████████████████████████████</div>
                          <div className="text-xs text-alert-red">🔒 ACESSO NÍVEL {v.level} REQUERIDO</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* EDITÁVEL: Nota de rodapé NZ-01 */}
              <div className="terminal-box p-3">
                <p className="text-xs text-muted-foreground text-center">
                  Qualquer divulgação não autorizada deste projeto será tratada como traição de Estado. Ref. interna:{" "}
                  <span className="text-alert-red">NZ-CLASSIFIED-001</span>
                </p>
              </div>
            </div>
          )}

          {/* ════════ REGISTROS / VÍDEOS ════════ */}
          {section === "videos" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Registros de Câmera e Vídeos</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Câmeras ao vivo (simuladas) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "CAM-01 — CORREDOR B7", live: true },
                  { name: "CAM-02 — LABORATÓRIO 3", live: true },
                  { name: "CAM-03 — [FALHA]", live: false },
                  { name: "CAM-04 — SALA DE SERVIDORES", live: true },
                ].map((cam, i) => (
                  <div key={i} className="terminal-box aspect-video flex flex-col">
                    <div className="px-3 py-1 border-b border-border flex items-center justify-between">
                      <span className="text-xs text-primary font-bold">{cam.name}</span>
                      <span className={`text-xs ${!cam.live ? "text-alert-red animate-flicker" : "text-primary"}`}>
                        {!cam.live ? "● SEM SINAL" : "● AO VIVO"}
                      </span>
                    </div>
                    <div className="flex-1 bg-secondary flex items-center justify-center">
                      {!cam.live ? (
                        <div className="text-center space-y-2">
                          <div className="text-alert-red text-2xl animate-flicker">⚠</div>
                          <div className="text-xs text-muted-foreground">SINAL PERDIDO</div>
                          {/* EDITÁVEL: Data/hora da última atualização da CAM-03 */}
                          <div className="text-xs text-muted-foreground">ÚLTIMA ATUALIZAÇÃO: 2027-02-11 03:47</div>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <div className="text-muted-foreground opacity-20 text-xs">
                            {Array(8).fill("█░▓▒░█▓░▒").join("")}
                          </div>
                          <div className="text-xs text-muted-foreground">FEED AO VIVO — SEM ATIVIDADE DETECTADA</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Alerta Daniel sobre CAM-03 */}
              {user === "daniel" && (
                <div className="terminal-box p-4 border-alert-red">
                  <div className="text-xs text-alert-red font-bold animate-flicker">
                    ARQUIVO OCULTADO DETECTADO — CAM-03 — 2027-02-11
                  </div>
                  {/* EDITÁVEL: Detalhe do arquivo ocultado */}
                  <div className="text-xs text-muted-foreground mt-1">
                    Registro de 4h17min removido. Autorização: DESCONHECIDA.
                  </div>
                </div>
              )}

              {/* ══ VÍDEOS DO YOUTUBE ══ */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <h3 className="text-xs font-bold tracking-widest text-primary uppercase">Arquivos de Vídeo Classificados</h3>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {YOUTUBE_VIDEOS.filter((v) => level >= v.level).length === 0 && (
                  <div className="terminal-box p-4 opacity-60">
                    <p className="text-xs text-muted-foreground">
                      Nenhum arquivo de vídeo disponível para o seu nível de acesso.{" "}
                      {/* Se você é admin e não vê vídeos, adicione-os na constante YOUTUBE_VIDEOS no código */}
                    </p>
                  </div>
                )}

                {/* EDITÁVEL: Adicione vídeos na constante YOUTUBE_VIDEOS no topo do arquivo */}
                {YOUTUBE_VIDEOS.filter((v) => level >= v.level).map((v) => (
                  <div key={v.id} className="terminal-box p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="text-xs font-bold text-foreground">{v.title}</div>
                        <div className="text-xs text-muted-foreground">{v.id} — {v.date}</div>
                      </div>
                      <span className="stamp text-xs">RESTRITO</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
                    {v.youtubeId && (
                      <div className="aspect-video w-full bg-secondary">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${v.youtubeId}`}
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══════════════ MODAL: LAUDO INGRID ══════════════ */}
      {ingridModal && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4" onClick={() => setIngridModal(false)}>
          <div
            className="terminal-box w-full max-w-2xl max-h-[85vh] overflow-auto p-0 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do modal */}
            <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-secondary">
              <div>
                <div className="text-xs font-bold text-primary tracking-widest">ARQ-003 — LAUDO MÉDICO CLASSIFICADO</div>
                <div className="text-xs text-muted-foreground">NordSternLab — Setor de Medicina Interna</div>
              </div>
              <button
                onClick={() => setIngridModal(false)}
                className="text-xs text-muted-foreground hover:text-alert-red border border-border px-2 py-1 hover:border-alert-red transition-colors"
              >
                ✕ FECHAR
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Cabeçalho do laudo */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-border p-4">
                <div><span className="text-muted-foreground">PACIENTE:</span> <span className="text-foreground font-bold">INGRID S.</span></div>
                <div><span className="text-muted-foreground">ID:</span> <span className="text-foreground">NSL-MED-0029</span></div>
                <div><span className="text-muted-foreground">SETOR:</span> <span className="text-foreground">Biotecnologia</span></div>
                {/* EDITÁVEL: Data do laudo médico */}
                <div><span className="text-muted-foreground">DATA:</span> <span className="text-foreground">2027-01-08</span></div>
                <div><span className="text-muted-foreground">MÉDICO RESP.:</span> <span className="text-foreground">DR. K. HENRIKSEN</span></div>
                <div><span className="text-muted-foreground">CLASSIFICAÇÃO:</span> <span className="text-alert-red font-bold">CONFIDENCIAL</span></div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-primary tracking-widest uppercase">1. Motivo do Afastamento</div>
                {/* EDITÁVEL: Seção 1 do laudo médico da Ingrid */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A colaboradora Ingrid S. foi formalmente afastada de suas atividades laboratoriais em 2027-01-08 por indicação
                  médica, em decorrência de gravidez em estágio confirmado (aproximadamente 14 semanas). O afastamento segue protocolo
                  NSL-MED-07 para gestantes expostas a ambientes de biossegurança nível 3 ou superior.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-primary tracking-widest uppercase">2. Avaliação Clínica</div>
                {/* EDITÁVEL: Seção 2 do laudo médico da Ingrid */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Exames iniciais indicam gravidez de evolução aparentemente normal. No entanto, dado o histórico de exposição
                  da colaboradora ao agente A-00 durante testes do Projeto NZ-01 (ref. NZ-CLASSIFIED-001), foi recomendado
                  monitoramento adicional de marcadores biológicos. Resultados dos exames secundários: <span className="text-alert-red font-bold">[REDACTED — NÍVEL 3]</span>.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-primary tracking-widest uppercase">3. Observações do Setor de Segurança</div>
                {/* EDITÁVEL: Seção 3 do laudo médico da Ingrid */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O Setor de Segurança Interna requisitou que o histórico de exposição laboratorial da colaboradora permaneça
                  em sigilo. A gestante não foi informada sobre a natureza dos agentes aos quais foi exposta durante os experimentos
                  da Fase A (2024). Qualquer comunicação com a colaboradora sobre esses dados deve ser previamente autorizada
                  pela direção do NordSternLab.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-primary tracking-widest uppercase">4. Prognóstico e Retorno</div>
                {/* EDITÁVEL: Seção 4 do laudo médico da Ingrid */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Retorno às atividades: <span className="text-alert-yellow font-bold">INDEFINIDO</span>. Aguarda-se conclusão
                  dos exames adicionais e avaliação trimestral. A colaboradora permanece em licença remunerada conforme decreto interno 2027-004.
                </p>
              </div>

              {/* Nota confidencial */}
              <div className="border border-alert-red p-3 space-y-1">
                <div className="text-xs font-bold text-alert-red tracking-widest">⚠ NOTA INTERNA — NÃO DIVULGAR À PACIENTE</div>
                {/* EDITÁVEL: Nota confidencial interna do laudo */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O exame de biomarcadores realizado em 2026-12-20 apresentou anomalias compatíveis com contaminação
                  por agente biológico classificado. Este dado está suprimido do prontuário padrão da paciente e é de acesso
                  restrito ao Diretor e à comissão médica interna. Ref: <span className="text-alert-red">DL-09 / NSL-CLASSIFIED-039</span>.
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border pt-3">
                <span>ARQ-003 — NSL-MED-0029</span>
                <span className="stamp">CONFIDENCIAL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL: ARQUIVO ══════════════ */}
      {selectedArchive && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4" onClick={() => setSelectedArchive(null)}>
          <div
            className="terminal-box w-full max-w-lg p-0 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-secondary">
              <div>
                <div className="text-xs font-bold text-primary tracking-widest">{selectedArchive.id} — [{selectedArchive.type}]</div>
                <div className="text-xs text-muted-foreground">{selectedArchive.name}</div>
              </div>
              <button
                onClick={() => setSelectedArchive(null)}
                className="text-xs text-muted-foreground hover:text-alert-red border border-border px-2 py-1 hover:border-alert-red transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">TIPO:</span> <span className="text-foreground">{selectedArchive.type}</span></div>
                <div><span className="text-muted-foreground">TAMANHO:</span> <span className="text-foreground">{selectedArchive.size}</span></div>
                <div><span className="text-muted-foreground">STATUS:</span> <span className={selectedArchive.status === "ACESSÍVEL" ? "text-primary" : "text-alert-red"}>{selectedArchive.status}</span></div>
                <div><span className="text-muted-foreground">ID:</span> <span className="text-foreground">{selectedArchive.id}</span></div>
              </div>
              {/* EDITÁVEL: Descrição — edite na constante ARCHIVES no topo do arquivo */}
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">{selectedArchive.description}</p>

              {selectedArchive.pdfUrl ? (
                <a
                  href={selectedArchive.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-xs font-bold tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  ► ABRIR ARQUIVO
                </a>
              ) : (
                <div className="text-xs text-muted-foreground border border-border p-3">
                  {/* Mensagem quando não há link de arquivo configurado */}
                  Arquivo físico não vinculado. Para adicionar, edite o campo <span className="text-primary">pdfUrl</span> na constante <span className="text-primary">ARCHIVES</span> no topo do arquivo Dashboard.tsx.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
