"use client";

import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ShieldPlus, HeartHandshake, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Painel", href: "/painel", icon: LayoutDashboard },
  { label: "Meu Seguro", href: "/meu-seguro", icon: ShieldPlus },
  { label: "Cuidar", href: "/cuidar", icon: HeartHandshake },
  { label: "Aprender", href: "/aprender", icon: BookOpen },
];

export function BottomNav() {
  const location = useLocation();
  const isFeminine = location.pathname === "/saude-feminina";

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md ${isFeminine ? "border-feminine/15 bg-feminine-background/95" : "border-border bg-background/95"}`}>
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-around px-2 sm:px-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex h-12 min-w-[68px] max-w-28 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 transition-colors",
                  isActive || (item.href === "/cuidar" && location.pathname === "/saude-feminina")
                    ? isFeminine ? "bg-feminine/10 text-feminine" : "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.label === "Aprender" && (
                  <span aria-label="3 lições disponíveis" className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-success px-1 text-[9px] font-bold text-success-foreground">3</span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}