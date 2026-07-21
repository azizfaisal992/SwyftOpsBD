import { Navigate, Outlet, useLocation } from "react-router-dom";
import ClientOnboardingProvider from "../../context/ClientOnboardingProvider";
import useAuth from "../../hooks/useAuth";

const ClientOnboardingRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm font-semibold text-[#003d9b]">Checking your account…</div>;
  }

  if (!user) {
    return <Navigate replace to="/login?type=family" state={{ from: location.pathname }} />;
  }

  return (
    <ClientOnboardingProvider>
      <Outlet />
    </ClientOnboardingProvider>
  );
};

export default ClientOnboardingRoute;
