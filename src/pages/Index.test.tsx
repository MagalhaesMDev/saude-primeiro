import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IndexPage from "./Index";

describe("IndexPage", () => {
  it("deve renderizar o título principal", () => {
    render(<IndexPage />);
    expect(screen.getByText(/proteção que cabe no seu bolso/i)).toBeInTheDocument();
  });

  it("deve renderizar o botão de ver planos", () => {
    render(<IndexPage />);
    expect(screen.getByRole("button", { name: /ver planos/i })).toBeInTheDocument();
  });

  it("deve renderizar o simulador de plano", () => {
    render(<IndexPage />);
    expect(screen.getByText(/simulador em 30 segundos/i)).toBeInTheDocument();
  });
});