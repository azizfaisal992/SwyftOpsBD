const SETTINGS_KEY = "swiftopsbd-system-settings";
const AUDIT_KEY = "swiftopsbd-settings-audit";

export const defaultSystemSettings = {
  general: { platformName: "SwiftOpsBD", supportEmail: "support@swiftops.bd", supportPhone: "+880 1234-567890", timezone: "Asia/Dhaka", currency: "BDT", language: "English", maintenanceMode: false },
  operations: { serviceRadius: 15, minimumVisit: 2, maximumVisit: 12, lateThreshold: 15, overtimeGrace: 15, geofenceDistance: 100, autoEndVisit: false, sosPhone: "+880 9999-000000" },
  verification: { requireNidFront: true, requireNidBack: true, requireResume: true, requireReference: false, assessmentScore: 70, expiryWarningDays: 45, approvalMode: "Manual review", reverificationMonths: 12 },
  security: { googleLogin: true, emailLogin: true, adminMfa: false, sessionTimeout: 30, minimumPasswordLength: 10, loginAttempts: 5, suspensionMinutes: 30, authorizedDomains: "localhost, swiftopsbd.web.app" },
  finance: { platformFee: 8, caregiverCommission: 5, vat: 15, minimumWithdrawal: 500, payoutSchedule: "Weekly", refundWindow: 24, paymentMode: "Test", primaryGateway: "SSLCommerz" },
  notifications: { email: true, sms: false, push: true, inApp: true, visitReminderMinutes: 60, lateArrival: true, paymentUpdates: true, verificationUpdates: true, documentExpiry: true, sosAlerts: true },
  matching: { distanceWeight: 35, experienceWeight: 20, ratingWeight: 25, specialtyWeight: 20, autoMatchThreshold: 90, manualReviewThreshold: 70, respectGenderPreference: true },
  cms: { approvalRequired: true, verifiedCaregiversOnly: true, featuredLimit: 6, revisionDays: 90, maintenanceBanner: false },
  integrations: {
    providers: {
      firebaseAuth: { enabled: true, publicId: "swiftopsbd", endpoint: "swiftopsbd.firebaseapp.com" },
      firestore: { enabled: true, publicId: "(default)", endpoint: "swiftopsbd" },
      googleMaps: { enabled: false, publicId: "", endpoint: "" },
      sslcommerz: { enabled: false, publicId: "", endpoint: "" },
      bkash: { enabled: false, publicId: "", endpoint: "" },
      email: { enabled: false, publicId: "", endpoint: "" },
      sms: { enabled: false, publicId: "", endpoint: "" },
    },
  },
  privacy: { documentRetentionYears: 5, auditRetentionYears: 7, deletionGraceDays: 30, exportWindowDays: 7, medicalAccessRestricted: true, automaticBackups: true },
};

const mergeSettings = (stored = {}) => Object.fromEntries(Object.entries(defaultSystemSettings).map(([category, values]) => {
  const merged = { ...values, ...(stored[category] ?? {}) };
  if (category === "integrations") {
    merged.providers = Object.fromEntries(Object.entries(values.providers).map(([id, provider]) => [id, { ...provider, ...(stored.integrations?.providers?.[id] ?? {}) }]));
  }
  return [category, merged];
}));

export const systemSettingsService = {
  get: () => {
    try { return mergeSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}")); }
    catch { return mergeSettings(); }
  },
  save: (settings, category, admin = "Admin User") => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    const audit = systemSettingsService.getAudit();
    const entry = { id: Date.now(), category, admin, action: `Updated ${category} settings`, time: new Date().toLocaleString() };
    localStorage.setItem(AUDIT_KEY, JSON.stringify([entry, ...audit].slice(0, 30)));
    return settings;
  },
  getAudit: () => {
    try { return JSON.parse(localStorage.getItem(AUDIT_KEY) ?? "[]"); }
    catch { return []; }
  },
};
