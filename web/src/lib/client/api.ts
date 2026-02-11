type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

const DEFAULT_USER_ID = "u1";
const USER_ID_STORAGE_KEY = "consent-match-user-id";

export function getCurrentUserId(): string {
  if (typeof window === "undefined") {
    return DEFAULT_USER_ID;
  }
  return localStorage.getItem(USER_ID_STORAGE_KEY) ?? DEFAULT_USER_ID;
}

export function setCurrentUserId(userId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(USER_ID_STORAGE_KEY, userId);
}

async function request<T>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": getCurrentUserId(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = (await response.json()) as ApiResponse<T>;
  return json;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
