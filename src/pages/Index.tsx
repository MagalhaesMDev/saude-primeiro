import { useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, Check, ChevronRight, HeartHandshake, LockKeyhole,
  Shield, ShieldPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";
import { formatDateTime } from "@/lib/utils";
import { usePrototypeStore } from "@/store/prototypeStore";

const SIMULATOR_QUESTIONS = [
  { id: "who", title: "Quem você quer proteger?", options: [{ label: "Apenas eu", value: "eu" }, { label: "Eu e família", value: "familia" }] },
  { id: "care", title: "Qual é a sua principal preocupação?", options: [{ label: "Telemedicina e farmácia", value: "care" }, { label: "Diária por internação ou acidente", value: "protection" }, { label: "Proteção financeira da renda", value: "income" }] },
  { id: "budget", title: "Quanto cabe no seu orçamento mensal?", options: [{ label: "Até R$ 20", value: "essential" }, { label: "Até R$ 30", value: "protection" }, { label: "Acima de R$ 30", value: "income" }] },
] as const;

const PLANS = {
  essential: { name: "Essencial", price: 14.9, description: "Uma opção demonstrativa para conhecer serviços e benefícios preventivos." },
  protection: { name: "Proteção", price: 24.9, description: "Uma opção ilustrativa com mais coberturas para comparar." },
  income: { name: "Renda", price: 39.9, description: "Uma opção ilustrativa com foco em proteção financeira." },
};

function getPlanKey(answers: Record<string, string>): keyof typeof PLANS {
  if (answers.budget === "income") return "income";
  if (answers.budget === "essential") return "essential";
  if (answers.budget === "protection" || answers.care === "protection" || answers.care === "income") return "protection";
  return "essential";
}

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function IndexPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { points, reminders, completeReminder, cashbackRedeemedCount, redeemCashback, selectPlan } = usePrototypeStore();
  const navigate = useNavigate();
  const plan = PLANS[getPlanKey(answers)];
  const cashbackAvailable = Math.max(Math.floor(points / 50) - cashbackRedeemedCount, 0);
  const pendingReminders = useMemo(() => reminders.filter((reminder) => !reminder.done).slice(0, 3), [reminders]);
  const progressToSilver = Math.min(points / 400 * 100, 100);

  const goToPlans = (planName: string, price: number) => {
    selectPlan(planName, price);
    navigate("/meu-seguro");
  };

  return (
    <main className="min-h-screen bg-background pb-28 pt-16">
      <section className="px-4 pb-8 pt-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary/10 via-card to-success/5 p-5 shadow-sm sm:p-6">
            <div className="relative z-10 flex flex-col gap-2">
              <Badge className="inline-flex w-fit rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-success hover:bg-success/10">
                PARA VOCÊ E SUA FAMÍLIA
              </Badge>
              <h1 className="max-w-xl text-[26px] font-bold leading-tight tracking-tight text-foreground sm:text-3xl">Proteção que cabe no seu bolso</h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Organize seus cuidados de saúde, aprenda no seu ritmo e conheça opções demonstrativas de proteção.
              </p>
              <Button variant="success" size="lg" className="mt-1 h-[52px] w-full rounded-[14px] sm:w-fit" onClick={() => navigate("/meu-seguro")}>
                Ver planos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-success/10 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="px-4 py-4">
        <Card className="mx-auto max-w-3xl overflow-hidden border-0 shadow-md">
          <CardContent className="p-5 sm:p-7">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              <p className="text-xs font-bold tracking-[0.14em]">SIMULADOR EM 30 SEGUNDOS</p>
            </div>
            <h2 className="text-xl font-bold text-foreground">Qual plano cabe na sua rotina?</h2>
            <p className="mb-6 mt-1 text-sm text-muted-foreground">Responda 3 perguntas rápidas para ver uma comparação ilustrativa.</p>
            <div className="space-y-5">
              {SIMULATOR_QUESTIONS.map((question, index) => (
                <fieldset key={question.id}>
                  <legend className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{index + 1}</span>
                    {question.title}
                  </legend>
                  <div className={`grid gap-2 ${question.id === "care" ? "grid-cols-1" : question.id === "who" ? "grid-cols-2" : "grid-cols-3"}`}>
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                          className={`inline-flex min-h-11 min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm ${selected ? "border-success bg-success/10 font-semibold text-success" : "border-border bg-muted/40 text-foreground hover:bg-muted"}`}
                        >
                          <span>{option.label}</span>
                          {selected && <Check aria-hidden="true" className="h-4 w-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-success/25 bg-gradient-to-r from-success/5 to-primary/5 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="mint" className="font-bold uppercase tracking-wide">PLANO RECOMENDADO PARA VOCÊ</Badge>
                <Badge variant="mint">Melhor custo-benefício*</Badge>
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <p className="whitespace-nowrap text-xl font-bold">{money(plan.price)} <span className="text-sm font-normal text-muted-foreground">/mês</span></p>
              </div>
              <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
                <Button variant="success" className="h-auto min-h-11 w-full min-w-0 whitespace-normal break-words px-3 py-2 text-center leading-5" onClick={() => goToPlans(plan.name, plan.price)}>Contratar este plano</Button>
                <Button variant="outline" className="h-auto min-h-11 w-full min-w-0 whitespace-normal break-words px-3 py-2 text-center leading-5" onClick={() => navigate("/meu-seguro")}>Ver Proteção (R$ 24,90) e Renda (R$ 39,90)</Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">*Rótulo visual e estimativa demonstrativos, sem avaliação de condições reais. O botão apenas abre a comparação; não gera contrato, cobrança ou cobertura.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">O que você quer fazer hoje?</h2>
            <Badge variant="secondary" className="rounded-full">Toque rápido</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/cuidar", title: "Cuidar de mim", description: "Organize lembretes de consultas, exames e vacinas.", icon: HeartHandshake, color: "bg-success/10 text-success" },
              { href: "/aprender", title: "Aprender", description: "Aprenda e acompanhe pontos demonstrativos.", icon: BookOpen, color: "bg-primary/10 text-primary" },
              { href: "/meu-seguro", title: "Entender meu seguro", description: "Compare opções e conceitos em linguagem simples.", icon: ShieldPlus, color: "bg-amber-100 text-amber-800" },
              { href: "/saude-feminina", title: "Saúde Feminina", description: "Registre informações do ciclo neste dispositivo.", icon: HeartHandshake, color: "bg-feminine/10 text-feminine" },
            ].map(({ href, title, description, icon: Icon, color }) => (
              <Link key={href} to={href} className="group flex min-h-24 items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}><Icon className="h-6 w-6" /></span>
                <span className="min-w-0 flex-1"><span className="block font-semibold">{title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span></span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:text-primary"><ChevronRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-4">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">Seu progresso</h2>
                <p className="mt-1 text-sm text-muted-foreground">{points} pts acumulados – Nível {points >= 1000 ? "Ouro" : points >= 400 ? "Prata" : "Bronze"}</p>
              </div>
              <Badge variant="mint">{Math.round(progressToSilver)}% da Prata</Badge>
            </div>
            <div className="my-4 flex items-center justify-between text-xs text-muted-foreground"><span>Bronze · 0–399 pts</span><span>Prata · 400 pts</span></div>
            <Progress value={progressToSilver} aria-label={`${Math.round(progressToSilver)}% do progresso para Prata`} className="h-3 bg-muted [&>div]:bg-success" />
            <div className="mt-2 text-sm font-semibold text-primary">Faltam {Math.max(400 - points, 0)} pts para Prata</div>
            <div className="mt-4 rounded-xl bg-success/5 p-3 text-sm text-foreground">Desbloqueie 20% de desconto em farmácias na Prata (e 35% no Ouro). <span className="text-xs text-muted-foreground">Benefícios ilustrativos, não disponíveis para resgate.</span></div>
            <Button asChild variant="default" className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"><Link to="/aprender">Continuar lição <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-4">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between"><div><h2 className="font-bold">Meu cashback</h2><p className="text-sm text-muted-foreground">Ganhe cashback aprendendo</p></div><Badge variant="mint">Resgatável*</Badge></div>
            <div className="mt-4 flex items-end justify-between gap-3"><span className="text-4xl font-bold">{money(cashbackAvailable)}</span><span className="text-right text-sm text-muted-foreground">R$ 1 a cada 50 pts conquistados</span></div>
            <Button variant="success" className="mt-4 w-full" disabled={cashbackAvailable < 1} onClick={redeemCashback}>{cashbackAvailable > 0 ? "Resgatar" : "Acumule pontos para simular"}</Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">*Simulação local: não há pagamento nem resgate em dinheiro.</p>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-5">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-lg font-bold">Próximos lembretes de saúde</h2><Badge variant="secondary">{pendingReminders.length} pendentes</Badge></div>
          <div className="space-y-3">
            {pendingReminders.map((reminder, index) => (
              <Card key={reminder.id}><CardContent className="flex flex-wrap items-center gap-3 p-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${index === 0 ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}><HeartHandshake className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge variant={index === 0 ? "success" : "secondary"}>{index === 0 ? "Prevenção" : "Exame"}</Badge><span className="text-xs text-muted-foreground">{formatDateTime(reminder.scheduledAt)}</span></div><p className="mt-1 font-semibold">{reminder.title}</p><p className="text-xs text-muted-foreground">{reminder.details || "Local ilustrativo · confira com o serviço de saúde."}</p></div>
                <Button variant="outline" size="sm" onClick={() => completeReminder(reminder.id)}>Marcar como feito</Button>
              </CardContent></Card>
            ))}
            {pendingReminders.length === 0 && <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">Você não tem lembretes pendentes.</p>}
          </div>
        </div>
      </section>

      <section id="politica-de-privacidade" className="px-4 py-5">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border bg-card p-4">
          <LockKeyhole className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1"><p className="text-sm text-muted-foreground">Seus dados são seus. Veja como os usamos com ética e clareza.</p><details className="mt-2 text-xs"><summary className="w-fit cursor-pointer font-semibold text-primary">Ver política</summary><p className="mt-2 leading-5 text-muted-foreground">As informações deste protótipo são armazenadas no navegador e não são enviadas a um serviço. O armazenamento local não é criptografado; evite inserir dados pessoais ou de saúde.</p></details></div>
        </div>
      </section>
      <HealthDisclaimerFooter />
    </main>
  );
}
