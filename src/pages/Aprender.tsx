"use client";

import { useState } from "react";
import { BookOpen, Shield, ArrowRight, Play, User, Heart as HeartIcon, Brain, Activity, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { usePrototypeStore } from "@/store/prototypeStore";

const TRAILS = [
  {
    id: 1,
    title: "Prevenção de acidentes de trabalho",
    category: "Entregadores e Autônomos",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-primary/10 text-primary",
    description: "Prevenção prática para reduzir riscos durante a rotina de trabalho.",
    time: "10 min",
    action: "Continuar",
  },
  {
    id: 2,
    title: "Saúde da mulher e autocuidado",
    category: "Saúde Feminina",
    icon: <User className="w-5 h-5" />,
    color: "bg-feminine/10 text-feminine",
    description: "Conheça cuidados preventivos e sinais que merecem avaliação profissional.",
    time: "10 min",
  },
  {
    id: 3,
    title: "Saúde do homem e prevenção",
    category: "Saúde Masculina",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-primary/10 text-primary",
    description: "Informações gerais de prevenção e autocuidado ao longo da vida.",
    time: "10 min",
  },
  {
    id: 4,
    title: "Cuidados com idosos e longevidade",
    category: "Família",
    icon: <HeartIcon className="w-5 h-5" />,
    color: "bg-success/10 text-success",
    description: "Orientações para apoiar o bem-estar e a autonomia de quem envelhece.",
    time: "10 min",
  },
  {
    id: 5,
    title: "Saúde mental e estresse",
    category: "Bem-estar",
    icon: <Brain className="w-5 h-5" />,
    color: "bg-accent text-accent-foreground",
    description: "Estratégias de bem-estar e caminhos para buscar apoio.",
    time: "10 min",
  },
  {
    id: 6,
    title: "Saúde no dia a dia acessível",
    category: "Dia a Dia",
    icon: <Activity className="w-5 h-5" />,
    color: "bg-warning/10 text-warning",
    description: "Hábitos de saúde possíveis para incluir na rotina.",
    time: "10 min",
  },
  {
    id: 7,
    title: "Entenda seu seguro sem mistério",
    category: "Seguros",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-primary/10 text-primary",
    description: "Entenda termos e conceitos comuns antes de avaliar um seguro.",
    time: "10 min",
  },
];

const GLOSSARY = [
  { term: "Carência", def: "Período de espera após a contratação antes de poder usar alguns benefícios do seguro." },
  { term: "Sinistro", def: "Evento coberto pelo seguro que dá direito a acionar o benefício, como acidente ou doença." },
  { term: "Franquia", def: "Valor que o cliente paga antes do seguro começar a cobrir os custos." },
  { term: "DIT", def: "Diária por Incapacidade Temporária - pagamento diário enquanto você não pode trabalhar por acidente ou doença." },
  { term: "Prêmio", def: "Valor mensal que você paga pelo seu plano de seguro." },
];

export default function AprenderPage() {
  const [activeTab, setActiveTab] = useState("todos");
  const { points, completedLessons, completeLesson, quizAnswered, quizCorrect, answerQuiz } = usePrototypeStore();
  const visibleTrails = activeTab === "todos"
    ? TRAILS
    : TRAILS.filter((trail) => trail.category.toLowerCase() === activeTab);

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Aprender</h1>
          </div>
          <p className="text-muted-foreground">
            Educação preventiva simples e gratuita para o seu dia a dia.
          </p>
        </div>
      </section>

      {/* Painel de nível */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-foreground">Seu nível</h3>
                    <p className="text-sm text-muted-foreground">{points} pts acumulados - Nível {points >= 1500 ? "Ouro" : points >= 500 ? "Prata" : "Bronze"}</p>
                  </div>
                  <Badge variant="success">{points >= 1500 ? "Ouro" : points >= 500 ? "Prata" : "Bronze"}</Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Bronze (0-499 pts)</span>
                  <span>Prata (500-1499 pts)</span>
                </div>
                <Progress value={points < 500 ? (points / 500) * 100 : points < 1500 ? ((points - 500) / 1000) * 100 : 100} className="h-3 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground">Próximo benefício</p>
                    <p className="text-sm font-semibold text-foreground">{points < 500 ? "Desconto em farmácias (nível Prata)" : "Benefícios do nível atual"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground">Pontos até o próximo nível</p>
                    <p className="text-sm font-semibold text-foreground">{Math.max((points < 500 ? 500 : points < 1500 ? 1500 : points) - points, 0)}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm" leftIcon={<Play className="w-4 h-4" />}>
                  Continuar lição
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Limite diário */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold text-foreground">Aprendizado consciente</h4>
                  <p className="text-sm text-muted-foreground">Atividades concluídas no protótipo</p>
                </div>
                <span className="text-sm font-bold text-primary">{completedLessons.length} lições</span>
              </div>
              <Progress value={Math.min(completedLessons.length * 20, 100)} className="h-2" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Filtro de temas */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Todos", "Entregadores e Autônomos", "Saúde Feminina", "Saúde Masculina", "Família", "Bem-estar", "Dia a Dia", "Seguros"].map((theme) => (
              <button key={theme} onClick={() => setActiveTab(theme.toLowerCase())} aria-pressed={activeTab === theme.toLowerCase()} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeTab === theme.toLowerCase() ? "bg-primary text-primary-foreground" : ""}`}>
                {theme}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lição em destaque */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Badge variant="mint" className="mb-2">Lição em destaque</Badge>
                    <h3 className="font-bold text-foreground text-lg">Como se proteger contra quedas e lesões no trabalho</h3>
                    <p className="text-sm text-muted-foreground mt-2">7 min de leitura • 10 pts • R$ 0,20 cashback</p>
                  </div>
                  <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="w-10 h-10" />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    "1. Ajuste a mochila: distribua o peso e confira se as alças e os fechos estão em boas condições.",
                    "2. Ao erguer volumes, aproxime a carga do corpo e evite movimentos bruscos.",
                    "3. Use calçado confortável e adequado às condições do local de trabalho.",
                    "4. Faça pausas quando possível e alterne tarefas repetitivas.",
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="success"
                  className="w-full mt-6"
                  leftIcon={<ArrowRight className="w-4 h-4" />}
                  disabled={completedLessons.includes("Como se proteger contra quedas e lesões no trabalho")}
                  onClick={() => completeLesson("Como se proteger contra quedas e lesões no trabalho")}
                >
                  {completedLessons.includes("Como se proteger contra quedas e lesões no trabalho") ? "Lição concluída" : "Concluir lição (+10 pts)"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quiz rápido */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-foreground">Quiz rápido</h4>
                  <Badge variant="success">{quizAnswered ? "Respondido" : "+10 pts"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  O que significa "carência" em um seguro?
                </p>
                <div className="space-y-2">
                  {[
                    "Período de espera antes de usar benefícios",
                    "Valor pago mensalmente pelo plano",
                    "Documento que formaliza o contrato",
                  ].map((opt, i) => (
                    <button key={i} disabled={quizAnswered} onClick={() => {
                      const correct = i === 0;
                      answerQuiz(correct);
                    }} className="w-full text-left px-4 py-3 rounded-xl border border-border text-sm hover:bg-muted transition-colors disabled:opacity-70">
                      {opt}
                    </button>
                  ))}
                </div>
                {quizCorrect !== null && <p role="status" className="mt-3 text-sm">{quizCorrect ? "Correto! Os pontos foram salvos neste navegador." : "A resposta correta é o período de espera antes de usar alguns benefícios."}</p>}
                {quizAnswered && quizCorrect === null && <p role="status" className="mt-3 text-sm">Quiz já respondido antes desta atualização. A resposta correta é o período de espera antes de usar alguns benefícios.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trilhas */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">Trilhas de Aprendizado</h2>
          <div className="space-y-4">
            {visibleTrails.map((trail) => {
              const isCompleted = completedLessons.includes(trail.title);
              return (
              <Card key={trail.id} className="p-4">
                <CardContent>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trail.color}`}>
                        {trail.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{trail.title}</h4>
                        <p className="text-xs text-muted-foreground">{trail.category}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px]">100% Grátis</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-3 text-xs text-muted-foreground">
                    <span>{isCompleted ? "Atividade concluída" : "Disponível"}</span>
                    <span>{trail.time}</span>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">{trail.description}</p>
                  <Button
                    variant="success"
                    className="w-full"
                    size="sm"
                    disabled={isCompleted}
                    onClick={() => completeLesson(trail.title)}
                  >
                    {isCompleted ? "Concluída (+10 pts)" : "Concluir atividade (+10 pts)"}
                  </Button>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Glossário */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-6">Tradutor de Seguros</h2>
          <Accordion type="single" collapsible>
            {GLOSSARY.map((item) => (
              <AccordionItem key={item.term} value={item.term}>
                <AccordionTrigger>{item.term}</AccordionTrigger>
                <AccordionContent>{item.def}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <HealthDisclaimerFooter />
    </div>
  );
}

function HealthDisclaimerFooter() {
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
      </div>
    </footer>
  );
}