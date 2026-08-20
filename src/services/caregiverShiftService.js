import { apiRequest } from "./apiClient";

export const getActiveCaregiverShift = () => apiRequest("/shifts/active");

export const listCaregiverShifts = ({ from = "", to = "" } = {}) => {
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  return apiRequest(`/shifts/mine?${query}`);
};

export const clockInCaregiverShift = (location) =>
  apiRequest("/shifts/clock-in", {
    method: "POST",
    body: JSON.stringify({ location }),
  });

export const clockOutCaregiverShift = (location) =>
  apiRequest("/shifts/clock-out", {
    method: "POST",
    body: JSON.stringify({ location }),
  });

export const updateCaregiverShiftLocation = (location) =>
  apiRequest("/shifts/location", {
    method: "PATCH",
    body: JSON.stringify({ location }),
  });
