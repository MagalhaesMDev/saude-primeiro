import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Brain,
  Heart,
  HeartPulse,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";

export type TrailAudience =
  | "todos"
  | "entregadores"
  | "mulheres"
  | "homens"
  | "idosos"
  | "gestantes"
  | "seguros";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  readingMinutes: number;
  points: number;
  cashback: number;
  imageSrc: string;
  imageAlt: string;
  videoUrl?: string;
  steps: string[];
  quiz: QuizQuestion[];
}

export interface Trail {
  id: string;
  title: string;
  category: string;
  audiences: TrailAudience[];
  icon: LucideIcon;
  color: string;
  lessons: Lesson[];
}

export interface LessonProgress {
  completed: boolean;
  quizScore: number;
  completedAt: string;
}

function question(
  id: string,
  questionText: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): QuizQuestion {
  return { id, question: questionText, options, correctIndex, explanation };
}

function lesson(
  id: string,
  title: string,
  readingMinutes: number,
  points: number,
  steps: string[],
  quiz: QuizQuestion[],
): Lesson {
  return {
    id,
    title,
    readingMinutes,
    points,
    cashback: 0.2,
    imageSrc: `/lessons/${id}.jpg`,
    imageAlt: `Ilustração educativa sobre ${title.toLocaleLowerCase("pt-BR")}`,
    steps,
    quiz,
  };
}

