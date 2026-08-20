import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  claims: {},
  account: null,
  permissions: [],
  accountError: "",
  loading: true,
  refreshAccount: async () => null,
});

export default AuthContext;
