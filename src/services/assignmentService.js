import { apiRequest } from "./apiClient";

export const listMyAssignments = () => apiRequest("/assignments/mine");

export const getMyAssignment = (assignmentId) =>
  apiRequest(`/assignments/${encodeURIComponent(assignmentId)}`);

export const getAssignedCaregiverVerification = (assignmentId) =>
  apiRequest(
    `/assignments/${encodeURIComponent(assignmentId)}/caregiver-verification`,
  );

export const confirmMyAssignment = (assignmentId) =>
  apiRequest(`/assignments/${encodeURIComponent(assignmentId)}/confirm`, {
    method: "PATCH",
  });

export const listMyVisits = ({ from = "", to = "" } = {}) => {
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  return apiRequest(`/assignments/visits/mine?${query}`);
};

export const getMyAttendance = () =>
  apiRequest("/assignments/attendance/mine");

export const listAdminAssignments = () =>
  apiRequest("/admin/assignments");

export const listAdminVisits = ({
  from = "",
  to = "",
  caregiverId = "",
  status = "",
} = {}) => {
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  if (caregiverId) query.set("caregiverId", caregiverId);
  if (status) query.set("status", status);
  return apiRequest(`/admin/assignments/visits?${query}`);
};

export const listAdminShifts = (status = "active") => {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest(`/admin/assignments/shifts${query}`);
};
