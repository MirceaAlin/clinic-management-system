import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ActivityLog from "../pages/ActivityLog";

beforeEach(() => localStorage.clear());

describe("ActivityLog", () => {
  it("afiseaza titlul paginii", () => {
    render(<MemoryRouter><ActivityLog /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Jurnal activități/i })).toBeTruthy();
  });

  it("afiseaza intrarile seed implicite cand nu exista date in localStorage", () => {
    render(<MemoryRouter><ActivityLog /></MemoryRouter>);
    // "Autentificare" apare de 3 ori in datele seed - verificam ca exista cel putin una
    const rows = screen.getAllByText(/Autentificare/i);
    expect(rows.length).toBeGreaterThan(0);
  });

  it("afiseaza butonul de stergere cand exista intrari", () => {
    render(<MemoryRouter><ActivityLog /></MemoryRouter>);
    expect(screen.getByText(/Șterge jurnalul/i)).toBeTruthy();
  });

  it("afiseaza numarul de intrari in header", () => {
    render(<MemoryRouter><ActivityLog /></MemoryRouter>);
    expect(screen.getByText(/intrări/i)).toBeTruthy();
  });

  it("afiseaza datele din localStorage cand exista", () => {
    const customLogs = [
      { id: 1, timestamp: "2025-12-01 10:00", action: "TestActiune", details: "Test detalii" },
    ];
    localStorage.setItem("activityLog", JSON.stringify(customLogs));
    render(<MemoryRouter><ActivityLog /></MemoryRouter>);
    expect(screen.getByText(/TestActiune/i)).toBeTruthy();
    expect(screen.getByText(/Test detalii/i)).toBeTruthy();
  });
});
