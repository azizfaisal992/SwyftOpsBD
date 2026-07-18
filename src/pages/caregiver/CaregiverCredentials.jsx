import { BadgeCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import FileUpload from "../../components/caregiver/FileUpload";
import OnboardingLayout from "../../components/caregiver/OnboardingLayout";
import useCaregiverOnboarding from "../../hooks/useCaregiverOnboarding";

const licenses = [
  ["CRP", "Certified Rehabilitation Professional", "#003d9b"],
  ["AHLC", "Allied Health Licensing Council", "#016c47"],
  ["RNLC", "Registered Nurse Licensing Council", "#004d3f"],
];

const emptyPendingFiles = {
  resume: null,
  nidFront: null,
  nidBack: null,
  referenceLetter: null,
  licenseCRP: null,
  licenseAHLC: null,
  licenseRNLC: null,
};

const CaregiverCredentials = () => {
  const navigate = useNavigate();
  const { record, uploadFile, deleteFile } = useCaregiverOnboarding();
  const [pendingFiles, setPendingFiles] = useState(emptyPendingFiles);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  if (!record.profileCompleted) return <Navigate replace to="/caregiver/profile-setup" />;

  const chooseFile = (kind, file) => {
    setPendingFiles((current) => ({ ...current, [kind]: file || null }));
    setNotice("");
    setError("");
  };

  const displayedFiles = (kind, existing) => pendingFiles[kind] ? [pendingFiles[kind]] : existing ? [existing] : [];

  const clearFile = async (kind, existing) => {
    if (pendingFiles[kind]) {
      setPendingFiles((current) => ({ ...current, [kind]: null }));
      return;
    }
    if (!existing) return;

    setSaving(true);
    setError("");
    try {
      await deleteFile(kind);
      setNotice("Document removed.");
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadPendingFiles = async () => {
    setSaving(true);
    setError("");
    let nextRecord = record;

    try {
      for (const [kind, file] of Object.entries(pendingFiles)) {
        if (file) nextRecord = await uploadFile(kind, file);
      }
      setPendingFiles(emptyPendingFiles);
      setNotice(nextRecord.credentialsCompleted ? "Required credentials uploaded." : "Draft saved. Resume and both NID sides are required to continue.");
      return nextRecord;
    } catch (uploadError) {
      setError(uploadError.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const continueToAssessment = async () => {
    const nextRecord = await uploadPendingFiles();
    if (nextRecord?.credentialsCompleted) {
      navigate("/caregiver/assessment");
    } else if (nextRecord) {
      setError("Upload your resume and both sides of your NID card before continuing.");
    }
  };

  return (
    <OnboardingLayout activeStep="credentials">
      <header className="mb-7">
        <h1 className="text-3xl font-semibold">Verification & Credentials</h1>
        <p className="mt-2 text-lg text-[#434654]">Upload your professional documents to verify your background and expertise.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <FileUpload
          title="Resume/CV"
          detail="PDF or DOCX, up to 5MB"
          required
          accept=".pdf,.doc,.docx"
          files={displayedFiles("resume", record.credentials.resume)}
          onChange={(event) => chooseFile("resume", event.target.files[0])}
          onClear={() => clearFile("resume", record.credentials.resume)}
        />
        <FileUpload
          title="NID Card — Front"
          detail="PDF, JPG or PNG, up to 5MB"
          required
          accept="image/*,.pdf"
          files={displayedFiles("nidFront", record.credentials.nidFront)}
          onChange={(event) => chooseFile("nidFront", event.target.files[0])}
          onClear={() => clearFile("nidFront", record.credentials.nidFront)}
        />
        <FileUpload
          title="NID Card — Back"
          detail="PDF, JPG or PNG, up to 5MB"
          required
          accept="image/*,.pdf"
          files={displayedFiles("nidBack", record.credentials.nidBack)}
          onChange={(event) => chooseFile("nidBack", event.target.files[0])}
          onClear={() => clearFile("nidBack", record.credentials.nidBack)}
        />
        <FileUpload
          title="Reference Letter"
          detail="PDF, JPG or PNG (optional)"
          compact
          accept=".pdf,image/*"
          files={displayedFiles("referenceLetter", record.credentials.referenceLetter)}
          onChange={(event) => chooseFile("referenceLetter", event.target.files[0])}
          onClear={() => clearFile("referenceLetter", record.credentials.referenceLetter)}
        />
      </div>

      <section className="mt-8">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold"><BadgeCheck className="size-6 text-[#003d9b]" />Professional Licenses</h2>
        <p className="mb-6 text-sm text-[#434654]">Optional—upload only the licences you currently hold.</p>
        <div className="grid gap-5 sm:grid-cols-3">
          {licenses.map(([name, detail, color]) => {
            const kind = `license${name}`;
            const displayed = pendingFiles[kind] || record.credentials.licenses[name];
            return (
              <article className="overflow-hidden rounded-lg border border-[#c3c6d6] bg-white" key={name}>
                <div className="h-1.5" style={{ backgroundColor: color }} />
                <div className="p-5">
                  <h3 className="font-semibold">{name}</h3>
                  <p className="mt-2 min-h-10 text-xs text-[#434654]">{detail}</p>
                  <label className="mt-4 block cursor-pointer rounded border border-[#737685] px-4 py-3 text-center text-sm font-semibold" style={{ color }}>
                    {displayed ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="size-4" /><span className="truncate">{displayed.name}</span></span> : "Upload Document"}
                    <input className="sr-only" type="file" accept=".pdf,image/*" onChange={(event) => chooseFile(kind, event.target.files[0])} />
                  </label>
                  {displayed && <button className="mt-3 w-full text-xs font-semibold text-red-700" type="button" onClick={() => clearFile(kind, record.credentials.licenses[name])}>Remove</button>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
      {notice && <p className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{notice}</p>}

      <div className="mt-9 flex flex-col-reverse justify-between gap-3 border-t border-[#c3c6d6] pt-7 sm:flex-row">
        <button className="secondary-action disabled:opacity-60" type="button" disabled={saving} onClick={uploadPendingFiles}>{saving ? "Uploading…" : "Save Progress"}</button>
        <button className="onboarding-action disabled:opacity-60" type="button" disabled={saving} onClick={continueToAssessment}>Continue to Assessment →</button>
      </div>
    </OnboardingLayout>
  );
};

export default CaregiverCredentials;
