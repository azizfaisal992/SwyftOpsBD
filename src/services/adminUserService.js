import { apiRequest } from "./apiClient";

export const listAdministratorUsers = () => apiRequest("/admin/users");
