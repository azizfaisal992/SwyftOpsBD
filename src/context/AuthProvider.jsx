import { getIdTokenResult, onIdTokenChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import AuthContext from "./auth-context";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setClaims({});
        setLoading(false);
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(currentUser);
        setClaims(tokenResult.claims);
      } catch {
        setClaims({});
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, claims, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
