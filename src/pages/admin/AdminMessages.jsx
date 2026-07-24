import {
  ArrowLeft,
  Bell,
  Check,
  Download,
  Eye,
  FileText,
  Flag,
  Info,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Siren,
  UserPlus,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import caregiverAllexus from "../../assets/caregiver-allexus.jpg";
import caregiverKelly from "../../assets/caregiver-kelly.jpg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareKelly from "../../assets/find-care-kelly.jpg";
import findCareSarah from "../../assets/find-care-sarah.jpg";
import { adminAccount } from "../../data/adminPortalData";

const conversations = [
  {
    id: "fatema-rahima",
    client: "Fatema Begum",
    caregiver: "Rahima Khatun",
    clientImage: findCareSarah,
    caregiverImage: caregiverSarah,
    preview: "I have arrived at the location and started the clock.",
    time: "10:45 AM",
    category: "Flagged",
    unread: 0,
    flagged: true,
    visitId: "VS-88219",
    service: "Post-Surgical Home Care",
    duration: "4 hours",
    status: "Ongoing",
    location: "Dhanmondi, Dhaka",
  },
  {
    id: "abdur-jewel",
    client: "Abdur Rahman",
    caregiver: "Jewel Ahmed",
    clientImage: findCareKelly,
    caregiverImage: caregiverKelly,
    preview: "Please do not forget the medicines.",
    time: "09:12 AM",
    category: "Client",
    unread: 3,
    flagged: false,
    visitId: "VS-88184",
    service: "Daily Medication Support",
    duration: "3 hours",
    status: "Scheduled",
    location: "Gulshan, Dhaka",
  },
  {
    id: "sara-arif",
    client: "Sara Islam",
    caregiver: "Arif Hossain",
    clientImage: caregiverAllexus,
    caregiverImage: caregiverKelly,
    preview: "Daily_Care_Report.pdf",
    time: "Yesterday",
    category: "Support",
    unread: 1,
    flagged: false,
    visitId: "VS-88091",
    service: "Senior Companion Care",
    duration: "6 hours",
    status: "Completed",
    location: "Banani, Dhaka",
  },
  {
    id: "nasrin-kabir",
    client: "Nasrin Sultana",
    caregiver: "Kabir Hasan",
    clientImage: caregiverSarah,
    caregiverImage: caregiverKelly,
    preview: "Could we reschedule tomorrow's visit?",
    time: "Monday",
    category: "Client",
    unread: 0,
    flagged: false,
    visitId: "VS-87997",
    service: "Physiotherapy Assistance",
    duration: "2 hours",
    status: "Reschedule",
    location: "Uttara, Dhaka",
  },
];

const messagesByConversation = {
  "fatema-rahima": [
    {
      id: 1,
      author: "Fatema Begum",
      role: "Client",
      time: "10:12 AM",
      text: "Hi Rahima, what time will you be arriving today? I need help with my medication around 11:00 AM.",
      side: "left",
    },
    {
      id: 2,
      author: "Rahima Khatun",
      role: "Caregiver",
      time: "10:15 AM",
      text: "I am already on my way! The traffic is a bit heavy, but I should be there by 10:45 AM at the latest.",
      side: "right",
    },
    {
      id: 3,
      author: "Rahima Khatun",
      role: "Caregiver",
      time: "10:16 AM",
      file: "Care_Session_Checklist.pdf",
      size: "1.2 MB",
      side: "right",
    },
    {
      id: 4,
      author: "Rahima Khatun",
      role: "Caregiver",
      time: "10:16 AM",
      text: "I've attached the pre-visit checklist for today's session. See you soon!",
      side: "right",
    },
    { id: 5, system: true, text: "Location shared: 12.3 km from service site" },
    {
      id: 6,
      author: "Rahima Khatun",
      role: "Caregiver",
      time: "10:45 AM",
      text: "I have arrived at the location and am starting the clock now.",
      side: "right",
    },
  ],
  "abdur-jewel": [
    {
      id: 1,
      author: "Abdur Rahman",
      role: "Client",
      time: "09:10 AM",
      text: "Please do not forget to bring the medicines listed in my care plan.",
      side: "left",
    },
    {
      id: 2,
      author: "Jewel Ahmed",
      role: "Caregiver",
      time: "09:12 AM",
      text: "Confirmed. I checked the plan and will bring everything needed.",
      side: "right",
    },
  ],
  "sara-arif": [
    {
      id: 1,
      author: "Arif Hossain",
      role: "Caregiver",
      time: "Yesterday",
      file: "Daily_Care_Report.pdf",
      size: "2.4 MB",
      side: "right",
    },
    {
      id: 2,
      author: "Sara Islam",
      role: "Client",
      time: "Yesterday",
      text: "Thank you. I have reviewed the care report.",
      side: "left",
    },
  ],
  "nasrin-kabir": [
    {
      id: 1,
      author: "Nasrin Sultana",
      role: "Client",
      time: "Monday",
      text: "Could we reschedule tomorrow's visit to the afternoon?",
      side: "left",
    },
    {
      id: 2,
      author: "Kabir Hasan",
      role: "Caregiver",
      time: "Monday",
      text: "I have notified the scheduling team so they can confirm availability.",
      side: "right",
    },
  ],
};

const filters = ["All", "Flagged", "Support", "Client"];

const AdminMessages = () => {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [flaggedIds, setFlaggedIds] = useState(
    () =>
      new Set(
        conversations.filter((item) => item.flagged).map((item) => item.id),
      ),
  );
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [notice, setNotice] = useState("");
  const [mobilePanel, setMobilePanel] = useState("list");
  const active =
    conversations.find((item) => item.id === activeId) ?? conversations[0];
  const messages = messagesByConversation[active.id] ?? [];

  const visibleConversations = useMemo(
    () =>
      conversations.filter((item) => {
        const text =
          `${item.client} ${item.caregiver} ${item.preview}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        const matchesFilter =
          filter === "All" ||
          (filter === "Flagged" && flaggedIds.has(item.id)) ||
          item.category === filter;
        return matchesQuery && matchesFilter;
      }),
    [filter, flaggedIds, query],
  );

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const toggleFlag = () => {
    setFlaggedIds((current) => {
      const next = new Set(current);
      if (next.has(active.id)) next.delete(active.id);
      else next.add(active.id);
      return next;
    });
    flash(
      flaggedIds.has(active.id)
        ? "Conversation flag removed."
        : "Conversation flagged for admin review.",
    );
  };

  const assignSupport = () => {
    setAssignedIds((current) => new Set(current).add(active.id));
    flash("Conversation assigned to the support queue.");
  };

  return (
    <div className="relative h-[calc(100vh-64px)] min-h-[560px] overflow-hidden bg-white lg:h-screen lg:min-h-[620px]">
      {notice && (
        <div className="absolute left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm text-white shadow-xl">
          <Check className="size-4" />
          {notice}
        </div>
      )}

      <header className="hidden h-16 items-center border-b border-[#c9cfdd] px-4 sm:px-6 lg:flex">
        {mobilePanel !== "list" && (
          <button
            className="mr-3 lg:hidden"
            type="button"
            onClick={() => setMobilePanel("list")}
            aria-label="Show conversations"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold sm:text-xl">
          Messages & Calls Oversight
        </h1>
        <span className="ml-3 hidden items-center gap-2 rounded-full bg-[#eef0f5] px-3 py-1 text-xs sm:flex">
          <i className="size-2 rounded-full bg-red-600" />2 active disputes
        </span>
        <button
          className="relative ml-auto rounded-lg p-2 hover:bg-slate-100"
          type="button"
          onClick={() => flash("You have 5 unread admin notifications.")}
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-1 top-1 size-2 rounded-full bg-red-600" />
        </button>
        <div className="ml-3 hidden items-center gap-2 border-l border-[#c9cfdd] pl-4 sm:flex">
          <img
            className="size-9 rounded-full object-cover"
            src={adminAccount.image}
            alt=""
          />
          <span>
            <b className="block text-sm">Admin User</b>
            <small className="text-[#687184]">Super Admin</small>
          </span>
        </div>
      </header>

      <div className="grid h-full lg:h-[calc(100%-64px)] lg:grid-cols-[280px_minmax(0,1fr)_278px] xl:grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside
          className={`${mobilePanel === "list" ? "flex" : "hidden"} min-h-0 flex-col border-r border-[#c9cfdd] bg-white lg:flex`}
        >
          <div className="p-4">
            <label className="flex items-center gap-2 rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-3 text-[#687184]">
              <Search className="size-4" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations..."
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {filters.map((item) => (
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === item ? "bg-[#0755b7] text-white" : "text-[#515867] hover:bg-[#eef3fb]"}`}
                  type="button"
                  key={item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-[#c9cfdd]">
            {visibleConversations.map((item) => (
              <button
                className={`flex w-full gap-3 border-b border-[#d8dde7] p-4 text-left transition hover:bg-[#f4f7fc] ${active.id === item.id ? "border-l-4 border-l-[#0755d3] bg-[#e9f1ff]" : "border-l-4 border-l-transparent"}`}
                type="button"
                key={item.id}
                onClick={() => {
                  setActiveId(item.id);
                  setMobilePanel("chat");
                }}
              >
                <AvatarPair conversation={item} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-start gap-2">
                    <b className="block flex-1 text-sm leading-5">
                      {item.client} ↔ {item.caregiver}
                    </b>
                    <small className="shrink-0 text-[10px] text-[#7b8291]">
                      {item.time}
                    </small>
                  </span>
                  <small className="mt-1 block line-clamp-2 text-[#515867]">
                    {item.preview}
                  </small>
                </span>
                <span className="flex flex-col items-center gap-2">
                  {flaggedIds.has(item.id) && (
                    <Flag className="size-3.5 fill-red-600 text-red-600" />
                  )}
                  {item.unread > 0 && (
                    <i className="grid size-5 place-items-center rounded-full bg-[#0755b7] text-[10px] font-semibold text-white not-italic">
                      {item.unread}
                    </i>
                  )}
                </span>
              </button>
            ))}
            {!visibleConversations.length && (
              <p className="p-8 text-center text-sm text-[#687184]">
                No conversations found.
              </p>
            )}
          </div>
        </aside>

        <main
          className={`${mobilePanel === "chat" ? "flex" : "hidden"} min-w-0 min-h-0 flex-col bg-[#f4f7fc] lg:flex`}
        >
          <header className="flex min-h-16 items-center gap-3 border-b border-[#c9cfdd] bg-white px-4">
            <button
              className="lg:hidden"
              type="button"
              onClick={() => setMobilePanel("list")}
              aria-label="Back to conversations"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0">
              <b className="block truncate">
                {active.client} ↔ {active.caregiver}
              </b>
              <small className="text-[#687184]">
                Client and caregiver conversation
              </small>
            </div>
            <span className="ml-auto hidden items-center gap-2 rounded-lg border bg-[#f4f6fb] px-3 py-2 text-[10px] font-semibold uppercase tracking-[.08em] text-[#687184] sm:flex">
              <Eye className="size-4" />
              Read-only oversight
            </span>
            <button
              className="grid size-9 place-items-center rounded-lg border border-[#c5cad8] lg:hidden"
              type="button"
              onClick={() => setMobilePanel("details")}
              aria-label="Conversation details"
            >
              <Info className="size-5" />
            </button>
          </header>

          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <span className="rounded-full border border-[#c5cad8] bg-white px-4 py-1.5 text-[10px] font-semibold uppercase text-[#687184]">
                  Today, October 24
                </span>
              </div>
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage
                    message={message}
                    key={message.id}
                    onDownload={() =>
                      flash(`${message.file} is ready for secure download.`)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <footer className="grid gap-2 border-t border-[#c9cfdd] bg-white p-3 sm:grid-cols-2 sm:p-4">
            <button
              className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold ${flaggedIds.has(active.id) ? "border-red-600 bg-red-50 text-red-700" : "border-[#c5cad8] text-[#515867]"}`}
              type="button"
              onClick={toggleFlag}
            >
              <Flag className="size-4" />
              {flaggedIds.has(active.id) ? "Remove Flag" : "Flag Conversation"}
            </button>
            <button
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white ${assignedIds.has(active.id) ? "bg-emerald-700" : "bg-[#0755b7]"}`}
              type="button"
              onClick={assignSupport}
            >
              <UserPlus className="size-4" />
              {assignedIds.has(active.id)
                ? "Assigned to Support"
                : "Assign Support Agent"}
            </button>
          </footer>
        </main>

        <aside
          className={`${mobilePanel === "details" ? "flex" : "hidden"} min-h-0 flex-col border-l border-[#c9cfdd] bg-[#f6f7fc] lg:flex`}
        >
          <div className="flex items-center border-b border-[#c9cfdd] bg-white p-4 lg:hidden">
            <b>Conversation Details</b>
            <button
              className="ml-auto"
              type="button"
              onClick={() => setMobilePanel("chat")}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="hide-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
            <DetailHeading>Linked Visit</DetailHeading>
            <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
              <div className="flex">
                <b className="text-sm text-[#0755b7]">#{active.visitId}</b>
                <span className="ml-auto rounded bg-emerald-100 px-2 py-1 text-[9px] font-semibold uppercase text-emerald-700">
                  {active.status}
                </span>
              </div>
              <b className="mt-3 block text-sm">{active.service}</b>
              <p className="mt-3 flex items-center gap-1 border-t pt-3 text-xs text-[#515867]">
                <MapPin className="size-3.5" />
                {active.location}
              </p>
              <div className="mt-3 grid grid-cols-2 text-xs">
                <span>
                  <small className="block text-[#7b8291]">Date</small>Oct 24,
                  2026
                </span>
                <span>
                  <small className="block text-[#7b8291]">Duration</small>
                  {active.duration}
                </span>
              </div>
            </section>

            <DetailHeading>Participants</DetailHeading>
            <Participant
              image={active.clientImage}
              name={active.client}
              badge="Active Client"
              tone="green"
            />
            <Participant
              image={active.caregiverImage}
              name={active.caregiver}
              badge="Verified Pro"
              tone="blue"
            />

            <DetailHeading>Call History</DetailHeading>
            <section className="overflow-hidden rounded-lg border border-[#c5cad8] bg-white text-xs">
              <div className="grid grid-cols-3 bg-[#e8ebf3] px-3 py-2 font-semibold text-[#687184]">
                <span>Time</span>
                <span>Duration</span>
                <span>Type</span>
              </div>
              <CallRow time="10:15" duration="2:14" type="In" tone="green" />
              <CallRow time="09:30" duration="0:45" type="Out" tone="blue" />
              <CallRow time="08:55" duration="--" type="Missed" tone="red" />
            </section>

            <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <b className="flex items-center gap-2 text-xs uppercase">
                <Siren className="size-4" />
                SOS History
              </b>
              <p className="mt-2 text-xs italic">
                No SOS alerts recorded for this pairing in the last 30 days.
              </p>
            </section>
          </div>
          <div className="space-y-2 border-t border-[#c9cfdd] bg-white p-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#0755b7] px-3 py-2.5 text-sm font-semibold text-[#0755b7]"
              type="button"
              onClick={() => flash(`Calling caregiver ${active.caregiver}...`)}
            >
              <Phone className="size-4" />
              Call Caregiver
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#0755b7] px-3 py-2.5 text-sm font-semibold text-[#0755b7]"
              type="button"
              onClick={() => flash(`Calling client ${active.client}...`)}
            >
              <Phone className="size-4" />
              Call Client
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const AvatarPair = ({ conversation }) => (
  <span className="relative h-11 w-12 shrink-0">
    <img
      className="absolute left-0 top-0 size-9 rounded-full border-2 border-white object-cover"
      src={conversation.clientImage}
      alt=""
    />
    <img
      className="absolute bottom-0 right-0 size-8 rounded-full border-2 border-white object-cover"
      src={conversation.caregiverImage}
      alt=""
    />
  </span>
);

const ChatMessage = ({ message, onDownload }) => {
  if (message.system)
    return (
      <div className="flex items-center gap-3 text-[10px] text-[#a0a7b4]">
        <span className="h-px flex-1 bg-[#c9cfdd]" />
        {message.text}
        <span className="h-px flex-1 bg-[#c9cfdd]" />
      </div>
    );
  const right = message.side === "right";
  return (
    <div className={`flex flex-col ${right ? "items-end" : "items-start"}`}>
      <small className="mb-1 px-2 text-[10px] font-semibold uppercase text-[#687184]">
        {message.author} ({message.role})
      </small>
      {message.file ? (
        <button
          className="flex w-full max-w-sm items-center gap-3 rounded-lg border border-[#c5cad8] bg-white p-3 text-left shadow-sm"
          type="button"
          onClick={onDownload}
        >
          <span className="grid size-10 place-items-center rounded bg-red-100 text-red-700">
            <FileText className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <b className="block truncate text-xs">{message.file}</b>
            <small className="text-[#687184]">{message.size} · PDF</small>
          </span>
          <Download className="size-4 text-[#0755b7]" />
        </button>
      ) : (
        <div
          className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-5 sm:max-w-[72%] ${right ? "rounded-br-sm bg-[#1265c4] text-white" : "rounded-bl-sm border border-[#c5cad8] bg-white"}`}
        >
          {message.text}
        </div>
      )}
      <small className="mt-1 px-2 text-[10px] text-[#7b8291]">
        {message.time}
      </small>
    </div>
  );
};

const DetailHeading = ({ children }) => (
  <h2 className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#687184]">
    {children}
  </h2>
);
const Participant = ({ image, name, badge, tone }) => (
  <div className="flex items-center gap-3">
    <img className="size-10 rounded-full object-cover" src={image} alt="" />
    <span>
      <b className="block text-sm">{name}</b>
      <small
        className={`rounded px-2 py-0.5 text-[9px] font-semibold ${tone === "green" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-[#0755b7]"}`}
      >
        {badge}
      </small>
    </span>
    <ShieldCheck className="ml-auto size-4 text-emerald-600" />
  </div>
);
const CallRow = ({ time, duration, type, tone }) => (
  <div className="grid grid-cols-3 border-t border-[#d8dde7] px-3 py-2.5">
    <b>{time}</b>
    <span>{duration}</span>
    <span
      className={`w-fit rounded px-1.5 text-[9px] font-semibold uppercase ${tone === "green" ? "bg-emerald-100 text-emerald-700" : tone === "blue" ? "bg-blue-100 text-[#0755b7]" : "bg-red-100 text-red-700"}`}
    >
      {type}
    </span>
  </div>
);

export default AdminMessages;
