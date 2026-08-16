import { Camera, CheckCircle2, MapPin, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingCard from "../../components/caregiver/OnboardingCard";
import OnboardingLayout from "../../components/caregiver/OnboardingLayout";
import useAuth from "../../hooks/useAuth";
import useCaregiverOnboarding from "../../hooks/useCaregiverOnboarding";

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-[#434654]">{label}</span>
    <input className="onboarding-input" {...props} />
  </label>
);

const careServices = [
  "Senior Care",
  "Child Care",
  "Home Nursing",
  "Companion Care",
  "Physiotherapy",
  "Dementia Care",
];

const CaregiverProfileSetup = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { user } = useAuth();
  const { record, saveProfile, uploadFile, deleteFile } = useCaregiverOnboarding();
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const collectProfile = () => {
    const formData = new FormData(formRef.current);
    return {
      fullName: formData.get("fullName"),
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      serviceRadius: formData.get("serviceRadius"),
      services: formData.getAll("services"),
      hourlyRate: formData.get("hourlyRate"),
    };
  };

  const saveDraft = async () => {
    setSaving(true);
    setError("");
    try {
      let nextRecord = await saveProfile(collectProfile());
      if (photoFile) {
        nextRecord = await uploadFile("profilePhoto", photoFile);
        setPhotoFile(null);
      }
      setNotice(nextRecord.profileCompleted ? "Profile saved and completed." : "Draft saved. Complete the remaining required fields to continue.");
      return nextRecord;
    } catch (saveError) {
      setError(saveError.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const continueToCredentials = async (event) => {
    event.preventDefault();
    if (!collectProfile().services.length) {
      setError("Select at least one service you can provide.");
      return;
    }
    if (!photoFile && !record.profile.photo) {
      setError("Upload a professional photo before continuing.");
      return;
    }
    const nextRecord = await saveDraft();
    if (nextRecord?.profileCompleted) navigate("/caregiver/credentials");
  };

  const removePhoto = async () => {
    if (photoFile) {
      setPhotoFile(null);
      return;
    }
    if (record.profile.photo) {
      setSaving(true);
      try {
        await deleteFile("profilePhoto");
        setNotice("Professional photo removed.");
      } catch (removeError) {
        setError(removeError.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const displayedPhotoName = photoFile?.name || record.profile.photo?.name || "";

  return (
    <OnboardingLayout activeStep="profile">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Profile Setup</h1>
        <p className="mt-2 text-sm text-[#434654]">Help families get to know you better by completing your professional profile.</p>
      </header>

      <form ref={formRef} className="space-y-6" onSubmit={continueToCredentials}>
        <OnboardingCard>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <label className="grid size-32 shrink-0 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-[#c3c6d6] bg-[#f4f5f7] p-3 text-center text-xs text-[#737685]">
              <span>
                {displayedPhotoName ? <CheckCircle2 className="mx-auto mb-2 size-8 text-emerald-600" /> : <Camera className="mx-auto mb-2 size-7" />}
                <span className="block max-w-24 truncate">{displayedPhotoName || "Upload Photo"}</span>
              </span>
              <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setPhotoFile(event.target.files[0] || null)} />
            </label>
            <div>
              <h2 className="font-semibold">Professional Photo <span className="text-red-600">*</span></h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#434654]">A clear, professional headshot helps build trust with families. Use a bright, neutral background.</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#434654]"><span className="rounded-full bg-[#f0f3ff] px-3 py-1">JPG or PNG</span><span className="rounded-full bg-[#f0f3ff] px-3 py-1">Max 5MB</span></div>
              {displayedPhotoName && <button className="mt-3 text-xs font-semibold text-red-700" type="button" onClick={removePhoto}>Remove photo</button>}
            </div>
          </div>
        </OnboardingCard>

        <OnboardingCard title="Personal Information" icon={UserRound}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="fullName" defaultValue={record.profile.fullName || user.displayName || ""} placeholder="e.g. Sarah Jenkins" required />
            <Field label="Date of Birth" name="dateOfBirth" defaultValue={record.profile.dateOfBirth} type="date" required />
            <label><span className="mb-2 block text-sm font-semibold text-[#434654]">Gender</span><select className="onboarding-input" name="gender" defaultValue={record.profile.gender} required><option value="" disabled>Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
            <Field label="Phone Number" name="phone" defaultValue={record.profile.phone} type="tel" placeholder="+880 1XXX-XXXXXX" required />
            <div className="sm:col-span-2"><Field label="Email Address" name="email" defaultValue={record.profile.email || user.email || ""} type="email" placeholder="sarah.jenkins@example.com" required /></div>
          </div>
        </OnboardingCard>

        <OnboardingCard title="Services & Hourly Rate" icon={UserRound}>
          <p className="mb-4 text-sm text-[#434654]">
            Select every service you are qualified to provide.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {careServices.map((service) => (
              <label
                className="flex items-center gap-3 rounded-lg border border-[#c3c6d6] p-3 text-sm font-medium"
                key={service}
              >
                <input
                  className="size-4 accent-[#003d9b]"
                  type="checkbox"
                  name="services"
                  value={service}
                  defaultChecked={record.profile.services?.includes(service)}
                />
                {service}
              </label>
            ))}
          </div>
          <div className="mt-5 max-w-sm">
            <Field
              label="Expected Hourly Rate (BDT)"
              name="hourlyRate"
              type="number"
              min="1"
              step="1"
              defaultValue={record.profile.hourlyRate}
              placeholder="e.g. 850"
              required
            />
          </div>
        </OnboardingCard>

        <OnboardingCard title="Location & Service Area" icon={MapPin}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3"><Field label="Primary Address" name="address" defaultValue={record.profile.address} placeholder="House, road and area" required /></div>
            <Field label="City" name="city" defaultValue={record.profile.city} placeholder="Dhaka" required />
            <Field label="Division" name="state" defaultValue={record.profile.state} placeholder="Dhaka" required />
            <Field label="Postal Code" name="zipCode" defaultValue={record.profile.zipCode} placeholder="1212" required />
            <label className="sm:col-span-2 lg:col-span-3">
              <span className="mb-2 block text-sm font-semibold text-[#434654]">Service Radius (miles)</span>
              <input className="w-full accent-[#003d9b]" name="serviceRadius" type="range" min="5" max="50" defaultValue={record.profile.serviceRadius} />
              <span className="mt-1 flex justify-between text-xs text-[#737685]"><span>5 miles</span><span>25 miles</span><span>50+ miles</span></span>
            </label>
          </div>
        </OnboardingCard>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        {notice && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{notice}</p>}

        <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#c3c6d6] pt-6 sm:flex-row">
          <button className="secondary-action disabled:opacity-60" type="button" disabled={saving} onClick={saveDraft}>{saving ? "Saving…" : "Save Progress"}</button>
          <button className="onboarding-action disabled:opacity-60" type="submit" disabled={saving}>Continue to Credentials →</button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default CaregiverProfileSetup;
