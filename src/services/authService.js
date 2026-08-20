import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { configureBrowserSessionPersistence } from "./firebaseSession";
import { initializeAuthenticatedAccount } from "./identityService";

export const registerWithEmail = async ({
  name,
  email,
  password,
  accountType,
}) => {
  await configureBrowserSessionPersistence();
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (name) {
    await updateProfile(result.user, { displayName: name });
    await result.user.getIdToken(true);
  }

  await initializeAuthenticatedAccount(result.user, accountType);
  return result.user;
};

export const loginWithEmail = async ({ email, password, accountType }) => {
  await configureBrowserSessionPersistence();
  const result = await signInWithEmailAndPassword(auth, email, password);
  await initializeAuthenticatedAccount(result.user, accountType);
  return result.user;
};

export const loginWithGoogle = async (accountType) => {
  await configureBrowserSessionPersistence();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  await initializeAuthenticatedAccount(result.user, accountType);
  return result.user;
};

export const requestPasswordReset = (email) =>
  sendPasswordResetEmail(auth, email);

export const logout = () => signOut(auth);
