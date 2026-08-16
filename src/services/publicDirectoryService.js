import { apiRequest } from "./apiClient";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

export const listPublicCaregivers = () =>
  apiRequest("/directory/caregivers", { authenticated: false });

export const publicCaregiverPhotoUrl = (caregiverId) =>
  `${API_BASE_URL}/api/v1/directory/caregivers/${encodeURIComponent(caregiverId)}/photo`;
