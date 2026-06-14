import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseReady, missingFirebaseEnv } from './firebase';
import { ensureUserProfile } from './firestore';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isFirebaseReady: boolean;
  missingFirebaseEnv: string[];
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isFirebaseReady,
  missingFirebaseEnv,
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!auth?.currentUser) {
      setProfile(null);
      return;
    }

    const nextProfile = await ensureUserProfile(auth.currentUser);
    setProfile(nextProfile);
  };

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const nextProfile = await ensureUserProfile(currentUser);
        setProfile(nextProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isFirebaseReady, missingFirebaseEnv, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
