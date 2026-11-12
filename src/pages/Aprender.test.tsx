import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AprenderPage from "./Aprender";
import { usePrototypeStore } from "@/store/prototypeStore";

function todayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function renderAprenderPage() {
  return render(
    <MemoryRouter>
      <AprenderPage />
    </MemoryRouter>
  );
}

describe("AprenderPage", () => {
  beforeEach(() => {
    usePrototypeStore.setState({
      points: 280,
      pointsToday: 25,
      pointsDate: todayKey(),
      cashbackEarned: 5,
      lessonProgress: {},
    });
  });

  it("filtra trilhas e atualiza a lição em destaque e a prévia do quiz", () => {
    renderAprenderPage();

    fireEvent.click(screen.getByRole("button", { name: "Idosos" }));

    expect(screen.getByText("Filtro ativo: Idosos")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Casa segura para envelhecer com mais autonomia" })).toBeInTheDocument();
    expect(screen.getByText(/o que pode ajudar a tornar a circulação em casa mais organizada/i)).toBeInTheDocument();
    expect(screen.getByText("Cuidado e autonomia na melhor idade")).toBeInTheDocument();
    expect(screen.queryByText("Deslocamentos com mais atenção")).not.toBeInTheDocument();
  });

  it("mostra um estado vazio para um tema sem trilhas e permite voltar a todos", () => {
    renderAprenderPage();

    fireEvent.click(screen.getByRole("button", { name: "Seguros" }));

    expect(screen.getByText("Filtro ativo: Seguros")).toBeInTheDocument();
    expect(screen.getByText("Ainda não há trilhas para este tema.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver todos" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver todos" }));
    expect(screen.getByText("Filtro ativo: Todos")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Deslocamentos com mais atenção" })).toBeInTheDocument();
  });

  it("explica termos comuns no tradutor de seguros", () => {
    renderAprenderPage();

    fireEvent.click(screen.getByRole("button", { name: /Apólice/ }));
    expect(screen.getByText(/reúne as condições do seguro/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Prêmio/ }));
    expect(screen.getByText(/valor pago pelo seguro/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Indenizar/ }));
    expect(screen.getByText(/pagar ou compensar um prejuízo coberto/i)).toBeInTheDocument();
  });
});
