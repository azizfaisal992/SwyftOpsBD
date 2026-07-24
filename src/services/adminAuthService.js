import {
  getIdTokenResult,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export const ADMIN_ROLES = [
  "super_admin",
  "admin",
  "operations_manager",
  "verification_officer",
  "finance_officer",
  "support_agent",
  "analyst",
];

export const hasAdminAccess = (claims = {}) =>
  claims.admin === true && ADMIN_ROLES.includes(claims.role);

export const getAdminAccess = async (user, forceRefresh = false) => {
  if (!user) return { allowed: false, claims: {} };

  const tokenResult = await getIdTokenResult(user, forceRefresh);
  return {
    allowed: hasAdminAccess(tokenResult.claims),
    claims: tokenResult.claims,
  };
};

export const loginAdmin = async ({ email, password }) => {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  const access = await getAdminAccess(credential.user, true);
  if (!access.allowed) {
    await signOut(auth);
    const error = new Error(
      "This Firebase account is not authorized to access administration.",
    );
    error.code = "auth/admin-access-required";
    throw error;
  }

  return { user: credential.user, claims: access.claims };
};

export const loginAdminWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const credential = await signInWithPopup(auth, provider);

  const access = await getAdminAccess(credential.user, true);
  if (!access.allowed) {
    await signOut(auth);
    const error = new Error(
      "This Google account is not authorized to access administration.",
    );
    error.code = "auth/admin-access-required";
    throw error;
  }

  return { user: credential.user, claims: access.claims };
};

export const logoutAdmin = () => signOut(auth);

export const resetAdminPassword = (email) =>
  sendPasswordResetEmail(auth, email.trim());
