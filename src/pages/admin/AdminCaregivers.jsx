import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Filter,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedOnboardingImage from "../../components/admin/ProtectedOnboardingImage";
import {
  getVerifiedCaregivers,
  updateCaregiverDirectoryVisibility,
  updateCaregiverProfile,
  updateCaregiverStatus,
} from "../../services/adminDirectoryService";
import {
  openVerificationDocument,
  reviewVerification,
} from "../../services/adminVerificationService";
import { listAdminAssignments } from "../../services/assignmentService";
import { getAdminFinanceOverview } from "../../services/paymentService";

const isCurrentAssignment = (assignment) =>
  !["cancelled", "completed"].includes(assignment.status);

const toCaregiver = (record, assignments = []) => {
  const caregiverAssignments = assignments.filter(
    (assignment) =>
      assignment.caregiverId === record.caregiverId &&
      isCurrentAssignment(assignment),
  );
  return {
  id: record.caregiverId,
  name: record.profile?.fullName || record.accountEmail || "Caregiver",
  phone: record.profile?.phone || "Not provided",
  email: record.profile?.email || record.accountEmail || "Not provided",
  address:
    [
      record.profile?.address,
      record.profile?.city,
      record.profile?.state,
      record.profile?.zipCode,
    ]
      .filter(Boolean)
      .join(", ") || "Not provided",
  nid: "Verified",
  verification: "Clear",
  trust: 100,
  clients: new Set(
    caregiverAssignments.map((assignment) => assignment.clientId),
  ).size,
  rating: "—",
  accountActive: record.accountStatus !== "suspended",
  directoryVisible:
    record.accountStatus !== "suspended" && record.directoryVisible === true,
  tone: "green",
  assignments: caregiverAssignments,
  raw: record,
  };
};

