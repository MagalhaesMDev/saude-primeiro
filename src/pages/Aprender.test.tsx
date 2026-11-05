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
      dailyPoints: 25,
      dailyPointsDate: todayKey(),
      quizAnswered: false,
      quizCorrect: null,
      quizSelectedAnswer: null,
    });
  });

  it("responde ao selecionar uma alternativa e registra pontos demonstrativos", () => {
    renderAprenderPage();

    fireEvent.click(screen.getByRole("button", { name: /dobrar os joelhos/i }));

    expect(usePrototypeStore.getState().quizCorrect).toBe(true);
    expect(usePrototypeStore.getState().quizSelectedAnswer).toBe(1);
    expect(usePrototypeStore.getState().points).toBe(290);
    expect(screen.getByRole("status")).toHaveTextContent(/ganhou 10 pontos demonstrativos/i);
    expect(screen.getByRole("button", { name: /dobrar os joelhos/i })).toBeDisabled();
  });

  it("exibe a alternativa correta sem conceder pontos para uma resposta incorreta", () => {
    renderAprenderPage();

    fireEvent.click(screen.getByRole("button", { name: /curvar a coluna/i }));

    expect(usePrototypeStore.getState().quizCorrect).toBe(false);
    expect(usePrototypeStore.getState().points).toBe(280);
    expect(screen.getByRole("status")).toHaveTextContent(/resposta incorreta/i);
    expect(screen.getByText(/dobre os joelhos, mantenha as costas eretas/i)).toBeInTheDocument();
  });
});
