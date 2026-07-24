import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock3,
  MapPin,
  MessageSquare,
  Phone,
  Route,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import caregiverKelly from "../../assets/caregiver-kelly.jpg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareKelly from "../../assets/find-care-kelly.jpg";
import findCareSarah from "../../assets/find-care-sarah.jpg";
import mapImage from "../../assets/find-care-map.jpg";

const requests = [
  {
    id: 1,
    name: "Mrs. Rabeya Begum",
    image: findCareSarah,
    age: 72,
    area: "Dhanmondi",
    address: "House 42, Road 15, Dhanmondi R/A, Dhaka 1209",
    rate: "৳850/Visit",
    care: "Dementia Care",
    status: "Open",
    ago: "2h ago",
    tone: "red",
  },
  {
    id: 2,
    name: "Mr. Kamal Ahmed",
    image: findCareKelly,
    age: 68,
    area: "Uttara Sector 4",
    address: "Sector 4, Uttara, Dhaka",
    rate: "৳1,200/Visit",
    care: "Post-Surgery",
    status: "Open",
    ago: "4h ago",
    tone: "amber",
  },
  {
    id: 3,
    name: "Begum Sufia",
    image: caregiverSarah,
    age: 80,
    area: "Gulshan 2",
    address: "Gulshan 2, Dhaka",
    rate: "৳750/Visit",
    care: "Elder Care",
    status: "Assigned",
    ago: "5h ago",
    tone: "green",
  },
  {
    id: 4,
    name: "Dr. Mansur Ali",
    image: caregiverKelly,
    age: 75,
    area: "Banani",
    address: "Block E, Banani, Dhaka",
    rate: "৳900/Visit",
    care: "Chronic Care",
    status: "Accepted",
    ago: "Yesterday",
    tone: "blue",
  },
  {
    id: 5,
    name: "Mrs. Salma Begum",
    image: caregiverSarah,
    age: 68,
    area: "Uttara",
    address: "Uttara Sector 4, Dhaka",
    rate: "৳1,100/Visit",
    care: "Post-Surgery",
    status: "Declined",
    ago: "2h ago",
    tone: "amber",
  },
];

const toneClasses = {
  red: "bg-red-600",
  amber: "bg-amber-600",
  green: "bg-emerald-600",
  blue: "bg-blue-700",
};

const AdminRequestsMatching = () => {
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(1);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [assignedId, setAssignedId] = useState(1);
  const [notice, setNotice] = useState("");
  const selected =
    requests.find((request) => request.id === selectedId) ?? requests[0];
  const visibleRequests = useMemo(
    () =>
      filter === "All"
        ? requests
        : requests.filter((request) => request.status === filter),
    [filter],
  );

  const selectRequest = (id) => {
    setSelectedId(id);
    setMobileDetail(true);
    setNotice("");
  };
  const act = (message) => setNotice(message);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f2f5fd] lg:h-[calc(100vh-64px)] lg:min-h-0 lg:overflow-hidden">
      <div className="grid min-h-[calc(100vh-64px)] lg:h-full lg:min-h-0 lg:grid-cols-[330px_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[330px_minmax(0,1fr)_300px]">
        <aside
          className={`${mobileDetail ? "hidden lg:flex" : "block lg:flex"} border-r border-[#c5cad8] bg-white lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden`}
        >
          <header className="border-b border-[#c5cad8] p-4">
            <h1 className="text-lg font-semibold">
              Care Requests <span className="text-[#0755d3]">(17 open)</span>
            </h1>
            <div className="hide-scrollbar mt-3 flex overflow-x-auto">
              {["All", "Open", "Assigned", "Accepted", "Declined"].map(
                (item) => (
                  <button
                    className={`border-b-2 px-3 py-2 text-xs ${filter === item ? "border-[#0755d3] font-semibold text-[#0649ad]" : "border-transparent text-[#515867]"}`}
                    type="button"
                    key={item}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </header>
          <div className="hide-scrollbar space-y-2 overflow-y-auto p-3 lg:min-h-0 lg:flex-1">
            {visibleRequests.map((request) => (
              <RequestCard
                request={request}
                selected={request.id === selectedId}
                key={request.id}
                onClick={() => selectRequest(request.id)}
              />
            ))}
          </div>
        </aside>

        <main
          className={`${mobileDetail ? "block lg:flex" : "hidden lg:flex"} min-w-0 lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden`}
        >
          <div className="hide-scrollbar p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            <button
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0649ad] lg:hidden"
              type="button"
              onClick={() => setMobileDetail(false)}
            >
              <ArrowLeft className="size-4" /> Back to requests
            </button>
            {notice && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <Check className="size-4" /> {notice}
              </div>
            )}
            <ClientSummary request={selected} />
            <section className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
              <p className="italic leading-7">
                “Sarah is amazing! She is very interactive with the family. We
                are looking for someone with that same professional warmth for{" "}
                {selected.name}.”
              </p>
              <b className="mt-4 block text-sm">
                — Jennifer M. (Family Daughter)
              </b>
            </section>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <CareNeeds />
              <Schedule />
            </div>
            <SuggestedCaregivers
              assignedId={assignedId}
              onAssign={setAssignedId}
            />
            <div className="mt-5 xl:hidden">
              <LocationReliability request={selected} />
            </div>
          </div>
          <ActionBar onAction={act} />
        </main>

        <aside className="hidden h-full overflow-hidden border-l border-[#c5cad8] bg-[#f7f8fd] p-5 xl:block">
          <LocationReliability request={selected} />
        </aside>
      </div>
    </div>
  );
};

