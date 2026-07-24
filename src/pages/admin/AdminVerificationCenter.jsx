import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileBadge,
  FileCheck2,
  Filter,
  History,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  RotateCcw,
  SlidersHorizontal,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import caregiverAllexus from "../../assets/caregiver-allexus.jpg";
import caregiverKelly from "../../assets/caregiver-kelly.jpg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareKelly from "../../assets/find-care-kelly.jpg";

const verificationCases = [
  {
    id: "V-882910",
    name: "Sarah Jenkins",
    image: caregiverSarah,
    type: "Caregiver",
    tags: ["NID", "Resume", "Assessment"],
    priority: "High",
    status: "Reviewing",
    age: "3 days ago",
    trust: 96,
    location: "Gulshan, Dhaka",
  },
  {
    id: "V-771402",
    name: "Farhana Islam",
    image: findCareKelly,
    type: "Caregiver",
    tags: ["NID", "License"],
    priority: "Normal",
    status: "Pending",
    age: "4 hours ago",
    trust: 91,
    location: "Banani, Dhaka",
  },
  {
    id: "V-663190",
    name: "Margaret Thompson",
    image: caregiverAllexus,
    type: "Caregiver",
    tags: ["NID", "Assessment"],
    priority: "Normal",
    status: "Flagged",
    age: "6 hours ago",
    trust: 74,
    location: "Dhanmondi, Dhaka",
  },
  {
    id: "V-559231",
    name: "Rahima Khatun",
    image: caregiverKelly,
    type: "Caregiver",
    tags: ["Resume", "Assessment"],
    priority: "Normal",
    status: "New",
    age: "1 day ago",
    trust: 88,
    location: "Uttara, Dhaka",
  },
];

const AdminVerificationCenter = () => {
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(verificationCases[0].id);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [sortOldest, setSortOldest] = useState(true);
  const [notice, setNotice] = useState("");
  const selected =
    verificationCases.find((item) => item.id === selectedId) ??
    verificationCases[0];
  const visibleCases = useMemo(() => {
    const filtered =
      filter === "All"
        ? verificationCases
        : verificationCases.filter((item) => item.type === filter);
    return sortOldest ? filtered : [...filtered].reverse();
  }, [filter, sortOldest]);

  const choose = (id) => {
    setSelectedId(id);
    setMobileDetail(true);
    setNotice("");
  };
  const act = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f7fc] lg:h-[calc(100vh-64px)] lg:min-h-0 lg:overflow-hidden">
      <div className="grid min-h-[calc(100vh-64px)] lg:h-full lg:min-h-0 lg:grid-cols-[320px_minmax(0,1fr)] lg:overflow-hidden">
        <aside
          className={`${mobileDetail ? "hidden lg:flex" : "flex"} min-h-0 flex-col border-r border-[#c5cad8] bg-white lg:h-full`}
        >
          <header className="shrink-0 border-b border-[#c5cad8] p-4">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold">Verification Queue (24)</h1>
              <Filter className="ml-auto size-5 text-[#0755d3]" />
            </div>
            <div className="mt-4 flex gap-2">
              {["All", "Caregiver"].map((item) => (
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
            <button
              className="mt-5 flex w-full items-center text-xs font-semibold uppercase text-[#606878]"
              type="button"
              onClick={() => setSortOldest((current) => !current)}
            >
              Sort by{" "}
              <span className="ml-auto normal-case text-[#111c2c]">
                {sortOldest ? "Oldest First" : "Newest First"}
              </span>
            </button>
          </header>
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
            {visibleCases.map((item) => (
              <CaseItem
                item={item}
                selected={item.id === selectedId}
                key={item.id}
                onClick={() => choose(item.id)}
              />
            ))}
          </div>
        </aside>

        <main
          className={`${mobileDetail ? "flex" : "hidden lg:flex"} min-w-0 flex-col lg:h-full lg:min-h-0 lg:overflow-hidden`}
        >
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <button
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0649ad] lg:hidden"
              type="button"
              onClick={() => setMobileDetail(false)}
            >
              <ArrowLeft className="size-4" /> Back to queue
            </button>
            {notice && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <Check className="size-4" /> {notice}
              </div>
            )}
            <CaseHeader item={selected} />
            <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <VerificationSummary
                title="Profile & Service Area"
                status="Complete"
                tone="green"
                lines={[
                  "Professional photo uploaded",
                  "Personal and contact details complete",
                  "Service address and radius provided",
                ]}
                footer="Required profile fields: 10/10 complete"
              />
              <VerificationSummary
                title="Required Documents"
                status="Submitted"
                tone="green"
                lines={[
                  "Resume / CV uploaded",
                  "NID front uploaded",
                  "NID back uploaded",
                ]}
                footer="Required credential uploads: 3/3 received"
              />
              <VerificationSummary
                title="Optional Credentials"
                status="Review needed"
                tone="amber"
                lines={[
                  "Reference letter not supplied",
                  "CRP license uploaded",
                  "AHLC and RNLC not supplied",
                ]}
                footer="Optional documents do not block approval"
              />
            </section>
            <CaregiverProfileSubmission item={selected} />
            <OnboardingDocuments />
            <AssessmentReview />
            <OnboardingHistory />
          </div>
          <DecisionBar onAction={act} />
        </main>
      </div>
    </div>
  );
};

