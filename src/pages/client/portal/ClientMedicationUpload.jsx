import {
  CheckCircle2,
  CloudUpload,
  Download,
  FileImage,
  FileText,
  History,
  Info,
  LoaderCircle,
  NotebookPen,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PortalCard from "../../../components/client/portal/PortalCard";
import {
  downloadMedicalDocument,
  getMyMedicalDocuments,
  saveMedicationInstructions,
  uploadMedicalDocument,
} from "../../../services/medicalDocumentService";

const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : new Intl.DateTimeFormat("en-BD", {
        timeZone: "Asia/Dhaka",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const formatSize = (bytes) => {
  const size = Number(bytes || 0);
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
};

const titleCase = (value = "") =>
  value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const ClientMedicationUpload = () => {
  const inputRef = useRef(null);
  const instructionsLoadedRef = useRef(false);
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("prescription");
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  const applyFiles = (selectedFiles) => {
    const accepted = Array.from(selectedFiles).filter((file) => {
      const lowerName = file.name.toLowerCase();
      return (
        file.size <= 10 * 1024 * 1024 &&
        allowedExtensions.some((extension) => lowerName.endsWith(extension))
      );
    });
    setFiles(accepted);
    if (accepted.length !== selectedFiles.length) {
      setError("Only PDF, JPG, PNG or WebP files up to 10 MB were selected.");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    let active = true;
    const refresh = () =>
      getMyMedicalDocuments()
        .then((record) => {
          if (!active) return;
          setDocuments(record.documents || []);
          if (!instructionsLoadedRef.current) {
            setNotes(record.instructions || "");
            instructionsLoadedRef.current = true;
          }
          setError("");
        })
        .catch((requestError) => {
          if (active) setError(requestError.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    void refresh();
    const timer = window.setInterval(refresh, 10000);
    const handleFocus = () => void refresh();
    window.addEventListener("focus", handleFocus);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleUpload = async () => {
    if (!files.length || uploading) return;
    setUploading(true);
    setError("");
    setNotice("");
    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadMedicalDocument(file, category));
      }
      setDocuments((current) =>
        [...uploaded, ...current].sort((left, right) =>
          String(right.uploadedAt).localeCompare(String(left.uploadedAt)),
        ),
      );
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      setNotice(
        `${uploaded.length} medical document${uploaded.length === 1 ? "" : "s"} uploaded securely.`,
      );
    } catch (requestError) {
      setError(requestError.message);
      // Reloading reconciles the list when an earlier file in a multi-upload
      // succeeded before a later file failed.
      try {
        const record = await getMyMedicalDocuments();
        setDocuments(record.documents || []);
      } catch {
        // Preserve the original actionable upload error.
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSaveInstructions = async () => {
    setSavingNotes(true);
    setError("");
    try {
      await saveMedicationInstructions(notes);
      setNotice("Medication instructions saved securely.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      const { blob, filename } = await downloadMedicalDocument(document);
      const url = URL.createObjectURL(blob);
      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.download = filename || document.name;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="mx-auto max-w-[1050px] p-5 sm:p-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">
          Upload Medication File
        </h1>
        <p className="mt-1 text-[#4c5261]">
          Manage prescription documents and medical reports for your care plan.
        </p>
      </header>

      {(error || notice) && (
        <p
          className={`mt-5 rounded-lg border p-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || notice}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <PortalCard className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-[#0649ad]">
                <Upload className="size-5" />
                Medical File Upload
              </h2>
              <label className="text-xs font-semibold text-[#596174]">
                Document type
                <select
                  className="ml-2 rounded-lg border border-[#c5cad8] bg-white px-3 py-2 text-sm text-[#101c2d]"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="prescription">Prescription</option>
                  <option value="medication_schedule">
                    Medication schedule
                  </option>
                  <option value="medical_report">Medical report</option>
                  <option value="lab_result">Lab result</option>
                </select>
              </label>
            </div>
            <div
              className="mt-4 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c5cad8] p-6 text-center transition hover:border-[#0649ad] hover:bg-[#f8faff]"
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  inputRef.current?.click();
                }
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                applyFiles(event.dataTransfer.files);
              }}
            >
              <span className="grid size-14 place-items-center rounded-xl bg-[#eef2ff]">
                <CloudUpload className="size-8 text-[#0649ad]" />
              </span>
              <strong className="mt-3 text-2xl">
                Drag & drop medical documents
              </strong>
              <span className="mt-2 text-[#4c5261]">
                PDF, JPG, PNG or WebP · maximum 10 MB per file
              </span>
              <span className="mt-6 rounded bg-[#0649ad] px-6 py-3 text-sm font-semibold text-white">
                Select from Computer
              </span>
              <input
                className="sr-only"
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(event) => applyFiles(event.target.files)}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <b className="text-sm">
                  {files.length} medical file{files.length === 1 ? "" : "s"}{" "}
                  ready
                </b>
                <ul className="mt-2 space-y-1 text-xs text-[#596174]">
                  {files.map((file) => (
                    <li className="flex justify-between gap-3" key={file.name}>
                      <span className="truncate">{file.name}</span>
                      <span>{formatSize(file.size)}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0649ad] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:ml-auto sm:w-auto"
                  type="button"
                  disabled={uploading}
                  onClick={handleUpload}
                >
                  {uploading ? (
                    <LoaderCircle className="size-5 animate-spin" />
                  ) : (
                    <CloudUpload className="size-5" />
                  )}
                  {uploading ? "Uploading..." : "Upload Securely"}
                </button>
              </div>
            )}
          </PortalCard>

          <PortalCard className="p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-[#0649ad]">
              <NotebookPen className="size-5" />
              Caregiver Instructions
            </h2>
            <textarea
              className="mt-4 min-h-32 w-full resize-y rounded border border-[#c5cad8] bg-[#f7f8fb] p-4 outline-none focus:border-[#0649ad]"
              value={notes}
              maxLength={2000}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add specific medication instructions for the assigned caregiver..."
            />
            <div className="mt-2 flex items-center text-xs text-[#687184]">
              <span>{notes.length}/2000</span>
              <button
                className="ml-auto rounded bg-emerald-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                type="button"
                disabled={savingNotes}
                onClick={handleSaveInstructions}
              >
                {savingNotes ? "Saving..." : "Save Instructions"}
              </button>
            </div>
          </PortalCard>
        </div>

        <PortalCard className="h-fit p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-[#0649ad]">
              <History className="size-5" />
              Recent Medical Uploads
            </h2>
            <span className="text-xs">{documents.length}</span>
          </div>

          <div className="mt-5 max-h-[620px] space-y-3 overflow-y-auto">
            {loading && (
              <LoaderCircle className="mx-auto my-10 size-8 animate-spin text-[#0649ad]" />
            )}
            {!loading &&
              documents.map((document) => (
                <MedicalDocumentCard
                  document={document}
                  key={`${document.source}-${document.documentId}`}
                  onDownload={() => handleDownload(document)}
                />
              ))}
            {!loading && !documents.length && (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <FileText className="mx-auto size-9 text-[#8b93a3]" />
                <b className="mt-3 block text-sm">
                  No medical documents uploaded
                </b>
                <p className="mt-1 text-xs text-[#687184]">
                  Only medical files uploaded by this client account will
                  appear here.
                </p>
              </div>
            )}
          </div>

          <p className="mt-6 flex gap-2 rounded-lg bg-[#eef2ff] p-3 text-xs leading-5 text-[#4c5261]">
            <Info className="size-5 shrink-0 text-[#0649ad]" />
            This panel contains only your protected prescriptions, medication
            schedules, lab results, and medical reports. Identity documents are
            never shown here.
          </p>
        </PortalCard>
      </div>
    </div>
  );
};

const MedicalDocumentCard = ({ document, onDownload }) => {
  const Icon = document.contentType?.startsWith("image/")
    ? FileImage
    : FileText;
  const reviewed = document.status === "reviewed";
  return (
    <article className="rounded-lg border border-[#c5cad8] bg-[#f9f9ff] p-3">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-12 shrink-0 place-items-center ${
            reviewed ? "bg-[#a7ead4]" : "bg-blue-100"
          }`}
        >
          <Icon
            className={`size-5 ${
              reviewed ? "text-emerald-800" : "text-[#0649ad]"
            }`}
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="break-all text-sm font-semibold">{document.name}</h3>
          <p className="mt-1 text-xs text-[#4c5261]">
            {titleCase(document.category)} · {formatSize(document.size)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] font-semibold uppercase ${
                reviewed
                  ? "bg-[#9df2c8] text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {reviewed && <CheckCircle2 className="size-3" />}
              {titleCase(document.status)}
            </span>
            {document.source === "onboarding" && (
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase text-[#596174]">
                <ShieldCheck className="size-3" />
                Onboarding
              </span>
            )}
          </div>
          <p className="mt-2 text-[10px] text-[#687184]">
            {formatDate(document.uploadedAt)}
          </p>
        </div>
        <button
          className="rounded-lg border border-[#c5cad8] bg-white p-2 text-[#0649ad]"
          type="button"
          onClick={onDownload}
          aria-label={`Download ${document.name}`}
        >
          <Download className="size-4" />
        </button>
      </div>
    </article>
  );
};

export default ClientMedicationUpload;
