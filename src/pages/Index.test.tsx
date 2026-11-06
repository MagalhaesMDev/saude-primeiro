import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IndexPage from "./Index";
import { usePrototypeStore } from "@/store/prototypeStore";

function renderIndexPage() {
  return render(
    <MemoryRouter>
      <IndexPage />
    </MemoryRouter>
  );
}

describe("IndexPage", () => {
  it("deve renderizar o título principal", () => {
    renderIndexPage();
    expect(screen.getByRole("heading", { name: /proteção que cabe no seu bolso/i })).toBeInTheDocument();
  });

  it("deve renderizar o botão de ver planos", () => {
    renderIndexPage();
    expect(screen.getByRole("button", { name: /ver planos/i })).toBeInTheDocument();
  });

  it("deve renderizar o simulador de plano", () => {
    renderIndexPage();
    expect(screen.getByText(/simulador em 30 segundos/i)).toBeInTheDocument();
    expect(screen.getByText(/qual plano cabe na sua rotina/i)).toBeInTheDocument();
    expect(screen.getByText(/quem você quer proteger/i)).toBeInTheDocument();
    expect(screen.getByText(/qual é a sua principal preocupação/i)).toBeInTheDocument();
    expect(screen.getByText(/quanto cabe no seu orçamento mensal/i)).toBeInTheDocument();
    expect(screen.getByText(/plano recomendado para você/i)).toBeInTheDocument();
  });

  it("recalcula a recomendação e apenas seleciona o plano demonstrativo", () => {
    usePrototypeStore.setState({ selectedPlan: null });
    renderIndexPage();

    fireEvent.click(screen.getByRole("button", { name: "Acima de R$ 30" }));
    expect(screen.getByRole("heading", { name: "Renda" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Selecionar para comparar" }));
    expect(usePrototypeStore.getState().selectedPlan).toEqual({ name: "Renda", price: 39.9 });
    expect(screen.getByText(/não gera contrato, cobrança ou cobertura/i)).toBeInTheDocument();
  });
});