const RequestCard = ({ request, selected, onClick }) => (
  <button
    className={`w-full rounded-lg border p-3 text-left transition ${selected ? "border-[#0755d3] bg-blue-50 shadow-sm" : "border-[#c5cad8] bg-white hover:border-blue-300"}`}
    type="button"
    onClick={onClick}
  >
    <div className="flex items-start gap-3">
      <img
        className="size-10 rounded-lg object-cover"
        src={request.image}
        alt=""
      />
      <div className="min-w-0 flex-1">
        <b className="block truncate text-sm">{request.name}</b>
        <small className="text-[#606878]">
          {request.age} Years • {request.area}
        </small>
      </div>
      <span
        className={`rounded px-2 py-1 text-[8px] font-semibold uppercase text-white ${toneClasses[request.tone]}`}
      >
        {request.care}
      </span>
    </div>
    <div className="mt-3 flex items-center gap-3 text-xs">
      <span className="flex items-center gap-1 text-[#515867]">
        <MapPin className="size-3" /> {request.area}
      </span>
      <b className="text-emerald-700">{request.rate}</b>
      <small className="ml-auto text-[#606878]">{request.ago}</small>
    </div>
  </button>
);

const ClientSummary = ({ request }) => (
  <section className="rounded-xl border border-[#c5cad8] bg-white p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <img
        className="size-20 rounded-xl object-cover"
        src={request.image}
        alt=""
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold">{request.name}</h2>
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-semibold uppercase text-emerald-700">
            <BadgeCheck className="size-3" /> Verified NID
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <span
            className={`rounded px-2 py-1 text-[9px] font-semibold uppercase text-white ${toneClasses[request.tone]}`}
          >
            {request.care}
          </span>
          <span className="flex items-center gap-1 text-[#515867]">
            <MapPin className="size-4 text-[#0755d3]" /> {request.area}
          </span>
          <span>{request.age} Years Old</span>
          <b className="text-emerald-700">{request.rate}</b>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="grid size-10 place-items-center rounded-lg border border-[#b7c1d3] text-[#0755d3]"
          type="button"
        >
          <Phone className="size-5" />
        </button>
        <button
          className="grid size-10 place-items-center rounded-lg border border-[#b7c1d3] text-[#0755d3]"
          type="button"
        >
          <MessageSquare className="size-5" />
        </button>
      </div>
    </div>
  </section>
);

const CareNeeds = () => (
  <section className="rounded-xl border border-[#c5cad8] bg-white p-5">
    <h3 className="flex items-center gap-2 font-semibold">
      <ShieldCheck className="size-5 text-[#0755d3]" /> Clinical Care Needs
    </h3>
    <ul className="mt-4 space-y-3 text-sm text-[#515867]">
      {[
        "Help with mobility",
        "Medication reminders",
        "Light meal preparation",
      ].map((need) => (
        <li className="flex items-center gap-3" key={need}>
          <Check className="size-5 rounded-full bg-blue-100 p-1 text-[#0755d3]" />{" "}
          {need}
        </li>
      ))}
    </ul>
  </section>
);
const Schedule = () => (
  <section className="rounded-xl border border-[#c5cad8] bg-white p-5">
    <div className="flex items-center">
      <h3 className="flex items-center gap-2 font-semibold">
        <Clock3 className="size-5 text-[#0755d3]" /> Schedule Details
      </h3>
      <span className="ml-auto rounded border border-blue-200 px-2 py-1 text-xs font-semibold text-[#0755d3]">
        09:00 - 12:00
      </span>
    </div>
    <div className="mt-5 grid grid-cols-7 gap-1">
      {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
        <div className="text-center" key={`${day}-${index}`}>
          <small>{day}</small>
          <span
            className={`mt-2 grid h-10 place-items-center rounded ${[0, 2, 4].includes(index) ? "bg-[#0755d3] text-xs font-semibold text-white" : "border border-[#c5cad8] bg-[#f3f4f8]"}`}
          >
            {[0, 2, 4].includes(index) ? "ON" : ""}
          </span>
        </div>
      ))}
    </div>
  </section>
);

