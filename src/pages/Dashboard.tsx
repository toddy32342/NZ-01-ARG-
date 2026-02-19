import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

type Section = "home" | "func" | "relatorios" | "arquivos" | "videos" | "nz01";

const EMPLOYEES = [
  { name: "Daniel M.", sector: "Biosegurança", status: "ATIVO", statusClass: "badge-ativo", note: null },
  { name: "Ingrid S.", sector: "Biotecnologia", status: "LICENÇA", statusClass: "badge-licenca", note: "⚠ Afastamento médico — Gestação em curso. Retorno previsto: INDEFINIDO." },
  { name: "Volk", sector: "Pesquisa", status: "INATIVO", statusClass: "badge-inativo", note: null },
  { name: "████████", sector: "—", status: "ARQUIVADO", statusClass: "badge-arquivado", note: "COFEE-0: Identidade suprimida por protocolo interno. Motivo real: [INFILTRAÇÃO DETECTADA — NÃO DIVULGAR]" },
  { name: "Heinz K.", sector: "Biosegurança", status: "ATIVO", statusClass: "badge-ativo", note: null },
];

const REPORTS = [
  { id: "REL-001", title: "Relatório de Biossegurança — Setor 7", date: "2027-03-14", level: 1, content: "Análise de contenção realizadas no perímetro interno. Nenhuma anomalia detectada. Protocolo 7-C mantido." },
  { id: "REL-002", title: "Avaliação de Campo — Projeto VOLK", date: "2027-01-28", level: 2, content: "Registros do sujeito Volk foram marcados como inconclusivos. Arquivos de acompanhamento transferidos para protocolo fechado. ACESSO NÍVEL 2 REQUERIDO." },
  { id: "ERRO-001", title: "Registro de Erro — COFEE", date: "2026-12-05", level: 1, content: "Inconsistência detectada no banco de dados de pessoal. Funcionário ID: COFEE-0 foi removido do sistema por ordem interna. Motivo: [REDACTED]. Investigação em andamento." },
  // ─────────────────────────────────────────────────────────────────
  // EDITÁVEL: Adicione abaixo novos relatórios seguindo o modelo:
  // { id: "REL-003", title: "Título do relatório", date: "2027-XX-XX", level: 1, content: "Conteúdo do relatório aqui." },
  // Nível de acesso: 1 = qualquer usuário logado | 2 = apenas daniel/admin | 3 = apenas admin
  // ─────────────────────────────────────────────────────────────────
];

