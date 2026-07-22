import { ArrowRight, BadgeInfo, FileHeart, IdCard, PanelsTopLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientFileUpload from "../../components/client/ClientFileUpload";
import ClientOnboardingLayout from "../../components/client/ClientOnboardingLayout";
import useClientOnboarding from "../../hooks/useClientOnboarding";

const fileMetadata = (file) => file ? {
  name: file.name,
  size: file.size,
  type: file.type,
  lastModified: file.lastModified,
} : null;

const ClientVerification = () => {
  const navigate = useNavigate();
  const { record, submit } = useClientOnboarding();
  const [nidFront, setNidFront] = useState(record.documents.nidFront);
  const [nidBack, setNidBack] = useState(record.documents.nidBack);
  const [medicalReports, setMedicalReports] = useState(record.documents.medicalReports || []);
  const [confirmed, setConfirmed] = useState(record.confirmed);
  const [notice, setNotice] = useState(record.submitted ? "Your profile has been submitted for verification." : "");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nidFront || !nidBack) {
      setError("Upload both the front and back of your National ID.");
      return;
    }
    if (!confirmed) {
      setError("Confirm that the information and documents are correct.");
      return;
    }
    submit({ nidFront, nidBack, medicalReports });
    setError("");
    setNotice("Onboarding complete. Opening your client portal…");
    setTimeout(() => navigate("/client/dashboard"), 500);
  };

  return (
    <ClientOnboardingLayout wide>
      <form className="py-1" onSubmit={handleSubmit}>
        <header className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.04em] text-[#0047a8]">Step 3 of 3</p>
          <span className="absolute right-0 top-0 rounded-full border border-[#c5cad8] bg-[#f2f4f9] px-3 py-1 text-xs text-[#4c5261]">Almost there</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">Verification &amp; Documents</h1>
          <p className="mt-2 max-w-3xl text-base leading-6 text-[#4c5261]">
            Please provide clear photos of your National ID and any relevant medical reports to complete your profile verification.
          </p>
        </header>

        <section className="mt-6 flex gap-3 rounded-lg border border-[#b8c8e9] bg-[#dce8ff] p-4">
          <BadgeInfo className="mt-0.5 size-5 shrink-0 text-[#0047a8]" />
          <div>
            <h2 className="text-sm font-semibold">Verification Process</h2>
            <p className="mt-1 text-sm text-[#4c5261]">Security is our priority. Document verification usually takes 24 hours. You will be notified via email once approved.</p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="relative">
            <IdCard className="absolute right-6 top-6 z-10 size-6 text-[#0047a8]" />
            <ClientFileUpload
              title="NID Front Side"
              description="Clear photo showing your face and details."
              value={nidFront}
              accept=".svg,.png,.jpg,.jpeg"
              onChange={(event) => setNidFront(fileMetadata(event.target.files[0]))}
            />
          </div>
          <div className="relative">
            <PanelsTopLeft className="absolute right-6 top-6 z-10 size-6 text-[#0047a8]" />
            <ClientFileUpload
              title="NID Back Side"
              description="Must include the barcode and address details."
              value={nidBack}
              accept=".svg,.png,.jpg,.jpeg"
              onChange={(event) => setNidBack(fileMetadata(event.target.files[0]))}
            />
          </div>
        </div>

        <div className="relative mt-9">
          <FileHeart className="absolute right-6 top-6 z-10 size-6 text-emerald-700" />
          <ClientFileUpload
            title={<>Medical Reports <span className="ml-1 rounded-sm bg-[#e7efff] px-2 py-1 text-[10px] font-normal text-[#4c5261]">Optional</span></>}
            description="Upload any relevant health history documents."
            value={medicalReports}
            multiple
            accent="green"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(event) => setMedicalReports(Array.from(event.target.files).map(fileMetadata))}
          />
        </div>

        <section className="mt-8 rounded-lg border border-[#c5cad8] bg-white p-6">
          <label className="flex items-start gap-3">
            <input className="mt-1 size-5 accent-[#0047a8]" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            <span>
              <strong className="block text-sm">I confirm all information is correct</strong>
              <span className="mt-1 block text-sm leading-5 text-[#4c5261]">
                I certify that the documents provided are authentic and belong to me. I agree to the GuardianCare Terms of Service regarding data processing.
              </span>
            </span>
          </label>

          {error && <p className="mt-5 rounded bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
          {notice && <p className="mt-5 rounded bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{notice}</p>}

          <div className="mt-7 flex flex-col-reverse justify-between gap-3 border-t border-[#c5cad8] pt-3 sm:flex-row sm:items-center">
            <button className="px-5 py-3 text-sm font-semibold text-[#4c5261]" type="button" onClick={() => navigate("/client/contact-setup")}>Back to Previous</button>
            <button className="flex items-center justify-center gap-3 rounded-xl bg-[#0047a8] px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#003781]" type="submit">
              Submit for Verification <ArrowRight className="size-4" />
            </button>
          </div>
        </section>
      </form>
    </ClientOnboardingLayout>
  );
};

export default ClientVerification;
