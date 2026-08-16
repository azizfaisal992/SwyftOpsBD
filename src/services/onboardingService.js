import { apiRequest } from "./apiClient";

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
