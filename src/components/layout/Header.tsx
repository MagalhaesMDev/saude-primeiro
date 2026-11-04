"use client";

import { usePathname } from "next/navigation";
import { Shield, User, Menu, X } from "lucide-react";
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
  const pathname = usePathname();
  const { user, isLoading } = useAuthStore();
  const sectionLabel = SECTION_LABELS[pathname] || "";

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
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors lg:hidden">
            <Shield className="w-5 h-5" />
          </button>
          {user ? (
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="outline" size="sm" className="h-8 px-3">
              Entrar
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