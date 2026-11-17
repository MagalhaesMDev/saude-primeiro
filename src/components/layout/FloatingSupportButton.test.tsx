import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { FloatingSupportButton } from "./FloatingSupportButton";
import { usePrototypeStore } from "@/store/prototypeStore";

describe("FloatingSupportButton", () => {
  beforeEach(() => {
    localStorage.clear();
    usePrototypeStore.setState({
      reminders: [{
        id: "assistant-test-exam",
        title: "Hemograma Completo",
        type: "EXAM",
        scheduledAt: "2026-11-18T08:00:00.000Z",
        details: "",
        done: false,
      }],
      cashbackEarned: 0,
      cashbackRedeemedCount: 0,
    });
  });

  it("requires confirmation before completing a reminder", () => {
    render(
      <MemoryRouter>
        <FloatingSupportButton />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Abrir assistente IA" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Mensagem para o assistente" }), {
      target: { value: "Marcar exame como feito" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(usePrototypeStore.getState().reminders[0].done).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(usePrototypeStore.getState().reminders[0].done).toBe(true);
    expect(screen.getByText(/Marquei “Hemograma Completo” como feito/)).toBeInTheDocument();
  });
});
