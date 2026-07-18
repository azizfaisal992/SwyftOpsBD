import { useContext } from "react";
import CaregiverOnboardingContext from "../context/caregiver-onboarding-context";

const useCaregiverOnboarding = () => {
  const context = useContext(CaregiverOnboardingContext);
  if (!context) {
    throw new Error("useCaregiverOnboarding must be used inside CaregiverOnboardingProvider.");
  }
  return context;
};

export default useCaregiverOnboarding;
