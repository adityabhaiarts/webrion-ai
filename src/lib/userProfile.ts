import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile } from "../types";

export function createDefaultProfile(user: User, fullName?: string): UserProfile {
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
    updatedAt: now,
  };
}

export async function ensureUserProfile(user: User, fullName?: string): Promise<UserProfile> {
  const fallback = createDefaultProfile(user, fullName);

  if (!db) {
    return fallback;
  }

  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, fallback);
    return fallback;
  }

  const existing = snapshot.data() as Partial<UserProfile> & { fontPreference?: string };
  const profile: UserProfile = {
    ...fallback,
    ...existing,
    uid: user.uid,
    fullName: fullName || user.displayName || existing.fullName || "",
    email: user.email || existing.email || "",
    photoURL: user.photoURL || existing.photoURL || "",
    plan: existing.plan || "free",
    theme: existing.theme || "Dark Green",
    font: existing.font || existing.fontPreference || "Inter",
    businessName: existing.businessName || "",
    phoneNumber: existing.phoneNumber || "",
    defaultWebsiteType: existing.defaultWebsiteType || "Business Landing Page",
    createdAt: existing.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(ref, profile, { merge: true });
  return profile;
}
