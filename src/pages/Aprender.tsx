import { useMemo, useState } from "react";
import {
  ArrowRight, Brain, Check, CheckCircle2, ChevronDown, Circle, Clock3,
  FileText, Heart, HeartPulse, Sparkles, Timer, Truck, UserRound, XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";
import { usePrototypeStore } from "@/store/prototypeStore";

const TRAILS = [
  { id: "work", category: "Autônomos & Trânsito", tags: ["Entregadores & Autônomos"], title: "Prevenção de acidentes de trabalho", subtitle: "Direção defensiva, EPIs simples e segurança no trânsito urbano.", icon: Truck, color: "bg-success/10 text-success", time: "10 min no total", action: "Continuar" },
  { id: "women", category: "Saúde Feminina", tags: ["Mulheres", "Gestantes e Mães"], title: "Saúde da mulher e autocuidado", subtitle: "Ciclo menstrual, exames preventivos e informações para cada fase da vida.", icon: Heart, color: "bg-primary/10 text-primary", time: "10 min no total", action: "Iniciar" },
  { id: "men", category: "Saúde Masculina", tags: ["Homens"], title: "Saúde do homem e prevenção", subtitle: "Check-ups, pressão arterial e conversas importantes sobre saúde.", icon: UserRound, color: "bg-warning/10 text-warning", time: "8 min restantes", action: "Iniciar" },
  { id: "family", category: "Melhor Idade", tags: ["Idosos"], title: "Cuidados com idosos e longevidade", subtitle: "Casa segura, vacinas em dia e rotina de medicamentos.", icon: HeartPulse, color: "bg-success/10 text-success", time: "10 min no total", action: "Começar trilha" },
  { id: "wellness", category: "Equilíbrio", tags: ["Entregadores & Autônomos", "Jovens", "Homens", "Mulheres"], title: "Saúde mental e estresse da rotina", subtitle: "Respiração prática, acolhimento e formas de buscar apoio.", icon: Brain, color: "bg-primary/10 text-primary", time: "6 min restantes", action: "Continuar" },
  { id: "mothers", category: "Gestantes e Mães", tags: ["Gestantes e Mães"], title: "Gestação, pós-parto e autocuidado", subtitle: "Informação geral e sinais para conversar com a equipe de saúde.", icon: HeartPulse, color: "bg-feminine/10 text-feminine", time: "10 min no total", action: "Começar trilha" },
  { id: "youth", category: "Juventude", tags: ["Jovens"], title: "Hábitos saudáveis para jovens", subtitle: "Sono, alimentação e prevenção sem julgamentos.", icon: Sparkles, color: "bg-violet-100 text-violet-700", time: "10 min no total", action: "Aprender" },
] as const;

const FILTERS = ["Todos", "Entregadores & Autônomos", "Mulheres", "Homens", "Idosos", "Gestantes e Mães", "Jovens"];
const LESSON_STEPS = [
  { title: "Piso molhado e graxa:", text: "Redobre o cuidado nos primeiros 10 minutos de chuva, quando o asfalto solta óleo residual." },
  { title: "Postura ao erguer peso:", text: "Flexione os joelhos e mantenha a carga colada ao peito para proteger a lombar." },
  { title: "Pausas ativas:", text: "A cada 2 horas de pilotagem ou esforço repetitivo, alongue punhos, pescoço e panturrilhas por 60s." },
];
const QUIZ_OPTIONS = [
  "A) Curvar a coluna para a frente sem dobrar as pernas.",
  "B) Dobrar os joelhos, manter as costas eretas e a carga junto ao corpo.",
  "C) Puxar o peso rapidamente com um dos braços para ganhar tempo.",
];
const GLOSSARY = [
  { term: "Carência", definition: "Período de espera indicado no contrato antes de determinada cobertura poder ser utilizada. Regras variam por produto." },
  { term: "Sinistro", definition: "Ocorrência que pode ser comunicada à seguradora para análise conforme as condições da apólice." },
  { term: "Franquia", definition: "Participação financeira definida no contrato que pode caber ao segurado em determinadas situações." },
  { term: "DIT (Diária por Incapacidade Temporária)", definition: "Cobertura que pode prever pagamento diário quando os critérios de incapacidade e demais condições do contrato forem atendidos." },
];

export default function AprenderPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [expandedTrail, setExpandedTrail] = useState<string | null>(null);
  const { points, dailyPoints, dailyPointsDate, completeTrailLesson, trailProgress, quizAnswered, quizCorrect, quizSelectedAnswer, answerQuiz } = usePrototypeStore();
  const date = new Date();
  const todayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const todayPoints = dailyPointsDate === todayKey ? dailyPoints : 0;
  const quizPointsAwarded = Math.min(10, Math.max(100 - todayPoints, 0));
  const level = points >= 1000 ? "Ouro" : points >= 400 ? "Prata" : "Bronze";
  const pointsToNext = level === "Bronze" ? 400 - points : level === "Prata" ? 1000 - points : 0;
  const levelProgress = level === "Bronze" ? Math.min(points / 400 * 100, 100) : level === "Prata" ? Math.min((points - 400) / 600 * 100, 100) : 100;
  const visibleTrails = useMemo(() => activeFilter === "Todos" ? TRAILS : TRAILS.filter((trail) => trail.tags.some((tag) => tag === activeFilter)), [activeFilter]);
  const cashbackAvailable = Math.floor(points / 50);

  return (
    <main className="min-h-screen bg-background pb-28 pt-16">
      <h1 className="sr-only">Aprender</h1>
      <section className="px-4 pb-2 pt-4">
        <Card className="mx-auto max-w-3xl overflow-hidden border-primary/10 bg-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Nível Atual</p><h2 className="mt-1 text-xl font-bold">{level}</h2><p className="text-sm text-muted-foreground">Próxima meta: {level === "Bronze" ? "Prata" : level === "Prata" ? "Ouro" : "Mais lições"}</p></div><div className="text-right"><span className="text-3xl font-bold text-primary">{points}</span><p className="text-xs text-muted-foreground">pontos demonstrativos</p></div></div>
            <div className="mb-2 mt-4 flex flex-wrap items-center justify-between gap-1 text-[11px] text-muted-foreground"><span>{level === "Bronze" ? `${points} pts` : level === "Prata" ? `${points - 400} pts` : "Meta atingida"}</span><span className="font-semibold text-success">{pointsToNext > 0 ? `Faltam ${pointsToNext} pts para ${level === "Bronze" ? "Prata" : "Ouro"}` : "Meta alcançada"}</span><span>{level === "Bronze" ? "400 pts" : "1.000 pts"}</span></div>
            <Progress value={levelProgress} className="h-3 [&>div]:bg-success" aria-label={`${Math.round(levelProgress)}% do progresso do nível`} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-success/5 p-3"><p className="text-lg font-bold text-success">20%</p><p className="text-xs text-muted-foreground">Farmácia no nível Prata*</p></div>
              <div className="rounded-xl bg-mint/30 p-3"><p className="text-lg font-bold">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cashbackAvailable)}</p><p className="text-xs text-muted-foreground">Cashback simulado disponível*</p></div>
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground">*Benefícios e valores ilustrativos; não há desconto ou dinheiro para resgate.</p>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-3"><Card className="mx-auto max-w-3xl border-success/15 bg-success/5"><CardContent className="flex items-start gap-3 p-4"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-success" /><div className="flex-1"><h2 className="text-sm font-bold">Aprendizado Consciente</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Limite saudável de 100 pts/dia. Você já conquistou {todayPoints}/100 pts hoje.</p><Progress value={Math.min(todayPoints, 100)} className="mt-3 h-2 [&>div]:bg-success" aria-label={`${todayPoints} de 100 pontos demonstrativos ganhos hoje`} /></div></CardContent></Card></section>

      <section className="px-4 py-4"><div className="mx-auto max-w-3xl"><div className="mb-2 flex items-center justify-between gap-2"><h2 className="font-bold">Escolha seus temas</h2><span className="shrink-0 text-[10px] text-muted-foreground">Filtro ativo</span></div><div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtrar temas">
        {FILTERS.map((filter) => <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} className={`min-h-9 shrink-0 rounded-full border px-4 text-xs font-medium ${activeFilter === filter ? "border-primary bg-primary text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}>{filter}</button>)}
      </div></div></section>

      <section className="px-4 py-4"><Card className="mx-auto max-w-3xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2"><Badge variant="secondary" className="font-bold uppercase tracking-wide">LIÇÃO EM DESTAQUE</Badge><Badge variant="mint">+10 pts e R$ 0,20 em cashback demonstrativo</Badge></div>
          <h2 className="mt-3 text-lg font-bold">Como se proteger contra quedas e lesões no trabalho</h2>
          <div className="relative mt-4 overflow-hidden rounded-2xl bg-primary/10">
            <img src="/entregador-placeholder.svg" alt="Ilustração demonstrativa de uma pessoa entregadora usando capacete e colete refletivo junto à motocicleta" className="h-44 w-full object-cover" />
            <Badge className="absolute bottom-2 left-2 gap-1 bg-foreground/75 text-white"><Timer className="h-3.5 w-3.5" />2 min de leitura</Badge>
          </div>
          <ol className="my-3 space-y-2">{LESSON_STEPS.map((step, index) => <li key={step.title} className="flex items-start gap-2.5 rounded-xl bg-primary/5 p-2.5 text-[13px] leading-snug"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{index + 1}</span><p><strong>{step.title}</strong> {step.text}</p></li>)}</ol>
          <div className="mt-4 rounded-xl bg-primary/10 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-primary"><Brain className="h-4 w-4" />Quiz Rápido</h3>
              <Badge variant="mint" className="text-[10px]">+10 pts e R$ 0,20 demonstrativos ao acertar • 1 pergunta</Badge>
            </div>
            <p className="text-sm font-semibold leading-snug">Ao carregar um pacote pesado no chão, qual é a conduta correta para não machucar as costas?</p>
            <div className="mt-3 space-y-2" role="group" aria-label="Alternativas do quiz">
              {QUIZ_OPTIONS.map((answer, index) => {
                const isSelected = quizSelectedAnswer === index;
                const isCorrectOption = index === 1;
                const isRevealedCorrect = quizAnswered && isCorrectOption;
                const isSelectedWrong = quizAnswered && isSelected && !quizCorrect;
                return (
                  <button
                    key={answer}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={quizAnswered}
                    onClick={() => answerQuiz(index)}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-card p-3 text-left text-xs leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default ${
                      isRevealedCorrect ? "border-success/30 bg-success/10 text-success" :
                        isSelectedWrong ? "border-destructive/30 bg-destructive/5 text-destructive" :
                          quizAnswered ? "opacity-60" : "hover:bg-primary/5"
                    }`}
                  >
                    <span>{answer}</span>
                    <span className="shrink-0" aria-hidden="true">
                      {isRevealedCorrect ? <CheckCircle2 className="h-5 w-5" /> : isSelectedWrong ? <XCircle className="h-5 w-5" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {quizAnswered && (
              <div role="status" aria-live="polite" className={`mt-3 rounded-xl p-3 text-xs leading-5 ${quizCorrect ? "bg-success/10 text-success" : "bg-card text-foreground"}`}>
                <p className="font-bold">{quizCorrect ? "Muito bem! Essa é a forma mais segura." : "Resposta incorreta. Veja a alternativa mais segura."}</p>
                <p className="mt-1">{quizCorrect
                  ? quizPointsAwarded > 0
                    ? `Você acertou e ganhou ${quizPointsAwarded} ponto${quizPointsAwarded === 1 ? "" : "s"} demonstrativo${quizPointsAwarded === 1 ? "" : "s"}.`
                    : "O limite demonstrativo de 100 pontos do dia já foi atingido; não foram adicionados pontos."
                  : "Dobre os joelhos, mantenha as costas eretas e aproxime a carga do corpo."}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">Pontuação ilustrativa, sujeita ao limite de 100 pts/dia; cashback sem conversão ou resgate em dinheiro.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card></section>

      <section className="px-4 py-5"><div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-2"><div><h2 className="text-lg font-bold">Trilhas de Aprendizado</h2><p className="text-xs text-muted-foreground">5 lições rápidas (2 min cada) por módulo</p></div><Badge variant="mint">100% Grátis*</Badge></div>
        <div className="space-y-3">{visibleTrails.map((trail, index) => {
          const Icon = trail.icon;
          const count = Math.min(trailProgress[trail.id] ?? 0, 5);
          const isExpanded = expandedTrail === trail.id;
          return <Card key={trail.id}><CardContent className="p-4">
            <div className="flex items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${trail.color}`}><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><Badge variant="secondary">{trail.category}</Badge><h3 className="mt-2 font-semibold">{index + 1}. {trail.title}</h3><p className="mt-1 text-xs text-muted-foreground">{trail.subtitle}</p></div><span className="text-[10px] text-muted-foreground">{trail.time}</span></div>
            <div className="mt-4 flex items-center justify-between text-xs"><span>{count}/5 lições</span><span className="text-muted-foreground">{Math.round(count / 5 * 100)}%</span></div><Progress value={count * 20} className="mt-2 h-2 [&>div]:bg-success" aria-label={`${count} de 5 lições concluídas: ${trail.title}`} />
            <Button variant={count > 0 ? "outline" : "success"} size="sm" className="mt-4 w-full" onClick={() => {
              if (count >= 5) { setExpandedTrail(isExpanded ? null : trail.id); return; }
              completeTrailLesson(trail.id, `${trail.title} · lição ${count + 1}`);
            }}>{count === 0 ? trail.action : count >= 5 ? "Rever lições" : "Continuar"} <ArrowRight className="ml-2 h-4 w-4" /></Button>
            {isExpanded && <ol className="mt-3 space-y-2 border-t pt-3">{Array.from({ length: 5 }, (_, lessonIndex) => <li key={lessonIndex} className="flex items-center justify-between text-xs"><span>Lição {lessonIndex + 1} · {["Introdução", "Cuidados práticos", "Sinais de atenção", "Onde buscar apoio", "Revisão"][lessonIndex]}</span>{lessonIndex < count ? <Check className="h-4 w-4 text-success" /> : <Clock3 className="h-4 w-4 text-muted-foreground" />}</li>)}</ol>}
          </CardContent></Card>;
        })}</div>
        <p className="mt-2 text-[10px] text-muted-foreground">*Atividades demonstrativas e gratuitas no protótipo.</p>
      </div></section>

      <section className="px-4 py-5"><Card className="mx-auto max-w-3xl"><CardContent className="p-5">
        <div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span><div><h2 className="font-bold">Tradutor de Seguros</h2><p className="text-xs text-muted-foreground">Entenda os termos difíceis do seguro sem enrolação</p></div><Badge variant="secondary" className="ml-auto">Prático</Badge></div>
        <Accordion type="single" collapsible>{GLOSSARY.map(({ term, definition }) => <AccordionItem key={term} value={term}><AccordionTrigger><span className="flex items-center gap-2"><ChevronDown className="h-4 w-4 text-primary" />{term}</span></AccordionTrigger><AccordionContent>{definition}</AccordionContent></AccordionItem>)}</Accordion>
      </CardContent></Card></section>
      <HealthDisclaimerFooter />
    </main>
  );
}
