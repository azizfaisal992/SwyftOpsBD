import {
  Activity,
  Bell,
  Check,
  ChevronRight,
  CircleAlert,
  Database,
  FileClock,
  Globe2,
  KeyRound,
  Link2,
  LockKeyhole,
  MapPin,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings2,
  SlidersHorizontal,
  UserRoundCheck,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { defaultSystemSettings, systemSettingsService } from "../../services/systemSettingsService";

const categories = [
  { id: "general", label: "General", description: "Brand, locale, and availability", icon: Settings2 },
  { id: "operations", label: "Care Operations", description: "Visits, geofence, and SOS", icon: MapPin },
  { id: "verification", label: "Verification", description: "Documents and approval rules", icon: UserRoundCheck },
  { id: "security", label: "Authentication & Security", description: "Login and account protection", icon: LockKeyhole },
  { id: "finance", label: "Payments & Finance", description: "Fees, payouts, and gateway mode", icon: WalletCards },
  { id: "notifications", label: "Notifications", description: "Channels and alert events", icon: Bell },
  { id: "matching", label: "Matching Rules", description: "Caregiver ranking logic", icon: SlidersHorizontal },
  { id: "cms", label: "Website & CMS", description: "Publishing and revision rules", icon: Globe2 },
  { id: "integrations", label: "Integrations", description: "External service connections", icon: Link2 },
  { id: "privacy", label: "Data & Privacy", description: "Retention, deletion, and backups", icon: Database },
  { id: "health", label: "Audit & System Health", description: "Status and change history", icon: Activity },
];

const integrations = [
  { id: "firebaseAuth", name: "Firebase Authentication", detail: "Google and email/password authentication" },
  { id: "firestore", name: "Cloud Firestore", detail: "Database rules and API records" },
  { id: "googleMaps", name: "Google Maps", detail: "Location, routing, and geofencing" },
  { id: "sslcommerz", name: "SSLCommerz", detail: "Client payment processing" },
  { id: "bkash", name: "bKash", detail: "Caregiver payouts and client wallet" },
  { id: "email", name: "Email Provider", detail: "Verification and system email" },
  { id: "sms", name: "SMS Provider", detail: "SOS and visit notifications" },
];

const validateCategory = (category, values) => {
  const errors = [];
  if (category === "general") {
    if (!values.platformName.trim()) errors.push("Platform name is required.");
    if (!/^\S+@\S+\.\S+$/.test(values.supportEmail)) errors.push("Enter a valid support email address.");
    if (!values.supportPhone.trim()) errors.push("Support phone is required.");
  }
  if (category === "operations") {
    if (values.minimumVisit <= 0) errors.push("Minimum visit duration must be greater than zero.");
    if (values.maximumVisit < values.minimumVisit) errors.push("Maximum visit duration cannot be shorter than the minimum.");
    if (values.geofenceDistance < 25) errors.push("Geofence radius must be at least 25 meters.");
  }
  if (category === "verification" && (values.assessmentScore < 0 || values.assessmentScore > 100)) errors.push("Assessment score must be between 0 and 100.");
  if (category === "security" && values.minimumPasswordLength < 8) errors.push("Minimum password length must be at least 8 characters.");
  if (category === "finance" && [values.platformFee, values.caregiverCommission, values.vat].some((value) => value < 0 || value > 100)) errors.push("Fee, commission, and VAT percentages must be between 0 and 100.");
  if (category === "matching") {
    const total = values.distanceWeight + values.experienceWeight + values.ratingWeight + values.specialtyWeight;
    if (total !== 100) errors.push(`Matching weights currently total ${total}%; they must total 100%.`);
    if (values.manualReviewThreshold > values.autoMatchThreshold) errors.push("Manual-review threshold cannot exceed the auto-match threshold.");
  }
  if (category === "privacy" && (values.documentRetentionYears < 1 || values.auditRetentionYears < 1)) errors.push("Retention periods must be at least one year.");
  return errors;
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(() => systemSettingsService.get());
  const [savedSettings, setSavedSettings] = useState(() => systemSettingsService.get());
  const [activeCategory, setActiveCategory] = useState("general");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [auditVersion, setAuditVersion] = useState(0);
  const isDirty = JSON.stringify(settings[activeCategory]) !== JSON.stringify(savedSettings[activeCategory]);
  const activeMeta = categories.find((item) => item.id === activeCategory);
  const ActiveCategoryIcon = activeMeta?.icon;
  const validationErrors = useMemo(() => validateCategory(activeCategory, settings[activeCategory]), [activeCategory, settings]);

  const visibleCategories = useMemo(() => categories.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(search.toLowerCase())), [search]);

  const update = (field, value, risk = false) => {
    if (risk) {
      setConfirmation({ field, value, label: activeMeta.label });
      return;
    }
    setSettings((current) => ({ ...current, [activeCategory]: { ...current[activeCategory], [field]: value } }));
  };

  const confirmRisk = () => {
    const { field, value } = confirmation;
    setSettings((current) => ({ ...current, [activeCategory]: { ...current[activeCategory], [field]: value } }));
    setConfirmation(null);
  };

  const save = () => {
    if (validationErrors.length) {
      setNotice("Please correct the highlighted validation issues before saving.");
      return;
    }
    systemSettingsService.save(settings, activeCategory);
    setSavedSettings(structuredClone(settings));
    setAuditVersion((current) => current + 1);
    setNotice(`${activeMeta.label} settings saved.`);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const discard = () => setSettings((current) => ({ ...current, [activeCategory]: { ...savedSettings[activeCategory] } }));

  const resetDefaults = () => setConfirmation({ reset: true, label: activeMeta.label });
  const confirmReset = () => {
    setSettings((current) => ({ ...current, [activeCategory]: { ...defaultSystemSettings[activeCategory] } }));
    setConfirmation(null);
  };

  return (
    <div className="mx-auto max-w-[1380px] p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end"><div><h1 className="text-2xl font-semibold sm:text-3xl">System Settings</h1><p className="mt-1 text-sm text-[#606878]">Configure platform behavior, security, operations, and integrations.</p></div><div className="flex gap-2 lg:ml-auto"><button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c3cad8] bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-40 sm:flex-none" type="button" disabled={!isDirty} onClick={discard}><RotateCcw className="size-4" />Discard</button><button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755b7] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40 sm:flex-none" type="button" disabled={!isDirty} onClick={save}><Save className="size-4" />Save Changes</button></div></header>

      {notice && <div className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${validationErrors.length ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}><Check className="size-4" />{notice}</div>}
      {isDirty && <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"><CircleAlert className="size-4" />You have unsaved changes in {activeMeta.label}.</div>}
      {validationErrors.length > 0 && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><b>Resolve before saving:</b><ul className="mt-1 list-disc pl-5">{validationErrors.map((error) => <li key={error}>{error}</li>)}</ul></div>}

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-xl border border-[#c8cfde] bg-white lg:sticky lg:top-20"><label className="m-3 flex items-center gap-2 rounded-lg border bg-[#f7f8fc] px-3 py-2.5"><Search className="size-4 text-[#687184]" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search settings..." /></label><nav className="hide-scrollbar flex gap-2 overflow-x-auto border-t p-3 lg:block lg:max-h-[calc(100vh-210px)] lg:space-y-1 lg:overflow-y-auto">{visibleCategories.map(({ id, label, description, icon: Icon }) => <button className={`flex min-w-[210px] items-center gap-3 rounded-lg p-3 text-left transition lg:w-full ${activeCategory === id ? "bg-[#eaf2ff] text-[#0755b7]" : "text-[#444c5b] hover:bg-[#f4f6fa]"}`} type="button" key={id} onClick={() => { if (!isDirty || window.confirm("Discard unsaved changes and switch settings category?")) { if (isDirty) discard(); setActiveCategory(id); } }}><span className={`grid size-9 shrink-0 place-items-center rounded-lg ${activeCategory === id ? "bg-white" : "bg-[#f0f2f6]"}`}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><b className="block text-sm">{label}</b><small className="block truncate text-[#7b8291]">{description}</small></span><ChevronRight className="hidden size-4 lg:block" /></button>)}</nav></aside>

        <main className="min-w-0 rounded-xl border border-[#c8cfde] bg-white"><header className="flex items-center border-b bg-[#f5f7fb] p-5"><span className="grid size-10 place-items-center rounded-lg bg-blue-100 text-[#0755b7]">{ActiveCategoryIcon && <ActiveCategoryIcon className="size-5" />}</span><div className="ml-3"><h2 className="font-semibold">{activeMeta?.label}</h2><p className="text-xs text-[#687184]">{activeMeta?.description}</p></div>{activeCategory !== "health" && <button className="ml-auto flex items-center gap-1 text-xs font-semibold text-[#687184]" type="button" onClick={resetDefaults}><RefreshCw className="size-3.5" />Reset defaults</button>}</header><div className="p-4 sm:p-6"><SettingsContent category={activeCategory} settings={settings} update={update} auditVersion={auditVersion} /></div>{activeCategory !== "health" && <footer className="flex justify-end gap-2 border-t bg-[#fafbfc] p-4"><button className="rounded-lg border px-4 py-2.5 text-sm font-semibold disabled:opacity-40" type="button" disabled={!isDirty} onClick={discard}>Cancel</button><button className="rounded-lg bg-[#0755b7] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40" type="button" disabled={!isDirty || validationErrors.length > 0} onClick={save}>Save {activeMeta?.label}</button></footer>}</main>
      </div>

      {confirmation && <ConfirmationModal title={confirmation.reset ? `Reset ${confirmation.label}?` : `Confirm sensitive change`} description={confirmation.reset ? "This restores the default values for this category. You must still save afterward." : `This change affects ${confirmation.label.toLowerCase()} across the platform. Confirm that you understand the impact.`} onCancel={() => setConfirmation(null)} onConfirm={confirmation.reset ? confirmReset : confirmRisk} />}
    </div>
  );
};

const SettingsContent = ({ auditVersion, category, settings, update }) => {
  const values = settings[category];
  if (category === "general") return <SettingsGrid><SettingSection title="Platform Identity" description="Basic information shown across the platform."><TextField label="Platform name" value={values.platformName} onChange={(value) => update("platformName", value)} /><TextField label="Support email" type="email" value={values.supportEmail} onChange={(value) => update("supportEmail", value)} /><TextField label="Support phone" value={values.supportPhone} onChange={(value) => update("supportPhone", value)} /></SettingSection><SettingSection title="Locale & Availability" description="Regional defaults for dates, language, and money."><SelectField label="Time zone" value={values.timezone} options={["Asia/Dhaka", "UTC"]} onChange={(value) => update("timezone", value)} /><SelectField label="Currency" value={values.currency} options={["BDT", "USD"]} onChange={(value) => update("currency", value)} /><SelectField label="Language" value={values.language} options={["English", "Bangla"]} onChange={(value) => update("language", value)} /><ToggleField label="Maintenance mode" description="Temporarily prevent public platform access." checked={values.maintenanceMode} danger onChange={(value) => update("maintenanceMode", value, true)} /></SettingSection></SettingsGrid>;
  if (category === "operations") return <SettingsGrid><SettingSection title="Visit Rules"><NumberField label="Default service radius (km)" value={values.serviceRadius} onChange={(value) => update("serviceRadius", value)} /><NumberField label="Minimum visit duration (hours)" value={values.minimumVisit} onChange={(value) => update("minimumVisit", value)} /><NumberField label="Maximum visit duration (hours)" value={values.maximumVisit} onChange={(value) => update("maximumVisit", value)} /><NumberField label="Late-arrival threshold (minutes)" value={values.lateThreshold} onChange={(value) => update("lateThreshold", value)} /></SettingSection><SettingSection title="Tracking & Emergency"><NumberField label="Overtime grace period (minutes)" value={values.overtimeGrace} onChange={(value) => update("overtimeGrace", value)} /><NumberField label="Geofence radius (meters)" value={values.geofenceDistance} onChange={(value) => update("geofenceDistance", value)} /><TextField label="SOS escalation phone" value={values.sosPhone} onChange={(value) => update("sosPhone", value)} /><ToggleField label="Automatically end visits" description="End active visits at the configured maximum duration." checked={values.autoEndVisit} onChange={(value) => update("autoEndVisit", value)} /></SettingSection></SettingsGrid>;
  if (category === "verification") return <SettingsGrid><SettingSection title="Required Caregiver Documents"><ToggleField label="NID front" checked={values.requireNidFront} onChange={(value) => update("requireNidFront", value)} /><ToggleField label="NID back" checked={values.requireNidBack} onChange={(value) => update("requireNidBack", value)} /><ToggleField label="Resume or CV" checked={values.requireResume} onChange={(value) => update("requireResume", value)} /><ToggleField label="Reference letter" checked={values.requireReference} onChange={(value) => update("requireReference", value)} /></SettingSection><SettingSection title="Approval Policy"><NumberField label="Minimum assessment score (%)" min="0" max="100" value={values.assessmentScore} onChange={(value) => update("assessmentScore", value)} /><NumberField label="Expiry warning (days)" value={values.expiryWarningDays} onChange={(value) => update("expiryWarningDays", value)} /><SelectField label="Approval mode" value={values.approvalMode} options={["Manual review", "Two-admin approval", "Automatic when valid"]} onChange={(value) => update("approvalMode", value)} /><NumberField label="Re-verification interval (months)" value={values.reverificationMonths} onChange={(value) => update("reverificationMonths", value)} /></SettingSection></SettingsGrid>;
  if (category === "security") return <SettingsGrid><SettingSection title="Sign-in Methods"><ToggleField label="Google sign-in" checked={values.googleLogin} onChange={(value) => update("googleLogin", value)} /><ToggleField label="Email and password" checked={values.emailLogin} onChange={(value) => update("emailLogin", value)} /><ToggleField label="Require MFA for admins" description="Recommended before production launch." checked={values.adminMfa} onChange={(value) => update("adminMfa", value, true)} /><TextField label="Firebase authorized domains" value={values.authorizedDomains} onChange={(value) => update("authorizedDomains", value)} /></SettingSection><SettingSection title="Session & Account Protection"><NumberField label="Admin session timeout (minutes)" value={values.sessionTimeout} onChange={(value) => update("sessionTimeout", value)} /><NumberField label="Minimum password length" value={values.minimumPasswordLength} onChange={(value) => update("minimumPasswordLength", value)} /><NumberField label="Maximum login attempts" value={values.loginAttempts} onChange={(value) => update("loginAttempts", value)} /><NumberField label="Suspension duration (minutes)" value={values.suspensionMinutes} onChange={(value) => update("suspensionMinutes", value)} /></SettingSection></SettingsGrid>;
  if (category === "finance") return <SettingsGrid><SettingSection title="Fees & Tax"><NumberField label="Platform service fee (%)" value={values.platformFee} onChange={(value) => update("platformFee", value)} /><NumberField label="Caregiver commission (%)" value={values.caregiverCommission} onChange={(value) => update("caregiverCommission", value)} /><NumberField label="VAT (%)" value={values.vat} onChange={(value) => update("vat", value)} /><NumberField label="Refund window (hours)" value={values.refundWindow} onChange={(value) => update("refundWindow", value)} /></SettingSection><SettingSection title="Payouts & Gateway"><NumberField label="Minimum withdrawal (BDT)" value={values.minimumWithdrawal} onChange={(value) => update("minimumWithdrawal", value)} /><SelectField label="Payout schedule" value={values.payoutSchedule} options={["Daily", "Weekly", "Biweekly", "Monthly"]} onChange={(value) => update("payoutSchedule", value)} /><SelectField label="Primary gateway" value={values.primaryGateway} options={["SSLCommerz", "bKash", "Manual bank transfer"]} onChange={(value) => update("primaryGateway", value)} /><SelectField label="Payment environment" value={values.paymentMode} options={["Test", "Live"]} onChange={(value) => update("paymentMode", value, value === "Live")} /></SettingSection></SettingsGrid>;
  if (category === "notifications") return <SettingsGrid><SettingSection title="Delivery Channels"><ToggleField label="Email notifications" checked={values.email} onChange={(value) => update("email", value)} /><ToggleField label="SMS notifications" checked={values.sms} onChange={(value) => update("sms", value)} /><ToggleField label="Push notifications" checked={values.push} onChange={(value) => update("push", value)} /><ToggleField label="In-app notifications" checked={values.inApp} onChange={(value) => update("inApp", value)} /></SettingSection><SettingSection title="Notification Events"><NumberField label="Visit reminder (minutes before)" value={values.visitReminderMinutes} onChange={(value) => update("visitReminderMinutes", value)} /><ToggleField label="Late caregiver alerts" checked={values.lateArrival} onChange={(value) => update("lateArrival", value)} /><ToggleField label="Payment updates" checked={values.paymentUpdates} onChange={(value) => update("paymentUpdates", value)} /><ToggleField label="Verification updates" checked={values.verificationUpdates} onChange={(value) => update("verificationUpdates", value)} /><ToggleField label="Document-expiry warnings" checked={values.documentExpiry} onChange={(value) => update("documentExpiry", value)} /><ToggleField label="SOS alerts" checked={values.sosAlerts} danger onChange={(value) => update("sosAlerts", value, !value)} /></SettingSection></SettingsGrid>;
  if (category === "matching") return <SettingsGrid><SettingSection title="Matching Score Weights" description="Weights should total 100%."><NumberField label="Distance weight (%)" value={values.distanceWeight} onChange={(value) => update("distanceWeight", value)} /><NumberField label="Experience weight (%)" value={values.experienceWeight} onChange={(value) => update("experienceWeight", value)} /><NumberField label="Rating weight (%)" value={values.ratingWeight} onChange={(value) => update("ratingWeight", value)} /><NumberField label="Specialty weight (%)" value={values.specialtyWeight} onChange={(value) => update("specialtyWeight", value)} /></SettingSection><SettingSection title="Decision Thresholds"><NumberField label="Auto-match threshold (%)" value={values.autoMatchThreshold} onChange={(value) => update("autoMatchThreshold", value)} /><NumberField label="Manual review threshold (%)" value={values.manualReviewThreshold} onChange={(value) => update("manualReviewThreshold", value)} /><ToggleField label="Respect caregiver gender preference" checked={values.respectGenderPreference} onChange={(value) => update("respectGenderPreference", value)} /><ScoreCheck values={values} /></SettingSection></SettingsGrid>;
  if (category === "cms") return <SettingsGrid><SettingSection title="Publishing Controls"><ToggleField label="Require approval before publishing" checked={values.approvalRequired} onChange={(value) => update("approvalRequired", value)} /><ToggleField label="Verified caregivers only" description="Prevents pending or rejected profiles from appearing publicly." checked={values.verifiedCaregiversOnly} danger onChange={(value) => update("verifiedCaregiversOnly", value, !value)} /><NumberField label="Featured caregiver limit" value={values.featuredLimit} onChange={(value) => update("featuredLimit", value)} /><NumberField label="Revision-history retention (days)" value={values.revisionDays} onChange={(value) => update("revisionDays", value)} /></SettingSection><SettingSection title="Public Website"><ToggleField label="Maintenance banner" checked={values.maintenanceBanner} onChange={(value) => update("maintenanceBanner", value)} /><div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs leading-5 text-[#0755b7]"><Globe2 className="mb-2 size-5" />Page content, public caregiver profiles, SEO, and staff permissions are managed from the Website CMS panel.</div></SettingSection></SettingsGrid>;
  if (category === "integrations") return <IntegrationsPanel values={values} update={update} />;
  if (category === "privacy") return <SettingsGrid><SettingSection title="Retention & Requests"><NumberField label="Document retention (years)" value={values.documentRetentionYears} onChange={(value) => update("documentRetentionYears", value)} /><NumberField label="Audit-log retention (years)" value={values.auditRetentionYears} onChange={(value) => update("auditRetentionYears", value)} /><NumberField label="Account deletion grace period (days)" value={values.deletionGraceDays} onChange={(value) => update("deletionGraceDays", value)} /><NumberField label="Data export response window (days)" value={values.exportWindowDays} onChange={(value) => update("exportWindowDays", value)} /></SettingSection><SettingSection title="Data Protection"><ToggleField label="Restrict medical-data access" checked={values.medicalAccessRestricted} danger onChange={(value) => update("medicalAccessRestricted", value, !value)} /><ToggleField label="Automatic database backups" checked={values.automaticBackups} danger onChange={(value) => update("automaticBackups", value, !value)} /><div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800"><CircleAlert className="mb-2 size-5" />Retention changes must later be enforced by scheduled backend jobs, not only by the frontend setting.</div></SettingSection></SettingsGrid>;
  return <SystemHealth auditVersion={auditVersion} />;
};

const IntegrationsPanel = ({ update, values }) => {
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const open = (integration) => {
    setSelected(integration);
    setDraft({ ...values.providers[integration.id] });
  };
  const apply = () => {
    update("providers", { ...values.providers, [selected.id]: draft });
    setSelected(null);
    setDraft(null);
  };
  return <div className="grid gap-3">{integrations.map((integration) => { const provider = values.providers[integration.id]; return <article className="flex flex-col gap-3 rounded-xl border border-[#d5dae5] p-4 sm:flex-row sm:items-center" key={integration.id}><span className={`grid size-10 shrink-0 place-items-center rounded-lg ${provider.enabled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}><Link2 className="size-5" /></span><div><b className="block text-sm">{integration.name}</b><small className="text-[#687184]">{provider.publicId || integration.detail}</small></div><span className={`w-fit rounded-full px-3 py-1 text-[9px] font-semibold uppercase sm:ml-auto ${provider.enabled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{provider.enabled ? "Enabled" : "Not configured"}</span><button className="rounded-lg border px-3 py-2 text-xs font-semibold text-[#0755b7]" type="button" onClick={() => open(integration)}>Configure</button></article>; })}<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-800"><KeyRound className="mb-2 size-5" /><b className="block">Never store private service credentials in frontend code.</b>Integration secrets must be stored as backend environment variables or a managed secret service.</div>{selected && <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/50 p-4"><section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start"><div><h2 className="text-xl font-semibold">Configure {selected.name}</h2><p className="mt-1 text-xs text-[#687184]">Store only public identifiers here. Private keys belong on the backend.</p></div><button className="ml-auto" type="button" onClick={() => setSelected(null)}><X className="size-5" /></button></div><div className="mt-5 space-y-4"><ToggleField label="Integration enabled" checked={draft.enabled} onChange={(enabled) => setDraft((current) => ({ ...current, enabled }))} /><TextField label="Public project / merchant identifier" value={draft.publicId} onChange={(publicId) => setDraft((current) => ({ ...current, publicId }))} /><TextField label="Public endpoint / domain" value={draft.endpoint} onChange={(endpoint) => setDraft((current) => ({ ...current, endpoint }))} /></div><div className="mt-6 flex justify-end gap-2"><button className="rounded-lg border px-4 py-2.5 text-sm font-semibold" type="button" onClick={() => setSelected(null)}>Cancel</button><button className="rounded-lg bg-[#0755b7] px-4 py-2.5 text-sm font-semibold text-white" type="button" onClick={apply}>Apply Configuration</button></div></section></div>}</div>;
};

const SystemHealth = ({ auditVersion }) => { void auditVersion; const audit = systemSettingsService.getAudit(); const health = [{ label: "REST API", value: "Not connected", tone: "amber" }, { label: "Firebase Auth", value: "Operational", tone: "green" }, { label: "Firestore", value: "Operational", tone: "green" }, { label: "File Storage", value: "Upgrade required", tone: "red" }]; return <div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{health.map((item) => <article className="rounded-xl border p-4" key={item.label}><small className="uppercase text-[#687184]">{item.label}</small><b className={`mt-2 block text-sm ${item.tone === "green" ? "text-emerald-700" : item.tone === "red" ? "text-red-700" : "text-amber-700"}`}>● {item.value}</b></article>)}</div><h3 className="mt-6 flex items-center gap-2 font-semibold"><FileClock className="size-5 text-[#0755b7]" />Recent Settings Audit</h3><div className="mt-3 overflow-hidden rounded-xl border"><div className="divide-y">{audit.length ? audit.map((entry) => <div className="grid gap-1 p-4 text-sm sm:grid-cols-[1fr_180px_180px]" key={entry.id}><b>{entry.action}</b><span className="text-[#687184]">{entry.admin}</span><small className="text-[#687184]">{entry.time}</small></div>) : <p className="p-8 text-center text-sm text-[#687184]">No settings changes have been recorded yet.</p>}</div></div></div>; };

const SettingsGrid = ({ children }) => <div className="grid items-start gap-5 xl:grid-cols-2">{children}</div>;
const SettingSection = ({ children, description, title }) => <section className="rounded-xl border border-[#d5dae5] p-4 sm:p-5"><h3 className="font-semibold">{title}</h3>{description && <p className="mt-1 text-xs text-[#687184]">{description}</p>}<div className="mt-4 space-y-4">{children}</div></section>;
const TextField = ({ label, onChange, type = "text", value }) => <label className="block text-xs font-semibold text-[#515867]">{label}<input className="mt-1.5 w-full rounded-lg border border-[#c8cfde] px-3 py-2.5 font-normal text-[#111c2c] outline-none focus:border-[#0755d3]" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
const NumberField = ({ label, max, min = "0", onChange, value }) => <label className="block text-xs font-semibold text-[#515867]">{label}<input className="mt-1.5 w-full rounded-lg border border-[#c8cfde] px-3 py-2.5 font-normal text-[#111c2c] outline-none focus:border-[#0755d3]" type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
const SelectField = ({ label, onChange, options, value }) => <label className="block text-xs font-semibold text-[#515867]">{label}<select className="mt-1.5 w-full rounded-lg border border-[#c8cfde] bg-white px-3 py-2.5 font-normal text-[#111c2c] outline-none focus:border-[#0755d3]" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
const ToggleField = ({ checked, danger, description, label, onChange }) => <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${danger ? "border-red-200 bg-red-50/50" : "border-[#d5dae5]"}`}><span className="min-w-0 flex-1"><b className="block text-sm">{label}</b>{description && <small className="text-[#687184]">{description}</small>}</span><input className="peer sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition peer-checked:bg-[#0755b7] after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" /></label>;
const ScoreCheck = ({ values }) => { const total = values.distanceWeight + values.experienceWeight + values.ratingWeight + values.specialtyWeight; return <div className={`rounded-lg border p-3 text-xs font-semibold ${total === 100 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>Weight total: {total}% {total === 100 ? "✓" : "— must equal 100%"}</div>; };

const ConfirmationModal = ({ description, onCancel, onConfirm, title }) => <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/50 p-4"><section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex"><span className="grid size-11 place-items-center rounded-full bg-red-100 text-red-700"><CircleAlert className="size-6" /></span><button className="ml-auto" type="button" onClick={onCancel}><X className="size-5" /></button></div><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-[#606878]">{description}</p><div className="mt-6 flex justify-end gap-2"><button className="rounded-lg border px-4 py-2.5 text-sm font-semibold" type="button" onClick={onCancel}>Cancel</button><button className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white" type="button" onClick={onConfirm}>Confirm Change</button></div></section></div>;

export default AdminSettings;
