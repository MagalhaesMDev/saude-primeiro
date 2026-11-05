import { useState } from "react";
import {
  Activity, ArrowLeft, BatteryCharging, CalendarDays, Check, CircleHelp, Droplets, Heart,
  HeartPulse, NotebookPen, Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";
import { usePrototypeStore } from "@/store/prototypeStore";

const PHASES = [
  { name: "Menstrual", color: "#db2777", percent: 18, body: "O útero elimina o revestimento interno, causando o sangramento. Cólicas e cansaço podem acontecer.", care: "Descanse quando puder e mantenha hidratação. Procure avaliação se a dor ou o sangramento preocuparem." },
  { name: "Folicular", color: "#a855f7", percent: 32, body: "Começa junto com a menstruação; um folículo amadurece enquanto o revestimento do útero volta a se formar.", care: "Observe como sua energia varia. Cada pessoa pode vivenciar essa fase de um jeito." },
  { name: "Ovulatória", color: "#16a34a", percent: 7, body: "A liberação do óvulo pode ocorrer perto do meio do ciclo, mas o dia e a duração variam.", care: "Esta previsão não confirma ovulação e não deve ser usada como método contraceptivo." },
  { name: "Lútea", color: "#f97316", percent: 43, body: "Após a ovulação, o corpo se prepara para um possível início de gravidez; se ela não ocorre, um novo ciclo começa.", care: "Mudanças de humor, apetite e sensibilidade podem ocorrer. Converse com um profissional se necessário." },
];
const MOODS = ["😊", "😐", "😔", "😠"];
const ENERGY = ["Baixa", "Média", "Alta"];
const SYMPTOMS = ["Cólica", "Dor de cabeça", "Inchaço", "Fadiga", "Sensibilidade"];
const FLOW_OPTIONS = ["Ausente", "Leve", "Médio", "Intenso"];
const FLOW_GUIDE = [
  ["1", "Normal", "Secreção pode variar ao longo do ciclo; observe o que é habitual para você."],
  ["2", "Período fértil", "Algumas pessoas notam secreção mais transparente e elástica. Isso não confirma ovulação."],
  ["3", "Candidíase", "Coceira e secreção podem ter várias causas; só um profissional pode avaliar e diagnosticar."],
  ["4", "Infecção bacteriana", "Alteração de odor, cor ou desconforto merece orientação de saúde, sem autodiagnóstico."],
  ["5", "Vaginose", "Alterações na secreção podem ter causas diferentes; procure avaliação para receber orientação."],
  ["6", "Sangramento / Manchas", "Sangramento fora do padrão ou após a menopausa precisa de avaliação clínica."],
];

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function SaudeFemininaPage() {
  const localToday = new Date();
  localToday.setHours(0, 0, 0, 0);
  const todayKey = localDateKey(localToday);
  const { cycleLogs, saveCycleLog, cycleStartDate, cycleLength, setCycleSettings, addReminder } = usePrototypeStore();
  const todayLog = cycleLogs.find((log) => log.date === todayKey);
  const parsedStart = cycleStartDate ? new Date(`${cycleStartDate}T00:00:00`) : null;
  const elapsedDays = parsedStart && !Number.isNaN(parsedStart.getTime())
    ? Math.floor((localToday.getTime() - parsedStart.getTime()) / 86400000)
    : null;
  const cycleDay = elapsedDays === null ? null : ((elapsedDays % cycleLength) + cycleLength) % cycleLength + 1;
  const ovulationDay = Math.max(cycleLength - 14, 6);
  const currentPhase = cycleDay === null ? null : cycleDay <= 5 ? "Menstrual" : cycleDay < ovulationDay ? "Folicular" : cycleDay === ovulationDay ? "Ovulatória" : "Lútea";
  const [activeTab, setActiveTab] = useState(currentPhase ?? "Menstrual");
  const [mood, setMood] = useState(todayLog?.mood ?? "");
  const [symptoms, setSymptoms] = useState<string[]>(todayLog?.symptoms ?? []);
  const [flow, setFlow] = useState(todayLog?.flow ?? "");
  const [energy, setEnergy] = useState(todayLog?.energy ?? "");
  const [intimacy, setIntimacy] = useState(todayLog?.intimacy ?? "");
  const [savedMessage, setSavedMessage] = useState("");

  const selectedPhase = PHASES.find((phase) => phase.name === activeTab) ?? PHASES[0];
  const nextPeriodDate = elapsedDays === null
    ? null
    : new Date(localToday.getTime() + (cycleLength - (((elapsedDays % cycleLength) + cycleLength) % cycleLength)) * 86400000);
  const fertileShare = Math.round(Math.min(6 / cycleLength * 100, 100));
  const energyValue = energy || todayLog?.energy || "";

  const viewedMonth = new Date(localToday.getFullYear(), localToday.getMonth(), 1);
  const dayStrip = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(localToday);
    date.setDate(localToday.getDate() + index);
    return date;
  });
  const calendarDays: Array<number | null> = [
    ...Array.from({ length: viewedMonth.getDay() }, () => null),
    ...Array.from({ length: new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 0).getDate() }, (_, index) => index + 1),
  ];
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  const registerPeriod = () => {
    setCycleSettings(todayKey, cycleLength);
    setSavedMessage("Início do ciclo registrado apenas neste navegador.");
  };
  const saveDiary = () => {
    if (!mood && !symptoms.length && !flow && !energy && !intimacy) return;
    saveCycleLog({ mood, symptoms, flow, energy, intimacy });
    setSavedMessage("Registro salvo somente neste navegador.");
  };

  return (
    <main className="min-h-screen bg-[#fff8f9] pb-28 pt-14">
      <h1 className="sr-only">Saúde Feminina</h1>
      <section className="space-y-2 px-4 pb-2 pt-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
          <Link
            to="/cuidar"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#f5e6ec] bg-white px-3 text-xs font-semibold text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feminine focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4 text-feminine" aria-hidden="true" />
            Voltar para Cuidar
          </Link>
          <Badge variant="feminine" className="rounded-full">Modo Acolhimento</Badge>
        </div>
        <Card className="mx-auto max-w-3xl rounded-2xl border-[#fde2ec] bg-white/90 shadow-sm"><CardContent className="flex items-start gap-2.5 p-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-feminine" />
          <p className="text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Privacidade & LGPD:</strong> Seus registros ficam somente neste navegador, sem criptografia. Este protótipo não garante conformidade com a LGPD; evite inserir dados reais de saúde.</p>
        </CardContent></Card>
      </section>

      <section className="px-4 py-2">
        <Card className="mx-auto max-w-3xl rounded-[28px] border-[#fee7ee] bg-white shadow-[0_4px_24px_rgba(255,145,175,0.12)]">
          <CardContent className="p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f4] text-feminine"><Activity className="h-5 w-5" /></span>
                <div className="min-w-0"><h2 className="text-sm font-bold">Nível de Energia</h2><p className="text-xs text-muted-foreground">{energyValue ? `Disposição: ${energyValue}` : "Registre como você está se sentindo"}</p></div>
              </div>
              <div className="shrink-0 text-right"><p className="text-sm font-bold">{new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" }).format(localToday)}</p><button type="button" onClick={() => scrollTo("cycle-calendar")} aria-label="Ir para calendário do ciclo" className="text-xs font-medium text-feminine">Ver calendário</button></div>
            </div>
            <div className="grid grid-cols-7 gap-1 py-2 text-center">
              {dayStrip.map((date, index) => {
                const isToday = index === 0;
                const cycleOffset = elapsedDays === null ? null : ((elapsedDays + index) % cycleLength) + 1;
                const isPredicted = cycleOffset !== null && cycleOffset <= 5 && !isToday;
                return <div key={date.toISOString()} className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-semibold ${isToday ? "text-foreground" : "text-muted-foreground"}`}>{isToday ? "HOJE" : ["D", "S", "T", "Q", "Q", "S", "S"][date.getDay()]}</span>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${isToday ? "bg-[#e5e5eb] font-bold text-foreground" : isPredicted ? "bg-[#ffe7ef] font-semibold text-feminine" : "text-foreground"}`}>{date.getDate()}</span>
                </div>;
              })}
            </div>
            <div className="my-2 flex min-h-40 flex-col items-center justify-center rounded-[24px] bg-gradient-to-b from-[#fff5ee] via-[#fff1f6] to-white">
              <span className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-feminine shadow-md shadow-feminine/10"><BatteryCharging className="h-12 w-12" aria-hidden="true" /></span>
              <span className="mt-2 text-xs font-semibold text-muted-foreground">{energyValue ? `Energia registrada: ${energyValue}` : "Seu bem-estar, no seu ritmo"}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#fcd4e2] bg-gradient-to-r from-[#fff5f8] to-[#fff0f4] p-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-feminine text-white"><HeartPulse className="h-5 w-5" /></span>
                <div className="min-w-0"><p className="text-xs font-bold">Previsão do ciclo</p><p className="text-[11px] leading-4 text-muted-foreground">{cycleDay === null ? "Informe o início do ciclo para ver uma estimativa." : `Fase ${currentPhase ?? "estimada"} · Dia ${cycleDay} de ${cycleLength}`}</p></div>
              </div>
              <Badge variant="feminine" className="shrink-0">{cycleDay === null ? "Sem dados" : `${fertileShare}% do ciclo`}</Badge>
            </div>
            <p className="mt-2 text-center text-[10px] leading-4 text-muted-foreground">Estimativa educativa, não é probabilidade de gravidez, método contraceptivo ou orientação médica.</p>
            {nextPeriodDate && <p className="mt-1 text-center text-[10px] text-muted-foreground">Próxima menstruação estimada: {new Intl.DateTimeFormat("pt-BR").format(nextPeriodDate)}.</p>}
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-3"><div className="mx-auto grid max-w-3xl grid-cols-4 gap-2 border-t border-[#f8e7ec] pt-4">
        {[
          { label: "Registrar menstruação", icon: CalendarDays, action: registerPeriod },
          { label: "Sintomas", icon: HeartPulse, action: () => scrollTo("cycle-diary") },
          { label: "Sexo", icon: Heart, action: () => { scrollTo("cycle-diary"); window.setTimeout(() => document.getElementById("intimacy")?.focus(), 350); } },
          { label: "Registro", icon: NotebookPen, action: () => scrollTo("cycle-diary") },
        ].map(({ label, icon: Icon, action }) => <button key={label} type="button" onClick={action} className="flex min-h-11 min-w-0 flex-col items-center gap-2 rounded-xl p-1 text-center text-[10px] font-semibold text-foreground hover:bg-feminine/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feminine"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-feminine text-white shadow-md shadow-feminine/20"><Icon className="h-6 w-6" /></span>{label}</button>)}
      </div>{savedMessage && <p role="status" className="mx-auto mt-2 max-w-3xl text-center text-xs text-feminine">{savedMessage}</p>}</section>

      <section id="cycle-calendar" className="px-4 py-3"><Card className="mx-auto max-w-3xl rounded-[26px] border-[#fee7ee] bg-white"><CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Calendário do ciclo</h2><p className="text-xs text-muted-foreground">Estimativa para {new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(viewedMonth)}</p></div><CalendarDays className="h-5 w-5 text-feminine" /></div>
        <div className="mb-2 grid grid-cols-7 gap-1">{["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => <span key={day} className="text-center text-[9px] font-semibold text-muted-foreground">{day}</span>)}</div>
        <div className="grid grid-cols-7 gap-1">{calendarDays.map((day, index) => {
          if (day === null) return <span aria-hidden="true" key={`empty-${index}`} />;
          const date = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), day);
          const offset = elapsedDays === null ? null : Math.floor((date.getTime() - parsedStart!.getTime()) / 86400000);
          const dayOfCycle = offset === null ? null : ((offset % cycleLength) + cycleLength) % cycleLength + 1;
          const isPeriod = dayOfCycle !== null && dayOfCycle <= 5;
          const isOvulation = dayOfCycle === ovulationDay;
          const isFertile = dayOfCycle !== null && dayOfCycle >= ovulationDay - 5 && dayOfCycle <= ovulationDay + 1;
          const isFollicular = dayOfCycle !== null && dayOfCycle > 5 && dayOfCycle < ovulationDay - 5;
          const isLuteal = dayOfCycle !== null && dayOfCycle > ovulationDay + 1;
          const isToday = localDateKey(date) === todayKey;
          return <span key={day} aria-label={`${day} ${isPeriod ? "menstruação estimada" : isOvulation ? "ovulação estimada" : isFertile ? "janela fértil estimada" : ""}`} className={`flex aspect-square flex-col items-center justify-center rounded-xl text-xs ${isToday ? "scale-105 bg-feminine font-bold text-white shadow-md" : isPeriod ? "bg-feminine/90 font-semibold text-white" : isOvulation ? "bg-success font-bold text-white" : isFertile ? "bg-success/15 font-semibold text-success" : isFollicular ? "bg-violet-100 font-medium text-violet-800" : isLuteal ? "bg-orange-50 font-medium text-orange-800" : "text-muted-foreground"}`}>{day}{isPeriod && <span className="text-[8px] leading-none">●</span>}{isFertile && !isOvulation && <span className="text-[8px] leading-none">✦</span>}</span>;
        })}</div>
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-feminine" />Menstruação estimada</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-success/20" />Janela fértil estimada</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-success" />Ovulação estimada</span></div>
      </CardContent></Card></section>

      <section className="px-4 py-3"><Card className="mx-auto max-w-3xl border-feminine/15"><CardContent className="grid gap-3 p-4 sm:grid-cols-2">
        <div><label htmlFor="cycle-start" className="mb-1 block text-xs font-semibold">Primeiro dia da última menstruação</label><input id="cycle-start" type="date" max={todayKey} value={cycleStartDate} onChange={(event) => setCycleSettings(event.target.value, cycleLength)} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" /></div>
        <div><label htmlFor="cycle-length" className="mb-1 block text-xs font-semibold">Duração média do ciclo (21 a 45 dias)</label><input id="cycle-length" type="number" min={21} max={45} value={cycleLength} onChange={(event) => { const length = Number(event.target.value); if (length >= 21 && length <= 45) setCycleSettings(cycleStartDate, length); }} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" /></div>
        <p className="text-[10px] leading-4 text-muted-foreground sm:col-span-2">A previsão é aproximada e pode não corresponder ao seu corpo. Não use para contracepção, diagnóstico ou decisões médicas.</p>
      </CardContent></Card></section>

      <section className="px-4 py-4"><div className="mx-auto max-w-3xl">
        <h2 className="mb-3 text-lg font-bold">As 4 Fases do Seu Ciclo</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto bg-feminine/10 p-1">{PHASES.map((phase, index) => <TabsTrigger key={phase.name} value={phase.name} className="min-h-10 min-w-fit shrink-0 px-3 py-2 text-[11px] data-[state=active]:bg-feminine data-[state=active]:text-white">{index + 1}. {phase.name}{phase.name === currentPhase ? " (Atual)" : ""}</TabsTrigger>)}</TabsList>
          <TabsContent value={activeTab} className="mt-3"><Card className="border-feminine/15 bg-feminine/5"><CardContent className="p-4"><h3 className="font-bold text-feminine">{selectedPhase.name}</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-3"><p className="mb-1 text-xs font-bold text-feminine">No corpo</p><p className="text-xs leading-5">{selectedPhase.body}</p></div><div className="rounded-xl bg-white p-3"><p className="mb-1 text-xs font-bold text-feminine">Autocuidado</p><p className="text-xs leading-5">{selectedPhase.care}</p></div></div><p className="mt-3 text-[10px] text-muted-foreground">A estimativa não substitui orientação de profissional de saúde.</p></CardContent></Card></TabsContent>
        </Tabs>
      </div></section>

      <section id="cycle-diary" className="scroll-mt-20 px-4 py-4"><Card className="mx-auto max-w-3xl border-feminine/15"><CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2"><NotebookPen className="h-5 w-5 text-feminine" /><h2 className="font-bold">Diário do Seu Dia</h2></div>
        <div className="space-y-4">
          <fieldset><legend className="mb-2 text-xs font-semibold text-muted-foreground">Humor</legend><div className="flex gap-2">{MOODS.map((value) => <button type="button" key={value} aria-label={`Humor ${value}`} aria-pressed={mood === value} onClick={() => setMood(value)} className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${mood === value ? "bg-feminine/10 ring-2 ring-feminine" : "bg-muted/50"}`}>{value}</button>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-xs font-semibold text-muted-foreground">Disposição</legend><div className="flex flex-wrap gap-2">{ENERGY.map((value) => <button type="button" key={value} aria-pressed={energy === value} onClick={() => setEnergy(value)} className={`rounded-full border px-3 py-1.5 text-xs ${energy === value ? "border-feminine bg-feminine/10 text-feminine" : ""}`}>{value}</button>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-xs font-semibold text-muted-foreground">Sintomas físicos</legend><div className="flex flex-wrap gap-2">{SYMPTOMS.map((value) => <button type="button" key={value} aria-pressed={symptoms.includes(value)} onClick={() => setSymptoms((current) => current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value])} className={`rounded-full border px-3 py-1.5 text-xs ${symptoms.includes(value) ? "border-feminine bg-feminine/10 text-feminine" : ""}`}>{value}</button>)}</div></fieldset>
          <fieldset><legend className="mb-2 text-xs font-semibold text-muted-foreground">Fluxo menstrual</legend><div className="flex flex-wrap gap-2">{FLOW_OPTIONS.map((value) => <button type="button" key={value} aria-pressed={flow === value} onClick={() => setFlow(value)} className={`rounded-full border px-3 py-1.5 text-xs ${flow === value ? "border-feminine bg-feminine/10 text-feminine" : ""}`}>{value}</button>)}</div></fieldset>
          <div><label htmlFor="intimacy" className="mb-2 block text-xs font-semibold text-muted-foreground">Atividade sexual (opcional)</label><select id="intimacy" value={intimacy} onChange={(event) => setIntimacy(event.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 text-sm"><option value="">Não registrar</option><option value="Sim">Sim</option><option value="Não">Não</option><option value="Prefiro não informar">Prefiro não informar</option></select><p className="mt-1 text-[10px] text-muted-foreground">Informação sensível salva apenas neste navegador, sem criptografia.</p></div>
          <Button variant="feminine" className="w-full" disabled={!mood && !symptoms.length && !flow && !energy && !intimacy} onClick={saveDiary}><Check className="mr-2 h-4 w-4" />Salvar Meu Cofre de Saúde</Button>
          {savedMessage && <p role="status" className="text-center text-xs text-feminine">{savedMessage}</p>}
          {cycleLogs.length > 0 && <p className="text-center text-[10px] text-muted-foreground">{cycleLogs.length} registro(s) local(is) salvo(s).</p>}
        </div>
      </CardContent></Card></section>

      <section className="px-4 py-4"><Card className="mx-auto max-w-3xl border-feminine/15"><CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2"><Droplets className="h-5 w-5 text-feminine" /><div><h2 className="font-bold">Tipos de Fluxo Vaginal</h2><p className="text-xs text-muted-foreground">Informação geral; não use para autodiagnóstico.</p></div></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{["Habitual", "Transparente", "Esbranquiçado", "Alteração de odor", "Coloração diferente", "Sangramento"].map((label, index) => <div key={label} className={`rounded-xl p-3 text-center ${index < 2 ? "bg-success/5" : "bg-feminine/5"}`}><span className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${index < 2 ? "bg-success/10 text-success" : "bg-feminine/10 text-feminine"}`}><CircleHelp className="h-4 w-4" /></span><span className="text-[10px] font-medium">{label}</span></div>)}</div>
        <ol className="mt-4 space-y-3">{FLOW_GUIDE.map(([number, title, description]) => <li key={number} className="flex gap-3 rounded-xl bg-muted/40 p-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-feminine/10 text-xs font-bold text-feminine">{number}</span><div><h3 className="text-xs font-semibold">{title}</h3><p className="mt-1 text-[11px] leading-5 text-muted-foreground">{description}</p></div></li>)}</ol>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">Procure atendimento se houver dor intensa, febre, odor forte, sangramento muito abundante ou qualquer sintoma que cause preocupação.</p>
      </CardContent></Card></section>

      <section className="px-4 py-4"><Card className="mx-auto max-w-3xl border-feminine/20 bg-feminine/5"><CardContent className="p-5">
        <h2 className="font-bold text-feminine">Quando falar com a ginecologista?</h2>
        <ul className="mt-3 space-y-2 text-sm text-feminine/90">{["Dor pélvica intensa ou persistente", "Sangramento muito abundante ou fora do padrão", "Febre, coceira ou corrimento com odor forte", "Dúvidas sobre ciclos irregulares ou sintomas que preocupam"].map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true">•</span>{item}</li>)}</ul>
        <Button variant="feminine" className="mt-4 w-full" onClick={() => { const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); addReminder({ title: "Procurar orientação ginecológica", type: "CONSULTATION", scheduledAt: tomorrow.toISOString(), details: "Lembrete demonstrativo. Nenhuma consulta foi agendada." }); setSavedMessage("Lembrete local criado; nenhuma consulta foi agendada."); }}>Agendar Consulta Ginecológica Online</Button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">Demonstração: o botão cria somente um lembrete local, não agenda consulta.</p>
      </CardContent></Card></section>
      <HealthDisclaimerFooter />
    </main>
  );
}
