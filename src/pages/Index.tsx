"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Clock, Shield, Heart, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function IndexPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: "who",
      question: "Quem você quer proteger?",
      options: [
        { label: "Apenas eu", value: "eu" },
        { label: "Eu e família", value: "familia" },
      ],
    },
    {
      id: "concern",
      question: "Qual é a sua principal preocupação?",
      options: [
        { label: "Telemedicina e farmácia barata", value: "telemedicina" },
        { label: "Diária por internação ou acidente", value: "internacao" },
        { label: "Proteção financeira da renda", value: "renda" },
      ],
    },
    {
      id: "budget",
      question: "Qual é o seu orçamento mensal?",
      options: [
        { label: "Até R$ 20", value: "20" },
        { label: "Até R$ 30", value: "30" },
        { label: "Acima de R$ 30", value: "30plus" },
      ],
    },
  ];

  const recommendedPlan = {
    name: "Plano Essencial",
    price: 14.90,
    badge: "Melhor custo-benefício",
    description: "Cobertura básica com telemedicina 24h e descontos em farmácias",
  };

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [questions[step].id]: value });
    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      {/* Hero Section */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success font-medium text-sm mb-6">
            <CheckCircle className="w-4 h-4" />
            Para você e sua família
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Proteção que cabe no seu bolso
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Cuidados médicos preventivos rápidos no celular e amparo financeiro
            justo para você que é quem mais ama trabalhar sem sobressaltos.
          </p>
          <Button variant="success" size="lg" className="w-full md:w-auto">
            Ver planos <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Simulador */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Simulador em 30 segundos
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Responda 3 perguntas rápidas e veja o plano sob medida com justo
              preço.
            </p>

            {step < questions.length ? (
              <>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    {questions[step].question}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {questions[step].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={cn(
                          "px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                          answers[questions[step].id] === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Pergunta {step + 1} de {questions.length}</span>
                  <div className="w-1/3 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-8">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Plano recomendado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Com base nas suas respostas, este plano é ideal para você.
                  </p>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-success/5 border border-success/20 mb-6">
                    <div>
                      <h4 className="font-bold text-foreground">{recommendedPlan.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {recommendedPlan.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground">
                        {formatCurrency(recommendedPlan.price)}/mês
                      </span>
                      <Badge variant="success" className="mt-2">
                        {recommendedPlan.badge}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button variant="success" className="w-full">
                      Contratar este plano
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleReset}>
                      Ver alternativa
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Atalhos */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">
            O que você quer fazer hoje?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Consultar um médico", icon: <Heart className="w-5 h-5" />, color: "bg-primary/10 text-primary" },
              { label: "Aprender a me prevenir", icon: <Rocket className="w-5 h-5" />, color: "bg-success/10 text-success" },
              { label: "Entender meu seguro", icon: <Shield className="w-5 h-5" />, color: "bg-muted text-foreground" },
            ].map((item) => (
              <Card key={item.label} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 {item.color}">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{item.label}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Progresso de nível */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-foreground">Seu progresso</h3>
                  <p className="text-sm text-muted-foreground">280 pts acumulados - Nível Bronze</p>
                </div>
                <Badge variant="success">+10 pts hoje</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Bronze</span>
                <span>Prata</span>
              </div>
              <Progress value={56} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Faltam 120 pts para Prata</span>
                <span>Benefício: 20% de desconto em farmácias</span>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                Continuar lição
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cashback */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <CardHeader className="flex flex-col items-center text-center">
              <h3 className="font-bold text-foreground">Meu cashback</h3>
              <p className="text-sm text-muted-foreground">Ganhe cashback aprendendo</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-4xl font-bold text-foreground">R$ 5,00</span>
                <Badge variant="mint">Resgatável</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                R$ 1 a cada 50 pts acumulados
              </p>
              <Button variant="success" className="w-full">
                Resgatar
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lembretes */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Próximos lembretes de saúde
          </h2>
          <div className="space-y-3">
            {[
              { title: "Vacina da gripe (Anual)", time: "15 de Maio de 2026, 14:00", type: "Prevenção" },
              { title: "Check-up de pressão arterial", time: "22 de Maio de 2026, 08:00", type: "Exame" },
            ].map((reminder) => (
              <Card key={reminder.title} className="p-4">
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">{reminder.title}</h4>
                      <p className="text-xs text-muted-foreground">{reminder.time}</p>
                    </div>
                    <Badge variant="primary" className="text-[10px]">{reminder.type}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-auto">
                    Marcar como feito
                  </Button>
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