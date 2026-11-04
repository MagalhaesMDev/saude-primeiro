import { AlertTriangle } from "lucide-react";

export function HealthDisclaimerFooter() {
  return (
    <footer className="border-t border-border bg-background py-6 px-4 mt-auto">
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
              ou procure a{" "}
              <a href="#" className="font-semibold text-success hover:underline">
                UPA
              </a>{" "}
              mais próxima.
            </p>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>
            Os valores e parceiros apresentados são ilustrativos. Consulte os termos do seu plano.
          </p>
        </div>
      </div>
    </footer>
  );
}