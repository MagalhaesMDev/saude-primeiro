"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Flower2, LogOut, Shield, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const SECTION_LABELS: Record<string, string> = {
  "/": "Início",
  "/painel": "Painel",
  "/meu-seguro": "Meu Seguro",
  "/cuidar": "Cuidar de Mim",
  "/aprender": "Aprender",
  "/saude-feminina": "Saúde Feminina",
  "/privacidade": "Privacidade",
  "/termos": "Termos de Uso",
};

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionLabel = SECTION_LABELS[location.pathname] || "";
  const isFeminine = location.pathname === "/saude-feminina";

  if (isLoading) return null;

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md",
        isFeminine
          ? "border-feminine/15 bg-feminine-background/95"
          : "border-border bg-background/95",
        className
      )}
    >
      <div className={cn("mx-auto flex max-w-3xl items-center justify-between px-4", isFeminine ? "h-14" : "h-16")}>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isFeminine ? "bg-gradient-to-tr from-feminine to-pink-300 text-white" : "bg-primary"
          )}>
            {isFeminine ? <Flower2 className="h-5 w-5" /> : <Shield className="h-5 w-5 text-primary-foreground" />}
          </div>
          <div>
            <h1 className={cn("text-sm font-bold leading-tight", isFeminine ? "text-foreground" : "text-primary")}>
              Saúde Primeiro
            </h1>
            {sectionLabel && (
              <p className={cn("text-[11px] font-semibold leading-none", isFeminine ? "text-feminine" : "text-success")}>
                <span aria-hidden="true">●</span> {sectionLabel}
              </p>
            )}
          </div>
        </div>

        <div className="relative flex items-center gap-1">
          <span className="sr-only">Seus dados ficam neste dispositivo neste protótipo.</span>
          <Shield aria-hidden="true" className={cn("h-5 w-5", isFeminine ? "text-feminine" : "text-primary")} />
          <ThemeToggle />
          {user ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir menu da conta"
              aria-expanded={menuOpen}
              className={cn("h-10 w-10 rounded-full text-primary-foreground hover:opacity-90", isFeminine ? "bg-feminine" : "bg-primary")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <UserRound className="h-5 w-5" />
            </Button>
          ) : (
            <Button asChild variant="ghost" size="icon" aria-label="Entrar ou abrir conta" className={cn("h-10 w-10 rounded-full text-primary-foreground hover:opacity-90", isFeminine ? "bg-feminine" : "bg-primary")}>
              <Link to="/login">
                <UserRound className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {user && menuOpen && (
            <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border bg-card p-2 shadow-lg">
              <p className="truncate px-3 py-2 text-xs text-muted-foreground">{user.name || user.email}</p>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
