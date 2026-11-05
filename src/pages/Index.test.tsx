import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IndexPage from "./Index";

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
    expect(screen.getByText(/proteção que cabe no seu bolso/i)).toBeInTheDocument();
  });

  it("deve renderizar o botão de ver planos", () => {
    renderIndexPage();
    expect(screen.getByRole("button", { name: /ver planos/i })).toBeInTheDocument();
  });

  it("deve renderizar o simulador de plano", () => {
    renderIndexPage();
    expect(screen.getByText(/simulador em 30 segundos/i)).toBeInTheDocument();
  });
});