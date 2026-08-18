import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Filter,
  Flag,
  Headphones,
  MapPin,
  MoreVertical,
  Phone,
  Radio,
  SortAsc,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import BarikoiMap from "../../components/maps/BarikoiMap";
import {
  listAdminShifts,
  listAdminVisits,
} from "../../services/assignmentService";

const normalizeLocation = (location) => {
  if (!location) return null;
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
};

const isActiveVisit = (visit) =>
  visit?.status === "active" &&
  !visit.clockOutAt &&
  !visit.completedAt &&
  !visit.endedAt;

const isActiveShift = (shift) =>
  shift?.status === "active" &&
  !shift.clockOutAt &&
  !shift.completedAt &&
  !shift.endedAt;

const newestActiveShiftPerCaregiver = (shifts) => {
  const unique = new Map();
  shifts.filter(isActiveShift).forEach((shift) => {
    const key = shift.caregiverId || shift.shiftId;
    const current = unique.get(key);
    const shiftTime = String(shift.updatedAt || shift.startedAt || "");
    const currentTime = String(
      current?.updatedAt || current?.startedAt || "",
    );
    if (!current || shiftTime > currentTime) unique.set(key, shift);
  });
  return [...unique.values()];
};

const toSession = (visit) => {
  const completed = visit.completedTasks?.length || 0;
  const total = visit.tasks?.length || 0;
  const startedAt = visit.clockInAt
    ? new Date(visit.clockInAt).getTime()
    : Date.now();
  return {
    id: visit.visitId,
    client: visit.clientName || "Client",
    caregiver: visit.caregiverName || "Caregiver",
    image: caregiverSarah,
    status: visit.status === "completed" ? "Completed" : "Active Visit",
    tone: visit.withinGeofence === false ? "red" : "green",
    baseSeconds: visit.status === "completed" ? visit.durationSeconds || 0 : 0,
    startedAt,
    checkIn: visit.clockInAt
      ? new Date(visit.clockInAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Not started",
    end: visit.scheduledEndLocal || "—",
    task: total === 1 ? visit.tasks[0] : "Care Tasks",
    progress: `${completed}/${total} Completed`,
    progressWidth: total ? Math.round((completed / total) * 100) : 0,
    location: visit.withinGeofence === false
      ? `Outside geofence${visit.distanceFromServiceMeters ? ` (${visit.distanceFromServiceMeters}m)` : ""}`
      : visit.currentLocation || visit.clockInLocation
        ? "Live GPS active"
      : visit.location || "Location unavailable",
    coordinates: normalizeLocation(
      visit.currentLocation ||
        visit.clockOutLocation ||
        visit.clockInLocation ||
        null,
    ),
    withinGeofence: visit.withinGeofence,
  };
};

const sessionTones = {
  green: {
    label: "bg-emerald-100 text-emerald-700",
    value: "text-[#0755d3]",
    border: "border-[#c5cad8]",
    progress: "bg-[#0755d3]",
  },
  amber: {
    label: "bg-orange-100 text-amber-800",
    value: "text-amber-800",
    border: "border-amber-600",
    progress: "bg-[#0755d3]",
  },
  red: {
    label: "bg-red-100 text-red-700",
    value: "text-red-700",
    border: "border-red-500",
    progress: "bg-slate-400",
  },
};

const AdminLiveOperations = () => {
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState("live");
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [descending, setDescending] = useState(false);
  const [zone, setZone] = useState("All Areas");
  const [notice, setNotice] = useState("");
  const [sessions, setSessions] = useState([]);
  const [activeShifts, setActiveShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadSessions = () => {
      Promise.all([
        listAdminVisits({ status: tab === "live" ? "active" : "completed" }),
        tab === "live" ? listAdminShifts("active") : Promise.resolve([]),
      ])
        .then(([records, shifts]) => {
          if (!active) return;
          setSessions(
            records
              .filter((record) =>
                tab === "live" ? isActiveVisit(record) : true,
              )
              .map(toSession),
          );
          setActiveShifts(newestActiveShiftPerCaregiver(shifts));
          setNotice("");
        })
        .catch((error) => {
          if (active) {
            setNotice(error.message);
            if (tab === "live") {
              setSessions([]);
              setActiveShifts([]);
            }
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };
    loadSessions();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") loadSessions();
    };
    const refreshTimer = window.setInterval(loadSessions, 5000);
    window.addEventListener("focus", loadSessions);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", loadSessions);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [tab]);

  const visibleSessions = useMemo(() => {
    const filtered = alertsOnly
      ? sessions.filter((item) => item.tone !== "green")
      : sessions;
    return [...filtered].sort((a, b) =>
      descending
        ? b.baseSeconds - a.baseSeconds
        : a.client.localeCompare(b.client),
    );
  }, [alertsOnly, descending, sessions]);

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const mapMarkers = [
    ...sessions
      .filter((session) => session.coordinates)
      .map((session) => ({
        ...session.coordinates,
        label: `${session.client} · ${session.caregiver}`,
      })),
    ...activeShifts
      .filter((shift) =>
        normalizeLocation(shift.currentLocation || shift.startLocation),
      )
      .filter((shift) =>
        !sessions.some(
          (session) => session.caregiver === shift.caregiverName,
        ),
      )
      .map((shift) => ({
        ...normalizeLocation(shift.currentLocation || shift.startLocation),
        label: `${shift.caregiverName || "Caregiver"} · On duty`,
      })),
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f7fc]">
      <section className="relative h-72 overflow-hidden bg-slate-700 sm:h-[420px]">
        <BarikoiMap
          className="h-full w-full"
          markers={mapMarkers /* sessions
            .filter((session) => session.coordinates)
            .map((session) => ({
              ...session.coordinates,
              label: `${session.client} · ${session.caregiver}`,
            })) */}
          zoom={11}
        />
        <div className="pointer-events-none absolute inset-0 bg-[#10243d]/10" />
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-6 sm:top-6">
          <label className="rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow">
            Zone:{" "}
            <select
              className="bg-transparent outline-none"
              value={zone}
              onChange={(event) => setZone(event.target.value)}
            >
              <option>All Areas</option>
              <option>Dhaka North</option>
              <option>Dhaka South</option>
            </select>
          </label>
          <div className="flex rounded-lg bg-white p-1 shadow">
            <button
              className={`rounded px-4 py-2 text-xs font-semibold ${tab === "live" ? "bg-[#0755d3] text-white" : "text-[#515867]"}`}
              type="button"
              onClick={() => setTab("live")}
            >
              LIVE
            </button>
            <button
              className={`rounded px-4 py-2 text-xs font-semibold ${tab === "history" ? "bg-[#0755d3] text-white" : "text-[#515867]"}`}
              type="button"
              onClick={() => setTab("history")}
            >
              HISTORY
            </button>
          </div>
        </div>
        <span className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-lg bg-[#0755d3] px-4 py-3 text-sm font-semibold text-white shadow sm:bottom-auto sm:right-6 sm:top-6">
          <span className="size-2 rounded-full bg-emerald-400" />{" "}
          {tab === "live"
            ? `${sessions.length} Active Visits · ${activeShifts.length} On Duty`
            : `${sessions.length} Completed Visits`}
        </span>
      </section>

      <section className="hide-scrollbar flex gap-3 overflow-x-auto border-b border-[#c5cad8] bg-white px-4 py-3 sm:px-6">
        {sessions.length ? (
          sessions.slice(0, 5).map((session) => (
            <AlertChip
              key={session.id}
              tone={
                session.withinGeofence === false
                  ? "red"
                  : session.coordinates ? "slate" : "amber"
              }
              icon={
                session.location === "Live GPS active"
                  ? MapPin
                  : AlertTriangle
              }
              text={`${session.client} — ${
                session.withinGeofence === false
                  ? "outside service geofence"
                  : session.location
              }`}
            />
          ))
        ) : (
          <span className="text-xs text-[#606878]">
            No live visit alerts are currently recorded.
          </span>
        )}
        <div className="hidden">
        <AlertChip
          tone="red"
          icon={AlertTriangle}
          text="Caregiver outside geofence — Abdul K., Banani"
        />
        <AlertChip
          tone="amber"
          icon={Clock3}
          text="Visit 2hr overtime — Mrs. Fatema, Dhanmondi"
        />
        <AlertChip
          tone="slate"
          icon={Flag}
          text="No medication recorded — Mrs. Sumaiya, Uttara"
        />
        </div>
      </section>

      <main className="mx-auto max-w-[1280px] p-4 sm:p-6">
        {notice && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <Radio className="size-4" /> {notice}
          </div>
        )}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <h1 className="text-lg font-medium">
            {tab === "live" ? "Ongoing Care Sessions" : "Visit History"}
          </h1>
          <div className="flex gap-2 sm:ml-auto">
            <button
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${alertsOnly ? "border-red-400 bg-red-50 text-red-700" : "border-[#c5cad8] bg-white"}`}
              type="button"
              onClick={() => setAlertsOnly((current) => !current)}
            >
              <Filter className="size-4" />{" "}
              {alertsOnly ? "Alerts Only" : "Filter"}
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c5cad8] bg-white px-4 py-2.5 text-sm"
              type="button"
              onClick={() => setDescending((current) => !current)}
            >
              <SortAsc className="size-4" /> Sort
            </button>
          </div>
        </header>
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleSessions.map((session) => (
            <SessionCard
              session={session}
              seconds={
                tab === "live"
                  ? Math.max(0, Math.floor((now - session.startedAt) / 1000))
                  : session.baseSeconds
              }
              key={session.id}
              onAction={notify}
            />
          ))}
        </section>
        {!loading && visibleSessions.length === 0 && (
          <div className="mt-5 rounded-xl border border-dashed border-[#b9c1d3] bg-white p-10 text-center text-[#606878]">
            No sessions match the current filters.
          </div>
        )}
      </main>
    </div>
  );
};

const SessionCard = ({ session, seconds, onAction }) => {
  const tone = sessionTones[session.tone];
  return (
    <article className={`rounded-xl border bg-white p-5 ${tone.border}`}>
      <div className="flex items-center">
        <span
          className={`rounded px-2 py-1 text-[9px] font-semibold uppercase ${tone.label}`}
        >
          {session.status}
        </span>
        <button className="ml-auto" type="button">
          <MoreVertical className="size-5 text-[#515867]" />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <img
          className="size-12 rounded-full object-cover"
          src={session.image}
          alt=""
        />
        <div>
          <b className="block leading-5">{session.client}</b>
          <small className="flex items-center gap-1 text-[#606878]">
            <MapPin className="size-3" /> {session.caregiver}
          </small>
        </div>
      </div>
      <div className="my-5 border-y border-[#d7dbe7] py-5 text-center">
        <b className={`font-mono text-3xl ${tone.value}`}>
          {formatDuration(seconds)}
        </b>
        <small className="mt-2 block uppercase tracking-[.12em] text-[#515867]">
          Active Duration
        </small>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <small className="uppercase text-[#515867]">Check-in</small>
          <b className="block text-sm">{session.checkIn}</b>
        </div>
        <div className="text-right">
          <small className="uppercase text-[#515867]">Scheduled End</small>
          <b className="block text-sm">{session.end}</b>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex text-xs">
          <span>{session.task}</span>
          <b className="ml-auto text-[#0649ad]">{session.progress}</b>
        </div>
        <span className="mt-2 block h-1.5 rounded bg-[#e7eaf2]">
          <span
            className={`block h-full rounded ${tone.progress}`}
            style={{ width: `${session.progressWidth}%` }}
          />
        </span>
      </div>
      <p
        className={`mt-5 flex items-center gap-2 text-xs font-semibold ${session.tone === "red" ? "text-red-600" : "text-emerald-700"}`}
      >
        {session.tone === "red" ? (
          <AlertTriangle className="size-4" />
        ) : (
          <CheckCircle2 className="size-4" />
        )}{" "}
        {session.location}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <QuickAction
          label="Call"
          icon={Phone}
          onClick={() => onAction(`Calling ${session.caregiver}...`)}
        />
        <QuickAction
          label="Support"
          icon={Headphones}
          onClick={() => onAction(`Support opened for ${session.client}.`)}
        />
        <QuickAction
          label="Escalate"
          icon={session.tone === "red" ? AlertTriangle : Flag}
          danger={session.tone === "red"}
          onClick={() => onAction(`Session for ${session.client} escalated.`)}
        />
      </div>
    </article>
  );
};

const QuickAction = ({ label, icon: Icon, danger = false, onClick }) => (
  <button
    className={`grid place-items-center rounded-lg border py-2.5 ${danger ? "border-red-500 bg-red-600 text-white" : "border-[#c5cad8] text-[#0755d3]"}`}
    type="button"
    onClick={onClick}
    aria-label={label}
  >
    <Icon className="size-5" />
  </button>
);
const AlertChip = ({ tone, icon: Icon, text }) => {
  const styles = {
    red: "border-red-300 bg-red-50 text-red-700",
    amber: "border-orange-300 bg-orange-50 text-amber-800",
    slate: "border-[#c5cad8] bg-[#f4f5f8] text-[#515867]",
  };
  return (
    <span
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${styles[tone]}`}
    >
      <Icon className="size-4" /> {text}
    </span>
  );
};
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

export default AdminLiveOperations;
