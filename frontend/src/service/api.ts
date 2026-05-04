import { getUserFromLocalStorage } from "./user.service";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function buildUrl(path: string) {
  return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiRequest<T>(url: string, options: RequestInit): Promise<T> {
  const userId = getUserFromLocalStorage();

  const headers = {
    ...jsonHeaders,
    ...(options.headers || {}),
    ...(userId ? { "X-User-ID": userId } : {}),
  };

  const res = await fetch(buildUrl(url), {
    ...options,
    headers,
  });

  let data: unknown;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as any).message === "string"
        ? (data as any).message
        : "Request failed";

    throw new ApiError(res.status, message);
  }

  return data as T;
}

function get<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: "GET" });
}

function post<T>(url: string, body: unknown): Promise<T> {
  return apiRequest<T>(url, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
}

function put<T>(url: string, body: unknown): Promise<T> {
  return apiRequest<T>(url, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
}

function del<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: "DELETE" });
}

export { get, post, put, del };