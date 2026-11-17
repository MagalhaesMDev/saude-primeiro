import type { LocalReminder } from "@/store/prototypeStore";

export interface AssistantLink {
  label: string;
  href: string;
}

export type AssistantAction =
  | { type: "complete-reminder"; reminderId: string; title: string }
  | { type: "redeem-cashback" }
  | { type: "select-plan"; name: string; price: number };

export interface LocalAssistantResponse {
  text: string;
  links?: AssistantLink[];
  reminderChoices?: LocalReminder[];
  action?: AssistantAction;
}

const SECTION_LINKS: AssistantLink[] = [
  { label: "Painel", href: "/painel" },
  { label: "Meu Seguro", href: "/meu-seguro" },
  { label: "Cuidar", href: "/cuidar" },
  { label: "Aprender", href: "/aprender" },
  { label: "Saúde Feminina", href: "/saude-feminina" },
];

const PLANS = [
  { name: "Essencial", price: 14.9 },
  { name: "Proteção", price: 24.9 },
  { name: "Renda", price: 39.9 },
];

function normalize(text: string): string {
  return text.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function reminderMatchesRequest(reminder: LocalReminder, message: string): boolean {
  const title = normalize(reminder.title);
  const type = normalize(reminder.type);
  if (message.includes(title)) return true;
  const titleWords = title.split(/\s+/).filter((word) => word.length >= 4);
  if (titleWords.some((word) => message.includes(word))) return true;

  const categories: Array<[string[], string[]]> = [
    [["consulta", "teleconsulta"], ["consultation"]],
    [["exame"], ["exam"]],
    [["vacina"], ["vaccine"]],
    [["medicamento", "remedio"], ["medication"]],
  ];
  return categories.some(([terms, types]) =>
    hasAny(message, terms) && types.some((category) => type.includes(category))
  );
}

function getSectionResponse(message: string): LocalAssistantResponse | null {
  if (hasAny(message, ["privacidade", "dados pessoais", "apagar dados", "excluir dados"])) {
    return {
      text: "O protótipo guarda algumas informações neste navegador. Evite inserir dados pessoais ou de saúde reais. Consulte a página de privacidade para saber mais.",
      links: [{ label: "Privacidade", href: "/privacidade" }],
    };
  }
  if (hasAny(message, ["saude feminina", "menstruacao", "ciclo menstrual"])) {
    return {
      text: "Na seção Saúde Feminina você pode registrar informações do ciclo neste dispositivo. Isso não oferece diagnóstico nem substitui orientação profissional.",
      links: [{ label: "Abrir Saúde Feminina", href: "/saude-feminina" }],
    };
  }
  if (hasAny(message, ["aprender", "licao", "trilha", "quiz", "estudar", "aula"])) {
    return {
      text: "Em Aprender há trilhas e lições educativas. Para concluir uma lição, é preciso abrir o conteúdo e responder ao quiz; não marco lições como concluídas por você.",
      links: [{ label: "Abrir Aprender", href: "/aprender" }],
    };
  }
  if (hasAny(message, ["seguro", "plano", "cobertura", "beneficio", "sinistro", "contratar"])) {
    return {
      text: "Meu Seguro permite comparar opções e conceitos ilustrativos. Este protótipo não vende planos, não confirma cobertura e não abre sinistros reais.",
      links: [{ label: "Abrir Meu Seguro", href: "/meu-seguro" }],
    };
  }
  if (hasAny(message, ["lembrete", "agenda", "consulta", "exame", "vacina", "cofre", "desconto", "cuidar"])) {
    return {
      text: "Em Cuidar você pode organizar lembretes locais e consultar recursos demonstrativos. Consultas e exames não são agendados por este app; o lembrete serve apenas para ajudar você a se organizar.",
      links: [{ label: "Abrir Cuidar", href: "/cuidar" }],
    };
  }
  if (hasAny(message, ["painel", "simulador", "cashback", "pontos", "saldo", "inicio"])) {
    return {
      text: "No Painel você encontra o simulador ilustrativo, seus pontos, cashback demonstrativo, lembretes e atalhos para as outras seções.",
      links: [{ label: "Abrir Painel", href: "/painel" }],
    };
  }
  return null;
}

export function getLocalAssistantResponse(
  rawMessage: string,
  reminders: LocalReminder[],
  cashbackAvailable: number,
): LocalAssistantResponse {
  const message = normalize(rawMessage.trim());

  if (!message) {
    return { text: "Escreva uma dúvida ou escolha uma das sugestões para começar." };
  }

  if (hasAny(message, ["emergencia", "urgente", "dor no peito", "falta de ar", "desmaio"])) {
    return {
      text: "Não consigo avaliar sintomas nem orientar tratamento. Se houver uma emergência, ligue para o SAMU pelo 192 ou procure uma unidade de pronto atendimento.",
      links: [{ label: "Cuidar", href: "/cuidar" }],
    };
  }

  if (hasAny(message, ["diagnostico", "diagnosticar", "sintoma", "tratamento", "remedio para"])) {
    return {
      text: "Posso explicar os recursos do app, mas não avaliar sintomas, diagnosticar ou recomendar tratamentos. Procure um profissional de saúde; em uma emergência, ligue 192.",
    };
  }

  const requestedPlan = PLANS.find((plan) => message.includes(normalize(plan.name)));
  if (
    requestedPlan
    && hasAny(message, ["selecionar", "escolher", "quero o plano", "ficar com"])
    && hasAny(message, ["plano", "seguro"])
  ) {
    return {
      text: `Posso selecionar o plano demonstrativo ${requestedPlan.name} (${requestedPlan.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês) para comparação. Isso não contrata um seguro. Quer confirmar?`,
      action: { type: "select-plan", name: requestedPlan.name, price: requestedPlan.price },
    };
  }

  if (hasAny(message, ["resgatar", "resgate"]) && hasAny(message, ["cashback", "saldo"])) {
    if (cashbackAvailable < 1) {
      return { text: "Não há saldo demonstrativo disponível para simular um resgate agora." };
    }
    return {
      text: `Há R$ ${cashbackAvailable.toFixed(2).replace(".", ",")} de saldo demonstrativo disponível. Quer simular o resgate? Nenhum pagamento será feito.`,
      action: { type: "redeem-cashback" },
    };
  }

  const requestsCompletion = hasAny(message, ["marcar", "concluir", "finalizar", "assinalar", "dar como feito"]);
  const mentionsReminder = hasAny(message, ["lembrete", "consulta", "teleconsulta", "exame", "vacina", "medicamento"]);
  if (requestsCompletion && mentionsReminder && !message.startsWith("como ")) {
    const pending = reminders.filter((reminder) => !reminder.done);
    if (pending.length === 0) {
      return { text: "Não encontrei lembretes pendentes para marcar como feitos." };
    }

    const matches = pending.filter((reminder) => reminderMatchesRequest(reminder, message));
    if (matches.length === 1) {
      return {
        text: `Quer marcar “${matches[0].title}” como feito? Essa alteração ficará salva apenas neste navegador.`,
        action: { type: "complete-reminder", reminderId: matches[0].id, title: matches[0].title },
      };
    }
    if (matches.length > 1 || !hasAny(message, ["consulta", "teleconsulta", "exame", "vacina", "medicamento"])) {
      return {
        text: "Qual destes lembretes você quer marcar como feito? Vou pedir confirmação antes de alterar.",
        reminderChoices: matches.length > 1 ? matches : pending,
      };
    }
    return { text: "Não encontrei um lembrete pendente desse tipo. Você pode ver os lembretes em Cuidar.", links: [{ label: "Abrir Cuidar", href: "/cuidar" }] };
  }

  if (hasAny(message, ["como funciona", "o que voce faz", "ajuda", "opcoes"])) {
    return {
      text: "Posso explicar as seções, levar você até elas e, com sua confirmação, marcar lembretes como feitos, selecionar um plano ilustrativo ou simular um resgate de cashback. Não faço agendamentos médicos, contratação nem diagnóstico.",
      links: SECTION_LINKS,
    };
  }

  return getSectionResponse(message) ?? {
    text: "Ainda não sei responder a isso neste protótipo local. Posso orientar você pelas seções do app; não envie dados pessoais ou de saúde.",
    links: SECTION_LINKS,
  };
}
