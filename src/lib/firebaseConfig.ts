export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
};

function requireEnv(name: string): string {
  const value = (import.meta as any).env?.[name] as string | undefined;
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function getFirebaseClientConfig(): FirebaseClientConfig {
  return {
    apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
    authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: requireEnv('VITE_FIREBASE_APP_ID'),
    measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
  };
}

