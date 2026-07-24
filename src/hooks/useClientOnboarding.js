import { useContext } from "react";
import ClientOnboardingContext from "../context/client-onboarding-context";

const useClientOnboarding = () => {
  const context = useContext(ClientOnboardingContext);
  if (!context) throw new Error("useClientOnboarding must be used inside ClientOnboardingProvider.");
  return context;
};

export default useClientOnboarding;
