import { useState } from "react";
import {
  Brain, CalendarDays, Check, Clock3, FileHeart, Flame,
  Microscope, Plus, Stethoscope, Store, Syringe, TicketPercent, Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";
import { FemaleHealthShortcut } from "@/components/health/FemaleHealthShortcut";
import { formatDateTime } from "@/lib/utils";
import { usePrototypeStore } from "@/store/prototypeStore";
import type { LucideIcon } from "lucide-react";

const DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const TYPE_LABEL: Record<string, string> = { EXAM: "Exame", VACCINE: "Vacina", MEDICATION: "Medicamento", CONSULTATION: "Consulta Online" };
const TYPE_COLOR: Record<string, string> = { EXAM: "bg-primary", CONSULTATION: "bg-success", VACCINE: "bg-amber-700", MEDICATION: "bg-feminine" };
const DOCUMENT_CATEGORIES: Array<{ name: string; icon: LucideIcon }> = [
  { name: "Exames", icon: Microscope },
  { name: "Receitas", icon: Stethoscope },
  { name: "Vacinação", icon: Syringe },
];

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function CuidarPage() {
  const [activeTab, setActiveTab] = useState("agenda");
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderType, setReminderType] = useState("EXAM");
  const [reminderDetails, setReminderDetails] = useState("");
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [documentCategory, setDocumentCategory] = useState("Exames");
  const [documents, setDocuments] = useState<Array<{ name: string; category: string }>>([]);
  const { reminders, addReminder, completeReminder, streakDays, streakLastDate, carePointsDate, dailyPointsDate, dailyPoints } = usePrototypeStore();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
  const weekDates = DAYS.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
  const currentWeek = Math.ceil(today.getDate() / 7);
  const todayKey = localDateKey(today);
  const completedToday = streakLastDate === todayKey;
  const earnedCarePointsToday = carePointsDate === todayKey;
  const todayReminders = reminders.filter((reminder) => !reminder.done && localDateKey(new Date(reminder.scheduledAt)) === todayKey);
  const pendingReminders = reminders.filter((reminder) => !reminder.done);

  const createReminder = (title: string, type: string, scheduledAt: string, details: string) => {
    addReminder({ title, type, scheduledAt, details });
  };
  const addSuggestedVaccine = () => {
    const date = new Date(today);
    date.setDate(today.getDate() + 7);
    date.setHours(9, 0, 0, 0);
    createReminder("Vacina da gripe anual (Influenza)", "VACCINE", date.toISOString(), "Lembrete demonstrativo. Confirme calendário e disponibilidade na unidade de saúde.");
    setSuggestionDismissed(true);
  };

  return (
    <main className="min-h-screen bg-background pb-28 pt-16">
      <section className="px-4 pb-4 pt-7">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-[0.16em] text-success">● SEU BEM-ESTAR DIÁRIO</p>
            <h1 className="text-2xl font-bold">Cuidar de Mim</h1>
            <p className="mt-1 text-sm text-muted-foreground">Um passo de cada vez, no seu ritmo.</p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"><Brain className="h-6 w-6" /></span>
        </div>
      </section>

      <section className="px-4 py-4">
        <Card className="mx-auto max-w-3xl overflow-hidden border-success/15">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Flame className="h-5 w-5" /></span><div><h2 className="font-bold">Ofensiva de Cuidado</h2><p className="mt-1 text-xs text-muted-foreground">{streakDays > 0 ? "Sua sequência é uma demonstração para este protótipo." : "Conclua um lembrete para iniciar sua sequência."}</p></div></div>
              <Badge variant="mint">{dailyPointsDate === todayKey && dailyPoints >= 100 ? "Limite diário atingido" : earnedCarePointsToday ? "+5 pts hoje (demo)" : "+5 pts ao concluir (demo)"}</Badge>
            </div>
            <div className="my-5 flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-4xl font-bold text-primary">{streakDays}</span><span className="mr-2 text-sm text-muted-foreground">dias</span>
              <div className="flex flex-1 justify-between gap-1">
                {DAYS.map((day, index) => {
                  const date = weekDates[index];
                  const isToday = localDateKey(date) === todayKey;
                  const isFuture = date > today;
                  const pastDaysAgo = Math.floor((today.getTime() - date.getTime()) / 86400000);
                  const checked = !isFuture && (isToday ? completedToday : pastDaysAgo < streakDays);
                  return <div key={day} className="flex flex-1 flex-col items-center gap-1"><span className={`flex h-8 w-8 items-center justify-center rounded-full ${isToday ? "ring-2 ring-primary ring-offset-2" : ""} ${checked ? "bg-success text-white" : isFuture ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"}`}>{checked ? <Check className="h-4 w-4" /> : isFuture ? <Clock3 className="h-3.5 w-3.5" /> : <span className="text-[9px]">{date.getDate()}</span>}</span><span className={`text-[9px] ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{day}</span></div>;
                })}
              </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground">Pontos, sequência e calendário são demonstrativos; não representam benefícios reais.</p>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-2">
        <div className="mx-auto max-w-3xl">
          <FemaleHealthShortcut />
        </div>
      </section>

      <section className="px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl bg-primary/10 p-1">
              <TabsTrigger value="agenda" className="min-h-11 min-w-[78px] flex-1 gap-1 px-2 py-2 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-white"><CalendarDays className="h-4 w-4" />Agenda</TabsTrigger>
              <TabsTrigger value="cofre" className="min-h-11 min-w-[78px] flex-1 gap-1 px-2 py-2 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-white"><FileHeart className="h-4 w-4" />Cofre</TabsTrigger>
              <TabsTrigger value="consultas" className="min-h-11 min-w-[92px] flex-1 gap-1 px-2 py-2 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-white"><Video className="h-4 w-4" />Consultas</TabsTrigger>
              <TabsTrigger value="descontos" className="min-h-11 min-w-[92px] flex-1 gap-1 px-2 py-2 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-white"><TicketPercent className="h-4 w-4" />Descontos</TabsTrigger>
            </TabsList>

            <TabsContent value="agenda" className="mt-5 space-y-4">
              {!suggestionDismissed && <Card className="border-l-4 border-success"><CardContent className="p-4">
                <p className="text-[10px] font-bold tracking-[0.14em] text-success">SUGESTÃO PREVENTIVA INTELIGENTE</p>
                <h2 className="mt-1 font-bold">Vacina da gripe anual (Influenza)</h2>
                <p className="mt-1 text-sm text-muted-foreground">Proteja seus dias de trabalho: confira o calendário e a disponibilidade na unidade de saúde.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="success" size="sm" onClick={addSuggestedVaccine}><Check className="mr-1 h-4 w-4" />Aceitar</Button>
                  <Button variant="outline" size="sm" className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10" onClick={() => { setShowReminderForm(true); document.getElementById("reminder-form")?.scrollIntoView({ behavior: "smooth" }); }}>Ajustar</Button>
                  <Button variant="ghost" size="sm" onClick={() => setSuggestionDismissed(true)}>Ignorar</Button>
                </div>
              </CardContent></Card>}

              <Card><CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div><h2 className="font-bold capitalize">{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(weekDates[0])}</h2><p className="text-xs text-muted-foreground">Semana {currentWeek}</p></div>
                  <div className="flex gap-1"><Button variant="outline" size="sm" aria-label="Semana anterior" onClick={() => setWeekOffset((offset) => offset - 1)}>‹</Button><Button variant="outline" size="sm" aria-label="Próxima semana" onClick={() => setWeekOffset((offset) => offset + 1)}>›</Button></div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDates.map((date, index) => {
                    const isToday = localDateKey(date) === todayKey;
                    const kinds = reminders.filter((reminder) => localDateKey(new Date(reminder.scheduledAt)) === localDateKey(date)).map((reminder) => reminder.type);
                    return <div key={localDateKey(date)} className={`flex min-h-[72px] flex-col items-center justify-center rounded-xl ${isToday ? "bg-primary text-white shadow-sm" : "bg-muted/50"}`}><span className={`text-[9px] font-semibold ${isToday ? "text-white/80" : "text-muted-foreground"}`}>{DAYS[index]}</span><span className="text-sm font-bold">{date.getDate()}</span>{isToday && <span className="text-[8px] font-bold">HOJE</span>}<span className="mt-1 flex h-2 gap-0.5">{[...new Set(kinds)].slice(0, 3).map((kind) => <i key={kind} aria-label={TYPE_LABEL[kind] ?? "Lembrete"} className={`h-1.5 w-1.5 rounded-full ${isToday ? "bg-white" : TYPE_COLOR[kind] ?? "bg-muted-foreground"}`} />)}</span></div>;
                  })}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">{[["EXAM", "Exame"], ["CONSULTATION", "Consulta"], ["VACCINE", "Vacina"]].map(([key, label]) => <span key={key} className="flex items-center gap-1"><i className={`h-2 w-2 rounded-full ${TYPE_COLOR[key]}`} />{label}</span>)}</div>
              </CardContent></Card>

              <Button variant="success" className="h-12 w-full" onClick={() => setShowReminderForm((visible) => !visible)}><Plus className="mr-2 h-5 w-5" />+ Adicionar lembrete</Button>
              {showReminderForm && <Card id="reminder-form"><CardContent className="space-y-3 p-4">
                <h3 className="font-semibold">Novo lembrete</h3>
                <label htmlFor="reminder-title" className="block text-sm font-medium">Nome</label><input id="reminder-title" required value={reminderTitle} onChange={(event) => setReminderTitle(event.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
                <label htmlFor="reminder-type" className="block text-sm font-medium">Tipo</label><select id="reminder-type" value={reminderType} onChange={(event) => setReminderType(event.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 text-sm"><option value="EXAM">Exame</option><option value="VACCINE">Vacina</option><option value="MEDICATION">Medicamento</option><option value="CONSULTATION">Consulta</option></select>
                <label htmlFor="reminder-date" className="block text-sm font-medium">Data e hora</label><input id="reminder-date" required type="datetime-local" value={reminderDate} onChange={(event) => setReminderDate(event.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
                <label htmlFor="reminder-details" className="block text-sm font-medium">Observações (opcional)</label><input id="reminder-details" value={reminderDetails} onChange={(event) => setReminderDetails(event.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
                <Button variant="success" className="w-full" disabled={!reminderTitle.trim() || !reminderDate} onClick={() => { createReminder(reminderTitle.trim(), reminderType, new Date(reminderDate).toISOString(), reminderDetails.trim()); setReminderTitle(""); setReminderDate(""); setReminderDetails(""); setShowReminderForm(false); }}>Salvar lembrete neste navegador</Button>
              </CardContent></Card>}
            </TabsContent>

            <TabsContent value="cofre" className="mt-5">
              <Card><CardContent className="p-4">
                <h2 className="font-bold">Documentos de saúde</h2>
                <p className="mb-4 mt-1 text-xs text-muted-foreground">Seleção apenas em memória. Arquivos não são enviados nem persistidos; não selecione documentos reais.</p>
                <div className="grid grid-cols-3 gap-2">
                  {DOCUMENT_CATEGORIES.map(({ name: category, icon: CategoryIcon }) => {
                    return <button key={category} type="button" aria-pressed={documentCategory === category} onClick={() => setDocumentCategory(category)} className={`rounded-xl border p-3 text-left ${documentCategory === category ? "border-primary bg-primary/5" : "bg-background"}`}><CategoryIcon className="mb-2 h-5 w-5 text-primary" /><span className="block text-xs font-semibold">{category}</span><span className="text-[10px] text-muted-foreground">{documents.filter((document) => document.category === category).length} arquivo(s)</span></button>;
                  })}
                </div>
                <label htmlFor="demo-document" className="mt-4 flex min-h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold hover:bg-muted">Escolher arquivo de {documentCategory.toLowerCase()}</label>
                <input id="demo-document" type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) setDocuments((current) => [...current, { name: file.name, category: documentCategory }]); event.target.value = ""; }} />
                {documents.map((document, index) => <p key={`${document.name}-${index}`} className="mt-2 text-xs text-muted-foreground">{document.name} · {document.category} (selecionado nesta sessão)</p>)}
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="consultas" className="mt-5">
              <Card><CardContent className="p-5"><span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success"><Video className="h-5 w-5" /></span><h2 className="font-bold">Consultas e telemedicina</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">O agendamento não está conectado neste protótipo. Você pode criar um lembrete para procurar o serviço de saúde escolhido.</p><Button variant="success" className="mt-4 w-full" onClick={() => { const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); createReminder("Solicitar teleconsulta", "CONSULTATION", tomorrow.toISOString(), "Lembrete demonstrativo; nenhum agendamento foi feito."); setActiveTab("agenda"); }}>Criar lembrete de teleconsulta</Button></CardContent></Card>
            </TabsContent>

            <TabsContent value="descontos" className="mt-5">
              <div className="space-y-4">
                <Card className="border-primary/15 bg-primary/5"><CardContent className="flex items-start gap-3 p-4"><TicketPercent className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-bold">Descontos ilustrativos</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">Os exemplos abaixo são apenas referências visuais. Não há convênios ou descontos ativos neste protótipo.</p></div></CardContent></Card>
                {[
                  { name: "Farmácia Bem Estar", detail: "Exemplo de benefício em medicamentos", icon: Store },
                  { name: "Laboratório Saúde Viva", detail: "Exemplo de benefício em exames", icon: Microscope },
                ].map(({ name, detail, icon: Icon }) => <Card key={name}><CardContent className="flex flex-wrap items-center gap-3 p-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="font-semibold">{name}</h3><p className="text-xs text-muted-foreground">{detail} · parceiro fictício</p></div><Badge variant="secondary">Não ativo</Badge></CardContent></Card>)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="px-4 py-5">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-bold">Próximos lembretes</h2><Badge variant="secondary">{todayReminders.length > 0 ? `${todayReminders.length} para hoje` : `${pendingReminders.length} pendentes`}</Badge></div>
          <div className="space-y-3">
            {pendingReminders.map((reminder) => {
              const date = new Date(reminder.scheduledAt);
              const isToday = localDateKey(date) === todayKey;
              const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
              const when = isToday ? `Hoje • ${new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date)}` : localDateKey(date) === localDateKey(tomorrow) ? `Amanhã • ${new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date)}` : formatDateTime(reminder.scheduledAt);
              const Icon = reminder.type === "EXAM" ? Microscope : reminder.type === "VACCINE" ? Syringe : reminder.type === "CONSULTATION" ? Stethoscope : Clock3;
              return <Card key={reminder.id}><CardContent className="flex flex-wrap items-start gap-3 p-4">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${reminder.type === "EXAM" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}><Icon className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge variant={reminder.type === "CONSULTATION" ? "success" : "secondary"}>{TYPE_LABEL[reminder.type] ?? "Lembrete"}</Badge><span className="text-xs text-muted-foreground">{when}</span></div><h3 className="mt-1 font-semibold">{reminder.title}</h3><p className="text-xs text-muted-foreground">{reminder.details || "Local ilustrativo · confira com o serviço de saúde."}</p></div>
                <Button variant="outline" size="sm" className={isToday ? "border-success/30 bg-success/10 text-success hover:bg-success/15" : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"} onClick={() => completeReminder(reminder.id)}><Check className="mr-1 h-4 w-4" />Marcar como feito</Button>
              </CardContent></Card>;
            })}
            {pendingReminders.length === 0 && <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">Nenhum lembrete pendente.</p>}
          </div>
        </div>
      </section>
      <HealthDisclaimerFooter />
    </main>
  );
}