const SuggestedCaregivers = ({ assignedId, onAssign }) => {
  const matches = [
    {
      id: 1,
      name: "Farhana Akhter",
      image: caregiverSarah,
      distance: "1.2 km away",
      rating: "4.9 (120)",
      match: 98,
      skill: "Specialized in dementia",
    },
    {
      id: 2,
      name: "Tanvir Hasan",
      image: caregiverKelly,
      distance: "2.5 km away",
      rating: "4.8 (85)",
      match: 92,
      skill: "Advanced mobility training",
    },
  ];
  return (
    <section className="mt-5 rounded-xl border border-[#c5cad8] bg-white p-5">
      <h3 className="text-lg font-semibold">Suggested Caregivers</h3>
      <div className="mt-4 space-y-3">
        {matches.map((caregiver) => (
          <article
            className="flex flex-col gap-3 rounded-lg border border-[#c5cad8] bg-[#f8faff] p-4 sm:flex-row sm:items-center"
            key={caregiver.id}
          >
            <img
              className="size-12 rounded-lg object-cover"
              src={caregiver.image}
              alt=""
            />
            <div className="min-w-0 flex-1">
              <b className="block">{caregiver.name}</b>
              <small className="text-[#606878]">
                {caregiver.distance} • ⭐ {caregiver.rating}
              </small>
            </div>
            <div className="sm:text-right">
              <b className="block text-xl text-[#0755d3]">
                {caregiver.match}% Match
              </b>
              <small className="uppercase text-[#606878]">
                {caregiver.skill}
              </small>
            </div>
            <button
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${assignedId === caregiver.id ? "bg-[#0755d3] text-white" : "border border-[#0755d3] text-[#0649ad]"}`}
              type="button"
              onClick={() => onAssign(caregiver.id)}
            >
              {assignedId === caregiver.id ? "Assigned ✓" : "Assign"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

const LocationReliability = ({ request }) => (
  <div className="space-y-5">
    <section className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
      <div className="relative h-44">
        <img
          className="h-full w-full object-cover"
          src={mapImage}
          alt={`Map of ${request.area}`}
        />
        <span className="absolute inset-0 grid place-items-center">
          <MapPin className="size-10 fill-red-500 text-white drop-shadow" />
        </span>
      </div>
      <div className="p-4">
        <p className="flex gap-2 text-sm leading-6 text-[#515867]">
          <MapPin className="mt-1 size-4 shrink-0 text-[#0755d3]" />{" "}
          {request.address}
        </p>
        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#c5cad8] bg-[#f1f3fa] py-2.5 text-sm font-semibold"
          type="button"
        >
          <Route className="size-4" /> View Route Map
        </button>
      </div>
    </section>
    <section className="rounded-xl border border-[#c5cad8] bg-white p-5">
      <h3 className="font-semibold uppercase tracking-[.08em]">
        Urgency & Reliability
      </h3>
      <Reliability
        color="bg-blue-500"
        title="New request (2h ago)"
        detail="System flag: Priority 2"
      />
      <Reliability
        color="bg-emerald-500"
        title="Verified Home Environment"
        detail="Field check completed"
      />
      <Reliability
        color="bg-red-600"
        title="High reliability score required"
        detail="Dementia history requires punctuality"
      />
    </section>
  </div>
);
const Reliability = ({ color, title, detail }) => (
  <div className="relative mt-5 border-l-2 border-[#dce2ee] pb-3 pl-5 last:pb-0">
    <span
      className={`absolute -left-[7px] top-1 size-3 rounded-full ring-4 ring-white ${color}`}
    />
    <b className="block text-sm">{title}</b>
    <small className="uppercase text-[#606878]">{detail}</small>
  </div>
);

const ActionBar = ({ onAction }) => (
  <section className="sticky bottom-0 z-20 mt-6 grid grid-cols-2 gap-2 border-t border-[#c5cad8] bg-white/95 p-3 shadow-[0_-5px_16px_rgba(15,23,42,.08)] backdrop-blur sm:flex sm:justify-end sm:p-4 lg:static lg:mt-0 lg:shrink-0">
    <button
      className="rounded-lg border border-[#8c93a2] px-5 py-2.5 font-semibold"
      type="button"
      onClick={() => onAction("Request placed on hold.")}
    >
      Hold
    </button>
    <button
      className="flex items-center justify-center gap-2 rounded-lg border border-red-500 px-5 py-2.5 font-semibold text-red-600"
      type="button"
      onClick={() =>
        onAction("Request declined. This will be saved by the API later.")
      }
    >
      <X className="size-4" /> Decline
    </button>
    <button
      className="rounded-lg border border-[#0755d3] px-5 py-2.5 font-semibold text-[#0649ad]"
      type="button"
      onClick={() => onAction("Manual assignment selected.")}
    >
      Manual Assign
    </button>
    <button
      className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white"
      type="button"
      onClick={() => onAction("Request approved and caregiver matched.")}
    >
      <UserCheck className="size-4" /> Approve & Auto-Match
    </button>
  </section>
);

export default AdminRequestsMatching;
