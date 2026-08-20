import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { hasAdminAccess } from "../../services/adminAuthService";

const AdminPortalRoute = () => {
  const { account, claims, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f7fc] text-sm font-semibold text-[#0755d3]">
        Verifying administrator access...
      </div>
    );
  }

  const hasMatchingBackendRole =
    account?.role === claims.role && account?.status === "active";

  if (!user || !hasAdminAccess(claims) || !hasMatchingBackendRole) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
          error: user
            ? "Your signed-in account does not have administrator access."
            : "Sign in with an authorized administrator account.",
        }}
      />
    );
  }

  return <Outlet />;
};

export default AdminPortalRoute;
