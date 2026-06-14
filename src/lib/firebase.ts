import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseClientConfig, hasFirebaseConfig } from './firebaseConfig';

let app: FirebaseApp | null = null;

if (hasFirebaseConfig()) {
  const firebaseConfig = getFirebaseClientConfig();
  app = initializeApp(firebaseConfig);
}

// These exports must exist for imports to work, but we guard usage.
export const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);
export const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);

// Firebase Analytics requires a browser environment.
export const analytics =
  app && typeof window !== 'undefined'
    ? getAnalytics(app)
    : (null as unknown as ReturnType<typeof getAnalytics>);

