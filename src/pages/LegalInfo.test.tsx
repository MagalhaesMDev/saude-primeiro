import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import LegalInfoPage from "./LegalInfo";

describe("LegalInfoPage", () => {
  it("explica armazenamento e remoção dos dados locais", () => {
    render(
      <MemoryRouter initialEntries={["/privacidade"]}>
        <LegalInfoPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Privacidade no protótipo" })).toBeInTheDocument();
    expect(screen.getByText(/não é criptografado por este protótipo/i)).toBeInTheDocument();
    expect(screen.getByText(/limpando o armazenamento\/site data/i)).toBeInTheDocument();
  });

  it("separa os termos demonstrativos da política de privacidade", () => {
    render(
      <MemoryRouter initialEntries={["/termos"]}>
        <LegalInfoPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Termos da demonstração" })).toBeInTheDocument();
    expect(screen.getByText(/não cria contrato, apólice, cobrança/i)).toBeInTheDocument();
  });
});
