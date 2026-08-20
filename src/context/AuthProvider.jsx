import { getIdTokenResult, onIdTokenChanged } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { bootstrapCurrentUser } from "../services/identityService";
import AuthContext from "./auth-context";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [claims, setClaims] = useState({});
  const [account, setAccount] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [accountError, setAccountError] = useState("");
  const [loading, setLoading] = useState(true);

  const refreshAccount = useCallback(async (forceTokenRefresh = false) => {
    if (!auth.currentUser) return null;
    const tokenResult = await getIdTokenResult(
      auth.currentUser,
      forceTokenRefresh,
    );
    const result = await bootstrapCurrentUser();
    setClaims(tokenResult.claims);
    setAccount(result.account);
    setPermissions(result.permissions || []);
    setAccountError("");
    return result;
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (!currentUser) {
        setClaims({});
        setAccount(null);
        setPermissions([]);
        setAccountError("");
        setLoading(false);
        return;
      }

      try {
        await refreshAccount();
      } catch (error) {
        setClaims({});
        setAccount(null);
        setPermissions([]);
        setAccountError(error.message || "The account API is unavailable.");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [refreshAccount]);

  return (
    <AuthContext.Provider value={{
      user,
      claims,
      account,
      permissions,
      accountError,
      loading,
      refreshAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
