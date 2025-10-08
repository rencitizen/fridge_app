export type ApiMeta = { timestamp: string };
export type ApiErrorPayload = { code: string; message: string; details?: unknown };
export type ApiSuccess<T> = { success: true; data: T; error: null; meta: ApiMeta };

function parseResponse<T>(res: Response): Promise<ApiSuccess<T>> {
  if (!res.ok) {
    return res.json().then((j) => {
      const errMessage = j?.error?.message || `HTTP ${res.status}`;
      throw new Error(errMessage);
    });
  }
  return res.json();
}

async function get<T>(path: string, init?: RequestInit): Promise<ApiSuccess<T>> {
  const res = await fetch(path, { ...init, method: 'GET' });
  return parseResponse<T>(res);
}

async function post<T>(path: string, body?: unknown, init?: RequestInit): Promise<ApiSuccess<T>> {
  const res = await fetch(path, {
    ...init,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: body == null ? undefined : JSON.stringify(body)
  });
  return parseResponse<T>(res);
}

export const apiClient = { get, post };

