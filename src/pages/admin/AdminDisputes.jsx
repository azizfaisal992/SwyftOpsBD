import {
  AlertTriangle,
  ArrowLeft,
  BadgeAlert,
  Banknote,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  ExternalLink,
  Filter,
  Gavel,
  MapPin,
  MessageSquare,
  Phone,
  Radio,
  Search,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import caregiverAllexus from "../../assets/caregiver-allexus.jpg";
import caregiverKelly from "../../assets/caregiver-kelly.jpg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareKelly from "../../assets/find-care-kelly.jpg";
import findCareSarah from "../../assets/find-care-sarah.jpg";
import { adminAccount } from "../../data/adminPortalData";

const initialIncidents = [
  {
    id: "INC-0042",
    type: "SOS",
    label: "Emergency SOS",
    severity: "Critical",
    status: "In Review",
    opened: "12 min ago",
    reported: "Oct 24, 2026 at 09:47 AM",
    client: "Mrs. Fatema",
    clientImage: findCareSarah,
    clientMeta: "Client since 2021 · 4.8 rating",
    caregiver: "Rahima K.",
    caregiverImage: caregiverSarah,
    caregiverMeta: "Top Pro · 4.9 rating · 120+ shifts",
    title: "Emergency SOS Incident",
    handler: "Abrar Hussain (Admin)",
    visit: "VIS-9982 · Post-Op Care",
    visitMeta: "Scheduled: 08:00 AM – 04:00 PM",
    transaction: "TXN-44129 · bKash",
    transactionMeta: "Amount: ৳2,400.00",
    timeline: [
      { title: "SOS Triggered", time: "09:45 AM", description: "SOS button pressed through the caregiver app. GPS coordinates were recorded at the client's residence.", tone: "red" },
      { title: "Status Changed: In Review", time: "09:47 AM", description: "System assigned the duty manager and notified the emergency response desk.", tone: "blue" },
      { title: "Visit Commenced", time: "08:00 AM", description: "Rahima K. clocked in for the scheduled shift. Initial vital signs were reported normal.", tone: "slate" },
    ],
  },
  {
    id: "INC-0039",
    type: "Complaints",
    label: "Service Complaint",
    severity: "High",
    status: "Open",
    opened: "2 hr ago",
    reported: "Oct 24, 2026 at 08:10 AM",
    client: "Mr. Ahmed Ali",
    clientImage: findCareKelly,
    clientMeta: "Client since 2024 · 4.6 rating",
    caregiver: "Sumon R.",
    caregiverImage: caregiverKelly,
    caregiverMeta: "Professional Caregiver · 4.5 rating",
    title: "Service Quality Complaint",
    handler: "Duty Manager Queue",
    visit: "VIS-9961 · Senior Care",
    visitMeta: "Scheduled: 07:00 AM – 11:00 AM",
    transaction: "TXN-44095 · Card",
    transactionMeta: "Amount: ৳1,800.00",
    timeline: [
      { title: "Complaint Submitted", time: "08:10 AM", description: "Client reported delayed arrival and incomplete medication notes.", tone: "amber" },
      { title: "Caregiver Contacted", time: "08:22 AM", description: "Operations desk requested an explanation and supporting visit notes.", tone: "blue" },
      { title: "Visit Started Late", time: "07:38 AM", description: "GPS check-in was recorded 38 minutes after the scheduled start.", tone: "slate" },
    ],
  },
  {
    id: "INC-0038",
    type: "Payment",
    label: "Payment Dispute",
    severity: "Normal",
    status: "Open",
    opened: "5 hr ago",
    reported: "Oct 24, 2026 at 05:15 AM",
    client: "Selina Begum",
    clientImage: caregiverAllexus,
    clientMeta: "Client since 2023 · 4.9 rating",
    caregiver: "Nasrin Akter",
    caregiverImage: caregiverSarah,
    caregiverMeta: "Verified Pro · 4.8 rating",
    title: "Payment Dispute",
    handler: "Finance Review Queue",
    visit: "VIS-9928 · Companion Care",
    visitMeta: "Completed: Oct 23, 06:00 PM",
    transaction: "TXN-43982 · bKash",
    transactionMeta: "Amount: ৳3,200.00",
    timeline: [
      { title: "Payment Disputed", time: "05:15 AM", description: "Client questioned an additional two-hour overtime charge.", tone: "amber" },
      { title: "Transaction Held", time: "05:16 AM", description: "Caregiver payout was placed on hold pending review.", tone: "blue" },
      { title: "Visit Completed", time: "Yesterday", description: "Visit ended with a caregiver-recorded duration of six hours.", tone: "slate" },
    ],
  },
  {
    id: "INC-0034",
    type: "No-show",
    label: "Caregiver No-show",
    severity: "High",
    status: "Escalated",
    opened: "Yesterday",
    reported: "Oct 23, 2026 at 07:30 AM",
    client: "Abdul Karim",
    clientImage: findCareKelly,
    clientMeta: "Priority client · 4.9 rating",
    caregiver: "Kabir Hasan",
    caregiverImage: caregiverKelly,
    caregiverMeta: "Professional Caregiver · 4.3 rating",
    title: "Missed Care Assignment",
    handler: "Operations Lead",
    visit: "VIS-9902 · Morning Care",
    visitMeta: "Scheduled: 07:00 AM – 10:00 AM",
    transaction: "No transaction captured",
    transactionMeta: "Billing automatically paused",
    timeline: [
      { title: "No-show Confirmed", time: "07:30 AM", description: "Caregiver did not check in and could not be reached.", tone: "red" },
      { title: "Replacement Requested", time: "07:34 AM", description: "Urgent matching workflow started for a replacement caregiver.", tone: "blue" },
      { title: "Client Notified", time: "07:36 AM", description: "Client and emergency contact received service-delay notifications.", tone: "slate" },
    ],
  },
];

const filters = ["All", "SOS", "Complaints", "Payment", "No-show"];
const severityStyles = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-800",
  Normal: "bg-blue-100 text-slate-700",
};

