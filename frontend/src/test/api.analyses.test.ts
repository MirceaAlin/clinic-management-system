import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAnalysesByPatientId } from "../api/analyses";

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

describe("getAnalysesByPatientId", () => {
  it("returneaza lista de analize pentru un pacient", async () => {
    const analyses = [
      { id: 1, testName: "Glicemie", result: "98", unit: "mg/dL", normalRange: "70-110", testDate: "2025-10-01", patientId: 1 },
    ];
    mockFetch.mockResolvedValue(makeResponse(analyses));

    const result = await getAnalysesByPatientId(1);
    expect(result).toHaveLength(1);
    expect(result[0].testName).toBe("Glicemie");
  });

  it("returneaza array gol daca pacientul nu are analize", async () => {
    mockFetch.mockResolvedValue(makeResponse([]));
    const result = await getAnalysesByPatientId(999);
    expect(result).toEqual([]);
  });

  it("apeleaza endpoint-ul corect cu patientId", async () => {
    mockFetch.mockResolvedValue(makeResponse([]));
    await getAnalysesByPatientId(42);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/analyses/patient/42"),
      expect.any(Object)
    );
  });
});
