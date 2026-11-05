"use client";

import { useState } from "react";
import { Shield, Phone, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Cell, Pie, PieChart } from "recharts";
import { usePrototypeStore } from "@/store/prototypeStore";

const PHASES = [
  {
    name: "Menstrual",
    color: "#EF4444",
    percent: 18,
    body: "O útero elimina o revestimento interno, causando o sangramento. Cólicas e cansaço podem acontecer.",
    care: "Descanse quando puder e mantenha hidratação. Calor local pode aliviar cólicas leves.",
  },
  {
    name: "Folicular",
    color: "#3B82F6",
    percent: 32,
    body: "Começa junto com a menstruação. Um folículo amadurece e o revestimento do útero volta a se formar.",
    care: "Observe como sua energia e disposição variam; cada pessoa sente essa fase de um jeito.",
  },
  {
    name: "Ovulação",
    color: "#10B981",
    percent: 7,
    body: "A liberação do óvulo ocorre perto do meio do ciclo em algumas pessoas, mas o dia pode variar.",
    care: "A previsão do aplicativo não confirma ovulação nem deve ser usada como método contraceptivo.",
  },
  {
    name: "Lútea",
    color: "#F59E0B",
    percent: 43,
    body: "Após a ovulação, o corpo se prepara para um possível início de gravidez. Se ela não acontece, um novo ciclo começa.",
    care: "Mudanças de humor, apetite ou sensibilidade podem ocorrer. Registre padrões e converse com um profissional.",
  },
];

