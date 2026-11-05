# 🏥 Saúde Primeiro

Plataforma de microsseguro inclusivo com educação preventiva, lembretes de saúde e gamificação, voltada a trabalhadores autônomos e informais e suas famílias.

## 📋 Visão Geral

O **Saúde Primeiro** é uma plataforma mobile-first que combina:
- **Microsseguro acessível** com planos a partir de R$ 14,90/mês
- **Educação preventiva** gamificada com trilhas de aprendizado
- **Lembretes de saúde** personalizados
- **Saúde feminina** com acompanhamento de ciclo menstrual
- **Gamificação** com pontos, níveis e cashback

> **Estado atual:** protótipo front-end para demonstração. Login, plano selecionado,
> lembretes, pontos e diário do ciclo (humor, sintomas, fluxo e energia) são salvos
> no armazenamento local do navegador. Arquivos selecionados no cofre ficam apenas
> em memória durante a sessão e não são enviados nem persistidos.
> Não existe API integrada, contratação de seguro, teleconsulta, envio de sinistro,
> recuperação de senha ou armazenamento seguro de documentos. Não use dados reais,
> especialmente dados de saúde. O armazenamento local não é criptografado e não
> atende, por si só, a requisitos de LGPD ou produção.

## 🚀 Tecnologias

- **Front-end**: React + TypeScript + Vite + Tailwind CSS
- **Estado**: Zustand
- **Navegação**: React Router DOM
- **Banco de dados**: PostgreSQL + Prisma ORM
- **Validação**: Zod
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Testes**: Vitest + Testing Library, Playwright para E2E

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar protótipo
pnpm dev
```

Os comandos `db:*` exigem PostgreSQL e `DATABASE_URL` configurados. O banco e o
cliente Prisma ainda não são usados pelas telas do protótipo.

## 🌍 Variáveis de Ambiente

Para usar os comandos Prisma, configure `DATABASE_URL` em um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/saudeprimeiro"
```

## 📂 Estrutura do Projeto

```
saude-primeiro/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── FloatingSupportButton.tsx
│   │   ├── health/
│   │   │   └── HealthDisclaimerFooter.tsx
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── progress.tsx
│   │       └── tabs.tsx
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── MeuSeguro.tsx
│   │   ├── Cuidar.tsx
│   │   ├── Aprender.tsx
│   │   ├── SaudeFeminina.tsx
│   │   ├── Login.tsx
│   │   └── NotFound.tsx
│   ├── store/
│   │   ├── authStore.ts
│   │   └── prototypeStore.ts
│   ├── lib/
│   │   └── utils.ts
│   └── globals.css
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e
```

## 🚀 Deploy

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel --prod
```

Configure as variáveis de ambiente no painel do Vercel.

## 📝 Decisões de Arquitetura

1. **Mobile-first**: Design responsivo com base em ~390px de largura
2. **TypeScript strict**: Type safety em todo o código
3. **Zustand para estado**: Estado global leve e performático
4. **Prisma ORM**: Abstração de banco com migrations e seed
5. **Tailwind CSS**: Estilização utilitária com design tokens
6. **Autenticação**: ainda não implementada; o login atual é apenas demonstrativo
7. **Zod para validação**: Validação de schemas front e back
8. **LGPD compliance**: Dados sensíveis criptografados e consentimento explícito

## 📞 Suporte

Em caso de emergência médica, ligue para **SAMU 192** ou procure a **UPA** mais próxima.