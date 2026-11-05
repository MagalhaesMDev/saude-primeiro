import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CuidarPage from "./Cuidar";

describe("CuidarPage", () => {
  it("exibe o atalho para Saúde Feminina apontando para a rota correta", () => {
    render(
      <MemoryRouter>
        <CuidarPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Abrir Saúde Feminina" })).toHaveAttribute(
      "href",
      "/saude-feminina"
    );
  });
});
