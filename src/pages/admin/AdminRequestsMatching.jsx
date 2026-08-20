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
import { useEffect, useMemo, useState } from "react";
import caregiverKelly from "../../assets/caregiver-kelly.jpg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareKelly from "../../assets/find-care-kelly.jpg";
import findCareSarah from "../../assets/find-care-sarah.jpg";
import BarikoiMap from "../../components/maps/BarikoiMap";
import {
  getAdminCareRequest,
  listAdminCareRequests,
  reconcilePaidCareRequests,
  updateAdminCareRequest,
} from "../../services/careRequestService";

const requestVisuals = [
  {
    id: 1,
    name: "Mrs. Rabeya Begum",
    image: findCareSarah,
    age: 72,
    area: "Dhanmondi",
    address: "House 42, Road 15, Dhanmondi R/A, Dhaka 1209",
    rate: "$850/Visit",
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
    rate: "$1,200/Visit",
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
    rate: "$750/Visit",
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
    rate: "$900/Visit",
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
    rate: "$1,100/Visit",
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

const statusLabel = (status) =>
  ({
    open: "Open",
    held: "Held",
    assigned: "Assigned",
    declined: "Declined",
    cancelled: "Cancelled",
  })[status] || status;

const adaptRequest = (request, index = 0) => ({
  ...request,
  id: request.requestId,
  name: request.client?.fullName || "Client",
  image:
    request.client?.photoURL ||
    requestVisuals[index % requestVisuals.length].image,
  age: request.client?.age ?? "—",
  area: request.client?.area || "Dhaka",
  latitude: Number(request.client?.latitude) || null,
  longitude: Number(request.client?.longitude) || null,
  address: [
    request.client?.house,
    request.client?.road,
    request.client?.area,
    "Dhaka",
  ].filter(Boolean).join(", "),
  rate: request.requestedCaregiver?.rate
    ? `$${request.requestedCaregiver.rate.toLocaleString()}/Visit`
    : request.budgetRange,
  care: request.careType,
  status: statusLabel(request.status),
  ago: request.createdAt
    ? new Date(request.createdAt).toLocaleDateString()
    : "New",
  tone: request.careType?.includes("Nursing") ? "blue" : "green",
  billing: request.billing || null,
});

const AdminRequestsMatching = () => {
  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [assignedId, setAssignedId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const loadRequests = async (preserveSelection = true) => {
    setLoading(true);
    try {
      await reconcilePaidCareRequests();
      const records = await listAdminCareRequests();
      const adapted = records.map(adaptRequest);
      setRequests(adapted);
      setError("");
      setSelectedId((current) =>
        preserveSelection && adapted.some((item) => item.id === current)
          ? current
          : adapted[0]?.id || "",
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    reconcilePaidCareRequests()
      .then(() => listAdminCareRequests())
      .then((records) => {
        if (!active) return;
        const adapted = records.map(adaptRequest);
        setRequests(adapted);
        setSelectedId(adapted[0]?.id || "");
        setError("");
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!selectedId) {
      return () => {
        active = false;
      };
    }
    getAdminCareRequest(selectedId)
      .then((record) => {
        if (active) {
          const detail = adaptRequest(record);
          setSelectedDetail(detail);
          setAssignedId(
            detail.assignedCaregiverId || detail.matches?.[0]?.caregiverId || "",
          );
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  const selected =
    selectedDetail ||
    requests.find((request) => request.id === selectedId) ||
    null;
  const visibleRequests = useMemo(
    () =>
      filter === "All"
        ? requests
        : requests.filter((request) => request.status === filter),
    [filter, requests],
  );

  const selectRequest = (id) => {
    setSelectedDetail(null);
    setSelectedId(id);
    setMobileDetail(true);
    setNotice("");
  };
  const act = async (action) => {
    if (!selected) return;
    setActing(true);
    setError("");
    try {
      const options =
        ["assign", "auto_match"].includes(action) && assignedId
          ? { caregiverId: assignedId }
          : {};
      const updated = await updateAdminCareRequest(
        selected.id,
        action,
        options,
      );
      const labels = {
        hold: "Request placed on hold.",
        decline: "Request declined.",
        assign: "Caregiver assigned successfully.",
        auto_match: "Request approved and auto-matched.",
      };
      setNotice(labels[action] || "Request updated.");
      await loadRequests();
      const refreshed = adaptRequest(
        await getAdminCareRequest(selected.id),
      );
      setSelectedDetail(refreshed);
      setAssignedId(
        refreshed.assignedCaregiverId ||
        updated.assignment?.caregiverId ||
        "",
      );
      if (["assign", "auto_match"].includes(action)) {
        setFilter("Assigned");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f2f5fd] lg:h-[calc(100vh-64px)] lg:min-h-0 lg:overflow-hidden">
      <div className="grid min-h-[calc(100vh-64px)] lg:h-full lg:min-h-0 lg:grid-cols-[330px_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[330px_minmax(0,1fr)_300px]">
        <aside
          className={`${mobileDetail ? "hidden lg:flex" : "block lg:flex"} border-r border-[#c5cad8] bg-white lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden`}
        >
          <header className="border-b border-[#c5cad8] p-4">
            <h1 className="text-lg font-semibold">
              Care Requests{" "}
              <span className="text-[#0755d3]">
                ({requests.filter((item) => item.status === "Open").length} open)
              </span>
            </h1>
            <div className="hide-scrollbar mt-3 flex overflow-x-auto">
              {["All", "Open", "Held", "Assigned", "Declined"].map(
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
            {loading && (
              <p className="p-5 text-center text-sm text-[#606878]">
                Loading care requests...
              </p>
            )}
            {!loading && requests.length === 0 && (
              <p className="p-5 text-center text-sm text-[#606878]">
                No care requests have been published.
              </p>
            )}
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
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {!selected ? (
              <div className="grid min-h-72 place-items-center rounded-xl border border-[#c5cad8] bg-white p-8 text-center text-sm text-[#606878]">
                Select a care request to review its matching details.
              </div>
            ) : (
              <>
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
              <CareNeeds needs={selected.tasks} />
              <Schedule request={selected} />
            </div>
            {selected.status === "Assigned" ? (
              <AssignedCaregiver request={selected} />
            ) : (
              <SuggestedCaregivers
                assignedId={assignedId}
                onAssign={setAssignedId}
                matches={selected.matches || []}
                requestedCaregiverId={selected.requestedCaregiverId}
              />
            )}
            <div className="mt-5 xl:hidden">
              <LocationReliability request={selected} />
            </div>
              </>
            )}
          </div>
          {selected && selected.status !== "Assigned" && (
            <ActionBar
              onAction={act}
              acting={acting}
              canAssign={Boolean(assignedId)}
            />
          )}
        </main>

        <aside className="hidden h-full overflow-hidden border-l border-[#c5cad8] bg-[#f7f8fd] p-5 xl:block">
          {selected && <LocationReliability request={selected} />}
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
        referrerPolicy="no-referrer"
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
    {request.billing && (
      <p
        className={`mt-2 rounded px-2 py-1 text-[10px] font-semibold ${
          request.billing.depositStatus === "paid"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {request.billing.depositPercent}% deposit: $
        {request.billing.depositAmount.toLocaleString("en-BD")} ·{" "}
        {request.billing.depositStatus}
      </p>
    )}
    {request.status === "Assigned" && (
      <p className="mt-2 rounded bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-800">
        Assigned to: {request.assignedCaregiver?.fullName || "Caregiver"}
      </p>
    )}
  </button>
);

const ClientSummary = ({ request }) => (
  <section className="rounded-xl border border-[#c5cad8] bg-white p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <img
        className="size-20 rounded-xl object-cover"
        src={request.image}
        alt=""
        referrerPolicy="no-referrer"
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
        {request.billing ? (
          <div className="mt-3 flex flex-wrap gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs">
            <b>
              Deposit ({request.billing.depositPercent}%): $
              {request.billing.depositAmount.toLocaleString("en-BD")}
            </b>
            <span
              className={
                request.billing.depositStatus === "paid"
                  ? "font-semibold text-emerald-700"
                  : "font-semibold text-amber-700"
              }
            >
              {request.billing.depositStatus === "paid"
                ? "Paid"
                : "Payment pending"}
            </span>
            <span>
              Total plan: ${request.billing.total.toLocaleString("en-US")}
            </span>
          </div>
        ) : (
          <p className="mt-3 text-xs text-amber-700">
            Billing agreement has not been created.
          </p>
        )}
        {request.requestedCaregiver?.name && (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            Client requested caregiver:{" "}
            <b>{request.requestedCaregiver.name}</b>
          </p>
        )}
        {request.status === "Assigned" &&
          request.assignedCaregiver?.fullName && (
            <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
              Assigned caregiver:{" "}
              <b>{request.assignedCaregiver.fullName}</b>
            </p>
          )}
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

const CareNeeds = ({ needs = [] }) => (
  <section className="rounded-xl border border-[#c5cad8] bg-white p-5">
    <h3 className="flex items-center gap-2 font-semibold">
      <ShieldCheck className="size-5 text-[#0755d3]" /> Clinical Care Needs
    </h3>
    <ul className="mt-4 space-y-3 text-sm text-[#515867]">
      {needs.map((need) => (
        <li className="flex items-center gap-3" key={need}>
          <Check className="size-5 rounded-full bg-blue-100 p-1 text-[#0755d3]" />{" "}
          {need}
        </li>
      ))}
    </ul>
  </section>
);
const Schedule = ({ request }) => (
  <section className="rounded-xl border border-[#c5cad8] bg-white p-5">
    <div className="flex items-center">
      <h3 className="flex items-center gap-2 font-semibold">
        <Clock3 className="size-5 text-[#0755d3]" /> Schedule Details
      </h3>
      <span className="ml-auto rounded border border-blue-200 px-2 py-1 text-xs font-semibold text-[#0755d3]">
        {request.preferredStartTime || request.preferredTime}
      </span>
    </div>
    <div className="mt-5 grid grid-cols-7 gap-1">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <div className="text-center" key={day}>
          <small>{day.slice(0, 1)}</small>
          <span
            className={`mt-2 grid h-10 place-items-center rounded ${request.preferredDays?.includes(day) ? "bg-[#0755d3] text-xs font-semibold text-white" : "border border-[#c5cad8] bg-[#f3f4f8]"}`}
          >
            {request.preferredDays?.includes(day) ? "ON" : ""}
          </span>
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs text-[#606878]">
      Service period: {request.serviceStartDate || "after assignment"}
      {request.serviceEndDate ? ` → ${request.serviceEndDate}` : ""} ·{" "}
      {request.hoursPerWeek || 0} hours per week
    </p>
  </section>
);

const SuggestedCaregivers = ({
  assignedId,
  onAssign,
  matches,
  requestedCaregiverId,
}) => {
  return (
    <section className="mt-5 rounded-xl border border-[#c5cad8] bg-white p-5">
      <h3 className="text-lg font-semibold">Suggested Caregivers</h3>
      <div className="mt-4 space-y-3">
        {matches.map((caregiver) => (
          <article
            className="flex flex-col gap-3 rounded-lg border border-[#c5cad8] bg-[#f8faff] p-4 sm:flex-row sm:items-center"
            key={caregiver.caregiverId}
          >
            <img
              className="size-12 rounded-lg object-cover"
              src={caregiverSarah}
              alt=""
            />
            <div className="min-w-0 flex-1">
              <b className="block">{caregiver.fullName}</b>
              {caregiver.caregiverId === requestedCaregiverId && (
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Client requested
                </span>
              )}
              <small className="block text-[#606878]">
                {caregiver.city || "Dhaka"} •{" "}
                {caregiver.responded ? "Accepted request" : "Available"}
              </small>
            </div>
            <div className="sm:text-right">
              <b className="block text-xl text-[#0755d3]">
                {caregiver.score}% Match
              </b>
              <small className="uppercase text-[#606878]">
                Verified caregiver
              </small>
            </div>
            <button
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${assignedId === caregiver.caregiverId ? "bg-[#0755d3] text-white" : "border border-[#0755d3] text-[#0649ad]"}`}
              type="button"
              onClick={() => onAssign(caregiver.caregiverId)}
            >
              {assignedId === caregiver.caregiverId ? "Selected ✓" : "Select"}
            </button>
          </article>
        ))}
        {matches.length === 0 && (
          <p className="rounded-lg bg-[#f8faff] p-5 text-sm text-[#606878]">
            No approved caregivers are available for matching.
          </p>
        )}
      </div>
    </section>
  );
};

const AssignedCaregiver = ({ request }) => {
  const caregiver = request.assignedCaregiver || {};
  const matchedCaregiver = request.matches?.find(
    (item) => item.caregiverId === request.assignedCaregiverId,
  );
  return (
    <section className="mt-5 rounded-xl border border-emerald-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {(caregiver.photo || matchedCaregiver?.photo) && (
          <img
            className="size-14 rounded-xl object-cover"
            src={caregiver.photo || matchedCaregiver.photo}
            alt={caregiver.fullName || matchedCaregiver?.fullName || ""}
          />
        )}
        <div className="min-w-0 flex-1">
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-700">
            Assignment confirmed
          </span>
          <h3 className="mt-2 text-lg font-semibold">
            {caregiver.fullName || matchedCaregiver?.fullName || "Caregiver"}
          </h3>
          <p className="text-sm text-[#606878]">
            This caregiver is assigned to {request.name}.
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <b className="block">Assigned</b>
          <span>
            {request.assignedAt
              ? new Date(request.assignedAt).toLocaleString()
              : "Assignment active"}
          </span>
        </div>
      </div>
    </section>
  );
};

const LocationReliability = ({ request }) => (
  <div className="space-y-5">
    <section className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
      <div className="relative h-44">
        <BarikoiMap
          className="h-full w-full"
          center={
            request.latitude && request.longitude
              ? {
                  latitude: request.latitude,
                  longitude: request.longitude,
                }
              : null
          }
          markers={
            request.latitude && request.longitude
              ? [{
                  latitude: request.latitude,
                  longitude: request.longitude,
                  label: request.name,
                }]
              : []
          }
          zoom={request.latitude ? 15 : 11}
        />
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

const ActionBar = ({ onAction, acting, canAssign }) => (
  <section className="sticky bottom-0 z-20 mt-6 grid grid-cols-2 gap-2 border-t border-[#c5cad8] bg-white/95 p-3 shadow-[0_-5px_16px_rgba(15,23,42,.08)] backdrop-blur sm:flex sm:justify-end sm:p-4 lg:static lg:mt-0 lg:shrink-0">
    <button
      className="rounded-lg border border-[#8c93a2] px-5 py-2.5 font-semibold"
      type="button"
      disabled={acting}
      onClick={() => onAction("hold")}
    >
      Hold
    </button>
    <button
      className="flex items-center justify-center gap-2 rounded-lg border border-red-500 px-5 py-2.5 font-semibold text-red-600"
      type="button"
      disabled={acting}
      onClick={() => onAction("decline")}
    >
      <X className="size-4" /> Decline
    </button>
    <button
      className="rounded-lg border border-[#0755d3] px-5 py-2.5 font-semibold text-[#0649ad]"
      type="button"
      disabled={acting || !canAssign}
      onClick={() => onAction("assign")}
    >
      Manual Assign
    </button>
    <button
      className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white"
      type="button"
      disabled={acting}
      onClick={() => onAction(canAssign ? "assign" : "auto_match")}
    >
      <UserCheck className="size-4" />{" "}
      {canAssign ? "Approve Selected Caregiver" : "Approve & Auto-Match"}
    </button>
  </section>
);

export default AdminRequestsMatching;
