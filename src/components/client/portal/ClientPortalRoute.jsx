import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const hasCompletedOnboarding = () => {
  try {
    return Boolean(JSON.parse(localStorage.getItem("swiftopsbd-client-onboarding"))?.submitted);
  } catch {
    return false;
  }
};

const ClientPortalRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm font-semibold text-[#06449d]">Opening client portal…</div>;
  }
  if (!user) {
    return <Navigate replace to="/login?type=family" state={{ from: location.pathname }} />;
  }
  if (!hasCompletedOnboarding()) {
    return <Navigate replace to="/client/profile-setup" />;
  }
  return <Outlet />;
};

export default ClientPortalRoute;
