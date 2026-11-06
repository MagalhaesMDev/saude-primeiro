import { AlertTriangle } from "lucide-react";

export function HealthDisclaimerFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-inherit px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">
              Aviso importante
            </p>
            <p>
              O conteúdo deste app é educativo e não substitui consulta médica.
              Em caso de emergência, ligue para{" "}
              <a href="tel:192" className="font-semibold text-success hover:underline">
                SAMU 192
              </a>{" "}
              ou procure a UPA mais próxima.
            </p>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>
            Valores, coberturas e parceiros são ilustrativos; este protótipo não oferece planos reais.
          </p>
        </div>
      </div>
    </footer>
  );
}