import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RoleLoginPage from "../pages/RoleLoginPage";

function renderWithRole(roleId: string) {
  return render(
    <MemoryRouter initialEntries={[`/login/${roleId}`]}>
      <Routes>
        <Route path="/login/:roleId" element={<RoleLoginPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RoleLoginPage", () => {
  it("afiseaza formularul de login", () => {
    renderWithRole("student");
    // Folosim getByRole pentru a viza specific heading-ul h1
    expect(screen.getByRole("heading", { name: /Conectează-te/i })).toBeTruthy();
    expect(screen.getByPlaceholderText(/exemplu@studmed/i)).toBeTruthy();
  });

  it("afiseaza eticheta corecta pentru rolul student", () => {
    renderWithRole("student");
    expect(screen.getByText(/Student – Pacient/i)).toBeTruthy();
  });

  it("afiseaza eticheta corecta pentru rolul personal", () => {
    renderWithRole("personal");
    expect(screen.getByText(/Personal medical/i)).toBeTruthy();
  });

  it("afiseaza campul de email", () => {
    renderWithRole("admin");
    expect(screen.getByPlaceholderText(/exemplu@studmed/i)).toBeTruthy();
  });

  it("afiseaza campul de parola", () => {
    renderWithRole("student");
    expect(screen.getByPlaceholderText(/Introduceți parola/i)).toBeTruthy();
  });
});
