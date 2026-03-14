import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserManagement from "../pages/UserManagement";

vi.mock("../api/client", () => ({
  apiGet: vi.fn().mockResolvedValue([
    { id: 1, firstName: "Ana", lastName: "Pop", email: "ana@test.ro", role: "PATIENT" },
  ]),
  apiDelete: vi.fn().mockResolvedValue(undefined),
}));

beforeEach(() => localStorage.clear());

describe("UserManagement", () => {
  it("afiseaza titlul paginii", async () => {
    await act(async () => {
      render(<MemoryRouter><UserManagement /></MemoryRouter>);
    });
    expect(screen.getByRole("heading", { name: /Gestionare utilizatori/i })).toBeTruthy();
  });

  it("afiseaza sectiunea de adaugare utilizator", async () => {
    await act(async () => {
      render(<MemoryRouter><UserManagement /></MemoryRouter>);
    });
    // Folosim getByRole heading pentru a evita conflictul cu butonul
    expect(screen.getByRole("heading", { name: /Adaugă utilizator/i })).toBeTruthy();
  });

  it("afiseaza campul de input pentru nume complet", async () => {
    await act(async () => {
      render(<MemoryRouter><UserManagement /></MemoryRouter>);
    });
    expect(screen.getByPlaceholderText(/Ex: Ionescu Ana/i)).toBeTruthy();
  });

  it("afiseaza sectiunea utilizatori inregistrati", async () => {
    await act(async () => {
      render(<MemoryRouter><UserManagement /></MemoryRouter>);
    });
    expect(screen.getByText(/Utilizatori înregistrați în sistem/i)).toBeTruthy();
  });
});
