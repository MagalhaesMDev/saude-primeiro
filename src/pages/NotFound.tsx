import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-16">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Página não encontrada</CardTitle>
          <CardDescription>
            A página que você procura não existe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="success" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Voltar ao início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}