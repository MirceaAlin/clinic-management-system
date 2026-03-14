import { apiPost } from "./client";

export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiPost<LoginResponse, { email: string; password: string }>(
    "/auth/login",
    { email, password }
  );
}
