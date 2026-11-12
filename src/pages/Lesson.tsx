import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, Clock3, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";
import { LessonImage } from "@/components/lessons/LessonImage";
import { LESSON_TRAILS } from "@/data/lessons";
import { usePrototypeStore } from "@/store/prototypeStore";

function getPrivacyEnhancedVideoUrl(videoUrl: string): string | undefined {
  const videoId = /(?:youtube-nocookie\.com\/embed\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/.exec(videoUrl)?.[1];
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : undefined;
}

export default function LessonPage() {
  const { trailId, lessonId } = useParams();
  const navigate = useNavigate();
  const trail = LESSON_TRAILS.find((item) => item.id === trailId);
  const lesson = trail?.lessons.find((item) => item.id === lessonId);
  const { lessonProgress, completeLesson } = usePrototypeStore();
  const [openedSteps, setOpenedSteps] = useState<Set<number>>(() => new Set());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [questionResults, setQuestionResults] = useState<Record<string, boolean>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!trail || !lesson) return <Navigate to="/aprender" replace />;

  const existingProgress = lessonProgress[lesson.id];
  const isCompleted = existingProgress?.completed ?? false;
  const allStepsOpened = openedSteps.size === lesson.steps.length;
  const currentQuestion = lesson.quiz[questionIndex];
  const quizScore = Object.values(questionResults).filter(Boolean).length;
  const embedUrl = lesson.videoUrl ? getPrivacyEnhancedVideoUrl(lesson.videoUrl) : undefined;
  const canComplete = allStepsOpened && quizCompleted && !isCompleted;

  const answerQuestion = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    const correct = answerIndex === currentQuestion.correctIndex;
    setSelectedAnswer(answerIndex);
    setAnswerCorrect(correct);
    setQuestionResults((current) => ({ ...current, [currentQuestion.id]: correct || current[currentQuestion.id] === true }));
  };

  const moveToNextQuestion = () => {
    if (selectedAnswer === null) return;
    if (questionIndex === lesson.quiz.length - 1) {
      setQuizCompleted(true);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
    setAnswerCorrect(null);
  };

  const retryQuestion = () => {
    setSelectedAnswer(null);
    setAnswerCorrect(null);
  };

  const finishLesson = () => {
    if (!canComplete) return;
    const result = completeLesson(lesson.id, quizScore, lesson.points, lesson.cashback);
    if (result.alreadyCompleted) {
      navigate("/aprender");
      return;
    }
    navigate("/aprender", {
      state: {
        completionNotice: {
          lessonTitle: lesson.title,
          awardedPoints: result.awardedPoints,
          awardedCashback: result.awardedCashback,
          dailyLimitReached: result.dailyLimitReached,
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-background pb-28 pt-16">
      <article className="mx-auto max-w-3xl px-4 py-5 sm:py-8">
        <Link to="/aprender" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />Voltar às trilhas
        </Link>

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{trail.category}</Badge>
            <Badge variant="outline" className="gap-1"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" />{lesson.readingMinutes} min de leitura</Badge>
            {isCompleted && <Badge variant="mint">Lição concluída</Badge>}
          </div>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{lesson.title}</h1>
          <p className="mt-3 text-sm font-medium text-primary">Conteúdo educativo — revisar com profissional de saúde.</p>
        </header>

        <div className="mt-5 aspect-video overflow-hidden rounded-2xl bg-muted">
          <LessonImage key={lesson.id} lesson={lesson} className="h-full w-full object-cover" />
        </div>

        {lesson.videoUrl && (
          <section aria-label="Vídeo educativo" className="mt-5">
            <h2 className="mb-2 text-sm font-semibold">Vídeo complementar</h2>
            {embedUrl ? (
              <div className="aspect-video overflow-hidden rounded-2xl bg-muted">
                <iframe
                  src={embedUrl}
                  title={`Vídeo complementar: ${lesson.title}`}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <p role="status" className="rounded-xl border p-3 text-sm text-muted-foreground">O vídeo complementar não está disponível. Você pode seguir com o conteúdo escrito.</p>
            )}
          </section>
        )}

        <section className="mt-7" aria-labelledby="lesson-steps-heading">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="lesson-steps-heading" className="text-lg font-bold">Etapas da lição</h2>
              <p className="mt-1 text-xs text-muted-foreground">Abra cada etapa para marcar a leitura e liberar a conclusão.</p>
            </div>
            <Badge variant={allStepsOpened ? "success" : "secondary"}>{openedSteps.size}/{lesson.steps.length} etapas abertas</Badge>
          </div>
          <Progress value={openedSteps.size / lesson.steps.length * 100} className="mt-3 h-2" aria-label={`${openedSteps.size} de ${lesson.steps.length} etapas abertas`} />
          <ol className="mt-4 space-y-3">
            {lesson.steps.map((step, index) => {
              const isOpen = openedSteps.has(index);
              return (
                <li key={`${lesson.id}-step-${index}`}>
                  <details className="group rounded-xl border bg-card">
                    <summary
                      aria-label={`Etapa ${index + 1}: ${step}`}
                      onClick={() => setOpenedSteps((current) => new Set(current).add(index))}
                      className="flex min-h-12 cursor-pointer list-none items-center gap-3 p-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{index + 1}</span>
                      <span className="flex-1">Etapa {index + 1}</span>
                      {isOpen && <CheckCircle2 aria-label="Etapa lida" className="h-5 w-5 text-success" />}
                    </summary>
                    <p className="px-4 pb-4 pl-14 text-sm leading-6 text-muted-foreground">{step}</p>
                  </details>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-8" aria-labelledby="lesson-quiz-heading">
          <Card className="border-primary/15">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><CircleHelp aria-hidden="true" className="h-5 w-5" /></span>
                <div>
                  <h2 id="lesson-quiz-heading" className="font-bold">Quiz da lição</h2>
                  {!quizCompleted && <p className="mt-1 text-xs text-muted-foreground">Pergunta {questionIndex + 1} de {lesson.quiz.length}</p>}
                </div>
              </div>

              {quizCompleted ? (
                <div role="status" aria-live="polite" className="mt-4 rounded-xl bg-success/10 p-4 text-sm text-success">
                  Quiz concluído: {quizScore} de {lesson.quiz.length} respostas corretas.
                </div>
              ) : (
                <>
                  <p className="mt-4 text-sm font-semibold leading-6">{currentQuestion.question}</p>
                  <div className="mt-3 space-y-2" role="group" aria-label={`Alternativas da pergunta ${questionIndex + 1}`}>
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrectOption = index === currentQuestion.correctIndex;
                      const optionClass = selectedAnswer === null
                        ? "border-border bg-background hover:bg-muted"
                        : isCorrectOption
                          ? "border-success/30 bg-success/10 text-success"
                          : isSelected
                            ? "border-destructive/30 bg-destructive/5 text-destructive"
                            : "border-border bg-background opacity-60";
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={isSelected}
                          disabled={selectedAnswer !== null}
                          onClick={() => answerQuestion(index)}
                          className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border p-3 text-left text-sm leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default ${optionClass}`}
                        >
                          <span>{option}</span>
                          {selectedAnswer !== null && isCorrectOption && <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {selectedAnswer !== null && (
                    <div role="status" aria-live="polite" className={`mt-4 rounded-xl p-4 text-sm leading-6 ${answerCorrect ? "bg-success/10 text-success" : "bg-muted text-foreground"}`}>
                      <p className="font-semibold">{answerCorrect ? "Resposta correta." : "Resposta incorreta."}</p>
                      <p className="mt-1">{currentQuestion.explanation}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {!answerCorrect && (
                          <Button type="button" variant="outline" size="sm" onClick={retryQuestion}>
                            <RotateCcw aria-hidden="true" className="mr-2 h-4 w-4" />Tentar novamente
                          </Button>
                        )}
                        <Button type="button" size="sm" onClick={moveToNextQuestion}>
                          {questionIndex === lesson.quiz.length - 1 ? "Finalizar quiz" : "Próxima pergunta"}
                          <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <div className="mt-6">
          {!allStepsOpened && <p className="mb-2 text-center text-xs text-muted-foreground">Abra todas as etapas e responda ao quiz para concluir.</p>}
          {isCompleted && <p role="status" className="mb-2 text-center text-xs text-muted-foreground">Esta lição já foi concluída. Revise o conteúdo quando quiser.</p>}
          <Button type="button" variant="success" className="w-full" disabled={!canComplete} onClick={finishLesson}>
            {isCompleted ? "Lição já concluída" : "Concluir lição"}
          </Button>
        </div>
      </article>
      <HealthDisclaimerFooter />
    </main>
  );
}
