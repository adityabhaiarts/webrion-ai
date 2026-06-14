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
    theme: "Light Clean",
    font: "Inter",
    businessName: "",
    phoneNumber: "",
    defaultWebsiteType: "Business Landing Page",
    createdAt: now,
    updatedAt: now,
  };
}

export async function ensureUserProfile(user: User, fullName?: string): Promise<UserProfile> {
  const fallback = createDefaultUserProfile(user, fullName);

  if (!db) return fallback;

  try {
    const profileRef = doc(db, "users", user.uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      await setDoc(profileRef, fallback, { merge: true });
      return fallback;
    }

    const existing = profileSnap.data() as Partial<UserProfile> & { fontPreference?: string };
    const profile: UserProfile = {
      ...fallback,
      ...existing,
      uid: user.uid,
      email: user.email || existing.email || "",
      photoURL: user.photoURL || existing.photoURL || "",
      fullName: fullName || user.displayName || existing.fullName || "",
      theme: existing.theme || "Light Clean",
      font: existing.font || existing.fontPreference || "Inter",
      updatedAt: Date.now(),
    };

    setDoc(profileRef, profile, { merge: true }).catch((error) => {
      console.warn("[Webrion] Profile sync skipped:", error);
    });

    return profile;
  } catch (error) {
    console.warn("[Webrion] Using local profile fallback because Firestore is unavailable:", error);
    return fallback;
  }
}

export async function saveUserProfile(profile: UserProfile) {
  if (!db) return profile;
  try {
    await setDoc(doc(db, "users", profile.uid), profile, { merge: true });
  } catch (error) {
    console.warn("[Webrion] Could not save profile to Firestore:", error);
  }
  return profile;
}
