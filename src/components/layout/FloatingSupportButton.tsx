"use client";

import { useState } from "react";
import { Headset, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FloatingSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isFeminine = useLocation().pathname === "/saude-feminina";

  return (
    <>
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Ajuda e suporte"
          className="fixed bottom-28 right-4 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-xl border bg-background p-4 shadow-xl sm:right-6"
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold">Ajuda e suporte</h2>
            <Button variant="ghost" size="icon" aria-label="Fechar suporte" onClick={() => setIsOpen(false)}>
              <X />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            O canal de atendimento ainda não está conectado neste protótipo.
            Em emergência médica, ligue para o SAMU.
          </p>
          <a href="tel:192" className="mt-3 inline-block font-semibold text-primary underline">
            Ligar para o SAMU 192
          </a>
        </aside>
      )}
      <Button
        className={`fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full p-0 text-primary-foreground shadow-lg hover:opacity-90 sm:bottom-20 sm:right-6 ${isFeminine ? "bg-feminine" : "bg-primary"}`}
        variant="default"
        size="icon"
        aria-label="Abrir ajuda e suporte"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Headset className="w-5 h-5" />
      </Button>
    </>
  );
}