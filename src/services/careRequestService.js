import { apiRequest } from "./apiClient";

export const listMyCarePlans = () => apiRequest("/care-plans");

export const listMyCareRequests = () =>
  apiRequest("/care-plans/requests/mine");

export const createCarePlan = (plan) =>
  apiRequest("/care-plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });

export const getCarePlan = (planId) =>
  apiRequest(`/care-plans/${encodeURIComponent(planId)}`);

export const updateCarePlan = (planId, plan) =>
  apiRequest(`/care-plans/${encodeURIComponent(planId)}`, {
    method: "PUT",
    body: JSON.stringify(plan),
  });

export const submitCarePlan = (planId) =>
  apiRequest(`/care-plans/${encodeURIComponent(planId)}/submit`, {
    method: "POST",
  });

export const listAvailableCareRequests = () =>
  apiRequest("/care-requests/available");

export const getAvailableCareRequest = (requestId) =>
  apiRequest(`/care-requests/${encodeURIComponent(requestId)}`);

export const respondToCareRequest = (requestId, decision, note = "") =>
  apiRequest(`/care-requests/${encodeURIComponent(requestId)}/respond`, {
    method: "POST",
    body: JSON.stringify({ decision, note }),
  });

export const listAdminCareRequests = (status = "") =>
  apiRequest(
    `/admin/care-requests${status ? `?status=${encodeURIComponent(status)}` : ""}`,
  );

export const reconcilePaidCareRequests = () =>
  apiRequest("/admin/care-requests/reconcile-paid", {
    method: "POST",
  });

export const getAdminCareRequest = (requestId) =>
  apiRequest(`/admin/care-requests/${encodeURIComponent(requestId)}`);

export const updateAdminCareRequest = (requestId, action, options = {}) =>
  apiRequest(`/admin/care-requests/${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    body: JSON.stringify({ action, ...options }),
  });