const AdminDisputes = () => {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [activeId, setActiveId] = useState(initialIncidents[0].id);
  const [filter, setFilter] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [query, setQuery] = useState("");
  const [resolution, setResolution] = useState("");
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileView, setMobileView] = useState("queue");
  const active = incidents.find((item) => item.id === activeId) ?? incidents[0];

  const visibleIncidents = useMemo(() => incidents.filter((incident) => {
    const matchesType = filter === "All" || incident.type === filter;
    const matchesSeverity = severity === "All" || incident.severity === severity;
    const text = `${incident.id} ${incident.client} ${incident.caregiver} ${incident.label}`.toLowerCase();
    return matchesType && matchesSeverity && text.includes(query.toLowerCase());
  }), [filter, incidents, query, severity]);

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const updateStatus = (status) => {
    setIncidents((current) => current.map((incident) => incident.id === active.id ? { ...incident, status } : incident));
  };

  const resolveIncident = () => {
    if (!resolution || notes.trim().length < 10) {
      flash("Select a resolution and enter at least 10 characters of internal notes.");
      return;
    }
    updateStatus("Resolved");
    flash(`${active.id} marked resolved and added to the audit log.`);
  };

  const escalateIncident = () => {
    updateStatus("Escalated");
    flash(`${active.id} escalated to the senior incident response team.`);
  };

  return (
    <div className="relative h-[calc(100vh-64px)] min-h-[600px] overflow-hidden bg-[#f1f5fa] lg:h-screen">
      {notice && <div className="absolute left-1/2 top-3 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-[#0b1e31] px-4 py-3 text-sm whitespace-nowrap text-white shadow-xl"><CircleAlert className="size-4" />{notice}</div>}

      <header className="hidden h-16 items-center border-b border-[#c9cfdd] bg-white px-6 lg:flex">
        <h1 className="text-xl font-semibold">Disputes & Incidents <span className="text-red-600">({incidents.filter((item) => item.status !== "Resolved").length} open)</span></h1>
        <label className="ml-auto flex w-full max-w-md items-center gap-2 rounded-lg bg-[#f0f3f8] px-3 py-2.5 text-[#687184]"><Search className="size-4" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents, ID, or users..." /></label>
        <button className="relative ml-5 p-2" type="button" onClick={() => flash("3 incident alerts require attention.")}><Bell className="size-5" /><span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-red-700 text-[8px] text-white">3</span></button>
        <div className="ml-4 flex items-center gap-3 border-l pl-5"><span className="text-right"><b className="block text-sm">Super Admin</b><small className="text-[#687184]">Incident Control</small></span><img className="size-9 rounded-full object-cover" src={adminAccount.image} alt="" /></div>
      </header>

      <div className="grid h-full min-h-0 lg:h-[calc(100%-64px)] lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className={`${mobileView === "queue" ? "flex" : "hidden"} min-h-0 flex-col border-r border-[#c9cfdd] bg-white lg:flex`}>
          <div className="border-b p-4 sm:p-5"><div className="flex items-center"><div><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#687184]">Queue Management</p><h2 className="mt-1 font-semibold">Active incident queue</h2></div><Filter className="ml-auto size-5 text-[#687184]" /></div><label className="mt-4 flex items-center gap-2 rounded-lg border bg-[#f8f9fc] px-3 py-2.5 lg:hidden"><Search className="size-4" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents..." /></label><div className="mt-4 flex flex-wrap gap-1">{filters.map((item) => <button className={`rounded px-3 py-1.5 text-xs font-semibold ${filter === item ? "bg-[#0755b7] text-white" : "text-[#515867] hover:bg-[#eef2f7]"}`} type="button" key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="mt-3 flex gap-2">{["All", "Critical", "High", "Normal"].map((item) => <button className={`rounded-full px-3 py-1 text-[9px] font-semibold uppercase ${severity === item ? item === "Critical" ? "bg-red-600 text-white" : item === "High" ? "bg-orange-500 text-white" : "bg-[#0755b7] text-white" : "bg-[#eef1f6] text-[#515867]"}`} type="button" key={item} onClick={() => setSeverity(item)}>{item}</button>)}</div></div>
          <div className="hide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f6f8fb] p-4">{visibleIncidents.map((incident) => <IncidentCard active={active.id === incident.id} incident={incident} key={incident.id} onClick={() => { setActiveId(incident.id); setResolution(""); setNotes(""); setMobileView("case"); }} />)}{!visibleIncidents.length && <p className="p-8 text-center text-sm text-[#687184]">No incidents match this queue.</p>}</div>
        </aside>

        <main className={`${mobileView === "case" ? "flex" : "hidden"} min-h-0 min-w-0 flex-col lg:flex`}>
          <header className="flex min-h-28 flex-col gap-3 border-b border-[#c9cfdd] bg-white p-4 sm:flex-row sm:items-center sm:px-6 lg:min-h-[120px]">
            <button className="absolute left-4 top-4 lg:hidden" type="button" onClick={() => setMobileView("queue")}><ArrowLeft className="size-5" /></button>
            <span className={`grid size-12 shrink-0 place-items-center rounded-lg font-bold ${active.type === "SOS" ? "bg-red-100 text-red-700" : "bg-blue-100 text-[#0755b7]"}`}>{active.type === "SOS" ? "SOS" : <AlertTriangle className="size-5" />}</span>
            <div className="min-w-0 pl-8 lg:pl-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-semibold sm:text-2xl">{active.title}</h2><span className={`rounded px-2 py-1 text-[9px] font-semibold uppercase ${active.status === "Escalated" ? "bg-red-700 text-white" : active.status === "Resolved" ? "bg-emerald-600 text-white" : "bg-red-700 text-white"}`}>{active.status}</span></div><p className="mt-1 text-sm text-[#515867]">Case ID: #{active.id} · Reported {active.reported}</p></div>
            <div className="sm:ml-auto sm:text-right"><small className="block text-[9px] font-semibold uppercase tracking-[.1em] text-[#8b93a3]">Assigned Handler</small><b className="mt-1 block rounded-lg border bg-[#f8f9fc] px-3 py-2 text-sm">{active.handler}</b></div>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-[#1265c4] px-4 py-3 text-sm font-semibold text-white shadow" type="button" onClick={() => flash(`Secure conference call started for ${active.client} and ${active.caregiver}.`)}><Phone className="size-4" />Connect Parties</button>
          </header>

          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto grid max-w-[1180px] items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-5">
                <IncidentTimeline incident={active} />
                <div className="grid gap-4 sm:grid-cols-2"><LinkedCard icon={Clock3} title="Linked Visit" value={active.visit} meta={active.visitMeta} status="Active · elapsed 2h 12m" onClick={() => flash(`${active.visit} opened in Schedule.`)} /><LinkedCard icon={Banknote} title="Linked Transaction" value={active.transaction} meta={active.transactionMeta} status="Paid & verified" onClick={() => flash(`${active.transaction} opened in Payments & Finance.`)} /></div>
              </div>
              <aside className="space-y-5"><ResolutionPanel resolution={resolution} setResolution={setResolution} notes={notes} setNotes={setNotes} onResolve={resolveIncident} onEscalate={escalateIncident} /><AffectedProfiles incident={active} onAction={flash} /></aside>
            </div>
          </div>
        </main>
      </div>

      <button className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-2xl bg-red-700 text-white shadow-xl" type="button" onClick={() => flash("Emergency operations channel opened.")} aria-label="Open emergency operations channel"><Radio className="size-6" /></button>
    </div>
  );
};