export const LESSON_TRAILS: Trail[] = [
  {
    id: "work",
    title: "Prevenção no trabalho e no trânsito",
    category: "Entregadores e autônomos",
    audiences: ["todos", "entregadores"],
    icon: Truck,
    color: "bg-success/10 text-success",
    lessons: [
      lesson(
        "work-ride",
        "Deslocamentos com mais atenção",
        3,
        10,
        [
          "Antes de sair, confira pneus, luzes, freios e os itens de segurança recomendados para o seu veículo.",
          "No trajeto, mantenha atenção ao entorno e adapte a velocidade às condições da via e do clima.",
          "Se estiver cansado ou distraído, faça uma pausa em local seguro antes de continuar.",
        ],
        [
          question("work-ride-q1", "O que fazer antes de iniciar um trajeto de trabalho?", [
            "Conferir os itens de segurança e as condições básicas do veículo.",
            "Aumentar a velocidade para terminar mais rápido.",
            "Usar o celular enquanto dirige para conferir o caminho.",
          ], 0, "Uma verificação simples antes de sair ajuda a perceber problemas e a planejar um trajeto com mais atenção."),
          question("work-ride-q2", "Se o cansaço atrapalhar sua atenção, qual é uma atitude prudente?", [
            "Continuar até terminar todas as entregas.",
            "Parar em local seguro e descansar antes de seguir.",
            "Acelerar para chegar logo ao destino.",
          ], 1, "Fazer uma pausa em segurança pode ajudar a recuperar a atenção. Evite continuar quando o cansaço comprometer o trajeto."),
        ],
      ),
      lesson(
        "work-load",
        "Movimentação de cargas no dia a dia",
        3,
        10,
        [
          "Observe o peso e o formato do objeto e veja se o caminho está livre antes de movê-lo.",
          "Sempre que possível, aproxime a carga do corpo e peça ajuda para volumes difíceis de manejar.",
          "Evite torcer o corpo durante o movimento; mude a direção com passos curtos e controlados.",
        ],
        [
          question("work-load-q1", "Antes de levantar um volume, o que é recomendado fazer?", [
            "Verificar o peso, o caminho e se é necessário pedir ajuda.",
            "Puxar o objeto rapidamente com um braço.",
            "Mover o objeto sem olhar para o trajeto.",
          ], 0, "Avaliar o volume e o caminho ajuda a escolher uma maneira mais segura de movimentá-lo e a pedir ajuda quando necessário."),
          question("work-load-q2", "Como manter a carga durante o deslocamento?", [
            "O mais distante possível do corpo.",
            "Próxima ao corpo, sem torcer o tronco.",
            "Acima da cabeça para liberar os braços.",
          ], 1, "Manter a carga próxima e evitar torções são orientações gerais de ergonomia. Se houver desconforto, interrompa a tarefa e procure orientação."),
        ],
      ),
      lesson(
        "work-weather",
        "Trabalho em dias de chuva e calor",
        4,
        15,
        [
          "Em dias de chuva, redobre a atenção ao piso e às condições de visibilidade do percurso.",
          "Use equipamentos de proteção adequados à atividade e às condições do tempo.",
          "Em períodos quentes, planeje pausas em locais seguros e tenha água disponível, conforme sua rotina.",
        ],
        [
          question("work-weather-q1", "Em uma via molhada, qual cuidado geral é importante?", [
            "Aumentar a velocidade para sair logo da chuva.",
            "Redobrar a atenção e adequar o trajeto às condições da via.",
            "Usar o celular para gravar a viagem.",
          ], 1, "Piso molhado pode exigir atenção adicional. Adeque o deslocamento às condições de visibilidade e da via."),
          question("work-weather-q2", "Em um dia muito quente, o que pode ajudar no cuidado durante o trabalho?", [
            "Planejar pausas em segurança e ter água disponível.",
            "Evitar qualquer pausa para concluir mais tarefas.",
            "Ignorar sinais de mal-estar.",
          ], 0, "Pausas e acesso à água podem fazer parte de uma rotina de cuidado. Se houver mal-estar, interrompa a atividade e procure orientação."),
        ],
      ),
    ],
  },
  {
    id: "women",
    title: "Saúde da mulher e autocuidado",
    category: "Saúde feminina",
    audiences: ["todos", "mulheres"],
    icon: Heart,
    color: "bg-feminine/10 text-feminine",
    lessons: [
      lesson(
        "women-checkups",
        "Conversas e consultas preventivas",
        3,
        10,
        [
          "Consultas de rotina são uma oportunidade para conversar sobre dúvidas e cuidados preventivos.",
          "Anote perguntas ou mudanças que queira comentar com um profissional de saúde.",
          "Exames e sua frequência dependem da história e das orientações individuais; confirme com a equipe de saúde.",
        ],
        [
          question("women-checkups-q1", "Quem pode orientar sobre quais exames preventivos são adequados para você?", [
            "Um profissional de saúde, considerando seu contexto.",
            "Uma lista genérica da internet, sem conversa.",
            "Somente familiares e amigos.",
          ], 0, "A indicação e a frequência de exames dependem de cada pessoa. Converse com um profissional de saúde."),
          question("women-checkups-q2", "Como se preparar para uma consulta de rotina?", [
            "Levar perguntas e informações que queira compartilhar.",
            "Omitir dúvidas para a consulta terminar mais rápido.",
            "Fazer exames sem orientação.",
          ], 0, "Anotar perguntas pode ajudar a aproveitar a conversa com a equipe de saúde."),
        ],
      ),
      lesson(
        "women-cycle",
        "Conhecendo o próprio ciclo",
        3,
        10,
        [
          "A duração e as características do ciclo podem variar entre pessoas e ao longo da vida.",
          "Se desejar, anote datas e observações para conversar com um profissional de saúde.",
          "Mudanças que preocupem você merecem uma conversa com a equipe de saúde, sem tentar se diagnosticar.",
        ],
        [
          question("women-cycle-q1", "Para que um registro pessoal do ciclo pode ser útil?", [
            "Para organizar observações que você queira discutir numa consulta.",
            "Para substituir uma avaliação profissional.",
            "Para confirmar um diagnóstico por conta própria.",
          ], 0, "Anotações podem apoiar uma conversa, mas não substituem avaliação ou orientação profissional."),
          question("women-cycle-q2", "O que fazer se uma mudança no ciclo causar preocupação?", [
            "Buscar orientação de um profissional de saúde.",
            "Seguir uma recomendação de outra pessoa sem avaliar.",
            "Ignorar a preocupação sempre.",
          ], 0, "Se algo preocupa você, compartilhe com um profissional de saúde para receber orientação adequada ao seu caso."),
        ],
      ),
      lesson(
        "women-wellbeing",
        "Autocuidado e rede de apoio",
        3,
        10,
        [
          "Reserve momentos possíveis para descanso e atividades que façam sentido para você.",
          "Compartilhe dúvidas e necessidades com pessoas de confiança, se isso for confortável.",
          "Se precisar de apoio em saúde, procure uma unidade ou profissional de saúde.",
        ],
        [
          question("women-wellbeing-q1", "Qual pode ser um primeiro passo de autocuidado?", [
            "Reconhecer uma necessidade e buscar apoio possível.",
            "Esperar até não conseguir mais realizar as atividades diárias.",
            "Deixar de conversar sobre dúvidas.",
          ], 0, "Perceber suas necessidades e procurar apoio são passos possíveis de cuidado."),
          question("women-wellbeing-q2", "Onde buscar orientação sobre saúde?", [
            "Com um profissional ou serviço de saúde.",
            "Em mensagens sem fonte verificável.",
            "Somente em publicações de redes sociais.",
          ], 0, "Serviços e profissionais de saúde podem orientar de acordo com sua situação."),
        ],
      ),
    ],
  },
  {
    id: "men",
    title: "Saúde do homem e prevenção",
    category: "Saúde masculina",
    audiences: ["todos", "homens"],
    icon: UserRound,
    color: "bg-primary/10 text-primary",
    lessons: [
      lesson(
        "men-routine",
        "Consultas de rotina também importam",
        3,
        10,
        [
          "Conversar com um profissional de saúde pode ajudar a esclarecer dúvidas sobre prevenção.",
          "Compartilhe seu histórico e suas preocupações de forma aberta, dentro do que se sentir confortável.",
          "A equipe de saúde pode orientar sobre cuidados e exames adequados para o seu contexto.",
        ],
        [
          question("men-routine-q1", "O que levar para uma conversa preventiva?", [
            "Dúvidas e informações que queira compartilhar com o profissional.",
            "Apenas uma lista de exames escolhida sem orientação.",
            "Nada; consultas de rotina nunca são úteis.",
          ], 0, "Levar perguntas ajuda a tornar a conversa mais clara, e o profissional pode orientar sobre as opções adequadas."),
          question("men-routine-q2", "A frequência de exames preventivos deve ser definida como?", [
            "De acordo com orientação profissional e contexto individual.",
            "Igual para todas as pessoas, sem exceção.",
            "Por recomendação de pessoas sem formação em saúde.",
          ], 0, "As recomendações podem variar. Converse com um profissional sobre o que faz sentido para você."),
        ],
      ),
      lesson(
        "men-heart",
        "Hábitos que apoiam a saúde do coração",
        4,
        15,
        [
          "Inclua movimento no cotidiano de uma forma compatível com suas possibilidades.",
          "Busque informações confiáveis para escolhas de alimentação e descanso.",
          "Converse com um profissional antes de mudar cuidados ou iniciar uma atividade que gere dúvidas.",
        ],
        [
          question("men-heart-q1", "Como começar a incluir mais movimento na rotina?", [
            "Escolher uma atividade possível e conversar com um profissional se tiver dúvidas.",
            "Ignorar limites e fazer esforço intenso de imediato.",
            "Seguir um plano de treino sem considerar seu contexto.",
          ], 0, "Atividades e cuidados devem considerar as necessidades de cada pessoa; procure orientação se tiver dúvidas."),
          question("men-heart-q2", "Onde confirmar informações sobre saúde?", [
            "Com fontes confiáveis e profissionais de saúde.",
            "Em qualquer publicação que prometa resultados rápidos.",
            "Em relatos isolados sem contexto.",
          ], 0, "Fontes confiáveis e profissionais podem ajudar a separar informação geral de orientação individual."),
        ],
      ),
      lesson(
        "men-mental-health",
        "Bem-estar emocional e apoio",
        3,
        10,
        [
          "Perceba como estão seu descanso, seus relacionamentos e sua rotina de trabalho.",
          "Falar com alguém de confiança pode ser um primeiro passo para buscar apoio.",
          "Se precisar, procure um serviço ou profissional de saúde; você não precisa lidar com tudo sozinho.",
        ],
        [
          question("men-mental-q1", "Quando buscar apoio emocional?", [
            "Quando sentir necessidade ou quiser conversar sobre seu bem-estar.",
            "Somente quando outra pessoa autorizar.",
            "Nunca; pedir apoio é sinal de fraqueza.",
          ], 0, "Buscar apoio é uma atitude válida em qualquer momento em que você sentir necessidade."),
          question("men-mental-q2", "Qual é uma opção para conversar sobre saúde emocional?", [
            "Um profissional ou serviço de saúde.",
            "Uma fonte anônima que não conhece seu contexto.",
            "Ignorar o que está sentindo.",
          ], 0, "Um profissional ou serviço de saúde pode ouvir e orientar sobre opções de apoio."),
        ],
      ),
    ],
  },
  {
    id: "family",
    title: "Cuidado e autonomia na melhor idade",
    category: "Idosos",
    audiences: ["todos", "idosos"],
    icon: HeartPulse,
    color: "bg-success/10 text-success",
    lessons: [
      lesson(
        "family-home",
        "Casa segura para envelhecer com mais autonomia",
        3,
        10,
        [
          "Observe áreas de circulação e mantenha caminhos usados no dia a dia livres de objetos soltos.",
          "Iluminação adequada e objetos de uso frequente ao alcance podem facilitar algumas tarefas.",
          "Mudanças no ambiente devem respeitar as preferências de quem mora ali; converse antes de fazê-las.",
        ],
        [
          question("family-home-q1", "O que pode ajudar a tornar a circulação em casa mais organizada?", [
            "Manter caminhos de uso frequente livres de obstáculos.",
            "Deixar objetos espalhados para estarem sempre à vista.",
            "Mudar os móveis de lugar sem conversar com quem mora ali.",
          ], 0, "Caminhos livres podem facilitar a circulação. É importante conversar com a pessoa sobre mudanças no ambiente."),
          question("family-home-q2", "Como fazer ajustes na casa de uma pessoa idosa?", [
            "Conversar e considerar sua rotina e preferências.",
            "Fazer mudanças sem avisar.",
            "Deixar os ajustes para outra pessoa decidir sozinha.",
          ], 0, "A participação da pessoa ajuda a manter autonomia e a escolher mudanças adequadas à sua rotina."),
        ],
      ),
      lesson(
        "family-vaccines",
        "Informação sobre vacinas e consultas",
        3,
        10,
        [
          "O calendário de vacinação pode depender da idade, histórico e recomendações vigentes.",
          "Leve a caderneta de vacinação ou as informações disponíveis a uma unidade de saúde.",
          "Confirme datas e orientações com um profissional ou serviço de saúde.",
        ],
        [
          question("family-vaccines-q1", "Onde confirmar quais vacinas estão indicadas?", [
            "Em um serviço ou com um profissional de saúde.",
            "Em uma mensagem encaminhada sem fonte.",
            "Em uma lista antiga sem conferir a data.",
          ], 0, "As recomendações podem mudar e variam conforme o histórico. Confirme com um serviço de saúde."),
          question("family-vaccines-q2", "O que pode ser útil levar para conferir o histórico de vacinação?", [
            "A caderneta ou os registros disponíveis.",
            "Apenas lembranças, sem compartilhar dúvidas.",
            "Um registro de outra pessoa.",
          ], 0, "Levar os registros disponíveis facilita a conversa com a equipe de saúde."),
        ],
      ),
      lesson(
        "family-support",
        "Apoio sem perder autonomia",
        3,
        10,
        [
          "Pergunte como a pessoa prefere receber ajuda antes de assumir uma tarefa por ela.",
          "Combine formas práticas de apoio, respeitando escolhas e privacidade.",
          "Dúvidas sobre cuidados podem ser conversadas com profissionais e serviços de saúde.",
        ],
        [
          question("family-support-q1", "Como oferecer ajuda de maneira respeitosa?", [
            "Perguntar o que a pessoa prefere e combinar o apoio.",
            "Decidir tudo sem consultar a pessoa.",
            "Ignorar as preferências para ganhar tempo.",
          ], 0, "Perguntar e combinar mantém a pessoa envolvida nas decisões sobre sua rotina."),
          question("family-support-q2", "Quem pode orientar sobre dúvidas de cuidado?", [
            "Profissionais e serviços de saúde.",
            "Somente alguém que não conhece a situação.",
            "Uma publicação sem autoria identificada.",
          ], 0, "A equipe de saúde pode ajudar com orientações adequadas à necessidade e ao contexto da pessoa."),
        ],
      ),
    ],
  },
  {
    id: "wellness",
    title: "Bem-estar e rotina",
    category: "Equilíbrio",
    audiences: ["todos", "entregadores", "mulheres", "homens"],
    icon: Brain,
    color: "bg-primary/10 text-primary",
    lessons: [
      lesson(
        "wellness-rest",
        "Pausas e descanso ao longo do dia",
        3,
        10,
        [
          "Observe como o ritmo de trabalho afeta seu descanso e sua disposição.",
          "Quando possível, programe pausas curtas em um local apropriado e seguro.",
          "Se o cansaço persistir ou preocupar você, converse com um profissional de saúde.",
        ],
        [
          question("wellness-rest-q1", "O que pode fazer parte de uma rotina mais cuidadosa?", [
            "Planejar pausas quando forem possíveis e seguras.",
            "Evitar parar mesmo quando o cansaço atrapalhar.",
            "Ignorar qualquer necessidade de descanso.",
          ], 0, "Pausas planejadas podem apoiar uma rotina mais equilibrada. Cada pessoa tem necessidades diferentes."),
          question("wellness-rest-q2", "Se o cansaço persistir e preocupar você, o que fazer?", [
            "Conversar com um profissional de saúde.",
            "Tentar um tratamento sem orientação.",
            "Não comentar com ninguém.",
          ], 0, "Um profissional pode conversar sobre o que você está sentindo e orientar os próximos passos."),
        ],
      ),
      lesson(
        "wellness-breathing",
        "Uma pausa para respirar com atenção",
        2,
        10,
        [
          "Se for confortável, faça uma pausa em um lugar tranquilo e perceba o ritmo natural da respiração.",
          "Não force o ritmo: interrompa a atividade se sentir desconforto.",
          "Uma prática breve pode ser um momento de pausa, mas não substitui cuidado profissional quando necessário.",
        ],
        [
          question("wellness-breathing-q1", "Como fazer uma pausa de respiração com atenção?", [
            "Observar a respiração sem forçar o ritmo.",
            "Prender o ar até sentir desconforto.",
            "Continuar a prática mesmo se não estiver confortável.",
          ], 0, "Uma pausa deve ser confortável. Pare se sentir desconforto e procure orientação se precisar."),
          question("wellness-breathing-q2", "Essa prática substitui atendimento de saúde?", [
            "Não, é apenas uma possibilidade de pausa.",
            "Sim, substitui qualquer acompanhamento.",
            "Sim, serve para diagnosticar problemas.",
          ], 0, "A prática é apenas uma pausa e não substitui avaliação ou atendimento de saúde."),
        ],
      ),
      lesson(
        "wellness-support",
        "Como encontrar uma rede de apoio",
        3,
        10,
        [
          "Pense em pessoas de confiança com quem você se sinta confortável para conversar.",
          "Serviços de saúde do seu território podem informar opções de acolhimento.",
          "Se uma situação for urgente ou houver risco imediato, procure um serviço de emergência.",
        ],
        [
          question("wellness-support-q1", "Qual pode ser uma forma de buscar apoio?", [
            "Conversar com alguém de confiança ou com um serviço de saúde.",
            "Guardar toda preocupação para si.",
            "Seguir orientações de qualquer fonte sem verificar.",
          ], 0, "Pessoas de confiança e serviços de saúde podem ajudar a identificar opções de apoio."),
          question("wellness-support-q2", "Em uma emergência, qual é uma atitude adequada?", [
            "Procurar um serviço de emergência.",
            "Esperar por uma resposta em uma rede social.",
            "Usar uma orientação geral como substituto de atendimento.",
          ], 0, "Emergências precisam de atendimento apropriado. Procure um serviço de emergência da sua região."),
        ],
      ),
    ],
  },
  {
    id: "mothers",
    title: "Gestação, pós-parto e autocuidado",
    category: "Gestantes",
    audiences: ["todos", "gestantes"],
    icon: Baby,
    color: "bg-feminine/10 text-feminine",
    lessons: [
      lesson(
        "mothers-prenatal",
        "Acompanhamento pré-natal",
        3,
        10,
        [
          "O acompanhamento pré-natal permite conversar sobre dúvidas e receber orientações ao longo da gestação.",
          "A frequência de consultas e exames deve seguir a orientação da equipe de saúde.",
          "Anote perguntas para levar às consultas e compartilhe mudanças que preocupem você.",
        ],
        [
          question("mothers-prenatal-q1", "Quem orienta o acompanhamento durante a gestação?", [
            "A equipe de saúde que acompanha a gestação.",
            "Uma lista genérica, sem considerar a pessoa.",
            "Somente comentários de conhecidos.",
          ], 0, "A equipe que acompanha a gestação pode orientar de acordo com as necessidades individuais."),
          question("mothers-prenatal-q2", "O que fazer com dúvidas entre consultas?", [
            "Anotá-las e entrar em contato com a equipe de saúde.",
            "Tentar confirmar um diagnóstico por conta própria.",
            "Ignorar todas as dúvidas.",
          ], 0, "Anotar dúvidas ajuda a conversar com a equipe de saúde e obter orientação confiável."),
        ],
      ),
      lesson(
        "mothers-support",
        "Rede de apoio na gestação e no pós-parto",
        3,
        10,
        [
          "Converse com pessoas de confiança sobre tarefas e formas de apoio que seriam úteis.",
          "Combine ajuda de maneira clara, respeitando preferências e limites.",
          "Profissionais e serviços de saúde podem orientar sobre dúvidas durante a gestação e o pós-parto.",
        ],
        [
          question("mothers-support-q1", "Como combinar uma forma de apoio?", [
            "Conversar sobre o que seria útil e respeitar os limites de cada pessoa.",
            "Esperar que outras pessoas adivinhem o que é necessário.",
            "Aceitar qualquer ajuda mesmo sem se sentir confortável.",
          ], 0, "Uma conversa clara ajuda a alinhar necessidades e limites."),
          question("mothers-support-q2", "Onde conversar sobre dúvidas de saúde no pós-parto?", [
            "Com profissionais ou serviços de saúde.",
            "Somente em relatos sem fonte.",
            "Em mensagens que prometam soluções universais.",
          ], 0, "A equipe de saúde pode oferecer orientação adequada à sua situação."),
        ],
      ),
      lesson(
        "mothers-care",
        "Autocuidado e comunicação com a equipe",
        3,
        15,
        [
          "Compartilhe com a equipe de saúde suas dúvidas e necessidades de cuidado.",
          "Peça que as orientações sejam explicadas de forma clara e confirme o que não entendeu.",
          "Se algo preocupar você, procure orientação de um serviço de saúde em vez de depender de informações genéricas.",
        ],
        [
          question("mothers-care-q1", "O que fazer se uma orientação não ficou clara?", [
            "Pedir à equipe de saúde que explique novamente.",
            "Adivinhar o que fazer.",
            "Seguir uma recomendação sem entender.",
          ], 0, "É válido pedir uma explicação mais clara e confirmar com a equipe antes de agir."),
          question("mothers-care-q2", "Qual fonte é mais adequada para dúvidas pessoais de saúde?", [
            "A equipe ou o serviço de saúde que acompanha você.",
            "Uma mensagem sem autoria identificada.",
            "Uma experiência de outra pessoa, sem contexto.",
          ], 0, "Orientações individuais devem ser conversadas com profissionais ou serviços de saúde."),
        ],
      ),
    ],
  },
  {
    id: "youth",
    title: "Hábitos saudáveis para jovens",
    category: "Juventude",
    audiences: ["todos"],
    icon: Sparkles,
    color: "bg-violet-100 text-violet-700",
    lessons: [
      lesson(
        "youth-sleep",
        "Sono e rotina de descanso",
        3,
        10,
        [
          "Uma rotina previsível de descanso pode ajudar a organizar o fim do dia.",
          "Observe como horários e atividades afetam seu descanso, sem buscar uma regra única para todos.",
          "Se dificuldades persistirem ou preocuparem você, converse com um adulto de confiança ou profissional de saúde.",
        ],
        [
          question("youth-sleep-q1", "O que pode ajudar a organizar o descanso?", [
            "Criar uma rotina que funcione para sua realidade.",
            "Comparar seu sono com o de todas as outras pessoas.",
            "Ignorar uma dificuldade que persiste.",
          ], 0, "As rotinas variam. Se algo preocupar você, converse com uma pessoa de confiança ou profissional de saúde."),
          question("youth-sleep-q2", "Com quem conversar sobre uma dificuldade persistente?", [
            "Com um adulto de confiança ou profissional de saúde.",
            "Com uma fonte anônima que promete soluções rápidas.",
            "Com ninguém, mesmo se precisar de ajuda.",
          ], 0, "Um adulto de confiança ou profissional pode ajudar a encontrar apoio adequado."),
        ],
      ),
      lesson(
        "youth-food",
        "Alimentação e informação confiável",
        3,
        10,
        [
          "Prefira informações de fontes confiáveis e desconfie de promessas de resultados imediatos.",
          "As necessidades alimentares variam; recomendações individuais devem ser conversadas com um profissional.",
          "Se tiver dúvidas sobre alimentação, procure um serviço ou profissional de saúde.",
        ],
        [
          question("youth-food-q1", "Como avaliar uma promessa sobre alimentação?", [
            "Desconfiar de resultados imediatos e procurar fontes confiáveis.",
            "Seguir qualquer dica que esteja em destaque.",
            "Acreditar que a mesma regra serve para todo mundo.",
          ], 0, "Promessas rápidas podem não considerar necessidades individuais. Busque informação confiável."),
          question("youth-food-q2", "Onde buscar orientação individual sobre alimentação?", [
            "Com um profissional ou serviço de saúde.",
            "Em uma publicação sem autoria.",
            "Em um desafio de internet.",
          ], 0, "Um profissional pode conversar sobre orientações adequadas ao seu contexto."),
        ],
      ),
      lesson(
        "youth-checkin",
        "Conversas sobre bem-estar",
        3,
        10,
        [
          "Reconheça quando quiser conversar sobre sentimentos, rotina ou relações.",
          "Procure um adulto de confiança e explique como prefere receber apoio.",
          "Se precisar de mais ajuda, um serviço de saúde pode orientar você e sua rede de apoio.",
        ],
        [
          question("youth-checkin-q1", "Qual é um primeiro passo se você quiser conversar sobre bem-estar?", [
            "Procurar um adulto de confiança.",
            "Achar que precisa resolver tudo sem apoio.",
            "Seguir orientações de pessoas desconhecidas.",
          ], 0, "Conversar com um adulto de confiança pode ajudar a encontrar apoio adequado."),
          question("youth-checkin-q2", "Se precisar de mais apoio, onde buscar orientação?", [
            "Em um serviço de saúde, com apoio de um adulto de confiança.",
            "Em uma mensagem sem fonte.",
            "Em uma promessa de solução imediata.",
          ], 0, "Serviços de saúde podem orientar jovens e suas redes de apoio."),
        ],
      ),
    ],
  },
];

export function getTrailProgress(
  trail: Trail,
  lessonProgress: Record<string, LessonProgress>,
) {
  const completed = trail.lessons.filter((lessonItem) => lessonProgress[lessonItem.id]?.completed).length;
  return { completed, total: trail.lessons.length };
}

export function getNextUncompletedLesson(
  trail: Trail,
  lessonProgress: Record<string, LessonProgress>,
): Lesson | undefined {
  return trail.lessons.find((lessonItem) => !lessonProgress[lessonItem.id]?.completed);
}

export function getNextLessonAcrossTrails(
  trails: Trail[],
  lessonProgress: Record<string, LessonProgress>,
): { trail: Trail; lesson: Lesson } | undefined {
  for (const trail of trails) {
    const nextLesson = getNextUncompletedLesson(trail, lessonProgress);
    if (nextLesson) return { trail, lesson: nextLesson };
  }
  return undefined;
}
