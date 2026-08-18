import { apiRequest } from "./apiClient";

export const listMyVisitRecords = (status = "") => {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest(`/visits/mine${query}`);
};

export const getMyActiveVisit = () => apiRequest("/visits/active/mine");

export const getVisit = (visitId) =>
  apiRequest(`/visits/${encodeURIComponent(visitId)}`);

export const clockInVisit = (visitId, location) =>
  apiRequest(`/visits/${encodeURIComponent(visitId)}/clock-in`, {
    method: "POST",
    body: JSON.stringify({ location }),
  });

export const saveVisitProgress = (
  visitId,
  { completedTasks, careNotes },
) =>
  apiRequest(`/visits/${encodeURIComponent(visitId)}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ completedTasks, careNotes }),
  });

export const updateVisitLocation = (visitId, location) =>
  apiRequest(`/visits/${encodeURIComponent(visitId)}/location`, {
    method: "PATCH",
    body: JSON.stringify({ location }),
  });

export const completeVisit = (
  visitId,
  { completedTasks, careNotes, location },
) =>
  apiRequest(`/visits/${encodeURIComponent(visitId)}/complete`, {
    method: "POST",
    body: JSON.stringify({ completedTasks, careNotes, location }),
  });
