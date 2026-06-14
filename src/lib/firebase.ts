import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseClientConfig, getMissingFirebaseEnv, hasFirebaseConfig } from './firebaseConfig';

export const missingFirebaseEnv = getMissingFirebaseEnv();
export const isFirebaseReady = hasFirebaseConfig();

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let analyticsInstance: Analytics | null = null;

if (isFirebaseReady) {
  const firebaseConfig = getFirebaseClientConfig();
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);

  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    try {
      analyticsInstance = getAnalytics(app);
    } catch (error) {
      console.warn('[Webrion] Firebase Analytics was not started:', error);
    }
  }
} else {
  console.warn('[Webrion] Firebase is not configured. Missing:', missingFirebaseEnv.join(', '));
}

export const firebaseApp = app;
export const auth = authInstance;
export const db = dbInstance;
export const analytics = analyticsInstance;
