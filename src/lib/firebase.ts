import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseClientConfig } from './firebaseConfig';

const firebaseConfig = getFirebaseClientConfig();

const app = initializeApp(firebaseConfig);

// Use the default Firestore database.
export const db = getFirestore(app);
export const auth = getAuth(app);

// Firebase Analytics requires a browser environment.
export const analytics =
  typeof window !== 'undefined' ? getAnalytics(app) : (null as unknown as ReturnType<typeof getAnalytics>);


