import { apiRequest } from "./apiClient";

export const getAdminDashboardOverview = () =>
  apiRequest("/admin/dashboard/overview");

export const getAdminReportsOverview = (range = "30d") =>
  apiRequest(`/admin/reports/overview?range=${encodeURIComponent(range)}`);
