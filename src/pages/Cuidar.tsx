"use client";

import { useState } from "react";
import { Video, Plus, CheckCircle, Clock, Microscope, Syringe, Stethoscope, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDateTime } from "@/lib/utils";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";
import { usePrototypeStore } from "@/store/prototypeStore";

const DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const REMINDER_TYPE_LABELS: Record<string, string> = {
  EXAM: "Exame",
  VACCINE: "Vacina",
  MEDICATION: "Medicamento",
  CONSULTATION: "Consulta",
};

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
  const { reminders, addReminder, completeReminder } = usePrototypeStore();
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
  const weekDates = DAYS.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
  const completedDays = new Set(
    reminders
      .filter((reminder) => reminder.done && reminder.completedAt)
      .map((reminder) => new Date(reminder.completedAt!).toDateString())
  );
  let streak = 0;
  const firstStreakDay = completedDays.has(today.toDateString()) ? 0 : 1;
  for (let offset = firstStreakDay; offset < firstStreakDay + completedDays.size; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    if (!completedDays.has(date.toDateString())) break;
    streak += 1;
  }

  const createReminder = (title: string, type: string, scheduledAt: string, details: string) => {
    addReminder({ title, type, scheduledAt, details });
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Cuidar de Mim</h1>
          </div>
          <p className="text-muted-foreground">
            Sua jornada de saúde preventiva, um dia de cada vez.
          </p>
        </div>
      </section>

      {/* Ofensiva de cuidado */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-foreground">Ofensiva de Cuidado</h3>
                  <p className="text-sm text-muted-foreground">{streak > 0 ? `${streak} dia(s) seguido(s) cuidando de você!` : "Conclua um lembrete para iniciar sua sequência."}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="success">{reminders.filter((reminder) => reminder.done).length} concluídos</Badge>
                  <span className="text-2xl font-bold text-primary">{streak} dia(s)</span>
                </div>
              </div>
              <div className="flex gap-2">
                {DAYS.map((day, i) => {
                  const done = completedDays.has(weekDates[i].toDateString());
                  return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? "bg-success text-success-foreground" : "bg-muted/50 text-muted-foreground"}`}>
                      <span className="text-xs font-semibold">{done ? '✓' : day}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{weekDates[i].toDateString() === today.toDateString() ? 'Hoje' : ''}</span>
                  </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Abas */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="cofre">Cofre</TabsTrigger>
              <TabsTrigger value="consultas">Consultas</TabsTrigger>
            </TabsList>

            <TabsContent value="agenda" className="mt-6">
              <div className="space-y-4">
                {/* Sugestão preventiva */}
                <Card className="border-l-4 border-warning bg-warning/5" hidden={suggestionDismissed}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3">
                      <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center text-warning">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Sugestão preventiva inteligente</h4>
                        <p className="text-sm text-muted-foreground">
                          Vacina da gripe anual (Influenza). Confira o calendário e a disponibilidade na unidade de saúde.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => createReminder(
                          "Vacina da gripe (lembrete)",
                          "VACCINE",
                          new Date(Date.now() + 7 * 86400000).toISOString(),
                          "Sugestão adicionada manualmente; confirme disponibilidade no posto de saúde."
                        )}
                      >Adicionar lembrete</Button>
                      <Button variant="outline" size="sm" onClick={() => setShowReminderForm(true)}>Ajustar</Button>
                      <Button variant="ghost" size="sm" onClick={() => setSuggestionDismissed(true)}>Ignorar</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Calendário */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-bold text-foreground">
                        {new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(weekDates[0])}
                      </h4>
                      <p className="text-xs text-muted-foreground">Sua semana</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="Semana anterior" onClick={() => setWeekOffset((offset) => offset - 1)}>‹</Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="Próxima semana" onClick={() => setWeekOffset((offset) => offset + 1)}>›</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS.map((day) => (
                      <div key={day} className="text-center text-[10px] font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDates.map((date) => {
                      const isToday = date.toDateString() === today.toDateString();
                      const hasEvent = reminders.some((reminder) => new Date(reminder.scheduledAt).toDateString() === date.toDateString());
                      return (
                        <div key={date.toISOString()} className="aspect-square rounded-xl flex flex-col items-center justify-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            isToday ? 'bg-primary text-white' : 'bg-background text-muted-foreground'
                          }`}>
                            {date.getDate()}
                          </div>
                          {hasEvent && (
                            <div className="w-1.5 h-1.5 rounded-full mt-1 bg-primary" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>Exame</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span>Consulta</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span>Vacina</span>
                    </div>
                  </div>
                </div>

                {/* Adicionar lembrete */}
                <Button variant="success" className="w-full h-12" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowReminderForm((visible) => !visible)}>
                  + Adicionar lembrete
                </Button>
                {showReminderForm && (
                  <form
                    className="space-y-3 rounded-xl border p-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (!reminderTitle.trim() || !reminderDate) return;
                      createReminder(reminderTitle.trim(), reminderType, new Date(reminderDate).toISOString(), reminderDetails.trim());
                      setReminderTitle("");
                      setReminderDate("");
                      setReminderDetails("");
                      setShowReminderForm(false);
                    }}
                  >
                    <label className="block text-sm font-medium" htmlFor="reminder-title">Nome</label>
                    <input id="reminder-title" required value={reminderTitle} onChange={(event) => setReminderTitle(event.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    <label className="block text-sm font-medium" htmlFor="reminder-type">Tipo</label>
                    <select id="reminder-type" value={reminderType} onChange={(event) => setReminderType(event.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                      <option value="EXAM">Exame</option><option value="VACCINE">Vacina</option><option value="MEDICATION">Medicamento</option><option value="CONSULTATION">Consulta</option>
                    </select>
                    <label className="block text-sm font-medium" htmlFor="reminder-date">Data e hora</label>
                    <input id="reminder-date" required type="datetime-local" value={reminderDate} onChange={(event) => setReminderDate(event.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    <label className="block text-sm font-medium" htmlFor="reminder-details">Observações (opcional)</label>
                    <input id="reminder-details" value={reminderDetails} onChange={(event) => setReminderDetails(event.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
                    <Button type="submit" variant="success" className="w-full">Salvar lembrete neste navegador</Button>
                  </form>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cofre" className="mt-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <CardContent>
                    <h4 className="font-bold text-foreground mb-4">Documentos de saúde</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: "Exames", icon: <Microscope className="w-5 h-5" /> },
                        { title: "Receitas", icon: <Stethoscope className="w-5 h-5" /> },
                        { title: "Vacinação", icon: <Syringe className="w-5 h-5" /> },
                      ].map((doc) => (
                        <button
                          key={doc.title}
                          type="button"
                          aria-pressed={documentCategory === doc.title}
                          onClick={() => setDocumentCategory(doc.title)}
                          className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Card className={`p-3 transition-colors ${documentCategory === doc.title ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-semibold text-foreground text-sm">{doc.title}</h5>
                                <p className="text-xs text-muted-foreground">{documents.filter((document) => document.category === doc.title).length} selecionado(s)</p>
                              </div>
                              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
                                {doc.icon}
                              </div>
                            </div>
                          </Card>
                        </button>
                      ))}
                    </div>
                    <label htmlFor="demo-document" className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                      Escolher arquivo de {documentCategory.toLowerCase()}
                    </label>
                    <input
                      id="demo-document"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) setDocuments((current) => [...current, { name: file.name, category: documentCategory }]);
                        event.target.value = "";
                      }}
                    />
                    {documents.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm" aria-live="polite">
                        {documents.map((document, index) => <li key={`${document.name}-${index}`}>{document.name} — {document.category} (selecionado neste dispositivo)</li>)}
                      </ul>
                    )}
                    <p className="mt-4 text-xs text-muted-foreground">
                      Protótipo: o arquivo não é enviado nem salvo. Não selecione documentos reais de saúde.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="consultas" className="mt-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <CardContent>
                    <h4 className="font-bold text-foreground mb-4">Teleconsulta</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Agende uma consulta online com um médico parceiro.
                    </p>
                    <Button
                      variant="success"
                      className="w-full"
                      leftIcon={<Video className="w-4 h-4" />}
                      onClick={() => {
                        createReminder("Solicitar teleconsulta", "CONSULTATION", new Date(Date.now() + 86400000).toISOString(), "Lembrete de demonstração; agendamento não enviado a um prestador.");
                        setActiveTab("agenda");
                      }}
                    >
                      Criar lembrete de teleconsulta
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Próximos lembretes */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-foreground">Próximos lembretes</h2>
            <span className="text-xs text-muted-foreground">{reminders.filter((reminder) => !reminder.done).length} pendentes</span>
          </div>
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className="p-4">
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reminder.done ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary'}`}>
                      {reminder.done ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" className="text-[10px]">{REMINDER_TYPE_LABELS[reminder.type] ?? "Lembrete"}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDateTime(reminder.scheduledAt)}</span>
                      </div>
                      <h4 className="font-semibold text-foreground">{reminder.title}</h4>
                      <p className="text-xs text-muted-foreground">{reminder.details}</p>
                    </div>
                    {reminder.done ? (
                      <Badge variant="success" className="text-[10px]">Feito</Badge>
                    ) : (
                      <Button variant="outline" size="sm" className="h-8 w-full px-3 sm:w-auto" onClick={() => completeReminder(reminder.id)}>
                        Marcar como feito
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {reminders.length === 0 && (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                Seus lembretes locais aparecerão aqui. Nenhum dado foi enviado a um serviço externo.
              </p>
            )}
          </div>
        </div>
      </section>

      <HealthDisclaimerFooter />
    </div>
  );
}
