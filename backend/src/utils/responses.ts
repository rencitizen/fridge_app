export type ApiMeta = { timestamp: string };
export type ApiErrorPayload = { code: string; message: string; details?: unknown };

export type ApiSuccess<T> = { success: true; data: T; error: null; meta: ApiMeta };
export type ApiFailure = { success: false; data: null; error: ApiErrorPayload; meta: ApiMeta };

export function createOk<T>(data: T): ApiSuccess<T> {
  return { success: true, data, error: null, meta: { timestamp: new Date().toISOString() } };
}

export function createFail(status: number, error: ApiErrorPayload): ApiFailure {
  return { success: false, data: null, error, meta: { timestamp: new Date().toISOString() } };
}
