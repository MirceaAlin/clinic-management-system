import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiGet, apiPost } from "../api/client";

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
    text: async () => JSON.stringify(body),
  } as unknown as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("apiGet", () => {
  it("returneaza datele JSON cand raspunsul este ok", async () => {
    mockFetch.mockResolvedValue(makeResponse({ id: 1, name: "Test" }));
    const data = await apiGet<{ id: number; name: string }>("/test");
    expect(data).toEqual({ id: 1, name: "Test" });
  });

  it("arunca eroare cand status-ul nu este ok", async () => {
    mockFetch.mockResolvedValue(makeResponse("Unauthorized", 401));
    await expect(apiGet("/secure")).rejects.toThrow("API error 401");
  });
});

describe("apiPost", () => {
  it("trimite body ca JSON si returneaza raspunsul", async () => {
    const payload = { email: "a@b.com", password: "pass" };
    const response = { id: 1, role: "PATIENT" };
    mockFetch.mockResolvedValue(makeResponse(response));

    const result = await apiPost<typeof response, typeof payload>("/auth/login", payload);
    expect(result).toEqual(response);

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body as string)).toEqual(payload);
  });
});
