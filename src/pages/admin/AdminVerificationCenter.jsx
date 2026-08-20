import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileBadge,
  FileCheck2,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import caregiverFallback from "../../assets/caregiver-sarah.jpg";
import ProtectedOnboardingImage from "../../components/admin/ProtectedOnboardingImage";
import {
  getVerificationQueue,
  openVerificationDocument,
  reviewVerification,
} from "../../services/adminVerificationService";

const fallbackInitial = (name = "User") =>
  name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const formatDate = (value) => {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const normalizeCase = ({ role, record }) => {
  const caregiver = role === "caregiver";
  const profile = record.profile || {};
  const contact = caregiver ? profile : record.contact || {};
  const documents = caregiver ? record.credentials || {} : record.documents || {};
  const userId = caregiver ? record.caregiverId : record.clientId;
  return {
    id: userId,
    role,
    roleLabel: caregiver ? "Caregiver" : "Client",
    name: profile.fullName || record.accountEmail || "Unnamed applicant",
    email: profile.email || contact.email || record.accountEmail || "",
    phone: profile.phone || contact.phone || "",
    location: caregiver
      ? [profile.address, profile.city].filter(Boolean).join(", ")
      : [contact.house, contact.road, contact.area].filter(Boolean).join(", "),
    submittedAt: record.submittedAt,
    status: record.verificationStatus,
    progress: Number(record.progress || 0),
    profile,
    contact,
    documents,
    assessment: caregiver ? record.assessment || {} : null,
    raw: record,
  };
};

const AdminVerificationCenter = () => {
  const [filter, setFilter] = useState("All");
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [mobileDetail, setMobileDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reviewMode, setReviewMode] = useState("");

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const records = (await getVerificationQueue()).map(normalizeCase);
      records.sort((a, b) =>
        String(a.submittedAt || "").localeCompare(String(b.submittedAt || "")));
      setCases(records);
      setSelectedId((current) =>
        records.some((item) => item.id === current)
          ? current
          : records[0]?.id || "");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadQueue, 0);
    return () => window.clearTimeout(timer);
  }, [loadQueue]);

  const visibleCases = useMemo(
    () => filter === "All"
      ? cases
      : cases.filter((item) => item.roleLabel === filter),
    [cases, filter],
  );
  const selected = cases.find((item) => item.id === selectedId) || null;

  const choose = (id) => {
    setSelectedId(id);
    setMobileDetail(true);
    setError("");
    setNotice("");
  };

  const decide = async (decision, feedback) => {
    if (!selected) return;
    setWorking(true);
    setError("");
    try {
      await reviewVerification(selected.role, selected.id, decision, feedback);
      setNotice(
        decision === "approved"
          ? `${selected.name} has been approved.`
          : `Updates were requested from ${selected.name}.`,
      );
      setMobileDetail(false);
      await loadQueue();
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f7fc] lg:h-[calc(100vh-64px)] lg:min-h-0 lg:overflow-hidden">
      <div className="grid min-h-[calc(100vh-64px)] lg:h-full lg:min-h-0 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className={`${mobileDetail ? "hidden lg:flex" : "flex"} min-h-0 flex-col border-r border-[#c5cad8] bg-white`}>
          <header className="shrink-0 border-b border-[#c5cad8] p-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-semibold">Verification Queue</h1>
                <p className="text-xs text-[#687184]">{cases.length} awaiting review</p>
              </div>
              <button className="ml-auto rounded-lg border p-2 text-[#0755d3]" type="button" onClick={loadQueue} aria-label="Refresh queue">
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              {["All", "Caregiver", "Client"].map((item) => (
                <button
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === item ? "bg-[#0755d3] text-white" : "bg-[#e9ecf4] text-[#515867]"}`}
                  type="button"
                  key={item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </header>
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
            {loading && <EmptyState icon={LoaderCircle} title="Loading submissions…" spin />}
            {!loading && error && <EmptyState icon={TriangleAlert} title={error} danger />}
            {!loading && !error && visibleCases.length === 0 && (
              <EmptyState icon={CheckCircle2} title="No submissions in this queue" />
            )}
            {!loading && visibleCases.map((item) => (
              <CaseItem
                key={`${item.role}-${item.id}`}
                item={item}
                selected={selected?.id === item.id}
                onClick={() => choose(item.id)}
              />
            ))}
          </div>
        </aside>

        <main className={`${mobileDetail ? "flex" : "hidden lg:flex"} min-w-0 flex-col lg:min-h-0`}>
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <button className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0649ad] lg:hidden" type="button" onClick={() => setMobileDetail(false)}>
              <ArrowLeft className="size-4" /> Back to queue
            </button>
            {notice && <Alert tone="success">{notice}</Alert>}
            {error && selected && <Alert tone="danger">{error}</Alert>}
            {selected ? (
              <>
                <CaseHeader item={selected} />
                <VerificationOverview item={selected} />
                <SubmittedProfile item={selected} />
                <SubmittedDocuments item={selected} onError={setError} />
                {selected.role === "caregiver" && <AssessmentReview item={selected} />}
                <SubmissionHistory item={selected} />
              </>
            ) : (
              <div className="grid min-h-[60vh] place-items-center">
                <EmptyState icon={ShieldCheck} title="Select a verification submission" />
              </div>
            )}
          </div>
          {selected && (
            <DecisionBar
              disabled={working}
              onApprove={() => decide("approved", "Verification approved by administrator.")}
              onChanges={() => setReviewMode("changes_required")}
              onReject={() => setReviewMode("rejected")}
            />
          )}
        </main>
      </div>
      {reviewMode && selected && (
        <ReviewDialog
          applicant={selected.name}
          mode={reviewMode}
          disabled={working}
          onClose={() => setReviewMode("")}
          onSubmit={async (feedback) => {
            await decide(reviewMode, feedback);
            setReviewMode("");
          }}
        />
      )}
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, danger = false, spin = false }) => (
  <div className={`grid min-h-48 place-items-center p-6 text-center ${danger ? "text-red-700" : "text-[#687184]"}`}>
    <div><Icon className={`mx-auto mb-3 size-7 ${spin ? "animate-spin" : ""}`} /><p className="text-sm font-semibold">{title}</p></div>
  </div>
);

const Alert = ({ children, tone }) => (
  <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${tone === "danger" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
    {children}
  </div>
);

const CaseItem = ({ item, selected, onClick }) => (
  <button className={`w-full border-b border-[#d8dce6] p-4 text-left ${selected ? "bg-[#dbe8ff]" : "hover:bg-[#f7f9fd]"}`} type="button" onClick={onClick}>
    <div className="flex items-start gap-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#0755d3] font-bold text-white">{fallbackInitial(item.name)}</span>
      <div className="min-w-0 flex-1">
        <b className="block truncate">{item.name}</b>
        <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-[9px] font-bold uppercase ${item.role === "client" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>{item.roleLabel}</span>
        <p className="mt-2 flex items-center gap-1 text-xs text-[#687184]"><Clock3 className="size-3" />{formatDate(item.submittedAt)}</p>
      </div>
      <span className="rounded bg-amber-100 px-2 py-1 text-[9px] font-bold uppercase text-amber-700">Pending</span>
    </div>
  </button>
);

const CaseHeader = ({ item }) => (
  <section className="rounded-xl border border-[#c5cad8] bg-white p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {item.role === "caregiver" ? (
        <ProtectedOnboardingImage
          className="size-20 shrink-0 rounded-xl object-cover ring-2 ring-[#0755d3]"
          role="caregiver"
          userId={item.id}
          fallback={caregiverFallback}
          alt={item.name}
        />
      ) : (
        <span className="grid size-20 shrink-0 place-items-center rounded-xl bg-[#0755d3] text-2xl font-bold text-white">{fallbackInitial(item.name)}</span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold">{item.name}</h2>
          <span className="rounded-full bg-[#dce8ff] px-3 py-1 text-xs font-semibold text-[#0755d3]">{item.roleLabel} submission</span>
        </div>
        <p className="mt-2 break-all text-sm text-[#515867]">{item.email}</p>
        <p className="mt-3 flex flex-wrap gap-4 text-sm text-[#737b8c]">
          <span className="flex items-center gap-1"><Clock3 className="size-4" />Submitted {formatDate(item.submittedAt)}</span>
          {item.location && <span className="flex items-center gap-1"><MapPin className="size-4" />{item.location}</span>}
        </p>
      </div>
      <div className="text-left sm:text-right"><small className="font-semibold uppercase tracking-wider text-[#737b8c]">Completion</small><b className="block text-4xl text-emerald-700">{item.progress}%</b></div>
    </div>
  </section>
);

const VerificationOverview = ({ item }) => {
  const caregiver = item.role === "caregiver";
  const profileReady = item.raw.profileCompleted;
  const contactReady = caregiver ? true : item.raw.contactCompleted;
  const docsReady = caregiver ? item.raw.credentialsCompleted : item.raw.documentsCompleted;
  const assessmentReady = caregiver ? item.raw.assessmentSubmitted : item.raw.confirmed;
  return (
    <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatusCard title="Profile" complete={profileReady} />
      {!caregiver && <StatusCard title="Contact & location" complete={contactReady} />}
      <StatusCard title={caregiver ? "Credentials" : "Identity documents"} complete={docsReady} />
      <StatusCard title={caregiver ? "Assessment" : "Information confirmation"} complete={assessmentReady} />
    </section>
  );
};

const StatusCard = ({ title, complete }) => (
  <article className={`rounded-xl border border-l-4 bg-white p-4 ${complete ? "border-l-emerald-600" : "border-l-amber-500"}`}>
    <div className="flex items-center gap-3">
      {complete ? <CheckCircle2 className="size-5 text-emerald-600" /> : <TriangleAlert className="size-5 text-amber-600" />}
      <div><b className="block text-sm">{title}</b><small className={complete ? "text-emerald-700" : "text-amber-700"}>{complete ? "Complete" : "Needs review"}</small></div>
    </div>
  </article>
);

const SubmittedProfile = ({ item }) => {
  const caregiver = item.role === "caregiver";
  const p = item.profile;
  const c = item.contact;
  const values = caregiver
    ? [
      ["Full name", p.fullName], ["Date of birth", p.dateOfBirth],
      ["Gender", p.gender], ["Phone", p.phone], ["Email", p.email],
      ["Address", [p.address, p.city, p.state, p.zipCode].filter(Boolean).join(", ")],
      ["Service radius", p.serviceRadius ? `${p.serviceRadius} km` : ""],
    ]
    : [
      ["Full name", p.fullName], ["Date of birth", p.dateOfBirth],
      ["Gender", p.gender], ["NID number", p.nidNumber],
      ["Phone", c.phone], ["Email", c.email],
      ["Service address", [c.house, c.road, c.area].filter(Boolean).join(", ")],
      ["Location pinned", c.locationPinned ? "Yes" : "No"],
    ];
  return (
    <section className="mt-7">
      <h2 className="flex items-center gap-2 text-lg font-semibold"><UserRound className="size-5" />Submitted Profile</h2>
      <dl className="mt-4 grid gap-4 rounded-xl border border-[#c5cad8] bg-white p-5 sm:grid-cols-2 xl:grid-cols-4">
        {values.map(([label, value]) => <div key={label}><dt className="text-[10px] font-bold uppercase tracking-wider text-[#737b8c]">{label}</dt><dd className="mt-2 break-words text-sm font-medium">{value || "Not provided"}</dd></div>)}
      </dl>
    </section>
  );
};

const documentEntries = (item) => {
  if (item.role === "caregiver") {
    const d = item.documents;
    return [
      ["Resume / CV", "resume", d.resume, true],
      ["NID front", "nidFront", d.nidFront, true],
      ["NID back", "nidBack", d.nidBack, true],
      ["Reference letter", "referenceLetter", d.referenceLetter, false],
      ["CRP license", "licenseCRP", d.licenses?.CRP, false],
      ["AHLC license", "licenseAHLC", d.licenses?.AHLC, false],
      ["RNLC license", "licenseRNLC", d.licenses?.RNLC, false],
    ];
  }
  return [
    ["NID front", "nidFront", item.documents.nidFront, true],
    ["NID back", "nidBack", item.documents.nidBack, true],
    ...(item.documents.medicalReports || []).map((file, index) =>
      [`Medical report ${index + 1}`, "medicalReport", file, false]),
  ];
};

const SubmittedDocuments = ({ item, onError }) => {
  const [opening, setOpening] = useState("");
  const documents = documentEntries(item);
  const open = async (kind, file) => {
    if (!file) return;
    setOpening(`${kind}-${file.id || ""}`);
    onError("");
    try {
      await openVerificationDocument(item.role, item.id, kind, file.id);
    } catch (openError) {
      onError(openError.message);
    } finally {
      setOpening("");
    }
  };
  return (
    <section className="mt-7">
      <h2 className="flex items-center gap-2 text-lg font-semibold"><FileCheck2 className="size-5" />Submitted Documents</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {documents.map(([label, kind, file, required], index) => {
          const key = `${kind}-${file?.id || index}`;
          return (
            <button className={`flex items-center gap-3 rounded-xl border p-4 text-left ${file ? "bg-white hover:border-[#0755d3]" : "border-amber-200 bg-amber-50"}`} type="button" disabled={!file || opening === key} onClick={() => open(kind, file)} key={key}>
              <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${file ? "bg-blue-100 text-[#0755d3]" : "bg-amber-100 text-amber-700"}`}>{opening === key ? <LoaderCircle className="size-5 animate-spin" /> : file ? <FileBadge className="size-5" /> : <TriangleAlert className="size-5" />}</span>
              <span className="min-w-0"><b className="block text-sm">{label}{required && <span className="text-red-600"> *</span>}</b><small className="block truncate text-[#737b8c]">{file?.name || "Not provided"}{file ? " · Open securely" : ""}</small></span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

const AssessmentReview = ({ item }) => {
  const a = item.assessment;
  return (
    <section className="mt-7">
      <h2 className="flex items-center gap-2 text-lg font-semibold"><ClipboardCheck className="size-5" />Competency Assessment</h2>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <AssessmentCard title="Emergency response" value={a.emergency} />
        <AssessmentCard title="Ethical conduct" value={a.ethics} />
        <AssessmentCard title="Hygiene practices" value={(a.hygiene || []).join(", ")} />
      </div>
    </section>
  );
};

const AssessmentCard = ({ title, value }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-5">
    <b className="flex items-center gap-2"><CheckCircle2 className="size-5 text-emerald-600" />{title}</b>
    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#515867]">{value || "No answer supplied"}</p>
  </article>
);

const SubmissionHistory = ({ item }) => (
  <section className="mt-7 rounded-xl border border-[#c5cad8] bg-white p-5">
    <h2 className="flex items-center gap-2 text-lg font-semibold"><Clock3 className="size-5" />Submission History</h2>
    <div className="mt-4 space-y-3 text-sm">
      <p><b>Account created:</b> {formatDate(item.raw.createdAt)}</p>
      <p><b>Last updated:</b> {formatDate(item.raw.updatedAt)}</p>
      <p><b>Submitted for review:</b> {formatDate(item.submittedAt)}</p>
    </div>
  </section>
);

const DecisionBar = ({ onApprove, onChanges, onReject, disabled }) => (
  <footer className="grid shrink-0 grid-cols-2 gap-2 border-t border-[#c5cad8] bg-white p-3 sm:flex sm:justify-end sm:p-4">
    <button className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white disabled:opacity-60" type="button" disabled={disabled} onClick={onApprove}><CheckCircle2 className="size-5" />Approve</button>
    <button className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-6 py-3 font-semibold text-red-700 disabled:opacity-60" type="button" disabled={disabled} onClick={onChanges}><RefreshCw className="size-5" />Request changes</button>
    <button className="hidden items-center justify-center gap-2 rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 sm:flex" type="button" disabled={disabled} onClick={onReject}><X className="size-5" />Reject submission</button>
  </footer>
);

const ReviewDialog = ({
  applicant,
  mode,
  disabled,
  onClose,
  onSubmit,
}) => {
  const changes = mode === "changes_required";
  const [feedback, setFeedback] = useState(
    changes
      ? "Please correct the highlighted information or upload clearer documents, then resubmit."
      : "The submitted identity or eligibility information could not be verified.",
  );
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4" role="presentation" onClick={onClose}>
      <form
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={async (event) => {
          event.preventDefault();
          if (feedback.trim()) await onSubmit(feedback.trim());
        }}
      >
        <div className="flex items-start gap-4">
          <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${changes ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
            {changes ? <RefreshCw className="size-5" /> : <X className="size-5" />}
          </span>
          <div>
            <h2 className="text-xl font-semibold">{changes ? "Request resubmission" : "Reject submission"}</h2>
            <p className="mt-1 text-sm text-[#687184]">This feedback will be shown to {applicant}.</p>
          </div>
        </div>
        <label className="mt-5 block text-sm font-semibold">
          Administrator feedback
          <textarea
            className="mt-2 min-h-32 w-full resize-y rounded-xl border border-[#b9c1d1] p-3 font-normal outline-none focus:border-[#0755d3] focus:ring-2 focus:ring-blue-100"
            required
            maxLength={1000}
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
          />
        </label>
        <footer className="mt-5 flex justify-end gap-2">
          <button className="rounded-lg border px-5 py-2.5 font-semibold" type="button" disabled={disabled} onClick={onClose}>Cancel</button>
          <button className={`rounded-lg px-5 py-2.5 font-semibold text-white disabled:opacity-60 ${changes ? "bg-amber-600" : "bg-red-700"}`} type="submit" disabled={disabled || !feedback.trim()}>
            {disabled ? "Saving…" : changes ? "Send request" : "Reject submission"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default AdminVerificationCenter;
