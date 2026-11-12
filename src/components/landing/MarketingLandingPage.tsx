import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  HeartHandshake,
  HeartPulse,
  LockKeyhole,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: HeartPulse,
    title: "Cuide da saúde no seu ritmo",
    description: "Acesse conteúdos simples e organize lembretes de prevenção para a sua rotina.",
  },
  {
    icon: ShieldCheck,
    title: "Entenda antes de escolher",
    description: "Compare conceitos e opções ilustrativas com informações fáceis de acompanhar.",
  },
  {
    icon: HeartHandshake,
    title: "Pense também em quem está com você",
    description: "Explore recursos para conversar sobre cuidado e proteção com a família.",
  },
];

const steps = [
  { number: "01", title: "Conheça", description: "Veja como funcionam os recursos de saúde e proteção." },
  { number: "02", title: "Compare", description: "Explore exemplos demonstrativos sem compromisso." },
  { number: "03", title: "Decida com clareza", description: "Entenda os próximos passos antes de qualquer escolha." },
];

const principles = [
  {
    icon: MessageCircleHeart,
    title: "Linguagem que aproxima",
    description: "Informação direta, sem complicar o que já faz parte do seu dia.",
  },
  {
    icon: LockKeyhole,
    title: "Transparência sobre o protótipo",
    description: "Sem promessas de cobertura, contratação ou atendimento que ainda não existem.",
  },
  {
    icon: Sparkles,
    title: "Feito para a vida real",
    description: "Uma experiência pensada para quem trabalha por conta própria e tem uma rotina dinâmica.",
  },
];

const testimonials = [
  {
    quote: "Quero entender o que está incluso antes de escolher.",
    profile: "Profissional independente",
  },
  {
    quote: "Cuidar da saúde precisa caber na minha rotina.",
    profile: "Trabalhadora autônoma",
  },
  {
    quote: "É mais fácil decidir quando explicam sem enrolação.",
    profile: "Trabalhador por conta própria",
  },
];

