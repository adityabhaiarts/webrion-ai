import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";
import type { UserProfile } from "../types";

export function createDefaultUserProfile(user: User, fullName?: string): UserProfile {
  const now = Date.now();

  return {
    uid: user.uid,
    fullName: fullName || user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    plan: "free",
    theme: "Dark Green",
    font: "Inter",
    businessName: "",
    phoneNumber: "",
    defaultWebsiteType: "Business Landing Page",
    createdAt: now,
    updatedAt: now
  };
}

export async function ensureUserProfile(user: User, fullName?: string) {
  const profileRef = doc(db, "users", user.uid);
  const profileSnap = await getDoc(profileRef);
  const fallback = createDefaultUserProfile(user, fullName);

  if (!profileSnap.exists()) {
    await setDoc(profileRef, fallback);
    return fallback;
  }

  const existing = profileSnap.data() as Partial<UserProfile>;
  const profile: UserProfile = {
    ...fallback,
    ...existing,
    uid: user.uid,
    email: user.email || existing.email || "",
    photoURL: user.photoURL || existing.photoURL || "",
    fullName: fullName || user.displayName || existing.fullName || "",
    updatedAt: Date.now()
  };

  await setDoc(profileRef, profile, { merge: true });
  return profile;
}

