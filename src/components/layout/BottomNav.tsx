"use client";

import { NavLink } from "react-router-dom";
import { Home, Shield, Heart, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Início", href: "/", icon: Home },
  { label: "Meu Seguro", href: "/meu-seguro", icon: Shield },
  { label: "Cuidar", href: "/cuidar", icon: Heart },
  { label: "Aprender", href: "/aprender", icon: BookOpen },
  { label: "Ciclo", href: "/saude-feminina", icon: Heart },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 h-full px-3 min-w-[60px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}