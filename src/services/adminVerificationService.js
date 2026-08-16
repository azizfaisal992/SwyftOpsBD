import { auth } from "../lib/firebase";
import { apiRequest } from "./apiClient";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const listByRole = (role, status) => {
  const path = role === "client"
    ? "/admin/client-onboarding"
    : "/admin/onboarding";
  return apiRequest(`${path}?status=${encodeURIComponent(status)}`);
};

export const getVerificationQueue = async (status = "under_review") => {
  const [caregivers, clients] = await Promise.all([
    listByRole("caregiver", status),
    listByRole("client", status),
  ]);
  return [
    ...caregivers.map((record) => ({ role: "caregiver", record })),
    ...clients.map((record) => ({ role: "client", record })),
  ];
};

export const reviewVerification = (role, userId, decision, feedback) => {
  const path = role === "client"
    ? `/admin/client-onboarding/${encodeURIComponent(userId)}/review`
    : `/admin/onboarding/${encodeURIComponent(userId)}/review`;
  return apiRequest(path, {
    method: "PATCH",
    body: JSON.stringify({ decision, feedback }),
  });
};

const filePath = (role, userId, kind, fileId) => {
  const prefix = role === "client"
    ? "/admin/client-onboarding"
    : "/admin/onboarding";
  const query = fileId ? `?fileId=${encodeURIComponent(fileId)}` : "";
  return `${prefix}/${encodeURIComponent(userId)}/files/${encodeURIComponent(kind)}/url${query}`;
};

const fetchVerificationFile = async (role, userId, kind, fileId = "") => {
  const result = await apiRequest(filePath(role, userId, kind, fileId));
  if (!result.requiresAuthorization) {
    return { directUrl: result.url };
  }

  const user = auth.currentUser;
  if (!user) throw new Error("Sign in before opening this document.");
  const fetchProtectedFile = async (refresh = false) =>
    fetch(`${API_BASE_URL}${result.url}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken(refresh)}`,
      },
    });
  let response = await fetchProtectedFile();
  if (response.status === 401) response = await fetchProtectedFile(true);
  if (!response.ok) throw new Error("The document could not be opened.");
  return { blob: await response.blob() };
};

export const getVerificationImageUrl = async (
  role,
  userId,
  kind,
  fileId = "",
) => {
  const file = await fetchVerificationFile(role, userId, kind, fileId);
  return file.directUrl || URL.createObjectURL(file.blob);
};

export const openVerificationDocument = async (
  role,
  userId,
  kind,
  fileId = "",
) => {
  const previewWindow = window.open("", "_blank");
  if (previewWindow) previewWindow.opener = null;
  try {
    const file = await fetchVerificationFile(role, userId, kind, fileId);
    if (file.directUrl) {
      if (previewWindow) previewWindow.location.href = file.directUrl;
      else window.open(file.directUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const objectUrl = URL.createObjectURL(file.blob);
    if (previewWindow) previewWindow.location.href = objectUrl;
    else window.open(objectUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  } catch (error) {
    previewWindow?.close();
    throw error;
  }
};
