import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteClientDocument,
  deleteClientMedicalReport,
  getClientOnboarding,
  saveClientContact,
  saveClientProfile,
  submitClientOnboarding,
  uploadClientDocument,
} from "../services/clientOnboardingService";
import ClientOnboardingContext from "./client-onboarding-context";

const ClientOnboardingProvider = ({ children }) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    getClientOnboarding()
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
  }, []);

  const saveProfile = useCallback(async (profile) => {
    const nextRecord = await saveClientProfile(profile);
    setRecord(nextRecord);
    return nextRecord;
  }, []);

  const saveContact = useCallback(async (contact) => {
    const nextRecord = await saveClientContact(contact);
    setRecord(nextRecord);
    return nextRecord;
  }, []);

  const uploadDocument = useCallback(async (kind, file) => {
    const nextRecord = await uploadClientDocument(kind, file);
    setRecord(nextRecord);
    return nextRecord;
  }, []);

  const deleteDocument = useCallback(async (kind, fileId) => {
    const nextRecord = kind === "medicalReport"
      ? await deleteClientMedicalReport(fileId)
      : await deleteClientDocument(kind);
    setRecord(nextRecord);
    return nextRecord;
  }, []);

  const submit = useCallback(async () => {
    const nextRecord = await submitClientOnboarding();
    setRecord(nextRecord);
    return nextRecord;
  }, []);

  const value = useMemo(() => ({
    record,
    loading,
    saveProfile,
    saveContact,
    uploadDocument,
    deleteDocument,
    submit,
  }), [
    deleteDocument,
    loading,
    record,
    saveContact,
    saveProfile,
    submit,
    uploadDocument,
  ]);

  if (loading || !record) {
    if (loadError) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#f4f5f7] p-6 text-center">
          <div>
            <h1 className="text-xl font-semibold text-red-700">
              Client onboarding API unavailable
            </h1>
            <p className="mt-2 max-w-lg text-sm text-[#434654]">
              {loadError}
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f5f7] text-sm font-semibold text-[#003d9b]">
        Loading client onboarding…
      </div>
    );
  }

  return (
    <ClientOnboardingContext.Provider value={value}>
      {children}
    </ClientOnboardingContext.Provider>
  );
};

export default ClientOnboardingProvider;
