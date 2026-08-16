import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { getClientOnboarding } from "../../../services/clientOnboardingService";

const ClientPortalRoute = () => {
  const { account, accountError, user, loading } = useAuth();
  const location = useLocation();
  const [onboarding, setOnboarding] = useState(null);
  const [onboardingError, setOnboardingError] = useState("");

  useEffect(() => {
    let active = true;
    if (!user || account?.role !== "client") {
      return () => {
        active = false;
      };
    }

    getClientOnboarding()
      .then((record) => {
        if (active) setOnboarding(record);
      })
      .catch((error) => {
        if (active) setOnboardingError(error.message);
      });

    return () => {
      active = false;
    };
  }, [account?.role, user]);

  const checkingOnboarding =
    Boolean(user) &&
    account?.role === "client" &&
    !onboarding &&
    !onboardingError;

  if (loading || checkingOnboarding) {
    return (
      <div className="grid min-h-screen place-items-center text-sm font-semibold text-[#06449d]">
        Opening client portal…
      </div>
    );
  }
  if (!user) {
    return (
      <Navigate
        replace
        to="/login?type=family"
        state={{ from: location.pathname }}
      />
    );
  }
  if (accountError || onboardingError || !account) {
    return (
      <Navigate
        replace
        to="/login?type=family"
        state={{
          from: location.pathname,
          error: accountError || onboardingError,
        }}
      />
    );
  }
  if (account.role !== "client") {
    return <Navigate replace to="/join" />;
  }
  if (!onboarding?.submitted) {
    return <Navigate replace to="/client/profile-setup" />;
  }
  return <Outlet context={{ onboarding }} />;
};

export default ClientPortalRoute;
