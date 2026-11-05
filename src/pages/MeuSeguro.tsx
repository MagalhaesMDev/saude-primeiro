"use client";

import { Shield, Star, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { usePrototypeStore } from "@/store/prototypeStore";
import { useState } from "react";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";

export default function MeuSeguroPage() {
  const { selectedPlan, selectPlan, claims, requestBenefit } = usePrototypeStore();
  const [benefitDescription, setBenefitDescription] = useState("");
  const plans = [
    {
      name: "Essencial",
      price: 14.90,
      type: "Básico",
      description: "Cobertura básica para você e sua família",
      features: ["Telemedicina 24h", "Descontos em farmácias", "Consulta online", "Acidentes pessoais", "Diária por internação"],
      badge: "Básico",
      popular: false,
    },
    {
      name: "Proteção",
      price: 24.90,
      type: "Intermediário",
      description: "Cobertura completa com mais benefícios",
      features: ["Telemedicina 24h", "Descontos em farmácias", "Consulta online", "Diária por internação", "Incapacidade temporária", "Auxílio funeral"],
      badge: "Intermediário",
      popular: true,
    },
    {
      name: "Renda",
      price: 39.90,
      type: "Completo",
      description: "Proteção completa com garantia de renda",
      features: ["Telemedicina 24h", "Descontos em farmácias", "Consulta online", "Diária por internação", "Incapacidade temporária", "Auxílio funeral", "Proteção financeira da renda"],
      badge: "Completo",
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

      <section className="px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-warning/30 bg-warning/5 p-4">
            <CardContent className="p-0 text-sm text-muted-foreground">
              <strong className="text-foreground">Demonstração:</strong> valores e coberturas são ilustrativos. Este protótipo não vende seguro, não confirma elegibilidade e não envia solicitações a uma seguradora.
            </CardContent>
          </Card>
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
                  <Button
                    variant="success"
                    className="w-full"
                    onClick={() => selectPlan(plan.name, plan.price)}
                  >
                    {selectedPlan?.name === plan.name ? "Plano selecionado" : "Escolher este plano"}
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
              { label: "Leia com clareza", desc: "Compare coberturas, exclusões, carências e limites" },
              { label: "Sem contratação no protótipo", desc: "Nenhuma cobrança ou apólice é gerada" },
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
                Registre uma solicitação demonstrativa neste dispositivo.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-3">
                <label htmlFor="benefit-description" className="text-sm font-medium">
                  Descreva o benefício que deseja solicitar
                </label>
                <textarea
                  id="benefit-description"
                  value={benefitDescription}
                  onChange={(event) => setBenefitDescription(event.target.value)}
                  className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Ex.: diária por internação"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  disabled={!benefitDescription.trim()}
                  onClick={() => {
                    requestBenefit(benefitDescription.trim());
                    setBenefitDescription("");
                  }}
                >
                  Acionar benefício
                </Button>
                {claims.length > 0 && (
                  <div aria-live="polite" className="rounded-md bg-muted p-3 text-sm">
                    Solicitações de demonstração: {claims.length}. Nenhum pedido foi enviado à seguradora.
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  Demonstração local: não envie documentos ou dados pessoais.
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
              { step: 1, title: "Compare as condições", desc: "Verifique limites, carências, exclusões e preço no contrato oficial" },
              { step: 2, title: "Confirme com a seguradora", desc: "Use os canais oficiais para validar cobertura e elegibilidade" },
              { step: 3, title: "Siga as orientações oficiais", desc: "Prazos e documentos dependem da apólice e da análise do pedido" },
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