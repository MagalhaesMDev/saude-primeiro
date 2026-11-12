import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Sparkles,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";
import { LessonImage } from "@/components/lessons/LessonImage";
import {
  getNextLessonAcrossTrails,
  getTrailProgress,
  LESSON_TRAILS,
  type TrailAudience,
} from "@/data/lessons";
import { usePrototypeStore } from "@/store/prototypeStore";

const FILTERS: { label: string; value: TrailAudience }[] = [
  { label: "Todos", value: "todos" },
  { label: "Entregadores e Autônomos", value: "entregadores" },
  { label: "Mulheres", value: "mulheres" },
  { label: "Homens", value: "homens" },
  { label: "Idosos", value: "idosos" },
  { label: "Gestantes", value: "gestantes" },
  { label: "Seguros", value: "seguros" },
];

const GLOSSARY = [
  { term: "Carência", definition: "Período de espera indicado no contrato antes de determinada cobertura poder ser utilizada. Regras variam por produto." },
  { term: "Sinistro", definition: "Ocorrência que pode ser comunicada à seguradora para análise conforme as condições da apólice." },
  { term: "Franquia", definition: "Participação financeira definida no contrato que pode caber ao segurado em determinadas situações." },
  { term: "DIT (Diária por Incapacidade Temporária)", definition: "Cobertura que pode prever pagamento diário quando os critérios de incapacidade e demais condições do contrato forem atendidos." },
];

interface CompletionNotice {
  lessonTitle: string;
  awardedPoints: number;
  awardedCashback: number;
  dailyLimitReached: boolean;
}

