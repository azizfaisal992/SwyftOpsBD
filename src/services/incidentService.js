import { apiRequest } from "./apiClient";

export const createIncident = (payload) =>
  apiRequest("/incidents", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMyIncidents = () => apiRequest("/incidents/mine");

export const getAdminIncidents = (filters = {}) => {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const suffix = query.toString() ? `?${query}` : "";
  return apiRequest(`/admin/incidents${suffix}`);
};

export const getAdminIncident = (incidentId) =>
  apiRequest(`/admin/incidents/${incidentId}`);

export const updateAdminIncident = (incidentId, payload) =>
  apiRequest(`/admin/incidents/${incidentId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
