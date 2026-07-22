import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminSession } from "../../services/adminAuthService";

const AdminPortalRoute = () => {
  const location = useLocation();
  return getAdminSession() ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  );
};

export default AdminPortalRoute;
