import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  GCLOUD_PROJECT_ID: z.string().optional(),
  GCLOUD_STORAGE_BUCKET: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS_BASE64: z.string().optional(),
  REDIS_URL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

const rawEnv = EnvSchema.parse(process.env);

function normalizePrivateKey(maybeKey: string | undefined): string | undefined {
  if (!maybeKey) return undefined;
  // Support keys provided with literal \n sequences
  return maybeKey.replace(/\\n/g, '\n');
}

export const env = {
  port: rawEnv.PORT ? Number(rawEnv.PORT) : 8080,
  corsOrigin: rawEnv.CORS_ORIGIN,
  firebaseProjectId: rawEnv.FIREBASE_PROJECT_ID,
  firebaseClientEmail: rawEnv.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: normalizePrivateKey(rawEnv.FIREBASE_PRIVATE_KEY),
  gcloudProjectId: rawEnv.GCLOUD_PROJECT_ID,
  gcloudStorageBucket: rawEnv.GCLOUD_STORAGE_BUCKET,
  gcpCredentialsBase64: rawEnv.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
  redisUrl: rawEnv.REDIS_URL,
  geminiApiKey: rawEnv.GEMINI_API_KEY,
} as const;

export function getCorsOriginOption(): true | string | RegExp | (string | RegExp)[] {
  if (!env.corsOrigin || env.corsOrigin === '*') {
    return true; // reflect request origin (allows all origins)
  }
  const entries = env.corsOrigin
    .split(',')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);
  return entries.length === 1 ? entries[0] : entries;
}

