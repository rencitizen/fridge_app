import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { env } from './env';

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
};

export function initFirebase() {
  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
  }
}

export const auth = () => getAuth();
export const storage = () => getStorage();
export const googleProvider = new GoogleAuthProvider();