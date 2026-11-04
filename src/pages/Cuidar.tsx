"use client";

import { useState } from "react";
import { Calendar, Folder, Video, Plus, CheckCircle, Clock, Microscope, Syringe, Stethoscope, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";

const DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

export default function CuidarPage() {
  const [activeTab, setActiveTab] = useState("agenda");

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
                  <p className="text-sm text-muted-foreground">6 dias seguidos cuidando de você!</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="success">+5 pts hoje</Badge>
                  <span className="text-2xl font-bold text-primary">6 dias</span>
                </div>
              </div>
              <div className="flex gap-2">
                {DAYS.map((day, i) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center {i === 5 ? 'bg-success text-success-foreground' : 'bg-muted/50 text-muted-foreground'}">
                      <span className="text-xs font-semibold">{i === 5 ? '✓' : day}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{i === 6 ? 'Hoje' : ''}</span>
                  </div>
                ))}
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
                <Card className="border-l-4 border-warning bg-warning/5">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center text-warning">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Sugestão preventiva inteligente</h4>
                        <p className="text-sm text-muted-foreground">
                          Vacina da gripe anual (Influenza). Proteja seus dias de trabalho. Postos de saúde com doses disponíveis.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="success" size="sm">Aceitar</Button>
                      <Button variant="outline" size="sm">Ajustar</Button>
                      <Button variant="ghost" size="sm">Ignorar</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Calendário */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-bold text-foreground">Maio, 2026</h4>
                      <p className="text-xs text-muted-foreground">Semana 4</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">‹</Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">›</Button>
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
                    {[21, 22, 23, 24, 25, 26, 27].map((day) => {
                      const isToday = day === 23;
                      const hasEvent = day === 21 || day === 23 || day === 26;
                      return (
                        <div key={day} className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            isToday ? 'bg-primary text-white' : 'bg-background text-muted-foreground'
                          }`}>
                            {day}
                          </div>
                          {hasEvent && (
                            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                              day === 21 ? 'bg-primary' : day === 23 ? 'bg-success' : 'bg-warning'
                            }`} />
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
                <Button variant="success" className="w-full h-12" leftIcon={<Plus className="w-4 h-4" />}>
                  + Adicionar lembrete
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="cofre" className="mt-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <CardContent>
                    <h4 className="font-bold text-foreground mb-4">Documentos de saúde</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: "Exames", icon: <Microscope className="w-5 h-5" />, count: 3 },
                        { title: "Receitas", icon: <Stethoscope className="w-5 h-5" />, count: 2 },
                        { title: "Vacinação", icon: <Syringe className="w-5 h-5" />, count: 1 },
                      ].map((doc) => (
                        <Card key={doc.title} className="p-3 cursor-pointer hover:bg-muted transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold text-foreground text-sm">{doc.title}</h5>
                              <p className="text-xs text-muted-foreground">{doc.count} documento{(doc.count > 1 ? 's' : '')}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
                              {doc.icon}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Fazer upload de documento
                    </Button>
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
                    <Button variant="success" className="w-full" leftIcon={<Video className="w-4 h-4" />}>
                      Agendar teleconsulta
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
            <span className="text-xs text-muted-foreground">2 para hoje</span>
          </div>
          <div className="space-y-3">
            {[
              {
                title: "Teleconsulta com Dr. Marcos",
                type: "Consulta Online",
                time: "Hoje • 14:30",
                location: "Clínica Médica Geral • Avaliação de rotina",
                done: true,
              },
              {
                title: "Hemograma Completo + Glicemia",
                type: "Exame",
                time: "Amanhã • 08:00",
                location: "Laboratório Popular Saúde Vida (Parceiro ilustrativo) • Em jejum de 8h",
                done: false,
              },
            ].map((reminder) => (
              <Card key={reminder.title} className="p-4">
                <CardContent>
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reminder.done ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary'}`}>
                      {reminder.done ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="primary" className="text-[10px]">{reminder.type}</Badge>
                        <span className="text-xs text-muted-foreground">{reminder.time}</span>
                      </div>
                      <h4 className="font-semibold text-foreground">{reminder.title}</h4>
                      <p className="text-xs text-muted-foreground">{reminder.location}</p>
                    </div>
                    {reminder.done ? (
                      <Badge variant="success" className="text-[10px]">Feito</Badge>
                    ) : (
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        Marcar como feito
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <HealthDisclaimerFooter />
    </div>
  );
}

function Heart({ className }: { className?: string }) {
  return <heart className={className} />;
}