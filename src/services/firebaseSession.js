import {
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export const configureBrowserSessionPersistence = () =>
  setPersistence(auth, browserSessionPersistence);
