import { ArrowLeft, ShieldCheck, Scale } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { HealthDisclaimerFooter } from "@/components/health/HealthDisclaimerFooter";

const PRIVACY_ITEMS = [
  {
    title: "Armazenamento neste protótipo",
    text: "Lembretes, preferências, registros de ciclo e dados da sessão de demonstração são mantidos no armazenamento local do navegador. Esse armazenamento não é criptografado por este protótipo e pode ser acessado por outras pessoas que usem o mesmo perfil do navegador.",
  },
  {
    title: "Não use dados reais",
    text: "Não informe senha real, documentos, informações de saúde identificáveis ou dados de pagamento. O login é apenas uma simulação e não verifica sua identidade.",
  },
  {
    title: "Como remover os dados",
    text: "Você pode sair da sessão pelo menu do perfil e apagar os dados salvos limpando o armazenamento/site data deste site nas configurações do navegador. Isso também remove preferências locais.",
  },
  {
    title: "Serviços externos",
    text: "Este protótipo não conecta consultas, seguradoras, atendimento, pagamentos ou recuperação de senha. Se estiver acessando uma versão hospedada, a infraestrutura que entrega o site ainda pode registrar dados técnicos de acesso; consulte o responsável pela publicação para informações específicas.",
  },
];

const TERMS_ITEMS = [
  {
    title: "Demonstração, sem contratação",
    text: "Planos, preços, coberturas, descontos, cashback e pontuação são exemplos de interface. Selecionar um plano ou acionar um formulário não cria contrato, apólice, cobrança, solicitação ou direito a benefício.",
  },
  {
    title: "Conteúdo de saúde",
    text: "As informações são educativas, não constituem diagnóstico ou orientação médica individual e não substituem atendimento profissional. Em emergência, ligue para o SAMU pelo 192.",
  },
  {
    title: "Sem serviços conectados",
    text: "Lembretes e progresso são demonstrações locais. Nenhum lembrete é enviado, consulta é marcada ou pedido é transmitido a uma seguradora.",
  },
  {
    title: "Uso seguro",
    text: "Não use este protótipo para tomar decisões de saúde, financeiras ou de contratação. Confirme condições e informações nos canais oficiais e com profissionais qualificados.",
  },
];

export default function LegalInfoPage() {
  const isPrivacy = useLocation().pathname === "/privacidade";
  const title = isPrivacy ? "Privacidade no protótipo" : "Termos da demonstração";
  const items = isPrivacy ? PRIVACY_ITEMS : TERMS_ITEMS;
  const Icon = isPrivacy ? ShieldCheck : Scale;

  return (
    <main className="min-h-screen bg-background px-4 pb-28 pt-20">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar ao início
        </Link>
        <div className="mb-5 mt-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-xs text-muted-foreground">Informações sobre esta versão demonstrativa.</p>
          </div>
        </div>
        <Card>
          <CardContent className="space-y-5 p-5">
            {items.map((item) => (
              <section key={item.title}>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </section>
            ))}
            <div className="flex flex-wrap gap-4 border-t pt-4 text-sm">
              <Link to="/privacidade" className="font-medium text-primary underline-offset-4 hover:underline">Privacidade</Link>
              <Link to="/termos" className="font-medium text-primary underline-offset-4 hover:underline">Termos da demonstração</Link>
            </div>
          </CardContent>
        </Card>
        <HealthDisclaimerFooter />
      </div>
    </main>
  );
}
