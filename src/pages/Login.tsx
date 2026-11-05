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
            {isRecovery ? "Recuperar senha" : isRegister ? "Criar conta de demonstração" : "Bem-vindo de volta"}
          </CardTitle>
          <CardDescription>
            {isRecovery
              ? "Informe seu e-mail para ver as opções disponíveis."
              : "Acesse o protótipo usando qualquer e-mail e senha."}
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
                <Label htmlFor="password">Senha</Label>
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>}
            {!isRecovery && <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-primary" />
                Lembrar de mim
              </label>
              <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
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
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Sessão de demonstração salva somente neste navegador. Não use dados reais.
          </p>
        </CardFooter>
      </Card>
      <p className="w-full max-w-md text-center text-xs text-muted-foreground">
        Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade.
      </p>
    </main>
  );
}