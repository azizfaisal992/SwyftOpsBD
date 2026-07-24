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
import caregiverAllexus from "../../assets/caregiver-allexus.jpg";
import caregiverKelly from "../../assets/caregiver-kelly.jpg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareSarah from "../../assets/find-care-sarah.jpg";
import mapImage from "../../assets/find-care-map.jpg";

const pageStartedAt = Date.now();
const sessions = [
  {
    id: 1,
    client: "Mrs. Rabeya Khatun",
    caregiver: "Abdul K.",
    image: findCareSarah,
    status: "Active Visit",
    tone: "green",
    baseSeconds: 5171,
    checkIn: "09:00 AM",
    end: "12:00 PM",
    task: "Medication",
    progress: "2/4 Completed",
    progressWidth: 50,
    location: "Within geofence",
  },
  {
    id: 2,
    client: "Mr. S. Rahman",
    caregiver: "Fahim J.",
    image: caregiverKelly,
    status: "Overtime",
    tone: "amber",
    baseSeconds: 13613,
    checkIn: "06:30 AM",
    end: "09:30 AM",
    task: "Care Tasks",
    progress: "3/3 Completed",
    progressWidth: 100,
    location: "Within geofence",
  },
  {
    id: 3,
    client: "Mrs. Fatema Z.",
    caregiver: "Sumit D.",
    image: caregiverAllexus,
    status: "Critical Alert",
    tone: "red",
    baseSeconds: 2811,
    checkIn: "11:00 AM",
    end: "02:00 PM",
    task: "Vitals Check",
    progress: "0/1 Completed",
    progressWidth: 10,
    location: "Outside geofence (2.4km)",
  },
  {
    id: 4,
    client: "Mrs. Aminul Islam",
    caregiver: "Shuva R.",
    image: caregiverSarah,
    status: "Active Visit",
    tone: "green",
    baseSeconds: 7906,
    checkIn: "09:30 AM",
    end: "01:30 PM",
    task: "Meal Prep",
    progress: "1/1 Done",
    progressWidth: 100,
    location: "Within geofence",
  },
];

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
  const [now, setNow] = useState(pageStartedAt);
  const [tab, setTab] = useState("live");
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [descending, setDescending] = useState(false);
  const [zone, setZone] = useState("All Areas");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const elapsed = Math.floor((now - pageStartedAt) / 1000);
  const visibleSessions = useMemo(() => {
    const source =
      tab === "history"
        ? sessions.map((item) => ({
            ...item,
            status: "Completed",
            tone: "green",
          }))
        : sessions;
    const filtered = alertsOnly
      ? source.filter((item) => item.tone !== "green")
      : source;
    return [...filtered].sort((a, b) =>
      descending ? b.baseSeconds - a.baseSeconds : a.id - b.id,
    );
  }, [alertsOnly, descending, tab]);

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f7fc]">
      <section className="relative h-72 overflow-hidden bg-slate-700 sm:h-[420px]">
        <img
          className="h-full w-full object-cover opacity-55 grayscale"
          src={mapImage}
          alt="Dhaka live operations map"
        />
        <div className="absolute inset-0 bg-[#10243d]/25" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
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
        <span className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-[#0755d3] px-4 py-3 text-sm font-semibold text-white shadow sm:right-6 sm:top-6">
          <span className="size-2 rounded-full bg-emerald-400" /> 89 Active
          Visits
        </span>
        <MapDot className="left-[32%] top-[40%]" tone="bg-blue-600" />
        <MapDot className="left-[58%] top-[58%]" tone="bg-red-600" />
        <MapDot className="left-[75%] top-[32%]" tone="bg-emerald-500" />
        <MapDot className="left-[82%] top-[68%]" tone="bg-blue-600" />
      </section>

      <section className="hide-scrollbar flex gap-3 overflow-x-auto border-b border-[#c5cad8] bg-white px-4 py-3 sm:px-6">
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
              seconds={session.baseSeconds + elapsed}
              key={session.id}
              onAction={notify}
            />
          ))}
        </section>
        {visibleSessions.length === 0 && (
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
const MapDot = ({ className, tone }) => (
  <span
    className={`absolute size-4 rounded-full border-2 border-white shadow-lg ${className} ${tone}`}
  />
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
