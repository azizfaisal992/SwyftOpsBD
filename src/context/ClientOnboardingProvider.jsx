import { useMemo, useState } from "react";
import ClientOnboardingContext from "./client-onboarding-context";

const storageKey = "swiftopsbd-client-onboarding";

const initialState = {
  profile: {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nidNumber: "",
  },
  contact: {
    phone: "",
    email: "",
    area: "",
    road: "",
    house: "",
    locationPinned: false,
  },
  documents: {
    nidFront: null,
    nidBack: null,
    medicalReports: [],
  },
  confirmed: false,
  submitted: false,
};

const readStoredState = () => {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
};

const ClientOnboardingProvider = ({ children }) => {
  const [record, setRecord] = useState(readStoredState);

  const updateRecord = (nextRecord) => {
    setRecord(nextRecord);
    localStorage.setItem(storageKey, JSON.stringify(nextRecord));
    return nextRecord;
  };

  const value = useMemo(() => ({
    record,
    saveProfile: (profile) => updateRecord({
      ...record,
      profile: { ...record.profile, ...profile },
    }),
    saveContact: (contact) => updateRecord({
      ...record,
      contact: { ...record.contact, ...contact },
    }),
    saveDocuments: (documents, confirmed = record.confirmed) => updateRecord({
      ...record,
      documents: { ...record.documents, ...documents },
      confirmed,
    }),
    submit: (documents = {}) => updateRecord({
      ...record,
      documents: { ...record.documents, ...documents },
      confirmed: true,
      submitted: true,
    }),
  }), [record]);

  return <ClientOnboardingContext.Provider value={value}>{children}</ClientOnboardingContext.Provider>;
};

export default ClientOnboardingProvider;
