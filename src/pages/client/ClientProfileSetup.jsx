import { BadgeCheck, CalendarDays, ChevronDown, Hash, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientOnboardingLayout from "../../components/client/ClientOnboardingLayout";
import ClientProgress from "../../components/client/ClientProgress";
import useAuth from "../../hooks/useAuth";
import useClientOnboarding from "../../hooks/useClientOnboarding";

const ClientProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { record, saveProfile } = useClientOnboarding();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    saveProfile({
      fullName: formData.get("fullName"),
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
      nidNumber: formData.get("nidNumber"),
    });
    navigate("/client/contact-setup");
  };

  return (
    <ClientOnboardingLayout>
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">Client Profile Setup</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-6 text-[#4c5261]">
          Welcome to GuardianCare Dhaka. To ensure the highest quality of care and security,
          please provide accurate personal information.
        </p>
      </header>

      <ClientProgress activeStep={1} />

      <form className="mt-6 rounded-lg border border-[#c5cad8] bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
        <h2 className="flex items-center gap-2 border-b border-[#c5cad8] pb-2 text-2xl font-semibold">
          <UserRound className="size-6 fill-[#06449d] text-[#06449d]" /> Personal Information
        </h2>

        <div className="mt-6 space-y-6">
          <label className="block">
            <span className="client-label">Full Name <b>*</b></span>
            <span className="relative block">
              <BadgeCheck className="client-field-icon" />
              <input
                className="client-input pl-10"
                name="fullName"
                defaultValue={record.profile.fullName || user?.displayName || ""}
                placeholder="As it appears on your NID"
                required
              />
            </span>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="client-label">Date of Birth <b>*</b></span>
              <span className="relative block">
                <CalendarDays className="client-field-icon" />
                <input className="client-input pl-10" name="dateOfBirth" type="date" defaultValue={record.profile.dateOfBirth} required />
              </span>
            </label>
            <label className="block">
              <span className="client-label">Gender <b>*</b></span>
              <span className="relative block">
                <UsersRound className="client-field-icon" />
                <select className="client-input appearance-none pl-10 pr-10" name="gender" defaultValue={record.profile.gender} required>
                  <option value="" disabled>Select Gender</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#4c5261]" />
              </span>
            </label>
          </div>

          <label className="block">
            <span className="flex items-center justify-between gap-3">
              <span className="client-label">National ID (NID) Number <b>*</b></span>
              <span className="mb-2 flex items-center gap-1 rounded-sm bg-[#e7efff] px-2 py-1 text-[11px] text-[#4c5261]">
                <ShieldCheck className="size-3" /> Secure
              </span>
            </span>
            <span className="relative block">
              <Hash className="client-field-icon" />
              <input
                className="client-input pl-10"
                name="nidNumber"
                defaultValue={record.profile.nidNumber}
                inputMode="numeric"
                minLength="10"
                maxLength="17"
                pattern="[0-9]{10}|[0-9]{17}"
                placeholder="Enter your 10 or 17 digit NID"
                required
              />
            </span>
            <span className="mt-2 block text-xs text-[#4c5261]">Your NID is required for identity verification and caregiver safety.</span>
          </label>
        </div>

        <div className="mt-9 flex flex-col-reverse justify-between gap-3 border-t border-[#c5cad8] pt-4 sm:flex-row">
          <button className="rounded border border-[#bfc6d8] bg-[#f3f5fa] px-6 py-3 text-sm font-semibold" type="button" onClick={() => navigate("/join")}>Cancel</button>
          <button className="rounded bg-[#0047a8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#003781]" type="submit">
            Next: Contact &amp; Location <span className="ml-2 text-xl">→</span>
          </button>
        </div>
      </form>

      <div className="mt-6 flex justify-center gap-8 text-xs text-[#747b8a]">
        <span className="flex items-center gap-1"><ShieldCheck className="size-4" /> Data Encrypted</span>
        <span className="flex items-center gap-1"><BadgeCheck className="size-4" /> Privacy Compliant</span>
      </div>
    </ClientOnboardingLayout>
  );
};

export default ClientProfileSetup;
