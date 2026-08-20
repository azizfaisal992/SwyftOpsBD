import { Navigate, Outlet, useLocation } from "react-router-dom";
import ClientOnboardingProvider from "../../context/ClientOnboardingProvider";
import useAuth from "../../hooks/useAuth";

const ClientOnboardingRoute = () => {
  const { account, accountError, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm font-semibold text-[#003d9b]">Checking your account…</div>;
  }

  if (!user) {
    return <Navigate replace to="/login?type=family" state={{ from: location.pathname }} />;
  }
  if (accountError || !account) {
    return <Navigate replace to="/login?type=family" state={{ from: location.pathname, error: accountError }} />;
  }
  if (!["unassigned", "client"].includes(account.role)) {
    return <Navigate replace to="/caregiver/profile-setup" />;
  }

  return (
    <ClientOnboardingProvider>
      <Outlet />
    </ClientOnboardingProvider>
  );
};

export default ClientOnboardingRoute;
