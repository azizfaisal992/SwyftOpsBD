import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  calculateOnboardingProgress,
  deleteCaregiverFile,
  getCaregiverOnboarding,
  saveCaregiverAssessment,
  saveCaregiverProfile,
  submitCaregiverOnboarding,
  uploadCaregiverFile,
} from "../services/onboardingService";
import CaregiverOnboardingContext from "./caregiver-onboarding-context";

const CaregiverOnboardingProvider = ({ children }) => {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    getCaregiverOnboarding(user.uid)
      .then((savedRecord) => {
        if (active) setRecord(savedRecord);
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user.uid]);

  const saveProfile = useCallback(async (profile) => {
    const nextRecord = await saveCaregiverProfile(user.uid, profile);
    setRecord(nextRecord);
    return nextRecord;
  }, [user.uid]);

  const uploadFile = useCallback(async (kind, file) => {
    const nextRecord = await uploadCaregiverFile(kind, file);
    setRecord(nextRecord);
    return nextRecord;
  }, []);

  const deleteFile = useCallback(async (kind) => {
    const nextRecord = await deleteCaregiverFile(kind);
    setRecord(nextRecord);
    return nextRecord;
  }, []);

  const saveAssessment = useCallback(async (assessment) => {
    const nextRecord = await saveCaregiverAssessment(user.uid, assessment);
    setRecord(nextRecord);
    return nextRecord;
  }, [user.uid]);

  const submitOnboarding = useCallback(async () => {
    const nextRecord = await submitCaregiverOnboarding();
    setRecord(nextRecord);
    return nextRecord;
  }, []);

  const refresh = useCallback(async () => {
    const nextRecord = await getCaregiverOnboarding(user.uid);
    setRecord(nextRecord);
    return nextRecord;
  }, [user.uid]);

  const value = useMemo(() => ({
    record,
    loading,
    progress: record ? calculateOnboardingProgress(record) : 0,
    saveProfile,
    saveAssessment,
    uploadFile,
    deleteFile,
    submitOnboarding,
    refresh,
  }), [deleteFile, loading, record, refresh, saveAssessment, saveProfile, submitOnboarding, uploadFile]);

  if (loading || !record) {
    if (loadError) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#f4f5f7] p-6 text-center">
          <div><h1 className="text-xl font-semibold text-red-700">Onboarding API unavailable</h1><p className="mt-2 max-w-lg text-sm text-[#434654]">{loadError}</p></div>
        </div>
      );
    }
    return <div className="grid min-h-screen place-items-center bg-[#f4f5f7] text-sm font-semibold text-[#003d9b]">Loading onboarding progress…</div>;
  }

  return <CaregiverOnboardingContext.Provider value={value}>{children}</CaregiverOnboardingContext.Provider>;
};

export default CaregiverOnboardingProvider;
