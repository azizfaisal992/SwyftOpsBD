import {
  AlertTriangle,
  ArrowLeft,
  BadgeAlert,
  Banknote,
  CheckCircle2,
  Clock3,
  Filter,
  Gavel,
  LoaderCircle,
  MapPin,
  Radio,
  RefreshCw,
  Search,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getAdminIncident,
  getAdminIncidents,
  updateAdminIncident,
} from "../../services/incidentService";

const filters = [
  ["All", ""],
  ["SOS", "sos"],
  ["Complaints", "service_complaint"],
  ["Payment", "payment_dispute"],
  ["No-show", "no_show"],
];

const formatDate = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const titleCase = (value = "") =>
  value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const AdminDisputes = () => {
  const [incidents, setIncidents] = useState([]);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("");
  const [severity, setSeverity] = useState("");
  const [query, setQuery] = useState("");
  const [resolution, setResolution] = useState("");
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileView, setMobileView] = useState("queue");

  const loadQueue = async (preferredId) => {
    setLoading(true);
    try {
      const records = await getAdminIncidents({
        type: filter,
        severity,
      });
      setIncidents(records);
      const selectedId =
        preferredId ||
        (records.some((item) => item.incidentId === active?.incidentId)
          ? active.incidentId
          : records[0]?.incidentId);
      if (selectedId) setActive(await getAdminIncident(selectedId));
      else setActive(null);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getAdminIncidents({ type: filter, severity })
      .then(async (records) => {
        if (cancelled) return;
        setIncidents(records);
        if (!records.length) {
          setActive(null);
          return;
        }
        const detail = await getAdminIncident(records[0].incidentId);
        if (!cancelled) setActive(detail);
      })
      .catch((error) => {
        if (!cancelled) setNotice(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter, severity]);

  const visibleIncidents = useMemo(
    () =>
      incidents.filter((incident) => {
        const text = [
          incident.incidentId,
          incident.label,
          incident.reporterName,
          incident.description,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(query.trim().toLowerCase());
      }),
    [incidents, query],
  );

  const selectIncident = async (incidentId) => {
    setMobileView("case");
    setResolution("");
    setNotes("");
    try {
      setActive(await getAdminIncident(incidentId));
    } catch (error) {
      setNotice(error.message);
    }
  };

  const applyAction = async (action) => {
    if (!active || saving) return;
    if (
      action === "resolve" &&
      (!resolution || notes.trim().length < 10)
    ) {
      setNotice(
        "Select a resolution and enter at least 10 characters of notes.",
      );
      return;
    }
    setSaving(true);
    try {
      const updated = await updateAdminIncident(active.incidentId, {
        action,
        resolution,
        notes,
      });
      setActive(updated);
      await loadQueue(updated.incidentId);
      setNotice(
        action === "resolve"
          ? "Incident resolved and recorded in the audit timeline."
          : `Incident ${action} action completed.`,
      );
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const openCount = incidents.filter(
    (incident) => incident.status !== "resolved",
  ).length;

  return (
    <div className="relative h-[calc(100vh-64px)] min-h-[600px] overflow-hidden bg-[#f1f5fa] lg:h-screen">
      {notice && (
        <button
          className="absolute left-1/2 top-3 z-[80] max-w-[90vw] -translate-x-1/2 rounded-lg bg-[#0b1e31] px-4 py-3 text-sm text-white shadow-xl"
          type="button"
          onClick={() => setNotice("")}
        >
          {notice}
        </button>
      )}

      <header className="hidden h-16 items-center border-b border-[#c9cfdd] bg-white px-6 lg:flex">
        <h1 className="text-xl font-semibold">
          Disputes & Incidents{" "}
          <span className="text-red-600">({openCount} open)</span>
        </h1>
        <label className="ml-auto flex w-full max-w-md items-center gap-2 rounded-lg bg-[#f0f3f8] px-3 py-2.5 text-[#687184]">
          <Search className="size-4" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search incidents, ID, or users..."
          />
        </label>
        <button
          className="ml-4 rounded-lg border p-2"
          type="button"
          onClick={() => loadQueue(active?.incidentId)}
          aria-label="Refresh incident queue"
        >
          <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      <div className="grid h-full min-h-0 lg:h-[calc(100%-64px)] lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside
          className={`${mobileView === "queue" ? "flex" : "hidden"} min-h-0 flex-col border-r border-[#c9cfdd] bg-white lg:flex`}
        >
          <div className="border-b p-4 sm:p-5">
            <div className="flex items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#687184]">
                  Queue Management
                </p>
                <h2 className="mt-1 font-semibold">Live incident queue</h2>
              </div>
              <Filter className="ml-auto size-5 text-[#687184]" />
            </div>
            <label className="mt-4 flex items-center gap-2 rounded-lg border bg-[#f8f9fc] px-3 py-2.5 lg:hidden">
              <Search className="size-4" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search incidents..."
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-1">
              {filters.map(([label, value]) => (
                <button
                  className={`rounded px-3 py-1.5 text-xs font-semibold ${
                    filter === value
                      ? "bg-[#0755b7] text-white"
                      : "text-[#515867] hover:bg-[#eef2f7]"
                  }`}
                  type="button"
                  key={label}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              {["", "critical", "high", "normal"].map((value) => (
                <button
                  className={`rounded-full px-3 py-1 text-[9px] font-semibold uppercase ${
                    severity === value
                      ? value === "critical"
                        ? "bg-red-600 text-white"
                        : "bg-[#0755b7] text-white"
                      : "bg-[#eef1f6] text-[#515867]"
                  }`}
                  type="button"
                  key={value || "all"}
                  onClick={() => setSeverity(value)}
                >
                  {value || "All"}
                </button>
              ))}
            </div>
          </div>

          <div className="hide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f6f8fb] p-4">
            {loading && !incidents.length && (
              <LoaderCircle className="mx-auto mt-12 size-8 animate-spin text-[#0755b7]" />
            )}
            {visibleIncidents.map((incident) => (
              <IncidentCard
                active={active?.incidentId === incident.incidentId}
                incident={incident}
                key={incident.incidentId}
                onClick={() => selectIncident(incident.incidentId)}
              />
            ))}
            {!loading && !visibleIncidents.length && (
              <div className="rounded-xl border border-dashed bg-white p-8 text-center">
                <ShieldAlert className="mx-auto size-8 text-emerald-600" />
                <b className="mt-3 block">No incidents in this queue</b>
                <p className="mt-1 text-xs text-[#687184]">
                  New SOS and dispute reports will appear here.
                </p>
              </div>
            )}
          </div>
        </aside>

        <main
          className={`${mobileView === "case" ? "flex" : "hidden"} min-h-0 min-w-0 flex-col lg:flex`}
        >
          {!active ? (
            <div className="grid flex-1 place-items-center p-6 text-center">
              <div>
                <BadgeAlert className="mx-auto size-12 text-[#8b93a3]" />
                <h2 className="mt-4 text-xl font-semibold">
                  Select an incident
                </h2>
                <p className="text-sm text-[#687184]">
                  Choose a case from the live queue to review it.
                </p>
                <button
                  className="mt-5 rounded-lg border px-4 py-2 lg:hidden"
                  type="button"
                  onClick={() => setMobileView("queue")}
                >
                  Back to queue
                </button>
              </div>
            </div>
          ) : (
            <>
              <CaseHeader
                incident={active}
                onBack={() => setMobileView("queue")}
                onAssign={() => applyAction("assign")}
                saving={saving}
              />
              <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mx-auto grid max-w-[1180px] items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="space-y-5">
                    <Timeline incident={active} />
                    <LinkedRecords incident={active} />
                  </div>
                  <aside className="space-y-5">
                    <ResolutionPanel
                      incident={active}
                      notes={notes}
                      resolution={resolution}
                      saving={saving}
                      setNotes={setNotes}
                      setResolution={setResolution}
                      onResolve={() => applyAction("resolve")}
                      onEscalate={() => applyAction("escalate")}
                      onReview={() => applyAction("review")}
                    />
                    <AffectedProfiles incident={active} />
                  </aside>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <span className="pointer-events-none fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-2xl bg-red-700 text-white shadow-xl">
        <Radio className="size-6" />
      </span>
    </div>
  );
};

const IncidentCard = ({ active, incident, onClick }) => (
  <button
    className={`w-full rounded-xl border-2 bg-white p-4 text-left shadow-sm transition ${
      active ? "border-[#0755d3]" : "border-[#d6dce7] hover:border-[#9db3d4]"
    }`}
    type="button"
    onClick={onClick}
  >
    <div className="flex items-start gap-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded font-bold ${
          incident.type === "sos"
            ? "bg-red-700 text-[10px] text-white"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        {incident.type === "sos" ? "SOS" : <AlertTriangle className="size-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <b className="block">#{incident.incidentId.slice(0, 8).toUpperCase()}</b>
        <small className="block text-[10px] font-semibold uppercase text-[#0755b7]">
          {incident.label}
        </small>
      </span>
      <span className="rounded bg-red-100 px-2 py-1 text-[9px] font-semibold uppercase text-red-700">
        {incident.severity}
      </span>
    </div>
    <p className="mt-3 line-clamp-2 text-xs text-[#515867]">
      {incident.description}
    </p>
    <div className="mt-3 flex border-t pt-3 text-[10px] text-[#8b93a3]">
      <span>{formatDate(incident.createdAt)}</span>
      <b className="ml-auto text-[#0755b7]">{titleCase(incident.status)}</b>
    </div>
  </button>
);

const CaseHeader = ({ incident, onAssign, onBack, saving }) => (
  <header className="flex min-h-28 flex-col gap-3 border-b border-[#c9cfdd] bg-white p-4 sm:flex-row sm:items-center sm:px-6">
    <button className="lg:hidden" type="button" onClick={onBack}>
      <ArrowLeft className="size-5" />
    </button>
    <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-red-100 font-bold text-red-700">
      {incident.type === "sos" ? "SOS" : <AlertTriangle className="size-5" />}
    </span>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold sm:text-2xl">{incident.title}</h2>
        <span className="rounded bg-red-700 px-2 py-1 text-[9px] font-semibold uppercase text-white">
          {titleCase(incident.status)}
        </span>
      </div>
      <p className="mt-1 text-sm text-[#515867]">
        Case #{incident.incidentId.slice(0, 8).toUpperCase()} ·{" "}
        {formatDate(incident.createdAt)}
      </p>
    </div>
    <div className="sm:ml-auto sm:text-right">
      <small className="block text-[9px] font-semibold uppercase text-[#8b93a3]">
        Assigned handler
      </small>
      <b className="mt-1 block text-sm">
        {incident.assignedAdminName || "Unassigned"}
      </b>
    </div>
    {!incident.assignedAdminId && (
      <button
        className="rounded-lg bg-[#1265c4] px-4 py-3 text-sm font-semibold text-white"
        type="button"
        disabled={saving}
        onClick={onAssign}
      >
        Assign to me
      </button>
    )}
  </header>
);

const Timeline = ({ incident }) => (
  <section className="rounded-xl border border-[#c8cfde] bg-white p-5 sm:p-7">
    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.08em] text-[#687184]">
      <BadgeAlert className="size-5 text-[#0755b7]" />
      Incident Timeline
    </h2>
    <div className="mt-6">
      {[...(incident.timeline || [])].reverse().map((event, index, events) => (
        <div
          className="relative grid grid-cols-[22px_1fr_auto] gap-3 pb-7 last:pb-0"
          key={`${event.event}-${event.createdAt}-${index}`}
        >
          <span className="relative z-10 mt-1 size-3 rounded-full border-2 border-white bg-[#0755d3]" />
          {index < events.length - 1 && (
            <span className="absolute left-[5px] top-3 h-full w-px bg-[#ccd3df]" />
          )}
          <div>
            <b className="block text-sm">{event.title}</b>
            <p className="mt-1 text-sm leading-5 text-[#515867]">
              {event.description}
            </p>
            {index === events.length - 1 && incident.location && (
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#0755b7]">
                <MapPin className="size-3" />
                {incident.location.latitude.toFixed(5)},{" "}
                {incident.location.longitude.toFixed(5)}
              </p>
            )}
          </div>
          <small className="text-right text-[#8b93a3]">
            {formatDate(event.createdAt)}
          </small>
        </div>
      ))}
    </div>
  </section>
);

const LinkedRecords = ({ incident }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <LinkedCard
      icon={Clock3}
      title="Linked Visit"
      value={incident.visit?.visitId || incident.visitId}
      meta={
        incident.visit
          ? `${incident.visit.date || ""} · ${incident.visit.status || ""}`
          : "No visit linked"
      }
    />
    <LinkedCard
      icon={Banknote}
      title="Linked Transaction"
      value={incident.transaction?.transactionId || incident.transactionId}
      meta={
        incident.transaction
          ? `$${Number(incident.transaction.amount || 0).toLocaleString("en-US")} · ${incident.transaction.status}`
          : "No transaction linked"
      }
    />
  </div>
);

const LinkedCard = ({ icon: Icon, meta, title, value }) => (
  <article className="rounded-xl border border-[#c8cfde] bg-white p-5">
    <div className="flex items-center">
      <Icon className="size-5 text-[#687184]" />
      <b className="ml-2 text-sm">{title}</b>
    </div>
    <div className="mt-4 rounded-lg bg-[#f4f6fa] p-4">
      <b className="block break-all text-sm">{value ? `#${value}` : "None"}</b>
      <small className="mt-1 block text-[#687184]">{meta}</small>
    </div>
  </article>
);

const ResolutionPanel = ({
  incident,
  notes,
  onEscalate,
  onResolve,
  onReview,
  resolution,
  saving,
  setNotes,
  setResolution,
}) => (
  <section className="rounded-xl border border-[#c8cfde] bg-white p-5">
    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-[#687184]">
      <Gavel className="size-5 text-amber-800" />
      Case Resolution
    </h2>
    <label className="mt-5 block text-[9px] font-semibold uppercase text-[#8b93a3]">
      Decision
      <select
        className="mt-2 w-full rounded-lg border bg-[#f8f9fc] px-3 py-3 text-sm font-normal text-[#111c2c]"
        value={resolution}
        onChange={(event) => setResolution(event.target.value)}
      >
        <option value="">Select resolution...</option>
        <option>Client supported</option>
        <option>Caregiver supported</option>
        <option>Partial refund</option>
        <option>Full refund</option>
        <option>No policy violation</option>
        <option>Account action required</option>
      </select>
    </label>
    <label className="mt-4 block text-[9px] font-semibold uppercase text-[#8b93a3]">
      Internal notes
      <textarea
        className="mt-2 min-h-28 w-full rounded-lg border bg-[#f8f9fc] p-3 text-sm font-normal normal-case"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Enter findings and reasoning..."
      />
    </label>
    <button
      className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      type="button"
      disabled={saving || incident.status === "resolved"}
      onClick={onResolve}
    >
      <CheckCircle2 className="size-5" />
      Mark Resolved
    </button>
    <button
      className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-red-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      type="button"
      disabled={saving || incident.status === "escalated"}
      onClick={onEscalate}
    >
      <ShieldAlert className="size-5" />
      Escalate Incident
    </button>
    {incident.status === "open" && (
      <button
        className="mt-3 w-full rounded border px-4 py-3 text-sm font-semibold"
        type="button"
        disabled={saving}
        onClick={onReview}
      >
        Begin Review
      </button>
    )}
  </section>
);

const AffectedProfiles = ({ incident }) => (
  <section className="rounded-xl border border-[#c8cfde] bg-white p-5">
    <h2 className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#8b93a3]">
      Affected Profiles
    </h2>
    <Profile profile={incident.client} fallback="Client" />
    <Profile profile={incident.caregiver} fallback="Caregiver" />
  </section>
);

const Profile = ({ fallback, profile }) => (
  <div className="mt-4 flex items-center gap-3">
    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-blue-100 text-[#0755b7]">
      <UserRound className="size-5" />
    </span>
    <span className="min-w-0 flex-1">
      <b className="block text-sm">{profile?.name || fallback}</b>
      <small className="block truncate text-[#687184]">
        {profile
          ? `${titleCase(profile.role)} · ${titleCase(profile.verificationStatus)}`
          : "Not linked"}
      </small>
    </span>
  </div>
);

export default AdminDisputes;
