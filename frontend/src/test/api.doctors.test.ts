import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDoctors } from "../api/doctors";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: (key: string) => key === "content-type" ? "application/json" : null,
    },
    json: async () => body,
    text: async () => String(body),
  } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe("getDoctors", () => {
  it("returneaza lista de doctori", async () => {
    const doctors = [
      { id: 1, firstName: "Maria", lastName: "Popa", specialization: "Medicina Generala", department: "Ambulatoriu" },
    ];
    mockFetch.mockResolvedValue(makeResponse(doctors));

    const result = await getDoctors();
    expect(result).toHaveLength(1);
    expect(result[0].specialization).toBe("Medicina Generala");
  });

  it("returneaza array gol cand nu exista doctori", async () => {
    mockFetch.mockResolvedValue(makeResponse([]));
    const result = await getDoctors();
    expect(result).toEqual([]);
  });
});
