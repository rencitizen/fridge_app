import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { env } from './env.js';

function buildServiceAccount(): ServiceAccount | undefined {
  if (env.gcpCredentialsBase64) {
    const json = Buffer.from(env.gcpCredentialsBase64, 'base64').toString('utf-8');
    return JSON.parse(json) as ServiceAccount;
  }

  if (env.firebaseProjectId && env.firebaseClientEmail && env.firebasePrivateKey) {
    return {
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey,
    } satisfies ServiceAccount;
  }

  return undefined;
}

export function initializeFirebaseIfNeeded() {
  if (getApps().length > 0) return;
  const serviceAccount = buildServiceAccount();
  initializeApp(
    serviceAccount
      ? {
          credential: cert(serviceAccount),
          storageBucket: env.gcloudStorageBucket,
        }
      : {
          storageBucket: env.gcloudStorageBucket,
        },
  );
}

export const db = () => getFirestore();
export const storage = () => getStorage().bucket(env.gcloudStorageBucket);

