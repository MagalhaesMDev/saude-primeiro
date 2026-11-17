"use client";

import { useState, type FormEvent } from "react";
import { Bot, Check, Send, Sparkles, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getLocalAssistantResponse,
  type AssistantAction,
  type LocalAssistantResponse,
} from "@/lib/localAssistant";
import { usePrototypeStore } from "@/store/prototypeStore";

interface AssistantMessage extends LocalAssistantResponse {
  id: string;
  role: "assistant" | "user";
}

const INITIAL_MESSAGE: AssistantMessage = {
  id: "welcome",
  role: "assistant",
  text: "Oi! Posso explicar as seções e ajudar com algumas ações demonstrativas. Sou um assistente local: não envio suas mensagens para um serviço de IA.",
};

const SUGGESTIONS = [
  "Como adiciono um lembrete?",
  "O que posso fazer no app?",
  "Como funcionam os planos?",
];

function messageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function FloatingSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_MESSAGE]);
  const isFeminine = useLocation().pathname === "/saude-feminina";
  const cashbackEarned = usePrototypeStore((state) => state.cashbackEarned);
  const cashbackRedeemedCount = usePrototypeStore((state) => state.cashbackRedeemedCount);
  const cashbackAvailable = Math.max(Math.floor(cashbackEarned) - cashbackRedeemedCount, 0);

  const sendMessage = (rawMessage: string) => {
    const text = rawMessage.trim();
    if (!text) return;

    const state = usePrototypeStore.getState();
    const response = getLocalAssistantResponse(text, state.reminders, cashbackAvailable);
    setMessages((current) => [
      ...current,
      { id: messageId(), role: "user", text },
      { id: messageId(), role: "assistant", ...response },
    ]);
    setDraft("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const updateActionMessage = (id: string, text: string, href?: string) => {
    setMessages((current) => current.map((message) =>
      message.id === id
        ? {
            ...message,
            text: `${message.text}\n\n${text}`,
            action: undefined,
            ...(href ? { links: [{ label: "Abrir seção", href }] } : {}),
          }
        : message
    ));
  };

  const confirmAction = (message: AssistantMessage) => {
    const action = message.action;
    if (!action) return;

    const state = usePrototypeStore.getState();
    const result = runConfirmedAction(action, state);
    updateActionMessage(message.id, result.text, result.href);
  };

  const cancelAction = (message: AssistantMessage) => {
    if (!message.action) return;
    updateActionMessage(message.id, "Tudo bem, não fiz nenhuma alteração.");
  };

  return (
    <>
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Assistente IA"
          className="fixed bottom-28 right-4 z-[60] flex max-h-[min(36rem,calc(100dvh-9rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl sm:right-6"
        >
          <div className={`flex items-center justify-between gap-3 border-b p-4 ${isFeminine ? "border-feminine/15" : "border-border"}`}>
            <div className="flex min-w-0 items-center gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isFeminine ? "bg-feminine/10 text-feminine" : "bg-primary/10 text-primary"}`}>
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="font-semibold">Assistente IA</h2>
                <p className="text-xs text-muted-foreground">Ajuda local do Saúde Primeiro</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" aria-label="Fechar assistente" onClick={() => setIsOpen(false)}>
              <X aria-hidden="true" />
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[92%] rounded-2xl px-3 py-2.5 text-sm ${message.role === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted text-foreground"}`}>
                  <p className="whitespace-pre-wrap leading-5">{message.text}</p>

                  {message.links && message.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <Link
                          key={`${message.id}-${link.href}`}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex min-h-9 items-center rounded-full border border-primary/20 bg-background px-3 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {message.reminderChoices && (
                    <div className="mt-2 space-y-2">
                      {message.reminderChoices.map((reminder) => (
                        <Button
                          key={reminder.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-auto min-h-9 w-full justify-start whitespace-normal text-left"
                          onClick={() => sendMessage(`Marcar como feito: ${reminder.title}`)}
                        >
                          {reminder.title}
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.action && (
                    <div className="mt-3 flex gap-2">
                      <Button type="button" size="sm" onClick={() => confirmAction(message)}>
                        <Check className="mr-1 h-4 w-4" aria-hidden="true" />
                        Confirmar
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => cancelAction(message)}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="min-h-9 rounded-full border px-3 text-left text-xs text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-3">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Escreva sua dúvida..."
              aria-label="Mensagem para o assistente"
              autoComplete="off"
              maxLength={500}
            />
            <Button type="submit" size="icon" aria-label="Enviar mensagem" disabled={!draft.trim()}>
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
          <p className="px-4 pb-3 text-[10px] leading-4 text-muted-foreground">
            Protótipo local: não envia mensagens. Não substitui orientação de saúde; emergências, SAMU 192.
          </p>
        </aside>
      )}

      <Button
        className={`fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full p-0 text-primary-foreground shadow-lg hover:opacity-90 sm:bottom-20 sm:right-6 ${isFeminine ? "bg-feminine" : "bg-primary"}`}
        variant="default"
        size="icon"
        aria-label={isOpen ? "Fechar assistente IA" : "Abrir assistente IA"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
      </Button>
    </>
  );
}

function runConfirmedAction(
  action: AssistantAction,
  state: ReturnType<typeof usePrototypeStore.getState>,
): { text: string; href?: string } {
  if (action.type === "complete-reminder") {
    const reminder = state.reminders.find((entry) => entry.id === action.reminderId);
    if (!reminder || reminder.done) {
      return { text: "Esse lembrete não está mais pendente, então não alterei nada.", href: "/cuidar" };
    }
    state.completeReminder(action.reminderId);
    return { text: `Marquei “${action.title}” como feito neste navegador.`, href: "/cuidar" };
  }

  if (action.type === "redeem-cashback") {
    const available = Math.max(Math.floor(state.cashbackEarned) - state.cashbackRedeemedCount, 0);
    if (available < 1) {
      return { text: "O saldo demonstrativo mudou e não há valor disponível. Não fiz nenhuma alteração.", href: "/painel" };
    }
    state.redeemCashback();
    return { text: "Resgate demonstrativo registrado neste navegador. Nenhum dinheiro foi transferido.", href: "/painel" };
  }

  state.selectPlan(action.name, action.price);
  return { text: `Plano ${action.name} selecionado apenas para comparação. Nenhum seguro foi contratado.`, href: "/meu-seguro" };
}
