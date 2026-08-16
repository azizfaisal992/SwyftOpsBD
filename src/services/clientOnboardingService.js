import { apiRequest } from "./apiClient";

export const getClientOnboarding = () =>
  apiRequest("/client-onboarding/me");

export const saveClientProfile = (profile) =>
  apiRequest("/client-onboarding/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });

export const saveClientContact = (contact) =>
  apiRequest("/client-onboarding/contact", {
    method: "PUT",
    body: JSON.stringify(contact),
  });

export const uploadClientDocument = (kind, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest(`/client-onboarding/files/${kind}`, {
    method: "POST",
    body: formData,
  });
};

export const deleteClientDocument = (kind) =>
  apiRequest(`/client-onboarding/files/${kind}`, { method: "DELETE" });

export const deleteClientMedicalReport = (fileId) =>
  apiRequest(`/client-onboarding/files/medicalReport/${fileId}`, {
    method: "DELETE",
  });

export const submitClientOnboarding = () =>
  apiRequest("/client-onboarding/submit", {
    method: "POST",
    body: JSON.stringify({ confirmed: true }),
  });
