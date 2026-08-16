import { Navigate, Outlet, useLocation } from "react-router-dom";
import CaregiverOnboardingProvider from "../../context/CaregiverOnboardingProvider";
import useAuth from "../../hooks/useAuth";

const CaregiverOnboardingRoute = () => {
  const { account, accountError, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm font-semibold text-[#003d9b]">Checking your account…</div>;
  }

  if (!user) {
    return <Navigate replace to="/login?type=professional" state={{ from: location.pathname }} />;
  }
  if (accountError || !account) {
    return <Navigate replace to="/login?type=professional" state={{ from: location.pathname, error: accountError }} />;
  }
  if (!["unassigned", "caregiver"].includes(account.role)) {
    return <Navigate replace to="/client/profile-setup" />;
  }

  return (
    <CaregiverOnboardingProvider>
      <Outlet />
    </CaregiverOnboardingProvider>
  );
};

export default CaregiverOnboardingRoute;
