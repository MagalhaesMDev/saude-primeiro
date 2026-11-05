import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar níveis
  await prisma.level.createMany({
    data: [
      {
        name: 'Bronze',
        minPoints: 0,
        maxPoints: 499,
        color: '#CD7F32',
        benefits: ['Desconto 5% em farmácias', 'Acesso a trilhas básicas'],
        order: 1,
      },
      {
        name: 'Prata',
        minPoints: 500,
        maxPoints: 1499,
        color: '#C0C0C0',
        benefits: ['Desconto 20% em farmácias', 'Cashback preventivo', 'Teleconsulta gratuita'],
        order: 2,
      },
      {
        name: 'Ouro',
        minPoints: 1500,
        maxPoints: null,
        color: '#FFD700',
        benefits: ['Desconto 35% em farmácias', 'Cashback em R$', 'Seguro vitalício garantido'],
        order: 3,
      },
    ],
  });

  // Criar planos
  await prisma.plan.createMany({
    data: [
      {
        name: 'Essencial',
        type: 'ESSENTIAL',
        price: 14.90,
        description: 'Cobertura básica para você e sua família',
        features: ['Telemedicina 24h', 'Descontos em farmácias', 'Consulta online'],
        coverage: ['Acidentes pessoais', 'Diária por internação'],
        isPopular: false,
        isActive: true,
      },
      {
        name: 'Proteção',
        type: 'PROTECTION',
        price: 24.90,
        description: 'Cobertura completa com mais benefícios',
        features: ['Telemedicina 24h', 'Descontos em farmácias', 'Consulta online', 'Diária por internação', 'Incapacidade temporária'],
        coverage: ['Acidentes pessoais', 'Diária por internação', 'Incapacidade temporária', 'Auxílio funeral'],
        isPopular: true,
        isActive: true,
      },
      {
        name: 'Renda',
        type: 'INCOME',
        price: 39.90,
        description: 'Proteção completa com garantia de renda',
        features: ['Telemedicina 24h', 'Descontos em farmácias', 'Consulta online', 'Diária por internação', 'Incapacidade temporária', 'Auxílio funeral', 'Proteção de renda'],
        coverage: ['Acidentes pessoais', 'Diária por internação', 'Incapacidade temporária', 'Auxílio funeral', 'Proteção financeira da renda'],
        isPopular: false,
        isActive: true,
      },
    ],
  });

  // Criar trilhas
  await prisma.trail.createMany({
    data: [
      {
        title: 'Prevenção de acidentes de trabalho',
        description: 'Aprenda a se proteger no dia a dia de trabalho',
        category: 'Entregadores e Autônomos',
        icon: 'Shield',
        color: '#1E3A8A',
        totalLessons: 5,
        estimatedTime: 10,
        isFree: true,
        order: 1,
      },
      {
        title: 'Saúde da mulher e autocuidado',
        description: 'Cuidados essenciais para a saúde feminina',
        category: 'Saúde Feminina',
        icon: 'Venus',
        color: '#EC4899',
        totalLessons: 5,
        estimatedTime: 10,
        isFree: true,
        order: 2,
      },
      {
        title: 'Saúde do homem e prevenção',
        description: 'Prevenção e cuidados para a saúde masculina',
        category: 'Saúde Masculina',
        icon: 'Mars',
        color: '#3B82F6',
        totalLessons: 5,
        estimatedTime: 10,
        isFree: true,
        order: 3,
      },
      {
        title: 'Cuidados com idosos e longevidade',
        description: 'Como cuidar de idosos e promover longevidade',
        category: 'Família',
        icon: 'Heart',
        color: '#10B981',
        totalLessons: 5,
        estimatedTime: 10,
        isFree: true,
        order: 4,
      },
      {
        title: 'Saúde mental e estresse',
        description: 'Estratégias para cuidar da saúde mental',
        category: 'Bem-estar',
        icon: 'Brain',
        color: '#8B5CF6',
        totalLessons: 5,
        estimatedTime: 10,
        isFree: true,
        order: 5,
      },
      {
        title: 'Saúde no dia a dia acessível',
        description: 'Dicas práticas de saúde para o cotidiano',
        category: 'Dia a Dia',
        icon: 'Activity',
        color: '#F59E0B',
        totalLessons: 5,
        estimatedTime: 10,
        isFree: true,
        order: 6,
      },
      {
        title: 'Entenda seu seguro sem mistério',
        description: 'Guia simples para entender seu microsseguro',
        category: 'Seguros',
        icon: 'FileText',
        color: '#1E3A8A',
        totalLessons: 5,
        estimatedTime: 10,
        isFree: true,
        order: 7,
      },
    ],
  });

  // Criar termos do glossário
  await prisma.glossaryTerm.createMany({
    data: [
      {
        term: 'Carência',
        definition: 'Período de espera após a contratação antes de poder usar alguns benefícios do seguro.',
        category: 'Seguros',
        order: 1,
      },
      {
        term: 'Sinistro',
        definition: 'Evento coberto pelo seguro que dá direito a acionar o benefício, como acidente ou doença.',
        category: 'Seguros',
        order: 2,
      },
      {
        term: 'Franquia',
        definition: 'Valor que o cliente paga antes do seguro começar a cobrir os custos.',
        category: 'Seguros',
        order: 3,
      },
      {
        term: 'DIT',
        definition: 'Diária por Incapacidade Temporária - pagamento diário enquanto você não pode trabalhar por acidente ou doença.',
        category: 'Seguros',
        order: 4,
      },
      {
        term: 'Prêmio',
        definition: 'Valor mensal que você paga pelo seu plano de seguro.',
        category: 'Seguros',
        order: 5,
      },
      {
        term: 'Apólice',
        definition: 'Documento que formaliza o contrato de seguro com todas as coberturas e regras.',
        category: 'Seguros',
        order: 6,
      },
      {
        term: 'Beneficiário',
        definition: 'Pessoa que recebe os benefícios do seguro em caso de sinistro.',
        category: 'Seguros',
        order: 7,
      },
    ],
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });