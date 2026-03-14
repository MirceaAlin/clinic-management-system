import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

describe("LoginPage", () => {
  it("afiseaza titlul si cele 3 carduri de rol", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Alege tipul de utilizator/i)).toBeTruthy();
    expect(screen.getByText(/Student/i)).toBeTruthy();
    expect(screen.getByText(/Personal medical/i)).toBeTruthy();
    expect(screen.getByText(/Administrator/i)).toBeTruthy();
  });

  it("afiseaza logo-ul MEDSTUD in navbar", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    // MEDSTUD apare o singura data in navbar
    expect(screen.getAllByText("MEDSTUD").length).toBeGreaterThan(0);
  });
});
