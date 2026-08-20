import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BarikoiMap from "../../../components/maps/BarikoiMap";
import {
  confirmMyAssignment,
  getMyAssignment,
} from "../../../services/assignmentService";
import {
  getBrowserLocation,
  getMapRoute,
} from "../../../services/mapService";

const ageFrom = (dateOfBirth) => {
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "Not recorded";
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  ) age -= 1;
  return `${age} years`;
};

const formatVisit = (visit) =>
  new Date(`${visit.date}T00:00:00`).toLocaleDateString("en-BD", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const CaregiverClientDetail = () => {
  const { clientId: assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [routing, setRouting] = useState(false);

  useEffect(() => {
    let active = true;
    getMyAssignment(assignmentId)
      .then((record) => {
        if (active) setAssignment(record);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [assignmentId]);

  const confirm = async () => {
    setWorking(true);
    setError("");
    try {
      setAssignment(await confirmMyAssignment(assignmentId));
    } catch (confirmError) {
      setError(confirmError.message);
    } finally {
      setWorking(false);
    }
  };

  const showRoute = async () => {
    const destination = {
      latitude: Number(assignment?.client?.latitude),
      longitude: Number(assignment?.client?.longitude),
    };
    if (!Number.isFinite(destination.latitude)
      || !Number.isFinite(destination.longitude)) {
      setError("This client has not pinned a precise service location yet.");
      return;
    }
    setRouting(true);
    setError("");
    try {
      const origin = await getBrowserLocation();
      setCurrentLocation(origin);
      setRoute(await getMapRoute(origin, destination));
    } catch (routeError) {
      setError(routeError.message);
    } finally {
      setRouting(false);
    }
  };

  if (loading) return <div className="grid min-h-[70vh] place-items-center"><LoaderCircle className="size-9 animate-spin text-[#0755d3]" /></div>;
  if (!assignment) return <div className="mx-auto max-w-xl p-8"><p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error || "Assignment not found."}</p></div>;

  const client = assignment.client || {};
  const address = [client.house, client.road, client.area].filter(Boolean).join(", ");
  const clientLocation = Number.isFinite(Number(client.latitude))
    && Number.isFinite(Number(client.longitude))
    ? {
        latitude: Number(client.latitude),
        longitude: Number(client.longitude),
      }
    : null;
  const upcoming = (assignment.visits || []).filter((visit) => visit.status === "scheduled").slice(0, 8);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#101c2d]">
      <header className="flex h-16 items-center border-b border-[#c5cad8] bg-white px-4 sm:px-8">
        <Link className="flex items-center gap-3 text-[#0649ad]" to="/caregiver/assigned-clients"><ArrowLeft className="size-5" /><b className="text-lg sm:text-2xl">SwiftOpsBD</b></Link>
        <span className="ml-auto rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#0649ad]">{assignment.status.replaceAll("_", " ")}</span>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-7 sm:px-8 sm:py-10">
        {error && <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <span className="grid size-24 shrink-0 place-items-center rounded-2xl bg-[#dce8ff] text-4xl font-bold text-[#0649ad] shadow sm:size-28">{client.fullName?.slice(0, 1) || "C"}</span>
            <div><h1 className="text-2xl font-bold sm:text-4xl">{client.fullName}</h1><p className="mt-2 flex items-center gap-2 text-[#4c5261]"><BadgeCheck className="size-5 text-emerald-700" />Verified client · {client.area}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex lg:ml-auto">
            <Link className="flex items-center justify-center gap-2 rounded-xl bg-[#dce8ff] px-5 py-3 font-semibold text-[#0649ad]" to="/caregiver/notifications"><MessageSquare className="size-5" />Message</Link>
            <a className="flex items-center justify-center gap-2 rounded-xl bg-[#dce8ff] px-5 py-3 font-semibold text-[#0649ad]" href={`tel:${client.phone}`}><Phone className="size-5" />Call</a>
            {assignment.status === "pending_confirmation" ? (
              <button className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white disabled:opacity-60" type="button" disabled={working} onClick={confirm}>{working ? <LoaderCircle className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}Confirm assignment</button>
            ) : (
              <Link className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#0649ad] px-6 py-3 font-semibold text-white" to={`/caregiver/visit/${assignment.assignmentId}`}><PlayCircle className="size-5" />Start Visit</Link>
            )}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <section className="rounded-2xl border border-[#d6dbe8] bg-white p-6">
            <h2 className="text-xl font-semibold text-[#0649ad]">Personal Information</h2>
            <dl className="mt-4 divide-y">
              <Detail label="Date of birth" value={client.dateOfBirth || "Not recorded"} />
              <Detail label="Age" value={ageFrom(client.dateOfBirth)} />
              <Detail label="Gender" value={client.gender || "Not recorded"} />
              <Detail label="Verification" value={client.verified ? "Verified" : "Pending"} />
              <Detail label="Phone" value={client.phone || "Not recorded"} />
            </dl>
          </section>
          <section className="rounded-2xl border border-[#d6dbe8] bg-white p-6">
            <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-semibold text-[#0649ad]">Care Plan</h2><span className="ml-auto rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold text-amber-900">{assignment.careType}</span></div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <article className="rounded-xl bg-[#eef3ff] p-4"><small className="uppercase tracking-wider text-[#4c5261]">Care tasks</small><ul className="mt-3 space-y-2 text-sm">{assignment.tasks.map((task) => <li className="flex items-center gap-2" key={task}><CheckCircle2 className="size-4 text-emerald-700" />{task}</li>)}</ul></article>
              <article className="rounded-xl bg-[#eef3ff] p-4"><small className="uppercase tracking-wider text-[#4c5261]">Weekly schedule</small><p className="mt-3 font-semibold">{assignment.hoursPerWeek} hours per week</p><p className="mt-2 text-sm">{assignment.preferredDays.join(", ")}</p><p className="mt-2 flex items-center gap-2 text-sm"><Clock3 className="size-4 text-[#0755d3]" />{assignment.preferredStartTime || assignment.preferredTime}</p><p className="mt-2 text-xs text-[#606878]">Starts {assignment.serviceStartDate || "after confirmation"}</p></article>
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <article className="overflow-hidden rounded-2xl border border-[#d6dbe8] bg-white">
            <div className="p-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-[#0649ad]"><MapPin className="size-5" />Address &amp; Location</h2>
              <p className="mt-2 text-sm text-[#4c5261]">{address || "Location not provided"}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  className="flex items-center gap-2 rounded-lg bg-[#0649ad] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  type="button"
                  disabled={routing || !clientLocation}
                  onClick={showRoute}
                >
                  <Navigation className="size-4" />
                  {routing ? "Finding route..." : "Route from my location"}
                </button>
                {route && (
                  <span className="text-sm font-semibold text-emerald-700">
                    {(route.distanceMeters / 1000).toFixed(1)} km · {Math.ceil(route.durationSeconds / 60)} min
                  </span>
                )}
              </div>
            </div>
            <div className="relative h-80 bg-[#eef3ff]">
              <BarikoiMap
                center={clientLocation}
                markers={[
                  ...(clientLocation ? [{ ...clientLocation, label: client.fullName }] : []),
                  ...(currentLocation ? [{ ...currentLocation, label: "Your location" }] : []),
                ]}
                routeGeometry={route?.geometry}
                interactive
                className="h-full w-full"
                zoom={clientLocation ? 14 : 11}
              />
              {!clientLocation && <span className="absolute bottom-4 left-4 right-4 rounded-lg bg-white px-4 py-3 text-center text-xs shadow">The client must pin a precise location before routing is available.</span>}
            </div>
          </article>
          <article className="rounded-2xl border border-[#d6dbe8] bg-white p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#0649ad]"><CalendarDays className="size-5" />Upcoming Visits</h2>
            <div className="mt-5 space-y-3">
              {upcoming.map((visit) => <div className="rounded-xl border border-[#d6dbe8] p-4" key={visit.visitId}><div className="flex justify-between gap-4"><b>{formatVisit(visit)}</b><span className="text-sm font-semibold text-[#0649ad]">{visit.scheduledStartLocal}–{visit.scheduledEndLocal}</span></div><p className="mt-1 text-xs text-[#687184]">{visit.durationHours} hours · {visit.confirmationStatus}</p></div>)}
              {upcoming.length === 0 && <p className="rounded-xl border border-dashed p-6 text-center text-sm text-[#687184]">No upcoming visits generated.</p>}
            </div>
          </article>
        </section>

        <footer className="mt-8 flex items-center justify-center gap-2 border-t py-6 text-xs tracking-widest text-[#687184]"><ShieldCheck className="size-5 text-[#0649ad]" />PRIVATE ASSIGNMENT DATA</footer>
      </main>
    </div>
  );
};

const Detail = ({ label, value }) => <div className="flex items-center justify-between gap-5 py-4"><dt className="text-sm text-[#4c5261]">{label}</dt><dd className="text-right text-sm font-semibold">{value}</dd></div>;

export default CaregiverClientDetail;
