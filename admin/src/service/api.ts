const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function buildUrl(path: string) {
  return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function apiRequest<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  const res = await fetch(buildUrl(url), options);

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

    throw new Error(message);
  }

  return data as T;
}

function get<T>(url: string): Promise<T> {
  return apiRequest<T>(url, {
    method: "GET",
  });
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
  return apiRequest<T>(url, {
    method: "DELETE",
  });
}

export { get, post, put, del };