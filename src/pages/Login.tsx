"use client";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setLoading } = useAuthStore();
  const [notice, setNotice] = useState("");
  const isRegister = location.pathname === "/cadastro";
  const isRecovery = location.pathname === "/esqueci-senha";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecovery) {
      setNotice("A recuperação de senha precisa de um serviço de e-mail configurado. Este protótipo não envia mensagens.");
      return;
    }
    setIsLoading(true);
    setLoading(true);
    login(
      { id: email.toLowerCase(), email, name: email.split("@")[0], role: "USER" },
      "demo-session"
    );
    setIsLoading(false);
    setLoading(false);
    navigate("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 pb-8 pt-20">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">
            {isRecovery ? "Recuperar senha" : isRegister ? "Criar conta de demonstração" : "Entrar na demonstração"}
          </CardTitle>
          <CardDescription>
            {isRecovery
              ? "A recuperação de conta não está disponível nesta demonstração."
              : "Use dados fictícios para explorar o protótipo; nenhuma conta real será criada."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {!isRecovery && <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha fictícia</Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Não use sua senha verdadeira"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>}
            {!isRecovery && <div className="flex justify-end">
              <Link to="/esqueci-senha" className="min-h-11 inline-flex items-center text-sm text-primary hover:underline">
                Esqueci minha senha
              </Link>
            </div>}
            <Button type="submit" variant="success" className="w-full" disabled={isLoading}>
              {isLoading ? "Aguarde..." : isRecovery ? "Continuar" : isRegister ? "Criar conta" : "Entrar"}
            </Button>
            {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-center text-muted-foreground">
            {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <Link to={isRegister ? "/login" : "/cadastro"} className="text-primary font-medium hover:underline">
              {isRegister ? "Entrar" : "Cadastre-se"}
            </Link>
          </p>
          <p className="text-xs text-center text-muted-foreground">
            Demonstração: qualquer senha fictícia é aceita e não é salva. A autenticação não é real.
          </p>
        </CardFooter>
      </Card>
      <p className="w-full max-w-md text-center text-xs text-muted-foreground">
        Leia os <Link to="/termos" className="text-primary underline-offset-4 hover:underline">termos da demonstração</Link> e a{" "}
        <Link to="/privacidade" className="text-primary underline-offset-4 hover:underline">privacidade no protótipo</Link>.
      </p>
    </main>
  );
}