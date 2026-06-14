export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
};

function getEnv(name: string): string | undefined {
  return (import.meta as any).env?.[name] as string | undefined;
}

function warnOnce(message: string) {
  const key = `__warnOnce_${message}`;
  const w = (globalThis as any)[key] as boolean | undefined;
  if (w) return;
  (globalThis as any)[key] = true;
  // eslint-disable-next-line no-console
  console.warn(message);
}

/**
 * Firebase client config.
 *
 * IMPORTANT: Do not hard-crash the whole app when env vars are missing.
 * Instead, return an inert config and let auth-dependent pages show an error.
 */
export function getFirebaseClientConfig(): FirebaseClientConfig {
  const apiKey = getEnv('VITE_FIREBASE_API_KEY');
  const authDomain = getEnv('VITE_FIREBASE_AUTH_DOMAIN');
  const projectId = getEnv('VITE_FIREBASE_PROJECT_ID');
  const appId = getEnv('VITE_FIREBASE_APP_ID');

  const missing = [
    !apiKey ? 'VITE_FIREBASE_API_KEY' : null,
    !authDomain ? 'VITE_FIREBASE_AUTH_DOMAIN' : null,
    !projectId ? 'VITE_FIREBASE_PROJECT_ID' : null,
    !appId ? 'VITE_FIREBASE_APP_ID' : null,
  ].filter(Boolean) as string[];

  if (missing.length) {
    warnOnce(
      `[Webrion] Firebase env vars missing: ${missing.join(
        ', '
      )}. Auth/Firestore features will be disabled until you set them in .env.local (Vite) or deployment env.`
    );

    // Inert values to prevent the app from crashing at import time.
    return {
      apiKey: 'missing',
      authDomain: 'missing',
      projectId: 'missing',
      appId: 'missing',
      storageBucket: undefined,
      messagingSenderId: undefined,
      measurementId: undefined,
    };
  }

  return {
    apiKey: apiKey!,
    authDomain: authDomain!,
    projectId: projectId!,
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: appId!,
    measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
  };
}

export function hasFirebaseConfig(): boolean {
  return Boolean(
    getEnv('VITE_FIREBASE_API_KEY') &&
      getEnv('VITE_FIREBASE_AUTH_DOMAIN') &&
      getEnv('VITE_FIREBASE_PROJECT_ID') &&
      getEnv('VITE_FIREBASE_APP_ID')
  );
}

