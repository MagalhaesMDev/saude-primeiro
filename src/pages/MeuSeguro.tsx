import { useState } from "react";
import {
  ArrowRight, Check, Clock3, Handshake, Heart, HeartHandshake, Hospital, ReceiptText, Shield,
  ShieldAlert, Umbrella, UserRound, Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";
import { formatCurrency } from "@/lib/utils";
import { usePrototypeStore } from "@/store/prototypeStore";

const PLANS = [
  {
    name: "Essencial", price: 14.9, label: "Básico",
    icon: Heart,
    description: "Uma referência para comparar benefícios preventivos.",
    features: ["Telemedicina (descrição ilustrativa)", "Descontos em farmácias (ilustrativos)", "Acidentes pessoais (consulte condições)", "Diária por internação (consulte condições)"],
  },
  {
    name: "Proteção", price: 24.9, label: "Destaque do protótipo", popular: true,
    icon: Shield,
    description: "Mais itens para comparar em uma simulação local.",
    features: ["Itens do Essencial", "Incapacidade temporária (consulte condições)", "Auxílio funeral (consulte condições)", "Valores e limites dependem de contrato real"],
  },
  {
    name: "Renda", price: 39.9, label: "Completo",
    icon: Handshake,
    description: "Uma opção ilustrativa com foco em proteção financeira.",
    features: ["Itens do Proteção", "Proteção financeira da renda (ilustrativa)", "Compare exclusões, limites e carências", "Nenhuma apólice é emitida neste protótipo"],
  },
];

const COVERAGES = [
  { title: "Acidentes pessoais", icon: ShieldAlert, text: "Exemplo: confira no contrato quais acidentes, limites e documentos seriam considerados." },
  { title: "Diária por internação", icon: Hospital, text: "Exemplo: verifique número máximo de diárias, carência e critérios de internação." },
  { title: "Incapacidade temporária", icon: Clock3, text: "Exemplo: entenda como a apólice define afastamento, comprovação e período de cobertura." },
  { title: "Auxílio funeral", icon: HeartHandshake, text: "Exemplo: confirme serviços, limites e quem pode ser incluído antes de contratar." },
];

export default function MeuSeguroPage() {
  const { selectedPlan, selectPlan, claims, requestBenefit } = usePrototypeStore();
  const [benefitDescription, setBenefitDescription] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const submitRequest = () => {
    if (!benefitDescription.trim()) return;
    requestBenefit(benefitDescription.trim());
    setBenefitDescription("");
    setRequestMessage("Solicitação de demonstração registrada apenas neste navegador; nada foi enviado à seguradora.");
  };

  return (
    <main className="min-h-screen bg-background pb-28 pt-16">
      <section className="px-4 pb-5 pt-7">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /><h1 className="text-2xl font-bold">Meu Seguro</h1></div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Compare conceitos de cobertura e conheça as opções demonstrativas.</p>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
          <Shield className="h-5 w-5 shrink-0" /><span><strong>Valores, coberturas e selos ilustrativos.</strong> Este protótipo não vende seguro nem confirma elegibilidade.</span>
        </div>
      </section>

      <section className="px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-lg font-bold">Escolha um plano para comparar</h2>
          <div className="grid items-stretch gap-4 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <Card key={plan.name} className={`relative overflow-hidden ${plan.popular ? "border-2 border-primary shadow-md lg:-translate-y-1" : ""}`}>
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${plan.popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}><plan.icon className="h-6 w-6" aria-hidden="true" /></span>
                    <Badge variant={plan.popular ? "success" : "secondary"}>{plan.label}</Badge>
                  </div>
                  <h3 className="text-xl font-bold">Plano {plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-3"><p className="whitespace-nowrap text-2xl font-bold">{formatCurrency(plan.price)}</p><p className="text-xs text-muted-foreground">/mês (simulado)</p></div>
                  <ul className="flex-1 space-y-2 border-t py-4">
                    {plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" /><span>{feature}</span></li>)}
                  </ul>
                  <Button variant="success" className="w-full" onClick={() => selectPlan(plan.name, plan.price)}>
                    {selectedPlan?.name === plan.name ? `${plan.name} selecionado para comparação` : `Selecionar ${plan.name} para comparar`}
                  </Button>
                  {selectedPlan?.name === plan.name && <p role="status" className="mt-2 text-center text-xs text-muted-foreground">Seleção local; nenhuma contratação foi realizada.</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-lg font-bold">Por que confiar no Saúde Primeiro?</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "Entenda as condições", text: "Confira fidelidade, carências e exclusões no contrato oficial.", icon: Shield },
              { title: "Compare pagamentos", text: "Verifique opções, valores e regras diretamente com a seguradora.", icon: Wallet },
              { title: "Escolha com informação", text: "Avalie cobertura e atendimento antes de tomar uma decisão.", icon: UserRound },
            ].map(({ title, text, icon: Icon }) => <Card key={title}><CardContent className="p-4"><span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></CardContent></Card>)}
          </div>
          <Card className="mt-4 border-primary/15 bg-primary/5"><CardContent className="p-5">
            <h3 className="font-bold">Avaliações</h3>
            <p className="mt-1 text-sm text-muted-foreground">Ainda não há avaliações reais. Esta demonstração não possui clientes ou dados de satisfação.</p>
          </CardContent></Card>
        </div>
      </section>

      <section id="acionar-beneficio" className="px-4 py-5">
        <Card className="mx-auto max-w-6xl border-success/20">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold">Precisa de apoio imediato?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Experimente o formulário local de acionamento demonstrativo. Ele não abre um sinistro real.</p>
            <label htmlFor="benefit-description" className="mb-2 mt-4 block text-sm font-medium">Descreva o benefício que deseja solicitar</label>
            <textarea id="benefit-description" value={benefitDescription} onChange={(event) => setBenefitDescription(event.target.value)} className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" placeholder="Ex.: exemplo para diária por internação" />
            <Button variant="success" className="mt-3 w-full" disabled={!benefitDescription.trim()} onClick={submitRequest}>Simular acionamento</Button>
            {requestMessage && <p role="status" className="mt-3 rounded-lg bg-success/10 p-3 text-sm text-success">{requestMessage}</p>}
            {claims.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Solicitações demonstrativas guardadas localmente: {claims.length}.</p>}
            <p className="mt-3 text-center text-xs text-muted-foreground">Não envie dados pessoais ou documentos. Nenhum pedido é transmitido.</p>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-5">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-lg font-bold">Passo a passo simples (3 etapas)</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "Descreva o que houve", text: "Registre informações solicitadas pelos canais oficiais." },
              { title: "Anexe fotos e recibos", text: "Envie documentos somente pela plataforma oficial da seguradora." },
              { title: "Acompanhe o pedido", text: "Consulte o andamento e prazos nos canais oficiais." },
            ].map((step, index) => <Card key={step.title}><CardContent className="p-4"><span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span><h3 className="font-semibold">{step.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{step.text}</p></CardContent></Card>)}
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={() => document.getElementById("benefit-description")?.focus()}>Iniciar acionamento (teste) <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </section>

      <section className="px-4 py-5">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-lg font-bold">O que cada cobertura significa no seu dia a dia</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {COVERAGES.map(({ title, text, icon: Icon }) => <Card key={title}><CardContent className="flex gap-3 p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div></CardContent></Card>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-5">
        <Card className="mx-auto max-w-6xl"><CardContent className="p-5">
          <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-bold">Meu histórico</h2><Badge variant="secondary">Índice de Proteção Inclusiva*</Badge></div>
          <p className="mb-4 mt-1 text-xs text-muted-foreground">Linha do tempo meramente ilustrativa; não há apólice nem cálculo individual.</p>
          <ol className="relative ml-2 space-y-4 border-l-2 border-primary/20 pl-5">
            {[["1 mês", "Conheça os conceitos de coberturas e carências."], ["3 meses", "Revise suas prioridades e compare opções oficiais."], ["12 meses", "Reavalie se os benefícios continuam adequados." ]].map(([time, text]) => <li key={time} className="relative"><span className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-primary" /><p className="text-sm font-semibold">{time}</p><p className="text-xs text-muted-foreground">{text}</p></li>)}
          </ol>
        </CardContent></Card>
      </section>

      <section className="px-4 py-5">
        <div className="mx-auto max-w-6xl"><h2 className="mb-4 text-lg font-bold">Benefícios futuros</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card><CardContent className="flex items-start gap-3 p-4"><ReceiptText className="h-6 w-6 text-success" /><div><div className="flex items-center gap-2"><h3 className="font-semibold">Cashback preventivo</h3><Badge variant="mint">Em breve</Badge></div><p className="mt-1 text-xs text-muted-foreground">Ideia demonstrativa de incentivo a atividades educativas; sem valor em dinheiro.</p></div></CardContent></Card>
            <Card><CardContent className="flex items-start gap-3 p-4"><Umbrella className="h-6 w-6 text-primary" /><div><div className="flex items-center gap-2"><h3 className="font-semibold">Proteção de longo prazo</h3><Badge variant="secondary">Conceito em estudo</Badge></div><p className="mt-1 text-xs text-muted-foreground">Não existe seguro vitalício garantido ou cobertura ativa neste protótipo.</p></div></CardContent></Card>
          </div>
        </div>
      </section>
      <HealthDisclaimerFooter />
    </main>
  );
}
