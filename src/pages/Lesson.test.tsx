import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AprenderPage from "./Aprender";
import LessonPage from "./Lesson";
import { usePrototypeStore } from "@/store/prototypeStore";

function todayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function renderLesson() {
  return render(
    <MemoryRouter initialEntries={["/aprender/work/work-ride"]}>
      <Routes>
        <Route path="/aprender/:trailId/:lessonId" element={<LessonPage />} />
        <Route path="/aprender" element={<AprenderPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function openAllSteps() {
  for (let index = 1; index <= 3; index += 1) {
    fireEvent.click(screen.getByText(`Etapa ${index}`, { exact: true }));
  }
}

describe("LessonPage", () => {
  beforeEach(() => {
    usePrototypeStore.setState({
      points: 0,
      pointsToday: 0,
      pointsDate: todayKey(),
      cashbackEarned: 0,
      lessonProgress: {},
    });
  });

  it("only enables completion after all steps and quiz answers, then awards once", () => {
    renderLesson();

    const completeButton = screen.getByRole("button", { name: "Concluir lição" });
    expect(completeButton).toBeDisabled();

    openAllSteps();
    fireEvent.click(screen.getByRole("button", { name: /conferir os itens de segurança/i }));
    fireEvent.click(screen.getByRole("button", { name: "Próxima pergunta" }));
    fireEvent.click(screen.getByRole("button", { name: /parar em local seguro e descansar/i }));
    fireEvent.click(screen.getByRole("button", { name: "Finalizar quiz" }));

    expect(screen.getByRole("button", { name: "Concluir lição" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Concluir lição" }));

    expect(screen.getByRole("status")).toHaveTextContent(/lição concluída: deslocamentos com mais atenção/i);
    expect(usePrototypeStore.getState().points).toBe(10);
    expect(usePrototypeStore.getState().cashbackEarned).toBe(0.2);
    expect(usePrototypeStore.getState().lessonProgress["work-ride"]?.quizScore).toBe(2);

    usePrototypeStore.getState().completeLesson("work-ride", 2, 10, 0.2);
    expect(usePrototypeStore.getState().points).toBe(10);
    expect(usePrototypeStore.getState().cashbackEarned).toBe(0.2);
  });

  it("allows retry after an incorrect answer without awarding points before completion", () => {
    renderLesson();
    openAllSteps();

    fireEvent.click(screen.getByRole("button", { name: /aumentar a velocidade para terminar mais rápido/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/resposta incorreta/i);
    fireEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));
    fireEvent.click(screen.getByRole("button", { name: /conferir os itens de segurança/i }));

    expect(usePrototypeStore.getState().points).toBe(0);
    expect(usePrototypeStore.getState().lessonProgress["work-ride"]).toBeUndefined();
  });
});