const AdminCaregivers = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCaregivers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [records, assignments] = await Promise.all([
        getVerifiedCaregivers(),
        listAdminAssignments(),
      ]);
      setCaregivers(
        records.map((record) => toCaregiver(record, assignments)),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const refreshDirectory = () => {
      Promise.all([getVerifiedCaregivers(), listAdminAssignments()])
        .then(([records, assignments]) => {
          if (!cancelled) {
            const updated = records.map((record) =>
              toCaregiver(record, assignments),
            );
            setCaregivers(updated);
            setSelected((current) =>
              current
                ? updated.find((item) => item.id === current.id) || current
                : null,
            );
          }
        })
        .catch((requestError) => {
          if (!cancelled) setError(requestError.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };
    refreshDirectory();
    const refreshTimer = window.setInterval(refreshDirectory, 15000);
    window.addEventListener("focus", refreshDirectory);
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", refreshDirectory);
    };
  }, []);

  const filtered = useMemo(
    () =>
      caregivers.filter((caregiver) => {
        console.log(caregiver);
        
        const matchesQuery = `${caregiver.name} ${caregiver.phone}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus =
          status === "all" ||
          (status === "active"
            ? caregiver.directoryVisible
            : !caregiver.directoryVisible);
        return matchesQuery && matchesStatus;
      }),
    [caregivers, query, status],
  );

  const changeDirectoryVisibility = async (caregiver, visible) => {
    if (
      !window.confirm(
        visible
          ? `Publish ${caregiver.name} in the Find Care directory?`
          : `Remove ${caregiver.name} from the Find Care directory?`,
      )
    ) return;
    try {
      await updateCaregiverDirectoryVisibility(caregiver.id, visible);
      await loadCaregivers();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-semibold">
            Caregivers ({caregivers.length})
          </h1>
          <p className="mt-1 text-sm text-[#515867]">
            Manage, verify, and monitor your caregiver workforce across
            Bangladesh.
          </p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            className="flex items-center justify-center gap-2 rounded-lg border border-[#c5cad8] bg-white px-3 py-2.5 text-sm font-semibold text-[#515867]"
            type="button"
            onClick={loadCaregivers}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#0755d3] bg-white px-4 py-2.5 text-sm font-semibold text-[#0649ad]"
            type="button"
          >
            <Download className="size-4" /> Export CSV
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-4 py-2.5 text-sm font-semibold text-white"
            type="button"
          >
            <Plus className="size-4" /> Add Caregiver
          </button>
        </div>
      </div>

      <section className="mt-5 grid gap-3 rounded-xl border border-[#c5cad8] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_auto] lg:items-end">
        <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#606878] lg:hidden">
          Search
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3">
            <Search className="size-4" />
            <input
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name or phone"
            />
          </div>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#606878]">
          Status
          <select
            className="mt-2 block w-full rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm font-normal normal-case outline-none"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Published</option>
            <option value="inactive">Hidden</option>
          </select>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#606878]">
          Verification
          <select className="mt-2 block w-full rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm font-normal normal-case outline-none">
            <option>All</option>
            <option>Clear</option>
            <option>Pending</option>
            <option>Flagged</option>
          </select>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#606878]">
          Service Zone
          <select className="mt-2 block w-full rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm font-normal normal-case outline-none">
            <option>All Zones</option>
            <option>Dhaka North</option>
            <option>Dhaka South</option>
          </select>
        </label>
        <button
          className="flex items-center justify-center gap-2 py-2.5 text-sm text-[#515867]"
          type="button"
        >
          <Filter className="size-4" /> Advanced Filters
        </button>
      </section>

      {error && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="flex-1">{error}</span>
          <button
            className="font-semibold underline"
            type="button"
            onClick={loadCaregivers}
          >
            Try again
          </button>
        </div>
      )}

      <section className="mt-5 hidden overflow-hidden rounded-xl border border-[#c5cad8] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-[#c5cad8] bg-[#f0f2fa] text-[#606878]">
              <tr>
                <th className="px-5 py-4">Caregiver</th>
                <th className="px-4 py-4">Phone Number</th>
                <th className="px-4 py-4">NID Status</th>
                <th className="px-4 py-4">Verification</th>
                <th className="px-4 py-4">Trust Score</th>
                <th className="px-4 py-4">Clients</th>
                <th className="px-4 py-4">Rating</th>
                <th className="px-4 py-4">Find Care</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-12 text-center text-[#606878]"
                    colSpan={9}
                  >
                    No verified caregivers match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((caregiver) => (
                <CaregiverRow
                  caregiver={caregiver}
                  key={caregiver.id}
                  onOpen={() => setSelected(caregiver)}
                  onStatusChange={(active) =>
                    changeDirectoryVisibility(caregiver, active)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center border-t border-[#c5cad8] bg-[#f7f8fd] px-5 py-4 text-sm text-[#515867]">
          <span>
            {loading
              ? "Loading verified caregivers..."
              : `Showing ${filtered.length} of ${caregivers.length} verified caregivers`}
          </span>
        </div>
      </section>

      <div className="mt-5 grid gap-3 md:hidden">
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-xl border border-[#c5cad8] bg-white p-8 text-center text-sm text-[#606878]">
            No verified caregivers match these filters.
          </div>
        )}
        {filtered.map((caregiver) => (
          <CaregiverMobileCard
            caregiver={caregiver}
            key={caregiver.id}
            onOpen={() => setSelected(caregiver)}
            onStatusChange={(active) =>
              changeDirectoryVisibility(caregiver, active)}
          />
        ))}
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Summary
          label="Verified Caregivers"
          value={caregivers.length}
          note="Approved by verification"
        />
        <Summary
          label="Active Accounts"
          value={caregivers.filter((caregiver) => caregiver.accountActive).length}
          note="Portal accounts enabled"
        />
        <Summary
          label="Pending Verification"
          value="—"
          note="View Verification Center"
        />
        <Summary
          label="Service Alerts"
          value="0"
          note="No directory alerts"
          danger
        />
      </section>

      {selected && (
        <VerificationDrawer
          caregiver={selected}
          onClose={() => setSelected(null)}
          onRejected={async () => {
            setSelected(null);
            await loadCaregivers();
          }}
          onUpdated={async () => {
            setSelected(null);
            await loadCaregivers();
          }}
        />
      )}
    </div>
  );
};

const CaregiverRow = ({ caregiver, onOpen, onStatusChange }) => (
  <tr className="border-b border-[#d7dbe7] last:border-0">
    <td className="px-5 py-4">
      <button
        className="flex items-center gap-3 text-left"
        type="button"
        onClick={onOpen}
      >
      
        <ProtectedOnboardingImage
          className="size-10 rounded-full object-cover"
          role="caregiver"
          userId={caregiver.id}
          alt={caregiver.name}
        />
        <span>
          <b className="block">{caregiver.name}</b>
          <small className="text-[#606878]">Professional Caregiver</small>
        </span>
      </button>
    </td>
    <td className="px-4 py-4">{caregiver.phone}</td>
    <td className="px-4 py-4">
      <StatusBadge value={caregiver.nid} />
    </td>
    <td className="px-4 py-4">
      <StatusBadge value={caregiver.verification} />
    </td>
    <td className="px-4 py-4">
      <b>{caregiver.trust}%</b>
      <span className="mt-2 block h-1.5 w-20 rounded bg-[#eef0f7]">
        <span
          className={`block h-full rounded ${caregiver.trust > 70 ? "bg-[#0755d3]" : caregiver.trust > 30 ? "bg-amber-500" : "bg-red-500"}`}
          style={{ width: `${caregiver.trust}%` }}
        />
      </span>
    </td>
    <td className="px-4 py-4 font-semibold">{caregiver.clients}</td>
    <td className="px-4 py-4">
      <Star className="mr-1 inline size-4 fill-amber-400 text-amber-400" />
      {caregiver.rating}
    </td>
    <td className="px-4 py-4">
      <Toggle
        active={caregiver.directoryVisible}
        disabled={!caregiver.accountActive}
        onChange={() => onStatusChange(!caregiver.directoryVisible)}
      />
    </td>
    <td className="px-4 py-4">
      <button
        className="font-semibold text-[#0649ad]"
        type="button"
        onClick={onOpen}
      >
        View
      </button>
    </td>
  </tr>
);

const CaregiverMobileCard = ({
  caregiver,
  onOpen,
  onStatusChange,
}) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-4">
    <div className="flex items-start gap-3">
      <ProtectedOnboardingImage
        className="size-12 rounded-full object-cover"
        role="caregiver"
        userId={caregiver.id}
        alt={caregiver.name}
      />
      <div className="min-w-0 flex-1">
        <b className="block">{caregiver.name}</b>
        <p className="text-xs text-[#606878]">{caregiver.phone}</p>
      </div>
      <div className="text-right">
        <small className="mb-1 block text-[9px] uppercase text-[#606878]">
          Find Care
        </small>
        <Toggle
          active={caregiver.directoryVisible}
          disabled={!caregiver.accountActive}
          onChange={() => onStatusChange(!caregiver.directoryVisible)}
        />
      </div>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
      <Metric label="Trust" value={`${caregiver.trust}%`} />
      <Metric label="Clients" value={caregiver.clients} />
      <Metric label="Rating" value={`★ ${caregiver.rating}`} />
    </div>
    <div className="mt-4 flex items-center gap-2">
      <StatusBadge value={caregiver.verification} />
      <button
        className="ml-auto rounded-lg bg-[#0755d3] px-4 py-2 text-xs font-semibold text-white"
        type="button"
        onClick={onOpen}
      >
        View
      </button>
    </div>
  </article>
);

const caregiverTabs = ["Profile", "Verification", "Assignments", "Payments"];

const VerificationDrawer = ({
  caregiver,
  onClose,
  onRejected,
  onUpdated,
}) => {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <>
      <button
        className="fixed inset-0 z-40 bg-slate-950/45"
        type="button"
        onClick={onClose}
        aria-label="Close caregiver verification"
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[430px] flex-col bg-[#f7f8fd] shadow-2xl">
        <header className="flex items-start gap-4 border-b border-[#c5cad8] bg-white p-5">
          <ProtectedOnboardingImage
            className="size-16 rounded-xl object-cover ring-2 ring-[#0755d3]"
            role="caregiver"
            userId={caregiver.id}
            alt={caregiver.name}
          />
          <div className="min-w-0">
            <b className="block text-lg">{caregiver.name}</b>
            <p className="text-sm text-[#515867]">
              Professional Caregiver • #{caregiver.id.toUpperCase()}
            </p>
            <div className="mt-2 flex gap-2">
              <StatusBadge
                value={
                  caregiver.raw?.reviewedAt
                    ? `Verified ${new Date(caregiver.raw.reviewedAt).toLocaleDateString()}`
                    : "Verified"
                }
              />
              <b className="text-xs text-[#0649ad]">
                {caregiver.trust}% Trust Score
              </b>
            </div>
          </div>
          <button className="ml-auto" type="button" onClick={onClose}>
            <X className="size-6" />
          </button>
        </header>
        <nav className="hide-scrollbar flex gap-2 overflow-x-auto border-b border-[#c5cad8] bg-white px-5">
          {caregiverTabs.map((tab) => (
            <button
              className={`whitespace-nowrap border-b-2 px-2 py-4 text-sm transition duration-200 hover:scale-105 hover:font-semibold hover:text-[#0755d3] ${activeTab === tab ? "border-[#0755d3] font-semibold text-[#0649ad]" : "border-transparent text-[#515867]"}`}
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {activeTab === "Verification" && (
            <CaregiverVerificationPanel caregiver={caregiver} />
          )}
          {activeTab === "Profile" && (
            <CaregiverProfilePanel caregiver={caregiver} />
          )}
          {activeTab === "Assignments" && (
            <CaregiverAssignmentsPanel caregiver={caregiver} />
          )}
          {activeTab === "Payments" && (
            <CaregiverPaymentsPanel
              caregiver={caregiver}
              key={caregiver.id}
            />
          )}
        </div>
        <CaregiverDrawerFooter
          activeTab={activeTab}
          caregiver={caregiver}
          onRejected={onRejected}
          onUpdated={onUpdated}
        />
      </aside>
    </>
  );
};

const CaregiverVerificationPanel = ({ caregiver }) => {
  const record = caregiver.raw || {};
  const credentials = record.credentials || {};
  const licenses = credentials.licenses || {};
  const assessment = record.assessment || {};
  const documents = [
    ["Resume", "resume", credentials.resume],
    ["NID front", "nidFront", credentials.nidFront],
    ["NID back", "nidBack", credentials.nidBack],
    ["Reference letter", "referenceLetter", credentials.referenceLetter],
    ["CRP license", "licenseCRP", licenses.CRP],
    ["AHLC license", "licenseAHLC", licenses.AHLC],
    ["RNLC license", "licenseRNLC", licenses.RNLC],
  ];

  return (
    <>
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-emerald-700" />
          <div>
            <b className="block">Verification approved</b>
            <small className="text-emerald-800">
              Reviewed{" "}
              {record.reviewedAt
                ? new Date(record.reviewedAt).toLocaleString()
                : "by an administrator"}
            </small>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
        <h3 className="font-semibold">Identity & credentials</h3>
        <p className="mt-1 text-xs text-[#606878]">
          These are the original files uploaded during caregiver onboarding.
        </p>
        <div className="mt-4 space-y-2">
          {documents.map(([label, kind, metadata]) => (
            <VerificationFile
              key={kind}
              label={label}
              kind={kind}
              metadata={metadata}
              role="caregiver"
              userId={caregiver.id}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
        <h3 className="font-semibold">Care assessment responses</h3>
        <AssessmentAnswer
          label="Emergency response"
          value={assessment.emergency}
        />
        <AssessmentAnswer label="Ethics response" value={assessment.ethics} />
        <div className="mt-4">
          <small className="font-semibold uppercase text-[#606878]">
            Hygiene checklist
          </small>
          {assessment.hygiene?.length ? (
            <ul className="mt-2 space-y-1 text-sm text-[#515867]">
              {assessment.hygiene.map((item) => (
                <li className="flex gap-2" key={item}>
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[#606878]">Not provided.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
        <h3 className="font-semibold">Verification history</h3>
        <p className="mt-4 border-l-2 border-emerald-300 pl-4">
          <b>Verification approved</b>
          <small className="block text-[#606878]">
            {record.reviewedAt
              ? new Date(record.reviewedAt).toLocaleString()
              : "Approval date unavailable"}
          </small>
        </p>
        <p className="mt-4 border-l-2 border-blue-300 pl-4">
          <b>Onboarding submitted</b>
          <small className="block text-[#606878]">
            {record.submittedAt
              ? new Date(record.submittedAt).toLocaleString()
              : "Submission date unavailable"}
          </small>
        </p>
      </section>
    </>
  );
};

const VerificationFile = ({
  label,
  kind,
  metadata,
  role,
  userId,
  fileId = "",
}) => {
  const [error, setError] = useState("");
  const available = Boolean(metadata?.storagePath);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#d7dbe7] p-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-lg ${
          available
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {available ? <CheckCircle2 className="size-4" /> : <X className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <b className="block text-sm">{label}</b>
        <small className="block truncate text-[#606878]">
          {available ? metadata.name || "Uploaded file" : "Not uploaded"}
        </small>
        {error && <small className="block text-red-600">{error}</small>}
      </div>
      {available && (
        <button
          className="rounded-lg border border-[#0755d3] px-3 py-2 text-xs font-semibold text-[#0649ad]"
          type="button"
          onClick={async () => {
            setError("");
            try {
              await openVerificationDocument(role, userId, kind, fileId);
            } catch (requestError) {
              setError(requestError.message);
            }
          }}
        >
          View
        </button>
      )}
    </div>
  );
};

const AssessmentAnswer = ({ label, value }) => (
  <div className="mt-4">
    <small className="font-semibold uppercase text-[#606878]">{label}</small>
    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#515867]">
      {value || "Not provided."}
    </p>
  </div>
);

const CaregiverProfilePanel = ({ caregiver }) => (
  <div className="space-y-5">
    <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <UserRound className="size-5 text-[#0755d3]" /> Professional Profile
      </h3>
      <dl className="mt-5 grid grid-cols-2 gap-5">
        <ProfileMetric
          label="Date of birth"
          value={caregiver.raw?.profile?.dateOfBirth || "Not provided"}
        />
        <ProfileMetric
          label="Gender"
          value={caregiver.raw?.profile?.gender || "Not provided"}
        />
        <ProfileMetric label="Email" value={caregiver.email} />
        <ProfileMetric label="Verification" value="Approved" />
        <ProfileMetric
          label="Profile progress"
          value={`${caregiver.raw?.progress || 100}%`}
        />
        <ProfileMetric
          label="Account"
          value={caregiver.accountActive ? "Active" : "Suspended"}
        />
        <ProfileMetric
          label="Find Care directory"
          value={caregiver.directoryVisible ? "Published" : "Hidden"}
        />
        <ProfileMetric
          label="Service radius"
          value={
            caregiver.raw?.profile?.serviceRadius
              ? `${caregiver.raw.profile.serviceRadius} km`
              : "Not provided"
          }
        />
      </dl>
    </section>
    <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
      <h3 className="font-semibold">Contact & Service Zone</h3>
      <p className="mt-4 flex items-center gap-3 text-sm">
        <Phone className="size-4 text-[#0755d3]" /> {caregiver.phone}
      </p>
      <p className="mt-3 flex items-center gap-3 text-sm">
        <MapPin className="size-4 shrink-0 text-[#0755d3]" />{" "}
        {caregiver.address}
      </p>
    </section>
    <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
      <h3 className="font-semibold">Specializations</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Post-Op Care", "Elder Care", "Medication", "Mobility"].map(
          (item) => (
            <span
              className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-[#0649ad]"
              key={item}
            >
              {item}
            </span>
          ),
        )}
      </div>
    </section>
    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-6 text-emerald-700" />
        <div>
          <b className="block">Account in good standing</b>
          <small className="text-emerald-800">
            No active complaints or compliance actions.
          </small>
        </div>
      </div>
    </section>
  </div>
);

const CaregiverAssignmentsPanel = ({ caregiver }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 gap-3">
      <AssignmentMetric label="Active Clients" value={caregiver.clients} />
      <AssignmentMetric
        label="Current Assignments"
        value={caregiver.assignments.length}
      />
    </div>
    <section>
      <div className="flex items-center">
        <h3 className="font-semibold">Current Assignments</h3>
      </div>
      {caregiver.assignments.length === 0 && (
        <div className="mt-3 rounded-xl border border-dashed border-[#b9c1d2] bg-white p-6 text-center text-sm text-[#606878]">
          No client is currently assigned to this caregiver.
        </div>
      )}
      {caregiver.assignments.map((assignment) => (
        <Assignment
          assignment={assignment}
          key={assignment.assignmentId}
        />
      ))}
    </section>
  </div>
);

const CaregiverPaymentsPanel = ({ caregiver }) => {
  const navigate = useNavigate();
  const [finance, setFinance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminFinanceOverview()
      .then((data) => {
        if (active) setFinance(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [caregiver.id]);

  const ledger = (finance?.caregiverLedger || []).filter(
    (entry) => entry.caregiverId === caregiver.id,
  );
  const payouts = (finance?.payouts || []).filter(
    (payout) => payout.caregiverId === caregiver.id,
  );
  const completedEarnings = ledger.filter(
    (entry) => entry.type === "earning" && entry.status === "completed",
  );
  const lifetime = completedEarnings.reduce(
    (sum, entry) => sum + Number(entry.amount || 0),
    0,
  );
  const now = new Date();
  const thisMonth = completedEarnings
    .filter((entry) => {
      const date = new Date(entry.createdAt || entry.updatedAt || 0);
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const available = [
    ...ledger,
    ...payouts.map((payout) => ({ ...payout, type: "withdrawal" })),
  ].reduce((total, entry) => {
    if (
      !["completed", "pending", "processing", "paid"].includes(entry.status)
    ) return total;
    if (
      entry.type === "earning" &&
      entry.status === "completed" &&
      (entry.paymentStatus !== "paid" || entry.payoutId)
    ) {
      return total + Number(entry.amount || 0);
    }
    if (entry.type === "withdrawal") {
      return total - Number(entry.amount || 0);
    }
    return total;
  }, 0);
  const recentPayments = [
    ...completedEarnings.map((entry) => ({
      id: entry.ledgerId,
      title: entry.description || "Caregiver earning",
      date: entry.createdAt || entry.updatedAt,
      amount: `+ $${Number(entry.amount || 0).toLocaleString("en-US")}`,
    })),
    ...payouts
      .filter((payout) =>
        ["pending", "processing", "paid"].includes(payout.status),
      )
      .map((payout) => ({
        id: payout.payoutId,
        title:
          payout.source === "admin_assignment_payout"
            ? `Payout for ${payout.clientName || "client service"}`
            : `Withdrawal to ${payout.method || "wallet"}`,
        date: payout.paidAt || payout.requestedAt || payout.updatedAt,
        amount: `- $${Number(payout.amount || 0).toLocaleString("en-US")}`,
      })),
  ]
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <section className="rounded-xl bg-[#0755d3] p-5 text-white">
        <div className="flex items-start">
          <div>
            <small className="uppercase text-blue-100">
              Available Earnings
            </small>
            <b className="mt-2 block text-3xl">
              ${Math.max(0, available).toLocaleString("en-US")}
            </b>
          </div>
          <WalletCards className="ml-auto size-8 text-blue-200" />
        </div>
        <button
          className="mt-5 w-full rounded-lg bg-white py-2.5 font-semibold text-[#0649ad] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={!finance || available <= 0}
          onClick={() => navigate("/admin/finance")}
          title={
            available <= 0
              ? "No completed caregiver earnings are available for payout."
              : "Process eligible payouts from Payments & Finance."
          }
        >
          {available > 0 ? "Process Payout" : "No Payout Due"}
        </button>
      </section>
      <div className="grid grid-cols-2 gap-3">
        <AssignmentMetric
          label="This Month"
          value={`$${thisMonth.toLocaleString("en-US")}`}
        />
        <AssignmentMetric
          label="Lifetime"
          value={`$${lifetime.toLocaleString("en-US")}`}
        />
      </div>
      <section>
        <h3 className="font-semibold">Recent Payments</h3>
        {!finance && !error && (
          <p className="mt-3 text-sm text-[#606878]">Loading payments…</p>
        )}
        {finance && recentPayments.length === 0 && (
          <div className="mt-3 rounded-xl border border-dashed border-[#b9c1d2] bg-white p-6 text-center text-sm text-[#606878]">
            No earnings or payouts have been recorded for this caregiver.
          </div>
        )}
        {recentPayments.map((payment) => (
          <CaregiverTransaction
            key={payment.id}
            title={payment.title}
            date={
              payment.date
                ? new Date(payment.date).toLocaleString()
                : "Date unavailable"
            }
            amount={payment.amount}
          />
        ))}
      </section>
      <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
        <h3 className="font-semibold">Payment Method</h3>
        <p className="mt-3 text-sm text-[#606878]">
          No verified payout method has been added.
        </p>
      </section>
    </div>
  );
};

const CaregiverDrawerFooter = ({
  activeTab,
  caregiver,
  onRejected,
  onUpdated,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const actions =
    activeTab === "Verification"
      ? ["Reject Verification"]
      : activeTab === "Profile"
        ? [
            "Edit Profile",
            caregiver.accountActive ? "Suspend Account" : "Activate Account",
          ]
        : activeTab === "Assignments"
          ? ["Assign Client", "Open Schedule"]
          : [];
  if (actions.length === 0) return null;
  return (
    <footer className={`${activeTab === "Verification" ? "block" : "grid grid-cols-2"} gap-3 border-t border-[#c5cad8] bg-white p-5`}>
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {actions.map((action, index) => (
        <button
          className={`rounded-lg py-3 font-semibold ${activeTab === "Verification" ? "w-full bg-red-600 text-white" : index === 0 ? "bg-[#0755d3] text-white" : "border border-[#8c93a2]"}`}
          type="button"
          key={action}
          disabled={busy}
          onClick={async () => {
            if (activeTab === "Profile" && action === "Edit Profile") {
              const fullName = window.prompt("Full name:", caregiver.name);
              if (!fullName?.trim()) return;
              const phone = window.prompt("Phone number:", caregiver.phone);
              if (phone === null) return;
              const address = window.prompt(
                "Street address:",
                caregiver.raw?.profile?.address || "",
              );
              if (address === null) return;
              setBusy(true);
              setError("");
              try {
                await updateCaregiverProfile(caregiver.id, {
                  fullName,
                  phone,
                  email: caregiver.email,
                  address,
                  city: caregiver.raw?.profile?.city || "",
                  state: caregiver.raw?.profile?.state || "",
                  zipCode: caregiver.raw?.profile?.zipCode || "",
                  serviceRadius:
                    caregiver.raw?.profile?.serviceRadius || 5,
                });
                await onUpdated?.();
              } catch (requestError) {
                setError(requestError.message);
              } finally {
                setBusy(false);
              }
              return;
            }
            if (
              activeTab === "Profile" &&
              ["Suspend Account", "Activate Account"].includes(action)
            ) {
              const nextActive = action === "Activate Account";
              if (!window.confirm(
                nextActive
                  ? `Reactivate ${caregiver.name}'s portal access?`
                  : `Suspend ${caregiver.name}? They will immediately lose portal access.`,
              )) return;
              setBusy(true);
              setError("");
              try {
                await updateCaregiverStatus(caregiver.id, nextActive);
                await onUpdated?.();
              } catch (requestError) {
                setError(requestError.message);
              } finally {
                setBusy(false);
              }
              return;
            }
            if (activeTab !== "Verification") return;
            const feedback = window.prompt(
              "Explain why this approved verification must be rejected:",
            );
            if (!feedback?.trim()) return;
            setBusy(true);
            setError("");
            try {
              await reviewVerification(
                "caregiver",
                caregiver.id,
                "rejected",
                feedback.trim(),
              );
              await onRejected?.();
            } catch (requestError) {
              setError(requestError.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy && activeTab === "Verification" ? "Rejecting..." : action}
        </button>
      ))}
    </footer>
  );
};

const ProfileMetric = ({ label, value }) => (
  <div className="min-w-0">
    <dt className="text-[10px] font-semibold uppercase text-[#606878]">
      {label}
    </dt>
    <dd className="mt-2 break-words font-medium">{value}</dd>
  </div>
);
const AssignmentMetric = ({ label, value }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-4">
    <small className="uppercase text-[#606878]">{label}</small>
    <b className="mt-2 block text-xl text-[#0649ad]">{value}</b>
  </article>
);
const Assignment = ({ assignment }) => (
  <article className="mt-3 rounded-xl border border-[#c5cad8] bg-white p-4">
    <div className="flex items-start">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 font-semibold text-[#0649ad]">
        {assignment.client?.fullName?.slice(0, 1) || "C"}
      </span>
      <div className="ml-3 min-w-0">
        <b className="block">{assignment.client?.fullName || "Client"}</b>
        <small className="text-[#606878]">{assignment.careType}</small>
      </div>
      <span className="ml-auto">
        <StatusBadge value={assignment.status.replaceAll("_", " ")} />
      </span>
    </div>
    <p className="mt-4 flex items-start gap-2 border-t border-[#e1e4ec] pt-3 text-xs text-[#515867]">
      <CalendarDays className="size-4 shrink-0" />
      <span>
        {assignment.preferredDays?.join(", ") || "Days not selected"}
        {" • "}
        {assignment.preferredStartTime ||
          assignment.preferredTime ||
          "Time not selected"}
        {" • "}
        {assignment.hoursPerWeek || 0} hrs/week
      </span>
    </p>
    <p className="mt-2 text-xs text-[#606878]">
      Service starts {assignment.serviceStartDate || "after confirmation"}
    </p>
    <div className="mt-3">
      <small className="font-semibold uppercase text-[#606878]">
        Assigned tasks
      </small>
      {assignment.tasks?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {assignment.tasks.map((task) => (
            <span
              className="rounded-full bg-[#e5efff] px-2.5 py-1 text-xs font-medium text-[#0649ad]"
              key={task}
            >
              {task}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-[#606878]">
          No specific tasks were included.
        </p>
      )}
    </div>
  </article>
);
const CaregiverTransaction = ({ title, date, amount }) => (
  <article className="mt-3 flex items-center gap-3 border-b border-[#e1e4ec] py-3 last:border-0">
    <span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-[#0755d3]">
      <CreditCard className="size-4" />
    </span>
    <div className="min-w-0 flex-1">
      <b className="block text-sm">{title}</b>
      <small className="text-[#606878]">{date}</small>
    </div>
    <b
      className={`text-sm ${amount.startsWith("+") ? "text-emerald-700" : ""}`}
    >
      {amount}
    </b>
  </article>
);

const StatusBadge = ({ value }) => {
  const normalized = value.toLowerCase();
  const style = normalized.includes("flag")
    ? "bg-red-100 text-red-700"
    : normalized.includes("pending") || normalized.includes("certify")
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${style}`}
    >
      {value}
    </span>
  );
};
const Toggle = ({ active, disabled = false, onChange }) => (
  <button
    className="relative block h-6 w-11 disabled:cursor-not-allowed disabled:opacity-50"
    type="button"
    onClick={onChange}
    disabled={disabled}
    aria-pressed={active}
    aria-label={
      active ? "Remove from Find Care directory" : "Publish in Find Care directory"
    }
    title={
      disabled
        ? "Reactivate the account before publishing this caregiver."
        : active
          ? "Published in Find Care"
          : "Hidden from Find Care"
    }
  >
  <span
    className={`relative block h-6 w-11 rounded-full transition ${active ? "bg-emerald-500" : "bg-slate-300"}`}
  >
    <span
      className={`absolute top-1 size-4 rounded-full bg-white transition ${active ? "left-6" : "left-1"}`}
    />
  </span>
  </button>
);
const Metric = ({ label, value }) => (
  <div className="rounded-lg bg-[#f1f3fa] p-2">
    <small className="block text-[9px] uppercase text-[#606878]">{label}</small>
    <b className="text-sm">{value}</b>
  </div>
);
const Summary = ({ label, value, note, danger = false }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-4">
    <p className="text-xs uppercase text-[#737b8c]">{label}</p>
    <b className="mt-2 block text-xl">{value}</b>
    <small className={danger ? "text-red-600" : "text-[#606878]"}>{note}</small>
  </article>
);
export default AdminCaregivers;