function isCompletionNotice(value: unknown): value is CompletionNotice {
  if (typeof value !== "object" || value === null) return false;
  const notice = value as Record<string, unknown>;
  return typeof notice.lessonTitle === "string"
    && typeof notice.awardedPoints === "number"
    && typeof notice.awardedCashback === "number"
    && typeof notice.dailyLimitReached === "boolean";
}

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function AprenderPage() {
  const [activeFilter, setActiveFilter] = useState<TrailAudience>("todos");
  const { points, pointsToday, pointsDate, cashbackEarned, lessonProgress } = usePrototypeStore();
  const location = useLocation();
  const todayPoints = pointsDate === localDateKey(new Date()) ? pointsToday : 0;
  const level = points >= 1000 ? "Ouro" : points >= 400 ? "Prata" : "Bronze";
  const pointsToNext = level === "Bronze" ? 400 - points : level === "Prata" ? 1000 - points : 0;
  const levelProgress = level === "Bronze" ? Math.min(points / 400 * 100, 100) : level === "Prata" ? Math.min((points - 400) / 600 * 100, 100) : 100;
  const visibleTrails = LESSON_TRAILS.filter((trail) => trail.audiences.includes(activeFilter));
  const nextLesson = getNextLessonAcrossTrails(LESSON_TRAILS, lessonProgress);
  const featuredEntry = getNextLessonAcrossTrails(visibleTrails, lessonProgress)
    ?? (visibleTrails[0] ? { trail: visibleTrails[0], lesson: visibleTrails[0].lessons[0] } : undefined);
  const completionNotice = isCompletionNotice(location.state?.completionNotice)
    ? location.state.completionNotice
    : undefined;

  return (
    <main className="min-h-screen bg-background pb-28 pt-16">
      <h1 className="sr-only">Aprender</h1>
      {completionNotice && (
        <div role="status" aria-live="polite" className="mx-4 mt-4 rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success sm:mx-auto sm:max-w-3xl">
          <p className="font-semibold">Lição concluída: {completionNotice.lessonTitle}</p>
          <p className="mt-1">
            {completionNotice.awardedPoints > 0
              ? `+${completionNotice.awardedPoints} pontos e `
              : "Nenhum ponto adicional foi somado hoje. "}
            +R$ {completionNotice.awardedCashback.toFixed(2).replace(".", ",")} de cashback simulado.
          </p>
          {completionNotice.dailyLimitReached && (
            <p className="mt-1">O limite saudável de 100 pontos por dia foi atingido; a lição foi concluída mesmo assim.</p>
          )}
        </div>
      )}

      <section className="px-4 pb-2 pt-4">
        <Card className="mx-auto max-w-3xl overflow-hidden border-primary/10 bg-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Nível atual</p>
                <h2 className="mt-1 text-xl font-bold">{level}</h2>
                <p className="text-sm text-muted-foreground">Próxima meta: {level === "Bronze" ? "Prata" : level === "Prata" ? "Ouro" : "Mais lições"}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary">{points}</span>
                <p className="text-xs text-muted-foreground">pontos demonstrativos</p>
              </div>
            </div>
            <div className="mb-2 mt-4 flex flex-wrap items-center justify-between gap-1 text-[11px] text-muted-foreground">
              <span>{level === "Bronze" ? `${points} pts` : level === "Prata" ? `${points - 400} pts` : "Meta atingida"}</span>
              <span className="font-semibold text-success">{pointsToNext > 0 ? `Faltam ${pointsToNext} pts para ${level === "Bronze" ? "Prata" : "Ouro"}` : "Meta alcançada"}</span>
              <span>{level === "Bronze" ? "400 pts" : "1.000 pts"}</span>
            </div>
            <Progress value={levelProgress} className="h-3 [&>div]:bg-success" aria-label={`${Math.round(levelProgress)}% do progresso do nível`} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-success/5 p-3">
                <p className="text-lg font-bold text-success">20%</p>
                <p className="text-xs text-muted-foreground">Farmácia no nível Prata*</p>
              </div>
              <div className="rounded-xl bg-mint/30 p-3">
                <p className="text-lg font-bold">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cashbackEarned)}</p>
                <p className="text-xs text-muted-foreground">Cashback simulado acumulado*</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground">*Benefícios e valores ilustrativos; não há desconto ou dinheiro para resgate.</p>
            {nextLesson ? (
              <Button asChild variant="success" className="mt-4 w-full">
                <Link to={`/aprender/${nextLesson.trail.id}/${nextLesson.lesson.id}`}>
                  Continuar lição <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <p className="mt-4 text-center text-xs text-muted-foreground">Você concluiu todas as lições disponíveis.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-3">
        <Card className="mx-auto max-w-3xl border-success/15 bg-success/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div className="flex-1">
              <h2 className="text-sm font-bold">Aprendizado consciente</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Limite saudável de 100 pts/dia. Você já conquistou {todayPoints}/100 pts hoje.</p>
              <Progress value={Math.min(todayPoints, 100)} className="mt-3 h-2 [&>div]:bg-success" aria-label={`${todayPoints} de 100 pontos demonstrativos ganhos hoje`} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold">Escolha seus temas</h2>
            <span className="text-xs text-muted-foreground" aria-live="polite">
              Filtro ativo: {FILTERS.find((filter) => filter.value === activeFilter)?.label}
            </span>
          </div>
          <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtrar temas">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <Button
                  key={filter.value}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`min-h-10 shrink-0 rounded-full px-4 text-xs ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {visibleTrails.length === 0 ? (
        <section className="px-4 py-4">
          <Card className="mx-auto max-w-3xl border-dashed">
            <CardContent className="p-6 text-center">
              <p className="font-semibold">Ainda não há trilhas para este tema.</p>
              <Button type="button" variant="outline" className="mt-4" onClick={() => setActiveFilter("todos")}>Ver todos</Button>
            </CardContent>
          </Card>
        </section>
      ) : (
        <>
          {featuredEntry && (
            <section className="px-4 py-4">
              <Card className="mx-auto max-w-3xl overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary" className="font-bold uppercase tracking-wide">Lição em destaque</Badge>
                    <Badge variant="mint">+{featuredEntry.lesson.points} pts e R$ {featuredEntry.lesson.cashback.toFixed(2).replace(".", ",")} demonstrativos</Badge>
                  </div>
                  <p className="mt-3 text-xs font-medium text-muted-foreground">{featuredEntry.trail.category}</p>
                  <h2 className="mt-1 text-lg font-bold">{featuredEntry.lesson.title}</h2>
                  <div className="relative mt-4 h-44 overflow-hidden rounded-2xl bg-primary/10">
                    <LessonImage key={featuredEntry.lesson.id} lesson={featuredEntry.lesson} className="h-full w-full object-cover" />
                    <Badge className="absolute bottom-2 left-2 gap-1 bg-foreground/75 text-white">
                      <Timer className="h-3.5 w-3.5" />{featuredEntry.lesson.readingMinutes} min de leitura
                    </Badge>
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">Prévia do quiz</p>
                  <p className="mt-2 text-sm font-semibold leading-snug">{featuredEntry.lesson.quiz[0].question}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{featuredEntry.lesson.quiz.length} perguntas · abra a lição para responder e ver as explicações.</p>
                  <p className="mt-3 text-xs text-muted-foreground">Conteúdo educativo — revisar com profissional de saúde.</p>
                  <Button asChild variant="success" className="mt-4 w-full">
                    <Link to={`/aprender/${featuredEntry.trail.id}/${featuredEntry.lesson.id}`}>
                      {lessonProgress[featuredEntry.lesson.id]?.completed ? "Rever esta lição" : "Começar esta lição"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}

          <section className="px-4 py-5">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold">Trilhas de aprendizado</h2>
                  <p className="text-xs text-muted-foreground">Lições rápidas para aprender no seu ritmo.</p>
                </div>
                <Badge variant="mint">Conteúdo educativo</Badge>
              </div>
              <div className="space-y-3">
                {visibleTrails.map((trail) => {
                  const Icon = trail.icon;
                  const progress = getTrailProgress(trail, lessonProgress);
                  const nextTrailLesson = getNextLessonAcrossTrails([trail], lessonProgress)
                    ?? { trail, lesson: trail.lessons[0] };
                  const action = progress.completed === 0
                    ? "Iniciar"
                    : progress.completed === progress.total
                      ? "Rever lições"
                      : "Continuar";
                  return (
                    <Card key={trail.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${trail.color}`}>
                            <Icon aria-hidden="true" className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <Badge variant="secondary">{trail.category}</Badge>
                            <h3 className="mt-2 font-semibold">{trail.title}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">{trail.lessons.length} lições curtas com quiz e explicação.</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs">
                          <span>{progress.completed}/{progress.total} lições</span>
                          <span className="text-muted-foreground">{Math.round(progress.completed / progress.total * 100)}%</span>
                        </div>
                        <Progress
                          value={progress.completed / progress.total * 100}
                          className="mt-2 h-2 [&>div]:bg-success"
                          aria-label={`${progress.completed} de ${progress.total} lições concluídas: ${trail.title}`}
                        />
                        <Button asChild variant={progress.completed > 0 && progress.completed < progress.total ? "outline" : "success"} size="sm" className="mt-4 w-full">
                          <Link to={`/aprender/${nextTrailLesson.trail.id}/${nextTrailLesson.lesson.id}`}>
                            {action}<ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground">Pontos, imagens e cashback são demonstrativos; nenhum pagamento ou benefício real é oferecido.</p>
            </div>
          </section>
        </>
      )}

      <section className="px-4 py-5">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
              <div>
                <h2 className="font-bold">Tradutor de seguros</h2>
                <p className="text-xs text-muted-foreground">Entenda termos comuns em linguagem simples.</p>
              </div>
            </div>
            <Accordion type="single" collapsible>
              {GLOSSARY.map(({ term, definition }) => (
                <AccordionItem key={term} value={term}>
                  <AccordionTrigger><span className="flex items-center gap-2"><ChevronDown className="h-4 w-4 text-primary" />{term}</span></AccordionTrigger>
                  <AccordionContent>{definition}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
      <HealthDisclaimerFooter />
    </main>
  );
}
