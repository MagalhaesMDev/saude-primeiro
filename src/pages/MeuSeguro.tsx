"use client";

import { Shield, Star, Check, Clock, FileText, CreditCard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function MeuSeguroPage() {
  const plans = [
    {
      name: "Essencial",
      price: 14.90,
      type: "Básico",
      description: "Cobertura básica para você e sua família",
      features: ["Telemedicina 24h", "Descontos em farmácias", "Consulta online", "Acidentes pessoais", "Diária por internação"],
      badge: null,
      popular: false,
    },
    {
      name: "Proteção",
      price: 24.90,
      type: "Intermediário",
      description: "Cobertura completa com mais benefícios",
      features: ["Telemedicina 24h", "Descontos em farmácias", "Consulta online", "Diária por internação", "Incapacidade temporária", "Auxílio funeral"],
      badge: "Mais escolhido",
      popular: true,
    },
    {
      name: "Renda",
      price: 39.90,
      type: "Completo",
      description: "Proteção completa com garantia de renda",
      features: ["Telemedicina 24h", "Descontos em farmácias", "Consulta online", "Diária por internação", "Incapacidade temporária", "Auxílio funeral", "Proteção financeira da renda"],
      badge: "Completo & Renda",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      {/* Header da seção */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Meu Seguro</h1>
          </div>
          <p className="text-muted-foreground">
            Escolha o plano que melhor cabe no seu bolso e proteja quem você ama.
          </p>
        </div>
      </section>

      {/* Planos */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Escolha seu plano
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.name} className={cn(
                "relative p-6 hover:shadow-md transition-shadow",
                plan.popular ? "border-primary ring-2 ring-primary" : "border-border"
              )}>
                {plan.badge && (
                  <Badge variant="success" className="absolute -top-3 right-4 text-[10px]">
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">/mês</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="success" className="w-full">
                    Escolher este plano
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Por que confiar */}
      <section className="px-4 py-8 bg-muted/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Por que confiar no Saúde Primeiro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Transparência", desc: "Sem letras miúdas, linguagem simples" },
              { label: "Aprovado por usuários", desc: "4,9/5 de mais de 10.000 avaliações" },
              { label: "Pagamento fácil", desc: "Pix, cartão ou boleto" },
            ].map((item) => (
              <Card key={item.label} className="p-4 text-center">
                <CardContent>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 bg-primary/10 text-primary">
                    <Star className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-foreground">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Acionar benefício */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-lg">Precisa de apoio imediato?</CardTitle>
              <CardDescription>
                Acione seu benefício com autenticação simples e rápida.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full" leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Acionar benefício
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Você precisará autenticar com CPF e senha para prosseguir.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Passo a passo */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Como acionar seu seguro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Abra um chamado", desc: "Informe o ocorrido pelo app" },
              { step: 2, title: "Envie documentos", desc: "Fotos e laudos médicos" },
              { step: 3, title: "Receba o benefício", desc: "Pagamento em até 5 dias úteis" },
            ].map((item) => (
              <Card key={item.step} className="p-6 text-center">
                <CardContent>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary text-primary-foreground">
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
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

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}