export default function SaudeFemininaPage() {
  const [activeTab, setActiveTab] = useState("menstrual");
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [flow, setFlow] = useState("");
  const [energy, setEnergy] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const { cycleLogs, saveCycleLog, cycleStartDate, cycleLength, setCycleSettings } = usePrototypeStore();
  const localToday = new Date();
  localToday.setHours(0, 0, 0, 0);
  const parsedStart = cycleStartDate ? new Date(`${cycleStartDate}T00:00:00`) : null;
  const elapsedDays = parsedStart && !Number.isNaN(parsedStart.getTime()) && parsedStart <= localToday
    ? Math.floor((localToday.getTime() - parsedStart.getTime()) / 86400000)
    : null;
  const cycleDay = elapsedDays === null ? null : (elapsedDays % cycleLength) + 1;
  const daysUntilNextPeriod = elapsedDays === null ? null : cycleLength - (elapsedDays % cycleLength);
  const nextPeriodDate = daysUntilNextPeriod === null
    ? null
    : new Date(localToday.getTime() + daysUntilNextPeriod * 86400000);
  const ovulationDay = Math.max(cycleLength - 14, 6);
  const currentPhase = cycleDay === null
    ? null
    : cycleDay <= 5
      ? "Menstrual"
      : cycleDay < ovulationDay
        ? "Folicular"
        : cycleDay === ovulationDay
          ? "Ovulação"
          : "Lútea";
  const viewedMonth = new Date(localToday.getFullYear(), localToday.getMonth(), 1);
  const calendarDays: Array<number | null> = [
    ...Array.from({ length: viewedMonth.getDay() }, () => null),
    ...Array.from(
      { length: new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 0).getDate() },
      (_, index) => index + 1
    ),
  ];
  const todayWeekday = localToday.getDay();
  const todayLog = cycleLogs.find((log) => log.date === [
    localToday.getFullYear(),
    String(localToday.getMonth() + 1).padStart(2, "0"),
    String(localToday.getDate()).padStart(2, "0"),
  ].join("-"));
  const energyValue = energy || todayLog?.energy || "";

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      {/* Privacidade */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-4 border-feminine/30 bg-feminine/5">
            <CardContent className="p-0">
              <div className="p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-feminine shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-feminine text-sm">Dados apenas neste navegador</h4>
                  <p className="text-xs text-feminine/80">
                    Este protótipo salva entradas no armazenamento local do navegador, sem criptografia. Não informe dados reais de saúde.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-feminine" />
            <h1 className="text-2xl font-bold text-foreground">Saúde Feminina</h1>
          </div>
          <p className="text-muted-foreground">
            Acompanhe seu ciclo menstrual e cuide da sua saúde com privacidade.
          </p>
        </div>
      </section>

      {/* Nível de energia e previsão */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="p-4">
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-foreground">Nível de energia</h4>
                    <p className="text-xs text-muted-foreground">Hoje</p>
                  </div>
                  <Badge variant="feminine">{energyValue || "Ainda não registrado"}</Badge>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-feminine transition-all" style={{ width: energyValue === "Alta" ? "100%" : energyValue === "Média" ? "60%" : energyValue === "Baixa" ? "30%" : "0%" }} />
                  </div>
                <span className="text-sm font-bold text-foreground">{energyValue || "—"}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-foreground">Próxima menstruação</h4>
                    <p className="text-xs text-muted-foreground">Previsão</p>
                  </div>
                  <Badge variant="default" className="text-[10px]">{daysUntilNextPeriod === null ? "Sem dados" : `${daysUntilNextPeriod} dias`}</Badge>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {nextPeriodDate ? new Intl.DateTimeFormat("pt-BR").format(nextPeriodDate) : "Informe o início"}
                  </p>
                  <p className="text-xs text-muted-foreground">Estimativa simples, não é orientação médica.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tira semanal */}
          <Card className="p-4">
            <CardContent>
              <h4 className="font-bold text-foreground mb-4">Esta semana</h4>
              <div className="flex gap-2">
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day, i) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === todayWeekday ? 'bg-feminine text-white' : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      {i === todayWeekday ? '●' : day[0]}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-4">
            <CardContent className="space-y-3">
              <h3 className="font-semibold">Configurar estimativa do ciclo</h3>
              <label htmlFor="cycle-start" className="block text-sm">Primeiro dia da última menstruação</label>
              <input
                id="cycle-start"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={cycleStartDate}
                onChange={(event) => setCycleSettings(event.target.value, cycleLength)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              <label htmlFor="cycle-length" className="block text-sm">Duração média do ciclo (21 a 45 dias)</label>
              <input
                id="cycle-length"
                type="number"
                min={21}
                max={45}
                value={cycleLength}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (value >= 21 && value <= 45) setCycleSettings(cycleStartDate, value);
                }}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">A estimativa considera um ciclo regular e pode não corresponder ao seu corpo. Não use como contraceptivo ou diagnóstico.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Donut do ciclo */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-foreground">Visão do seu ciclo</h3>
                    <p className="text-sm text-muted-foreground">
                      {cycleDay === null ? "Adicione os dados do ciclo para uma estimativa." : `Estimativa: fase ${currentPhase} • Dia ${cycleDay} de ${cycleLength}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Diagrama ilustrativo; a duração de cada fase varia.</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-48 h-48 mx-auto md:mx-0">
                    <PieChart width={240} height={240}>
                      <Pie
                        data={PHASES}
                        dataKey="percent"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        stroke="#fff"
                      >
                      {PHASES.map((phase) => (
                        <Cell key={phase.name} fill={phase.color} />
                      ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="flex-1 space-y-4">
                    {PHASES.map((phase) => (
                      <div key={phase.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: phase.color }} />
                        <span className="text-sm text-foreground">{phase.name}</span>
                        <span className="ml-auto text-sm text-muted-foreground">~{phase.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calendário mensal */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-4">
            <CardContent>
              <h4 className="font-bold text-foreground mb-4">
                {new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(viewedMonth)}
              </h4>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
                  <div key={day} className="text-center text-[10px] font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (day === null) return <div key={`empty-${index}`} />;
                  const calendarDate = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), day);
                  const calendarElapsed = parsedStart && calendarDate >= parsedStart
                    ? Math.floor((calendarDate.getTime() - parsedStart.getTime()) / 86400000)
                    : null;
                  const calendarCycleDay = calendarElapsed === null ? null : (calendarElapsed % cycleLength) + 1;
                  const isPeriod = calendarCycleDay !== null && calendarCycleDay <= 5;
                  const isOvulation = calendarCycleDay === ovulationDay;
                  const isFertile = calendarCycleDay !== null && calendarCycleDay >= ovulationDay - 5 && calendarCycleDay <= ovulationDay + 1;
                  return (
                    <div key={day} className="aspect-square rounded-xl flex flex-col items-center justify-center text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPeriod ? 'bg-feminine text-white' : isOvulation ? 'bg-warning/20 text-warning' : isFertile ? 'bg-success/20 text-success' : 'bg-background text-muted-foreground'
                      }`}>
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-feminine" />
                  <span>Menstruação</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success/20" />
                  <span>Fertilidade</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-warning/20" />
                  <span>Ovulação</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4 fases */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">As 4 fases do seu ciclo</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              {PHASES.map((phase) => (
                <TabsTrigger key={phase.name} value={phase.name.toLowerCase()}>
                  {phase.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {PHASES.map((phase) => (
              <TabsContent key={phase.name} value={phase.name.toLowerCase()} className="mt-6">
                <Card className="p-4">
                  <CardContent>
                    <h4 className="font-bold text-foreground mb-2">{phase.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{phase.body}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">No corpo</p>
                        <p className="text-xs text-foreground">{phase.body}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Autocuidado</p>
                        <p className="text-xs text-foreground">{phase.care}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">As fases e durações são aproximações educativas; ciclos e sintomas variam de pessoa para pessoa.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Diário */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-4">
            <CardContent>
              <h4 className="font-bold text-foreground mb-4">Diário do seu dia</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Humor</p>
                  <div className="flex gap-2">
                    {["😊", "😐", "😔", "😠"].map((emoji) => (
                      <button type="button" key={emoji} aria-pressed={mood === emoji} onClick={() => setMood(emoji)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform ${mood === emoji ? "bg-feminine/20 ring-2 ring-feminine" : ""}`}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Energia</p>
                  <div className="flex gap-2">
                    {["Baixa", "Média", "Alta"].map((level) => (
                      <button type="button" key={level} aria-pressed={energyValue === level} onClick={() => setEnergy(level)} className={`px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors ${energyValue === level ? "bg-feminine/20 border-feminine" : ""}`}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Sintomas físicos</p>
                  <div className="flex flex-wrap gap-2">
                    {["Cólica", "Dor de cabeça", "Inchaço", "Fadiga"].map((symptom) => (
                      <button type="button" key={symptom} aria-pressed={symptoms.includes(symptom)} onClick={() => setSymptoms((current) => current.includes(symptom) ? current.filter((entry) => entry !== symptom) : [...current, symptom])} className={`px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors ${symptoms.includes(symptom) ? "bg-feminine/20 border-feminine" : ""}`}>
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Intensidade do fluxo</p>
                  <div className="flex flex-wrap gap-2">
                    {["Leve", "Moderado", "Intenso"].map((flowOption) => (
                      <button type="button" key={flowOption} aria-pressed={flow === flowOption} onClick={() => setFlow(flowOption)} className={`px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors ${flow === flowOption ? "bg-feminine/20 border-feminine" : ""}`}>
                        {flowOption}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="feminine"
                  className="w-full mt-4"
                  disabled={!mood && symptoms.length === 0 && !flow && !energy}
                  onClick={() => {
                    if (!mood && symptoms.length === 0 && !flow && !energy) return;
                    saveCycleLog({ mood, symptoms, flow, energy });
                    setSavedMessage("Registro salvo somente neste navegador.");
                  }}
                >
                  Salvar meu cofre de saúde
                </Button>
                {savedMessage && <p role="status" className="mt-2 text-center text-xs text-muted-foreground">{savedMessage}</p>}
                {cycleLogs.length > 0 && <p className="text-center text-xs text-muted-foreground">{cycleLogs.length} registro(s) local(is) salvo(s).</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Guia de fluxo */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-4">
            <CardContent>
              <h4 className="font-bold text-foreground mb-4">Tipos de fluxo e corrimento</h4>
              <div className="space-y-3">
                {[
                  { type: "Normal", desc: "Corrimento claro ou esbranquiçado, sem cheiro forte." },
                  { type: "Fértil", desc: "Corrimento transparente e elástico, como clara de ovo." },
                  { type: "Menstrual", desc: "Sangramento vermelho ou marrom durante o período." },
                  { type: "Alerta", desc: "Corrimento com cheiro forte, coceira ou cor estranha. Procure atendimento." },
                ].map((item) => (
                  <div key={item.type} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-feminine bg-feminine/10">
                      {item.type === "Alerta" ? "!" : "i"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.type}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Quando procurar atendimento: dor intensa, sangramento muito abundante, febre ou corrimento com cheiro forte.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quando falar com ginecologista */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-4 border-feminine/30 bg-feminine/5">
            <CardContent>
              <h4 className="font-bold text-feminine mb-2">Quando falar com a ginecologista?</h4>
              <p className="text-sm text-feminine/80 mb-4">
                Sinais de alerta: menstruação irregular por mais de 3 meses, dor pélvica intensa, sangramento entre períodos.
              </p>
              <Button variant="feminine" className="w-full" leftIcon={<Phone className="w-4 h-4" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Agendar consulta ginecológica online
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <HealthDisclaimerFooterFeminina />
    </div>
  );
}

function HealthDisclaimerFooterFeminina() {
  return (
    <footer className="border-t border-border bg-background py-6 px-4 mt-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
          <div className="w-5 h-5 text-warning shrink-0 mt-0.5">⚠</div>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Aviso importante</p>
            <p>O conteúdo deste app é educativo e não substitui consulta médica. Em caso de emergência, ligue para <a href="tel:192" className="font-semibold text-success hover:underline">SAMU 192</a> ou procure a UPA mais próxima.</p>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>Os valores e parceiros apresentados são ilustrativos. Consulte os termos do seu plano.</p>
        </div>
      </div>
    </footer>
  );
}