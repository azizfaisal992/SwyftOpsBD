import { auth } from "../lib/firebase";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const apiRequest = async (path, options = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in before accessing caregiver onboarding.");

  const token = await user.getIdToken();
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}/api${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || "The onboarding API request failed.");
    error.status = response.status;
    throw error;
  }
  return payload.data;
};

export const calculateOnboardingProgress = (record) => record?.progress || 0;

export const getCaregiverOnboarding = () => apiRequest("/onboarding/me");

export const saveCaregiverProfile = (_userId, profile) =>
  apiRequest("/onboarding/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });

export const saveCaregiverAssessment = (_userId, assessment) =>
  apiRequest("/onboarding/assessment", {
    method: "PUT",
    body: JSON.stringify(assessment),
  });

export const uploadCaregiverFile = async (kind, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest(`/onboarding/files/${kind}`, {
    method: "POST",
    body: formData,
  });
};

export const deleteCaregiverFile = (kind) =>
  apiRequest(`/onboarding/files/${kind}`, { method: "DELETE" });

export const submitCaregiverOnboarding = () =>
  apiRequest("/onboarding/submit", { method: "POST" });
