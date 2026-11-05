"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Shield, UserRound } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const SECTION_LABELS: Record<string, string> = {
  "/": "Início",
  "/meu-seguro": "Meu Seguro",
  "/cuidar": "Cuidar de Mim",
  "/aprender": "Aprender",
  "/saude-feminina": "Saúde Feminina",
};

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuthStore();
  const sectionLabel = SECTION_LABELS[location.pathname] || "";

  if (isLoading) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-primary leading-tight">
              Saúde Primeiro
            </h1>
            {sectionLabel && (
              <p className="text-xs text-muted-foreground leading-none">
                • {sectionLabel}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sair da conta"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm" className="h-9 px-3">
              <Link to="/login">
                <UserRound className="h-4 w-4" />
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function getInitials(text: string): string {
  return text
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}