"use client";

import { useState } from "react";
import { Shield, Heart, Calendar, Droplets, Activity, Moon, Sun, Clock, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Doughnut } from "recharts";

const PHASES = [
  { name: "Menstrual", color: "#EF4444", percent: 25 },
  { name: "Folicular", color: "#3B82F6", percent: 25 },
  { name: "Ovulação", color: "#10B981", percent: 25 },
  { name: "Lútea", color: "#F59E0B", percent: 25 },
];

export default function SaudeFemininaPage() {
  const [activeTab, setActiveTab] = useState("fases");

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
                  <h4 className="font-bold text-feminine text-sm">Seus dados estão protegidos</h4>
                  <p className="text-xs text-feminine/80">
                    Dados de ciclo menstrual são sensíveis, opcionais e criptografados. Você pode apagá-los a qualquer momento.
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
            <Venus className="w-5 h-5 text-feminine" />
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
                  <Badge variant="feminine">Alto</Badge>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-feminine" style={{ width: "75%" }} />
                  </div>
                  <span className="text-sm font-bold text-foreground">75%</span>
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
                  <Badge variant="primary" className="text-[10px]">12 dias</Badge>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold text-foreground">15/06/2026</p>
                  <p className="text-xs text-muted-foreground">em 12 dias</p>
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
                      i === 0 ? 'bg-feminine text-white' : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      {i === 0 ? '●' : day[0]}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>
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
                    <p className="text-sm text-muted-foreground">Fase atual: Folicular • Dia 14 de 28</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-48 h-48 mx-auto md:mx-0">
                    <Doughnut
                      data={PHASES}
                      dataKey="percent"
                      nameKey="name"
                      cx={120}
                      cy={120}
                      innerRadius={80}
                      outerRadius={100}
                      stroke="#888"
                      strokeWidth={2}
                    >
                      {PHASES.map((phase, index) => (
                        <key key={index}>
                          <defs>
                            <linearGradient id={`color${index}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={phase.color} />
                              <stop offset="100%" stopColor={phase.color} />
                            </linearGradient>
                          </defs>
                        </key>
                      ))}
                    </Doughnut>
                  </div>
                  <div className="flex-1 space-y-4">
                    {PHASES.map((phase) => (
                      <div key={phase.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: phase.color }} />
                        <span className="text-sm text-foreground">{phase.name}</span>
                        <span className="ml-auto text-sm text-muted-foreground">{phase.percent}%</span>
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
              <h4 className="font-bold text-foreground mb-4">Calendário mensal</h4>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
                  <div key={day} className="text-center text-[10px] font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day) => {
                  const isPeriod = day >= 1 && day <= 5;
                  const isFertile = day >= 11 && day <= 16;
                  const isOvulation = day === 14;
                  return (
                    <div key={day} className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer text-xs transition-all hover:scale-105">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPeriod ? 'bg-feminine text-white' : isFertile ? 'bg-success/20 text-success' : isOvulation ? 'bg-warning/20 text-warning' : 'bg-background text-muted-foreground'
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
                    <p className="text-sm text-muted-foreground mb-4">
                      Explicação simples sobre o que acontece nesta fase do ciclo menstrual.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">No corpo</p>
                        <p className="text-xs text-foreground">Mudanças hormonais típicas desta fase.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Alimentação</p>
                        <p className="text-xs text-foreground">Alimentos recomendados para esta fase.</p>
                      </div>
                    </div>
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
                      <button key={emoji} className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Sintomas físicos</p>
                  <div className="flex gap-2">
                    {["Cólica", "Dor de cabeça", "Inchaço", "Fadiga"].map((symptom) => (
                      <button key={symptom} className="px-3 py-1.5 rounded-full border border-border text-xs text-sm hover:bg-muted transition-colors">
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Intensidade do fluxo</p>
                  <div className="flex gap-2">
                    {["Leve", "Moderado", "Intenso"].map((flow) => (
                      <button key={flow} className="px-3 py-1.5 rounded-full border border-border text-xs text-sm hover:bg-muted transition-colors">
                        {flow}
                      </button>
                    ))}
                  </div>
                </div>
                <Button variant="feminine" className="w-full mt-4">
                  Salvar meu cofre de saúde
                </Button>
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

function Venus({ className }: { className?: string }) {
  return <venus className={className} />;
}

function HealthDisclaimerFooterFeminina() {
  return (
    <footer className="border-t border-border bg-background py-6 px-4 mt-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
          <div className="w-5 h-5 text-warning shrink-0 mt-0.5">⚠</div>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Aviso importante</p>
            <p>O conteúdo deste app é educativo e não substitui consulta médica. Em caso de emergência, ligue para <a href="tel:192" className="font-semibold text-success hover:underline">SAMU 192</a> ou procure a <a href="#" className="font-semibold text-success hover:underline">UPA</a> mais próxima.</p>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>Os valores e parceiros apresentados são ilustrativos. Consulte os termos do seu plano.</p>
        </div>
      </div>
    </footer>
  );
}