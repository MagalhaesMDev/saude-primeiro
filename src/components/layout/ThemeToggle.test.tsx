import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("alterna entre os temas", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="test-theme-toggle">
        <ThemeToggle />
      </ThemeProvider>
    );

    const darkButton = await screen.findByRole("button", { name: "Ativar tema escuro" });
    fireEvent.click(darkButton);

    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));

    fireEvent.click(screen.getByRole("button", { name: "Ativar tema claro" }));

    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
  });
});
