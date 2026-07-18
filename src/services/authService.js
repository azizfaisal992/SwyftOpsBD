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

export const registerWithEmail = async ({ name, email, password }) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (name) {
    await updateProfile(result.user, { displayName: name });
  }

  return result.user;
};

export const loginWithEmail = async ({ email, password }) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const requestPasswordReset = (email) =>
  sendPasswordResetEmail(auth, email);

export const logout = () => signOut(auth);
