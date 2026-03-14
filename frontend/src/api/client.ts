const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

if (import.meta.env.DEV) {
  console.log("API_BASE_URL =", API_BASE_URL);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  // defensive: res.headers poate lipsi/fi undefined in mock-uri de test vechi
  const contentType = res.headers?.get?.("content-type") ?? "application/json";
  if (res.status === 204 || !contentType.includes("application/json")) {
    return undefined as unknown as T;
  }
  return res.json() as Promise<T>;
}

function getAuthHeaders(): Record<string, string> {
  const user = localStorage.getItem("currentUser");
  const token = user ? JSON.parse(user).token : null;
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json", ...getAuthHeaders() },
  });
  return handleResponse<T>(res);
}

export async function apiPost<T, B = unknown>(path: string, body: B): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiPut<T, B = unknown>(path: string, body: B): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: { Accept: "application/json", ...getAuthHeaders() },
  });
  return handleResponse<void>(res);
}
