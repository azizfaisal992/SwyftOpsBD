import { auth } from "../lib/firebase";
import { apiRequest } from "./apiClient";

const accountRoleByType = {
  family: "client",
  professional: "caregiver",
};

const pendingBootstraps = new Map();

export const bootstrapCurrentUser = () => {
  const uid = auth.currentUser?.uid || "pending-user";
  const pending = pendingBootstraps.get(uid);
  if (pending) return pending;

  const request = apiRequest("/users/bootstrap", { method: "POST" })
    .finally(() => pendingBootstraps.delete(uid));
  pendingBootstraps.set(uid, request);
  return request;
};

export const getCurrentAccount = () => apiRequest("/users/me");

export const updateCurrentAccount = (fields) =>
  apiRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify(fields),
  });

export const selectCurrentAccountType = (role) =>
  apiRequest("/users/me/account-type", {
    method: "POST",
    body: JSON.stringify({ role }),
  });

export const getCurrentPermissions = () =>
  apiRequest("/users/me/permissions");

export const initializeAuthenticatedAccount = async (user, accountType) => {
  let result = await bootstrapCurrentUser();
  const requestedRole = accountRoleByType[accountType];

  if (!requestedRole) return result;
  if (result.account.role === "unassigned") {
    const selection = await selectCurrentAccountType(requestedRole);
    if (selection.refreshToken) await user.getIdToken(true);
    result = {
      account: selection.account,
      permissions: selection.permissions,
    };
  } else if (result.account.role !== requestedRole) {
    const error = new Error(
      `This account is registered as ${result.account.role}, not ${requestedRole}.`,
    );
    error.code = "auth/account-type-mismatch";
    throw error;
  }

  return result;
};
