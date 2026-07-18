import { Navigate, Outlet, useLocation } from "react-router-dom";
import CaregiverOnboardingProvider from "../../context/CaregiverOnboardingProvider";
import useAuth from "../../hooks/useAuth";

const CaregiverOnboardingRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm font-semibold text-[#003d9b]">Checking your account…</div>;
  }

  if (!user) {
    return <Navigate replace to="/login?type=professional" state={{ from: location.pathname }} />;
  }

  return (
    <CaregiverOnboardingProvider>
      <Outlet />
    </CaregiverOnboardingProvider>
  );
};

export default CaregiverOnboardingRoute;
