import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  claims: {},
  loading: true,
});

export default AuthContext;
