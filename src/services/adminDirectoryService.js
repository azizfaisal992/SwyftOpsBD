import { apiDownload, apiRequest } from "./apiClient";

export const getVerifiedCaregivers = () =>
  apiRequest("/admin/onboarding?status=approved");

export const getVerifiedClients = () =>
  apiRequest("/admin/client-onboarding?status=approved");

export const updateCaregiverStatus = (caregiverId, active) =>
  apiRequest(
    `/admin/directory/caregivers/${encodeURIComponent(caregiverId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ active }),
    },
  );

export const updateCaregiverDirectoryVisibility = (caregiverId, visible) =>
  apiRequest(
    `/admin/directory/caregivers/${encodeURIComponent(caregiverId)}/directory`,
    {
      method: "PATCH",
      body: JSON.stringify({ visible }),
    },
  );

export const updateCaregiverProfile = (caregiverId, profile) =>
  apiRequest(
    `/admin/directory/caregivers/${encodeURIComponent(caregiverId)}/profile`,
    {
      method: "PATCH",
      body: JSON.stringify(profile),
    },
  );

export const updateClientDetails = (clientId, details) =>
  apiRequest(`/admin/directory/clients/${encodeURIComponent(clientId)}`, {
    method: "PATCH",
    body: JSON.stringify(details),
  });

export const renewClientCare = (clientId) =>
  apiRequest(
    `/admin/directory/clients/${encodeURIComponent(clientId)}/renew-care`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );

export const deleteClientAccount = (clientId) =>
  apiRequest(`/admin/directory/clients/${encodeURIComponent(clientId)}`, {
    method: "DELETE",
    body: JSON.stringify({ confirmClientId: clientId }),
  });

export const getSystemDocuments = () =>
  apiRequest("/admin/directory/documents");

export const downloadSystemDocument = async (documentId) => {
  const { blob, filename } = await apiDownload(
    `/admin/directory/documents/${encodeURIComponent(documentId)}/download`,
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
