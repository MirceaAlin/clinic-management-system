import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginRequest } from "../api/auth";

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

describe("loginRequest", () => {
  it("returneaza UserDTO la autentificare reusita", async () => {
    const user = { id: 1, firstName: "Ana", lastName: "Pop", email: "ana@test.ro", role: "PATIENT" };
    mockFetch.mockResolvedValue(makeResponse(user));

    const result = await loginRequest("ana@test.ro", "pass");
    expect(result).toEqual(user);
  });

  it("arunca eroare la credentiale gresite", async () => {
    mockFetch.mockResolvedValue(makeResponse("Invalid credentials", 401));
    await expect(loginRequest("x@x.com", "wrong")).rejects.toThrow("API error 401");
  });
});