const ARCHIVES = [
  { id: "ARQ-001", name: "Protocolo 17-B", type: "PDF", size: "2.3 MB", status: "ACESSÍVEL", level: 1 },
  { id: "ARQ-002", name: "Arquivo VOLK — Fase 2", type: "ENC", size: "█████", status: "CRIPTOGRAFADO", level: 3 },
  { id: "ARQ-003", name: "Laudos Médicos — Ing. S. [GESTAÇÃO]", type: "MED", size: "1.1 MB", status: "ACESSÍVEL", level: 2 },
  { id: "ARQ-004", name: "████████ — Dossiê COFEE", type: "███", size: "█████", status: "REMOVIDO", level: 99 },
  { id: "ARQ-005", name: "NZ-01 — Relatório de Falhas Completo", type: "ENC", size: "█████", status: "CRIPTOGRAFADO", level: 3 },
  { id: "ARQ-006", name: "NZ-01 / A-00 — Protótipo Inicial", type: "BIO", size: "4.7 MB", status: "ACESSÍVEL", level: 2 },
  // ─────────────────────────────────────────────────────────────────
  // EDITÁVEL: Adicione novos arquivos seguindo o modelo:
  // { id: "ARQ-007", name: "Nome do arquivo", type: "PDF/BIO/ENC", size: "X.X MB", status: "ACESSÍVEL", level: 1 },
  // Status: "ACESSÍVEL" | "CRIPTOGRAFADO" | "REMOVIDO"
  // ─────────────────────────────────────────────────────────────────
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("home");
  const [user, setUser] = useState("");
  const [level, setLevel] = useState(0);
  const [time, setTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

      {/* Top bar */}
      <div className="border-b border-border bg-card flex items-center px-4 py-2 gap-4 z-30 sticky top-0">
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="text-muted-foreground hover:text-primary text-xs px-2 py-1 border border-border hover:border-primary transition-colors"
        >
          ☰
        </button>
        <img src={logo} alt="DPA" className="h-7 w-7 opacity-80" />
        <div className="flex-1">
          <span className="text-primary font-bold text-xs tracking-widest">DPA</span>
          <span className="text-muted-foreground text-xs ml-2">// PAINEL INTERNO</span>
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
        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-48 border-r border-border bg-card flex flex-col shrink-0 pt-4">
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

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-6">

          {/* ===== HOME ===== */}
          {section === "home" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Painel Geral</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

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
                  <div className="text-xs text-muted-foreground">ACESSOS REGISTRADOS</div>
                  <div className="text-foreground font-bold text-sm">17</div>
                </div>
              </div>

              {/* Alert */}
              <div className="border border-alert-yellow bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-alert-yellow tracking-widest">
                  ⚠ ALERTA — INCONSISTÊNCIA EM REGISTROS DETECTADA
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Um ou mais registros de pessoal apresentam inconsistências. Referência: COFEE-0. Investigação pendente por autoridade superior.
                </p>
              </div>

              {/* User-specific content */}
              {user === "daniel" && (
                <div className="border border-alert-red bg-card p-4">
                  <div className="text-xs text-alert-red font-bold tracking-widest animate-flicker">
                    [REGISTROS PESSOAIS DISPONÍVEIS]
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 animate-flicker" style={{ animationDelay: "0.5s" }}>
                    Não deixe eles verem.
                  </p>
                </div>
              )}
              {user === "ingrid" && (
                <div className="border border-alert-yellow bg-card p-4">
                  <div className="text-xs text-alert-yellow font-bold">Acesso limitado.</div>
                  <p className="text-xs text-muted-foreground mt-1">Alguns arquivos foram removidos da sua visualização.</p>
                </div>
              )}
            </div>
          )}

          {/* ===== FUNCIONÁRIOS ===== */}
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
                      <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className={`px-4 py-3 font-bold ${emp.name === "████████" ? "redacted text-alert-red" : "text-foreground"}`}>
                          {emp.name}
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

          {/* ===== RELATÓRIOS ===== */}
          {section === "relatorios" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Relatórios</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-3">
                {REPORTS.filter((r) => level >= r.level).map((r) => (
                  <div key={r.id} className="terminal-box p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary tracking-widest">{r.id}</span>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="text-sm font-bold text-foreground">{r.title}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.content}</p>
                  </div>
                ))}
                {level < 2 && (
                  <div className="terminal-box p-4 border-alert-red opacity-60">
                    <span className="text-xs text-muted-foreground">
                      {REPORTS.filter((r) => level < r.level).length} relatório(s) oculto(s) — nível de acesso insuficiente.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== ARQUIVOS ===== */}
          {section === "arquivos" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Arquivos</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-2">
                {ARCHIVES.map((a) => (
                  <div
                    key={a.id}
                    className={`terminal-box p-4 flex items-center justify-between ${a.level > level ? "opacity-40 cursor-not-allowed" : "hover:border-primary transition-colors cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground font-mono">[{a.type}]</span>
                      <div>
                        <div className={`text-xs font-bold ${a.level > level ? "text-muted-foreground" : "text-foreground"}`}>
                          {a.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{a.id} — {a.size}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 font-bold tracking-wider ${
                        a.status === "ACESSÍVEL" ? "badge-ativo" :
                        a.status === "CRIPTOGRAFADO" ? "badge-inativo" :
                        "badge-arquivado"
                      }`}
                    >
                      {a.level > level ? "BLOQUEADO" : a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ===== PROJ. NZ-01 (nível 2+) ===== */}
          {section === "nz01" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Projeto NZ-01 — Arma Biológica</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="stamp text-xs">CONFIDENCIAL</span>
              </div>

              {/* Aviso de classificação */}
              <div className="border border-alert-red bg-card p-4">
                <div className="text-xs font-bold text-alert-red tracking-widest animate-flicker">
                  ⚠ NÍVEL DE RISCO: EXTREMO — PROTOCOLO BIO-7 ATIVO
                </div>
                {/* EDITÁVEL: Altere a descrição geral do projeto NZ-01 abaixo */}
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  O Projeto NZ-01 consiste no desenvolvimento de um agente biológico de supressão seletiva. Todas as iterações
                  anteriores ao modelo final resultaram em falhas críticas de contenção. O histórico de versões está documentado
                  abaixo em ordem cronológica de desenvolvimento.
                </p>
              </div>

              {/* Timeline de versões */}
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground tracking-widest uppercase mb-2">— Histórico de Iterações —</div>

                {/* A-00 */}
                <div className="terminal-box p-4 border-l-4 border-l-alert-yellow space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-alert-yellow tracking-widest">A-00 — PROTÓTIPO INICIAL</span>
                    <span className="text-xs text-muted-foreground">2024-07-02</span>
                  </div>
                  {/* EDITÁVEL: Descreva a versão A-00 abaixo */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Primeira iteração do agente. Falha catastrófica na fase de estabilização — agente mostrou
                    comportamento imprevisível em ambientes controlados. Projeto suspenso por 4 meses para revisão de protocolos.
                  </p>
                  <span className="badge-inativo text-xs px-2 py-0.5 font-bold">FALHA — DESCONTINUADO</span>
                </div>

                {/* Espaço para versões intermediárias — EDITÁVEL */}
                {/* 
                  EDITÁVEL: Copie e cole o bloco abaixo para adicionar mais versões (A-01, A-02, B-00, etc.)
                  
                  <div className="terminal-box p-4 border-l-4 border-l-alert-yellow space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-alert-yellow tracking-widest">A-01 — NOME DA VERSÃO</span>
                      <span className="text-xs text-muted-foreground">AAAA-MM-DD</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Descrição da versão aqui. O que aconteceu, qual foi a falha, etc.
                    </p>
                    <span className="badge-inativo text-xs px-2 py-0.5 font-bold">FALHA — DESCONTINUADO</span>
                  </div>
                */}

                {/* NZ-01 — versão final, bloqueada para nível 3 */}
                <div className={`terminal-box p-4 border-l-4 space-y-2 ${level >= 3 ? "border-l-alert-red" : "border-l-border opacity-50"}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold tracking-widest ${level >= 3 ? "text-alert-red animate-flicker" : "text-muted-foreground"}`}>
                      NZ-01 — VERSÃO FINAL
                    </span>
                    <span className="text-xs text-muted-foreground">{level >= 3 ? "2027-01-15" : "████████"}</span>
                  </div>
                  {level >= 3 ? (
                    <>
                      {/* EDITÁVEL: Descreva a versão final NZ-01 abaixo (apenas admin vê) */}
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Iteração final considerada operacional pelo comitê interno. Detalhes de composição e vetor de
                        dispersão classificados em nível máximo. Acesso restrito ao Diretor e pesquisadores sênior autorizados.
                        Status de implantação: [REDACTED].
                      </p>
                      <span className="badge-ativo text-xs px-2 py-0.5 font-bold">OPERACIONAL — ATIVO</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground redacted">████████████████████████████████████████</span>
                    </div>
                  )}
                  {level < 3 && (
                    <div className="text-xs text-alert-red">🔒 ACESSO NÍVEL 3 REQUERIDO</div>
                  )}
                </div>
              </div>

              {/* Nota de rodapé */}
              <div className="terminal-box p-3">
                {/* EDITÁVEL: Mensagem de rodapé da seção NZ-01 */}
                <p className="text-xs text-muted-foreground text-center">
                  Qualquer divulgação não autorizada deste projeto será tratada como traição de Estado. Ref. interna:{" "}
                  <span className="text-alert-red">NZ-CLASSIFIED-001</span>
                </p>
              </div>
            </div>
          )}

          {/* ===== VIDEOS (nível 2+) ===== */}
          {section === "videos" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Registros de Câmera</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["CAM-01 — CORREDOR B7", "CAM-02 — LABORATÓRIO 3", "CAM-03 — [FALHA]", "CAM-04 — SALA DE SERVIDORES"].map((cam, i) => (
                  <div key={i} className="terminal-box aspect-video flex flex-col">
                    <div className="px-3 py-1 border-b border-border flex items-center justify-between">
                      <span className="text-xs text-primary font-bold">{cam}</span>
                      <span className={`text-xs ${i === 2 ? "text-alert-red animate-flicker" : "text-primary"}`}>
                        {i === 2 ? "● SEM SINAL" : "● AO VIVO"}
                      </span>
                    </div>
                    <div className="flex-1 bg-secondary flex items-center justify-center">
                      {i === 2 ? (
                        <div className="text-center space-y-2">
                          <div className="text-alert-red text-2xl animate-flicker">⚠</div>
                          <div className="text-xs text-muted-foreground">SINAL PERDIDO</div>
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

              {user === "daniel" && (
                <div className="terminal-box p-4 border-alert-red">
                  <div className="text-xs text-alert-red font-bold animate-flicker">
                    ARQUIVO OCULTADO DETECTADO — CAM-03 — 2027-02-11
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Registro de 4h17min removido. Autorização: DESCONHECIDA.
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
