import { describe, expect, it } from "vitest";
import { getLocalAssistantResponse } from "./localAssistant";
import type { LocalReminder } from "@/store/prototypeStore";

const reminders: LocalReminder[] = [
  {
    id: "exam",
    title: "Hemograma Completo",
    type: "EXAM",
    scheduledAt: "2026-11-18T08:00:00.000Z",
    details: "",
    done: false,
  },
  {
    id: "consultation",
    title: "Teleconsulta",
    type: "CONSULTATION",
    scheduledAt: "2026-11-19T14:30:00.000Z",
    details: "",
    done: false,
  },
];

describe("getLocalAssistantResponse", () => {
  it("guides the user to a section without making changes", () => {
    const response = getLocalAssistantResponse("Quero aprender", reminders, 0);

    expect(response.links).toEqual([{ label: "Abrir Aprender", href: "/aprender" }]);
    expect(response.action).toBeUndefined();
  });

  it("asks for confirmation before marking a matching reminder as done", () => {
    const response = getLocalAssistantResponse("Marcar exame como feito", reminders, 0);

    expect(response.action).toEqual({
      type: "complete-reminder",
      reminderId: "exam",
      title: "Hemograma Completo",
    });
  });

  it("offers a local plan selection only after an explicit selection request", () => {
    const response = getLocalAssistantResponse("Selecionar plano Essencial", reminders, 0);

    expect(response.action).toEqual({ type: "select-plan", name: "Essencial", price: 14.9 });
    expect(getLocalAssistantResponse("Explique o plano Essencial", reminders, 0).action).toBeUndefined();
  });

  it("does not offer cashback redemption when there is no available balance", () => {
    const response = getLocalAssistantResponse("Resgatar cashback", reminders, 0);

    expect(response.action).toBeUndefined();
    expect(response.text).toContain("Não há saldo");
  });
});