const CaseItem = ({ item, selected, onClick }) => (
  <button
    className={`w-full border-b border-[#c5cad8] p-4 text-left transition ${selected ? "bg-[#dbe8ff]" : "bg-white hover:bg-[#f7f9fd]"}`}
    type="button"
    onClick={onClick}
  >
    <div className="flex items-start gap-3">
      <img
        className="size-12 rounded-lg object-cover"
        src={item.image}
        alt=""
      />
      <div className="min-w-0 flex-1">
        <b className="block truncate">{item.name}</b>
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              className="rounded bg-[#0755d3] px-2 py-1 text-[8px] font-semibold uppercase text-white"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1 text-xs text-[#606878]">
          <Clock3 className="size-3" /> {item.age}
        </p>
      </div>
      <div className="text-right">
        <span
          className={`rounded px-2 py-1 text-[9px] font-semibold uppercase ${item.priority === "High" ? "bg-red-600 text-white" : "bg-slate-200 text-[#515867]"}`}
        >
          {item.priority}
        </span>
        <small
          className={`mt-10 block ${item.status === "Flagged" ? "text-red-600" : "text-[#0649ad]"}`}
        >
          {item.status}
        </small>
      </div>
    </div>
  </button>
);

const CaseHeader = ({ item }) => (
  <section className="rounded-xl border border-[#c5cad8] bg-white p-4 sm:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <img
        className="size-20 rounded-xl object-cover ring-2 ring-[#c5cad8]"
        src={item.image}
        alt=""
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold">{item.name}</h2>
          <span className="rounded-full bg-[#dce8ff] px-3 py-1 text-xs font-semibold text-[#515867]">
            CASE #{item.id}
          </span>
        </div>
        <p className="mt-1 text-[#515867]">
          Caregiver Applicant • Onboarding Submission
        </p>
        <p className="mt-3 flex flex-wrap gap-4 text-sm text-[#737b8c]">
          <span className="flex items-center gap-1">
            <Clock3 className="size-4" /> Submitted 3 days ago
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-4" /> {item.location}
          </span>
        </p>
      </div>
      <div className="text-center sm:text-right">
        <small className="font-semibold uppercase tracking-[.1em] text-[#737b8c]">
          Review Readiness
        </small>
        <b className="mt-1 block text-4xl text-emerald-700">{item.trust}%</b>
      </div>
    </div>
  </section>
);

const VerificationSummary = ({ title, status, tone, lines, footer }) => {
  const amber = tone === "amber";
  return (
    <article
      className={`rounded-xl border border-[#c5cad8] border-l-4 bg-white p-5 ${amber ? "border-l-amber-500" : "border-l-emerald-600"}`}
    >
      <div className="flex items-start gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className={`ml-auto rounded px-2 py-1 text-[9px] font-semibold uppercase ${amber ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
        >
          {status}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {lines.map((line, index) => (
          <p className="flex items-start gap-3 text-sm" key={line}>
            {amber && index === 0 ? (
              <TriangleAlert className="size-5 shrink-0 text-amber-500" />
            ) : (
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
            )}
            {line}
          </p>
        ))}
      </div>
      <p className="mt-6 border-t border-[#d7dbe7] pt-4 text-xs text-[#737b8c]">
        {footer}
      </p>
    </article>
  );
};
const CaregiverProfileSubmission = ({ item }) => (
  <section className="mt-7">
    <h2 className="flex items-center gap-2 text-lg font-semibold">
      <UserRound className="size-5" /> Submitted Profile
    </h2>
    <div className="mt-4 grid gap-4 xl:grid-cols-2">
      <article className="rounded-xl border border-[#c5cad8] bg-white p-5">
        <h3 className="font-semibold">Personal & Contact Information</h3>
        <dl className="mt-5 grid grid-cols-2 gap-5">
          <SubmissionField label="Full Name" value={item.name} />
          <SubmissionField label="Date of Birth" value="12 March 1991" />
          <SubmissionField label="Gender" value="Female" />
          <SubmissionField
            label="Phone"
            value="+880 1712 345678"
            icon={Phone}
          />
          <div className="col-span-2">
            <SubmissionField
              label="Email"
              value="sarah.jenkins@example.com"
              icon={Mail}
            />
          </div>
        </dl>
      </article>
      <article className="rounded-xl border border-[#c5cad8] bg-white p-5">
        <h3 className="font-semibold">Location & Service Area</h3>
        <dl className="mt-5 grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <SubmissionField
              label="Primary Address"
              value="House 24, Road 12, Gulshan 2"
              icon={MapPinned}
            />
          </div>
          <SubmissionField label="City" value="Dhaka" />
          <SubmissionField label="Division" value="Dhaka" />
          <SubmissionField label="Postal Code" value="1212" />
          <SubmissionField label="Service Radius" value="25 miles" />
        </dl>
      </article>
    </div>
  </section>
);

const OnboardingDocuments = () => (
  <section className="mt-7">
    <div className="flex flex-wrap items-center gap-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <FileCheck2 className="size-5" /> Onboarding Documents
      </h2>
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        Required: 3/3
      </span>
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <SubmissionDocument
        label="Resume / CV"
        file="Sarah_Jenkins_Resume.pdf"
        required
      />
      <SubmissionDocument
        label="NID Card — Front"
        file="NID_Front.jpg"
        required
      />
      <SubmissionDocument
        label="NID Card — Back"
        file="NID_Back.jpg"
        required
      />
      <SubmissionDocument
        label="Reference Letter"
        file="Not provided"
        missing
      />
      <SubmissionDocument label="CRP License" file="CRP_License_2026.pdf" />
      <SubmissionDocument
        label="AHLC / RNLC Licenses"
        file="Not provided"
        missing
      />
    </div>
  </section>
);

const AssessmentReview = () => (
  <section className="mt-7">
    <div className="flex items-center">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <ClipboardCheck className="size-5" /> Competency & Skills Assessment
      </h2>
      <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        Completed
      </span>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-3">
      <AssessmentCard
        number="1"
        title="Emergency Protocols"
        result="Correct"
        detail="Selected: Call emergency services immediately and stay with the client."
      />
      <AssessmentCard
        number="2"
        title="Ethical Conduct"
        result="68 words"
        detail="The applicant would respectfully decline the gift, explain professional boundaries, and report the interaction in the care log."
      />
      <AssessmentCard
        number="3"
        title="Hygiene Standards"
        result="4/4 selected"
        detail="Hand washing, equipment sanitizing, fresh gloves, and digital care-log updates were all confirmed."
      />
    </div>
  </section>
);

const OnboardingHistory = () => (
  <section className="mt-7">
    <h2 className="flex items-center gap-2 text-lg font-semibold">
      <History className="size-5" /> Onboarding Submission History
    </h2>
    <div className="mt-5 ml-3 border-l-2 border-[#d7dbe7] pl-5">
      <HistoryItem
        color="bg-emerald-600"
        title="Submitted for Admin Review"
        date="July 19, 2026 • Caregiver Portal"
        note="Profile, required documents, and assessment were locked for compliance review."
      />
      <HistoryItem
        color="bg-[#0755d3]"
        title="Competency Assessment Completed"
        date="July 19, 2026 • Score: 100% required fields"
        note="Emergency response, ethical conduct, and four mandatory hygiene practices submitted."
      />
      <HistoryItem
        color="bg-[#0755d3]"
        title="Credentials Uploaded"
        date="July 18, 2026 • Caregiver Portal"
        note="Resume and both sides of the NID received; CRP license supplied as an optional credential."
      />
      <HistoryItem
        color="bg-emerald-600"
        title="Profile Setup Completed"
        date="July 18, 2026 • Caregiver Portal"
        note="Professional photo, contact details, address, and service radius saved."
      />
    </div>
  </section>
);

const SubmissionField = ({ label, value, icon: Icon }) => (
  <div>
    <dt className="text-[10px] font-semibold uppercase tracking-[.08em] text-[#737b8c]">
      {label}
    </dt>
    <dd className="mt-2 flex items-center gap-2 text-sm font-medium">
      {Icon && <Icon className="size-4 text-[#0755d3]" />}
      {value}
    </dd>
  </div>
);
const SubmissionDocument = ({
  label,
  file,
  required = false,
  missing = false,
}) => (
  <button
    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${missing ? "border-amber-200 bg-amber-50" : "border-[#c5cad8] bg-white hover:border-[#0755d3]"}`}
    type="button"
  >
    <span
      className={`grid size-10 shrink-0 place-items-center rounded-lg ${missing ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-[#0755d3]"}`}
    >
      {missing ? (
        <TriangleAlert className="size-5" />
      ) : (
        <FileBadge className="size-5" />
      )}
    </span>
    <span className="min-w-0">
      <b className="block text-sm">
        {label} {required && <span className="text-red-600">*</span>}
      </b>
      <small
        className={`block truncate ${missing ? "text-amber-700" : "text-[#737b8c]"}`}
      >
        {file}
      </small>
    </span>
  </button>
);
const AssessmentCard = ({ number, title, result, detail }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-5">
    <div className="flex items-center gap-3">
      <span className="grid size-8 place-items-center rounded-full bg-[#0755d3] text-sm font-semibold text-white">
        {number}
      </span>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
      <CheckCircle2 className="size-5" /> {result}
    </div>
    <p className="mt-3 text-sm leading-6 text-[#515867]">{detail}</p>
  </article>
);
const HistoryItem = ({ color, title, date, note }) => (
  <article className="relative mb-7 last:mb-0">
    <span
      className={`absolute -left-[31px] top-1 size-4 rounded-full border-4 border-white ring-2 ring-current ${color}`}
    />
    <b className="block text-sm">{title}</b>
    <small className="text-[#737b8c]">{date}</small>
    <p className="mt-3 rounded-r-lg border-l-2 border-[#c5cad8] bg-[#f1f3fa] p-3 text-sm text-[#515867]">
      {note}
    </p>
  </article>
);

const DecisionBar = ({ onAction }) => (
  <footer className="grid shrink-0 grid-cols-2 gap-2 border-t border-[#c5cad8] bg-white p-3 sm:flex sm:justify-end sm:p-4">
    <button
      className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white"
      type="button"
      onClick={() => onAction("Verification case approved.")}
    >
      <CheckCircle2 className="size-5" /> Approve
    </button>
    <button
      className="flex items-center justify-center gap-2 rounded-lg bg-red-700 px-6 py-3 font-semibold text-white"
      type="button"
      onClick={() => onAction("Verification case rejected.")}
    >
      <X className="size-5" /> Reject
    </button>
    <button
      className="flex items-center justify-center gap-2 rounded-lg border border-[#8c93a2] px-5 py-3 font-semibold"
      type="button"
      onClick={() => onAction("Resubmission request prepared.")}
    >
      <RotateCcw className="size-5" /> Request Resubmission
    </button>
    <button
      className="flex items-center justify-center gap-2 rounded-lg border border-[#8c93a2] px-4 py-3 font-semibold"
      type="button"
      onClick={() => onAction("Admin note editor opened.")}
    >
      <SlidersHorizontal className="size-5" /> Add Note
    </button>
  </footer>
);

export default AdminVerificationCenter;
