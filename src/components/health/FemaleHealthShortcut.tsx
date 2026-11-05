import { ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export function FemaleHealthShortcut() {
  return (
    <Link
      to="/saude-feminina"
      aria-label="Abrir Saúde Feminina"
      className="block min-h-11 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feminine focus-visible:ring-offset-2"
    >
      <Card className="rounded-2xl border-feminine/30 bg-feminine/5 transition-colors hover:bg-feminine/10">
        <CardContent className="flex items-center gap-3 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-feminine/10 text-feminine">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold tracking-[0.14em] text-feminine">
              SAÚDE FEMININA
            </span>
            <span className="mt-1 block font-bold text-foreground">
              Ciclo e bem-estar feminino
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              Acompanhe seu ciclo, sintomas e autocuidado com privacidade.
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-feminine/10 text-feminine">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
