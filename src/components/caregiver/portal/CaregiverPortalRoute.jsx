import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const CaregiverPortalRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return;
  <div className="grid min-h-screen place-items-center text-sm font-semibold text-[#0649ad]">
    Opening caregiver portal…
  </div>;
  if (!user)
    return (
      <Navigate
        replace
        to="/login?type=professional"
        state={{ from: location.pathname }}
      />
    );
  return <Outlet />;
};

export default CaregiverPortalRoute;
