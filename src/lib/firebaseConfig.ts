export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
};

const REQUIRED_FIREBASE_ENV = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

function getEnv(name: string): string | undefined {
  const value = import.meta.env?.[name];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function getMissingFirebaseEnv(): string[] {
  return REQUIRED_FIREBASE_ENV.filter((name) => !getEnv(name));
}

export function hasFirebaseConfig(): boolean {
  return getMissingFirebaseEnv().length === 0;
}

export function getFirebaseClientConfig(): FirebaseClientConfig {
  const missing = getMissingFirebaseEnv();

  if (missing.length) {
    throw new Error(
      `[Webrion] Missing Firebase env vars: ${missing.join(', ')}. Add them in Vercel Environment Variables and redeploy.`
    );
  }

  return {
    apiKey: getEnv('VITE_FIREBASE_API_KEY')!,
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN')!,
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID')!,
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID')!,
    measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
  };
}