const questions = [
  {
    question: "Este site oferece um plano de saúde ou seguro para contratar?",
    answer:
      "Ainda não. Esta é uma demonstração educativa: valores, opções e benefícios exibidos são ilustrativos. Nenhum botão gera proposta, contrato, cobrança ou cobertura.",
  },
  {
    question: "O que posso fazer nesta demonstração?",
    answer:
      "Você pode conhecer conteúdos educativos, testar um simulador ilustrativo e explorar recursos de organização de cuidados. As informações inseridas ficam neste navegador e não são enviadas a um serviço.",
  },
  {
    question: "Posso informar meus dados pessoais ou de saúde?",
    answer:
      "Não use dados reais neste protótipo. Ele não oferece armazenamento seguro, atendimento clínico ou recursos para lidar com informações sensíveis.",
  },
  {
    question: "A demonstração substitui uma consulta médica?",
    answer:
      "Não. O conteúdo é informativo e não substitui orientação de um profissional de saúde. Em uma emergência, ligue para o SAMU pelo 192 ou procure uma unidade de pronto atendimento.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${light ? "text-white" : "text-slate-950"}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.18em] ${light ? "text-emerald-300" : "text-emerald-800"}`}>
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-xl text-base leading-7 ${light ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f7f8f6]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Saúde Primeiro, início">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#123b36] text-white">
            <ShieldCheck aria-hidden="true" className="h-[21px] w-[21px]" strokeWidth={1.8} />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-slate-900">
            Saúde <span className="text-[#257363]">Primeiro</span>
          </span>
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
          <a className="text-sm text-slate-600 transition hover:text-[#123b36]" href="#beneficios">Benefícios</a>
          <a className="text-sm text-slate-600 transition hover:text-[#123b36]" href="#como-funciona">Como funciona</a>
          <a className="text-sm text-slate-600 transition hover:text-[#123b36]" href="#depoimentos">Depoimentos</a>
          <a className="text-sm text-slate-600 transition hover:text-[#123b36]" href="#duvidas">Dúvidas</a>
        </nav>

        <Link
          to="/painel"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#123b36] px-5 text-sm font-semibold text-white transition hover:bg-[#1b5048] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#257363] focus-visible:ring-offset-2"
        >
          <span className="hidden sm:inline">Explorar demonstração</span>
          <span className="sm:hidden">Explorar</span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-[#102e2a] px-5 pb-8 pt-14 text-white sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="max-w-sm">
          <a href="#inicio" className="flex w-fit items-center gap-3" aria-label="Saúde Primeiro, voltar ao início">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10">
              <ShieldCheck aria-hidden="true" className="h-[21px] w-[21px] text-emerald-300" strokeWidth={1.8} />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.03em]">Saúde Primeiro</span>
          </a>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            Informação e cuidado para quem faz acontecer, todos os dias.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-300">
            <a className="transition hover:text-white" href="#beneficios">Benefícios</a>
            <a className="transition hover:text-white" href="#duvidas">Perguntas frequentes</a>
            <Link className="transition hover:text-white" to="/painel">Área demonstrativa</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Informações</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-300">
            <Link className="transition hover:text-white" to="/privacidade">Privacidade e dados</Link>
            <Link className="transition hover:text-white" to="/termos">Termos de uso</Link>
            <a className="transition hover:text-white" href="tel:192">Emergência: SAMU 192</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/15 pt-6">
        <p className="text-xs leading-5 text-slate-400">
          Protótipo educativo. Não oferece planos reais, contratação, cobertura ou atendimento médico.
          Não informe dados pessoais ou de saúde. Em emergências, ligue 192.
        </p>
        <p className="mt-4 text-xs text-slate-500">© {new Date().getFullYear()} Saúde Primeiro. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f8f6] font-sans text-slate-900 antialiased">
      <LandingHeader />
      <main>
        <section id="inicio" className="scroll-mt-24 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e5df] bg-white px-3.5 py-2 text-xs font-medium text-[#315d52] shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2c8a6e]" />
                Saúde e proteção para a vida real
              </div>
              <h1 className="mt-7 text-balance text-[2.75rem] font-semibold leading-[1.06] tracking-[-0.055em] text-[#122c29] sm:text-5xl lg:text-[3.75rem]">
                Cuidar de você também é proteger o seu trabalho.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Informação de saúde, organização do cuidado e uma forma mais clara de conhecer opções de proteção — no seu ritmo.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/painel"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#176550] px-7 py-4 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(23,101,80,0.18)] transition hover:-translate-y-0.5 hover:bg-[#124f3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176550] focus-visible:ring-offset-2"
                >
                  Conheça a demonstração
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-transparent px-7 py-4 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176550] focus-visible:ring-offset-2"
                >
                  Como funciona
                  <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-5 max-w-lg text-xs leading-5 text-slate-500">
                Uma experiência demonstrativa. Nenhuma opção exibida representa uma oferta real de seguro ou cobertura.
              </p>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-xs font-medium text-slate-600">
                {["Informação sem complicação", "Escolha no seu tempo", "Feito para quem trabalha por conta própria"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-[#26765f]" strokeWidth={2.5} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
              <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full bg-[#dbe9df] blur-3xl sm:-left-8 sm:-top-8" />
              <div className="relative overflow-hidden rounded-[28px] bg-[#d7e0d9] shadow-[0_24px_70px_rgba(19,47,40,0.13)] sm:rounded-[36px]">
                <img
                  src="/entregador-moto.png"
                  alt="Entregador autônomo se preparando para trabalhar em sua motocicleta"
                  className="aspect-[1.13/1] w-full object-cover object-[57%_center] sm:aspect-[1.19/1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2824]/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">Para quem move o dia</p>
                  <p className="mt-2 max-w-sm text-xl font-medium leading-snug tracking-[-0.03em] sm:text-2xl">
                    Seu cuidado merece fazer parte da sua rotina.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-[0_14px_36px_rgba(20,50,43,0.14)] sm:-right-5 sm:px-5 sm:py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f2ed] text-[#176550]">
                  <HeartPulse aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Cuidado mais simples</span>
                  <span className="mt-0.5 block text-xs text-slate-500">Informação no seu ritmo</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="beneficios" className="scroll-mt-24 border-y border-slate-200/80 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Mais clareza para cuidar"
              title="O que você precisa, sem complicar."
              description="Recursos pensados para apoiar decisões melhores sobre saúde e proteção, sem tirar você do controle."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
              {benefits.map(({ icon: Icon, title, description }, index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-[#fbfcfa] p-6 sm:p-7">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 1 ? "bg-[#eaf0f5] text-[#385a77]" : "bg-[#e7f2ed] text-[#176550]"}`}>
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.025em] text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <SectionHeading
              eyebrow="Um caminho mais simples"
              title="Clareza em cada etapa."
              description="Conheça os recursos, compare com calma e entenda o que é real — e o que ainda é apenas uma demonstração."
            />
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {steps.map((step) => (
                <article key={step.number} className="flex gap-5 py-6 sm:gap-7 sm:py-7">
                  <span className="pt-1 text-sm font-semibold tabular-nums text-[#26765f]">{step.number}</span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#123b36] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionHeading
              light
              eyebrow="Nosso compromisso"
              title="Confiança se constrói com transparência."
              description="Acreditamos que uma boa experiência começa por explicar com honestidade o que você está vendo."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {principles.map(({ icon: Icon, title, description }, index) => (
                <article key={title} className={`rounded-2xl border border-white/10 p-5 sm:p-6 ${index === 2 ? "sm:col-span-2" : ""} bg-white/[0.06]`}>
                  <Icon aria-hidden="true" className="h-5 w-5 text-emerald-300" strokeWidth={1.8} />
                  <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="depoimentos" className="scroll-mt-24 bg-[#eef3ef] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Uma ideia que começa ouvindo"
                title="O cuidado precisa fazer sentido para a sua vida."
                description="Estas frases representam necessidades que inspiram o projeto — não são depoimentos de clientes."
              />
              <span className="mb-1 inline-flex w-fit shrink-0 rounded-full border border-[#cbd9d0] bg-white/70 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                Exemplos ilustrativos
              </span>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {testimonials.map(({ quote, profile }) => (
                <figure key={quote} className="flex min-h-48 flex-col rounded-2xl border border-[#dce6df] bg-white p-6 sm:p-7">
                  <span className="text-3xl leading-none text-[#62a28c]" aria-hidden="true">“</span>
                  <blockquote className="mt-3 flex-1 text-lg font-medium leading-7 tracking-[-0.02em] text-slate-800">
                    {quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                    {profile} <span className="font-normal text-slate-400">· perfil ilustrativo</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="duvidas" className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Perguntas frequentes"
                title="Tudo claro antes de continuar."
                description="Saiba exatamente o que esta demonstração oferece e como tratar as informações exibidas."
              />
              <Link to="/privacidade" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#176550] hover:text-[#124f3f]">
                Veja informações sobre privacidade
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {questions.map(({ question, answer }) => (
                <details key={question} className="group py-5">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-semibold leading-6 text-slate-900 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176550]">
                    {question}
                    <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="max-w-2xl pb-1 pr-8 pt-3 text-sm leading-6 text-slate-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[28px] bg-[#e5efe9] p-7 sm:p-10 lg:flex-row lg:items-center lg:p-14">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#26765f]">Comece com informação</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#122c29] sm:text-4xl">
                O primeiro passo para se cuidar pode ser entender melhor.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Explore os recursos demonstrativos e veja como a experiência pode apoiar sua rotina.
              </p>
            </div>
            <Link
              to="/painel"
              className="inline-flex min-h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#176550] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#124f3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176550] focus-visible:ring-offset-2 sm:w-auto"
            >
              Acessar a demonstração
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
