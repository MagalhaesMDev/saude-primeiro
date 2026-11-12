import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import IndexPage from "./Index";
import DashboardPage from "./Dashboard";
import { usePrototypeStore } from "@/store/prototypeStore";

function renderPage(page: ReactNode) {
  return render(
    <MemoryRouter>
      {page}
    </MemoryRouter>
  );
}

describe("Landing page", () => {
  it("apresenta a proposta e direciona para a demonstração", () => {
    renderPage(<IndexPage />);
    expect(screen.getByRole("heading", { name: /cuidar de você também é proteger o seu trabalho/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /conheça a demonstração/i })).toHaveAttribute("href", "/painel");
  });

  it("explica que os depoimentos são ilustrativos e inclui FAQ acessível", () => {
    renderPage(<IndexPage />);
    expect(screen.getByText(/não são depoimentos de clientes/i)).toBeInTheDocument();
    const question = screen.getByText(/este site oferece um plano de saúde ou seguro para contratar/i);
    fireEvent.click(question);
    expect(screen.getByText(/nenhum botão gera proposta, contrato, cobrança ou cobertura/i)).toBeVisible();
  });
});

describe("DashboardPage", () => {
  it("deve renderizar o simulador de plano", () => {
    renderPage(<DashboardPage />);
    expect(screen.getByText(/simulador em 30 segundos/i)).toBeInTheDocument();
    expect(screen.getByText(/qual plano cabe na sua rotina/i)).toBeInTheDocument();
    expect(screen.getByText(/quem você quer proteger/i)).toBeInTheDocument();
    expect(screen.getByText(/qual é a sua principal preocupação/i)).toBeInTheDocument();
    expect(screen.getByText(/quanto cabe no seu orçamento mensal/i)).toBeInTheDocument();
    expect(screen.getByText(/plano recomendado para você/i)).toBeInTheDocument();
  });

  it("recalcula a recomendação e apenas seleciona o plano demonstrativo", () => {
    usePrototypeStore.setState({ selectedPlan: null });
    renderPage(<DashboardPage />);

    fireEvent.click(screen.getByRole("button", { name: "Acima de R$ 30" }));
    expect(screen.getByRole("heading", { name: "Renda" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Selecionar para comparar" }));
    expect(usePrototypeStore.getState().selectedPlan).toEqual({ name: "Renda", price: 39.9 });
    expect(screen.getByText(/não gera contrato, cobrança ou cobertura/i)).toBeInTheDocument();
  });
});