const IncidentCard = ({ active, incident, onClick }) => <button className={`w-full rounded-xl border-2 bg-white p-4 text-left shadow-sm transition ${active ? "border-[#0755d3]" : "border-[#d6dce7] hover:border-[#9db3d4]"}`} type="button" onClick={onClick}><div className="flex items-start gap-3"><span className={`grid size-9 shrink-0 place-items-center rounded font-bold ${incident.type === "SOS" ? "bg-red-700 text-[10px] text-white" : incident.type === "Payment" ? "bg-blue-600 text-white" : "bg-amber-700 text-white"}`}>{incident.type === "SOS" ? "SOS" : incident.type === "Payment" ? <Banknote className="size-4" /> : <AlertTriangle className="size-4" />}</span><span className="min-w-0 flex-1"><b className="block">#{incident.id}</b><small className={`block text-[10px] font-semibold uppercase ${incident.severity === "Critical" ? "text-red-700" : "text-[#0755b7]"}`}>{incident.label}</small></span><span className={`rounded px-2 py-1 text-[9px] font-semibold uppercase ${severityStyles[incident.severity]}`}>{incident.severity}</span></div><div className="mt-3 space-y-1 text-xs text-[#515867]"><p>Client: <b>{incident.client}</b></p><p>Caregiver: <b>{incident.caregiver}</b></p></div><div className="mt-3 flex border-t pt-3 text-[10px] text-[#8b93a3]"><span>Opened {incident.opened}</span><b className={`ml-auto ${incident.status === "Escalated" ? "text-red-700" : "text-[#0755b7]"}`}>{incident.status}</b></div></button>;

