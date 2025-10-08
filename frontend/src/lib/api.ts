import axios from 'axios';
import { env } from './env';

const client = axios.create({ baseURL: env.backendBaseUrl });

export type ApiSuccess<T> = { success: true; data: T; error: null };
export type ApiFailure = { success: false; error: { code: string; message: string } };

export async function getInventory() {
  const { data } = await client.get<ApiSuccess<{ items: unknown[] }>>('/api/inventory');
  return data.data.items;
}

export async function uploadImage(imageBase64: string, filename?: string) {
  const { data } = await client.post<ApiSuccess<{ jobId: string; gcsUri: string }>>('/api/upload', {
    imageBase64,
    filename,
  });
  return data.data;
}

export async function getUploadStatus(jobId: string) {
  const { data } = await client.get<ApiSuccess<{ state: string; progress: number; result: unknown }>>(
    `/api/upload/status/${encodeURIComponent(jobId)}`,
  );
  return data.data;
}

export async function suggestRecipes(ingredients: string[]) {
  const params = new URLSearchParams();
  if (ingredients.length > 0) params.set('ingredients', ingredients.join(','));
  const { data } = await client.get<ApiSuccess<{ recipes: unknown[] }>>(`/api/recipes/suggest?${params.toString()}`);
  return data.data.recipes;
}