const IncidentTimeline = ({ incident }) => <section className="rounded-xl border border-[#c8cfde] bg-white p-5 sm:p-7"><h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.08em] text-[#687184]"><BadgeAlert className="size-5 text-[#0755b7]" />Incident Timeline</h2><div className="mt-6">{incident.timeline.map((event, index) => <div className="relative grid grid-cols-[22px_1fr_auto] gap-3 pb-7 last:pb-0" key={`${event.title}-${event.time}`}><span className={`relative z-10 mt-1 size-3 rounded-full border-2 border-white ${event.tone === "red" ? "bg-red-700" : event.tone === "blue" ? "bg-[#0755d3]" : "bg-slate-300"}`} />{index < incident.timeline.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-[#ccd3df]" />}<div><b className="block text-sm">{event.title}</b><p className="mt-1 text-sm leading-5 text-[#515867]">{event.description}</p>{index === 0 && incident.type === "SOS" && <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#0755b7]" type="button"><MapPin className="size-3" />23.8103° N, 90.4125° E</button>}</div><small className="text-[#8b93a3]">{event.time}</small></div>)}</div></section>;

const LinkedCard = ({ icon: Icon, meta, onClick, status, title, value }) => <button className="rounded-xl border border-[#c8cfde] bg-white p-5 text-left" type="button" onClick={onClick}><div className="flex items-center"><Icon className="size-5 text-[#687184]" /><b className="ml-2 text-sm">{title}</b><ExternalLink className="ml-auto size-4 text-[#8b93a3]" /></div><div className="mt-4 rounded-lg bg-[#f4f6fa] p-4"><b className="block text-sm">#{value}</b><small className="mt-1 block text-[#687184]">{meta}</small><span className="mt-4 block text-[10px] font-semibold uppercase text-[#0755b7]">{status}</span></div></button>;

const ResolutionPanel = ({ notes, onEscalate, onResolve, resolution, setNotes, setResolution }) => <section className="rounded-xl border border-[#c8cfde] bg-white p-5"><h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.08em] text-[#687184]"><Gavel className="size-5 text-amber-800" />Case Resolution</h2><label className="mt-5 block text-[9px] font-semibold uppercase tracking-[.08em] text-[#8b93a3]">Decision Action<select className="mt-2 w-full rounded-lg border border-[#c8cfde] bg-[#f8f9fc] px-3 py-3 text-sm font-normal text-[#111c2c] outline-none" value={resolution} onChange={(event) => setResolution(event.target.value)}><option value="">Select resolution...</option><option>Client supported</option><option>Caregiver supported</option><option>Partial refund</option><option>Full refund</option><option>No policy violation</option><option>Account action required</option></select></label><label className="mt-4 block text-[9px] font-semibold uppercase tracking-[.08em] text-[#8b93a3]">Resolution Notes<textarea className="mt-2 min-h-28 w-full rounded-lg border border-[#c8cfde] bg-[#f8f9fc] p-3 text-sm font-normal normal-case tracking-normal outline-none" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Enter internal findings and reasoning..." /></label><button className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-emerald-700 px-4 py-3 text-sm font-semibold text-white" type="button" onClick={onResolve}><CheckCircle2 className="size-5" />Mark Resolved</button><button className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-red-700 px-4 py-3 text-sm font-semibold text-white" type="button" onClick={onEscalate}><ShieldAlert className="size-5" />Escalate Incident</button></section>;

const AffectedProfiles = ({ incident, onAction }) => <section className="rounded-xl border border-[#c8cfde] bg-white p-5"><h2 className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#8b93a3]">Affected Profiles</h2><Profile image={incident.clientImage} name={incident.client} meta={incident.clientMeta} onClick={() => onAction(`${incident.client} profile opened.`)} /><Profile image={incident.caregiverImage} name={incident.caregiver} meta={incident.caregiverMeta} onClick={() => onAction(`${incident.caregiver} profile opened.`)} /><div className="mt-4 grid grid-cols-2 gap-2"><button className="flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold text-[#0755b7]" type="button" onClick={() => onAction("Secure incident message opened.")}><MessageSquare className="size-4" />Message</button><button className="flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold text-[#0755b7]" type="button" onClick={() => onAction("Profile restrictions menu opened.")}><UserRoundCheck className="size-4" />Review</button></div></section>;
const Profile = ({ image, meta, name, onClick }) => <button className="mt-4 flex w-full items-center gap-3 text-left" type="button" onClick={onClick}><img className="size-11 rounded-lg object-cover" src={image} alt="" /><span className="min-w-0 flex-1"><b className="block text-sm">{name}</b><small className="block truncate text-[#687184]">{meta}</small></span><ChevronRight className="size-4 text-[#8b93a3]" /></button>;

export default AdminDisputes;
