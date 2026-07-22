import {
  Accessibility,
  BadgeCheck,
  CheckCircle2,
  Map,
  MapPin,
  MessageSquare,
  Phone,
  Pill,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import mapImage from "../../../assets/find-care-map.jpg";
import { requestedClients } from "../../../data/caregiverPortalData";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CaregiverRequestDetail = () => {
  const { clientId } = useParams();
  const [notice, setNotice] = useState("");
  const client = requestedClients.find((item) => item.id === clientId) ?? requestedClients[0];
  const requestedDays = client.schedule.some((item) => item.startsWith("Daily"))
    ? weekDays
    : client.schedule.map((item) => item.slice(0, 3));
  const standardShift = client.schedule[0]?.match(/\((.*?)\)/)?.[1] ?? "09:00 - 12:00";
  const visitRate = client.rate.replace(" / Visit", "");

  const respond = (response) => {
    setNotice(
      response === "accept"
        ? `${client.name}'s request has been selected for acceptance. The API will save this decision later.`
        : `${client.name}'s request has been selected for decline. The API will save this decision later.`,
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f7ff]">
      <div className="mx-auto grid max-w-[1020px] gap-6 px-4 py-6 sm:px-5 sm:py-8 lg:grid-cols-[1fr_300px] lg:gap-8">
        <div className="space-y-6">
          {notice && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <CheckCircle2 className="size-5 shrink-0" /> {notice}
            </div>
          )}

          <section className="relative overflow-hidden rounded-2xl border border-[#c5cad8] bg-white p-4 sm:p-7">
            <span className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#f5f7fc]" />
            <div className="relative flex flex-col gap-7 sm:flex-row">
              <div className="relative shrink-0 self-start">
                <img className="size-36 rounded-xl object-cover shadow-md sm:h-48 sm:w-48" src={client.image} alt={client.name} />
                <span className="absolute -bottom-3 -right-3 flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow">
                  <BadgeCheck className="size-4" /> Verified
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start gap-3">
                  <h1 className="text-xl font-bold">{client.name}</h1>
                  <span className="rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase text-amber-700 sm:ml-auto">{client.care}</span>
                </div>
                <p className="mt-4 flex items-center gap-1 text-[#4c5261]"><MapPin className="size-4 text-[#0649ad]" /> {client.area}</p>
                <p className="mt-4 text-[#4c5261]">{client.age} Years Old, {client.gender}</p>
                <p className="mt-4 flex items-center gap-2 border-b border-[#c5cad8] pb-4 text-[#4c5261]">
                  NID: 1952-XXXX-XXXX-XX
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-800">Verified</span>
                </p>
                <div className="mt-4 flex items-end gap-3">
                  <div><small className="block font-semibold uppercase tracking-[0.1em] text-[#4c5261]">Rate</small><b className="text-3xl text-[#0649ad]">{visitRate}</b></div>
                  <span className="mb-1 text-sm text-[#4c5261]">/ Visit</span>
                  <a className="ml-auto grid size-11 place-items-center rounded-lg border border-[#c5cad8] text-[#0649ad]" href="tel:+8801700000000" aria-label={`Call ${client.name}`}><Phone className="size-5" /></a>
                  <button className="grid size-11 place-items-center rounded-lg border border-[#c5cad8] text-[#0649ad]" type="button" aria-label={`Message ${client.name}`}><MessageSquare className="size-5" /></button>
                </div>
              </div>
            </div>
          </section>

          <div className="lg:hidden">
            <LocationCard client={client} />
          </div>

          <section className="relative overflow-hidden rounded-2xl border border-[#b7d795] bg-[#edffd1] p-5 sm:p-8">
            <span className="absolute right-7 top-2 text-7xl font-serif text-[#cde7a7]">”</span>
            <h2 className="font-semibold">Family Notes</h2>
            <blockquote className="relative mt-5 text-base italic leading-7 sm:text-lg sm:leading-8">“Sarah is amazing! She is very interactive with the family. We are looking for someone with that same professional warmth for {client.name}.”</blockquote>
            <div className="mt-6 flex flex-wrap items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#0649ad] text-xs font-semibold text-white">JM</span><b className="text-[#0649ad]">Jennifer M.</b><span className="text-sm text-[#4c5261]">— Family Daughter</span></div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[#c5cad8] bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4c5261]">Clinical Care Needs</h2>
              <CareNeed icon={Accessibility} label="Help with mobility" tone="blue" />
              <CareNeed icon={Pill} label="Medication reminders" tone="purple" />
              <CareNeed icon={Utensils} label="Light meal preparation" tone="orange" />
            </section>
            <section className="rounded-2xl border border-[#c5cad8] bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4c5261]">Schedule Details</h2>
              <div className="mt-5 rounded-xl bg-[#dce8ff] p-4"><small className="font-semibold uppercase text-[#4c5261]">Standard Shift</small><b className="mt-2 block font-medium text-[#0649ad]">{standardShift}</b></div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {weekDays.map((day) => <span className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${requestedDays.includes(day) ? "bg-[#0649ad] text-white" : "bg-[#f2f3f7] text-[#4c5261]"}`} key={day}>{day}</span>)}
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="hidden lg:block">
            <LocationCard client={client} />
          </div>
          <section className="rounded-2xl border border-[#b8cae9] bg-[#dce8ff] p-6">
            <h2 className="font-semibold">Urgency &amp; Reliability</h2>
            <StatusDot color="bg-emerald-700" label="New request (2h ago)" />
            <StatusDot color="bg-[#0649ad]" label="Verified Home Environment" />
            <StatusDot color="bg-red-600" label="High reliability score required" />
          </section>
        </aside>
      </div>

      <footer className="sticky bottom-0 z-30 flex w-full flex-col gap-3 border-t border-[#c5cad8] bg-white px-4 py-3 shadow-[0_-6px_20px_rgba(15,23,42,.06)] sm:flex-row sm:items-center sm:px-5 sm:py-4">
        <div><b>Reviewing {client.name}</b><small className="block text-[#4c5261]">Decide by Friday, 10:00 AM</small></div>
        <div className="grid grid-cols-2 gap-3 sm:ml-auto sm:flex sm:gap-4"><button className="min-w-0 rounded-xl border-2 border-[#777e8c] px-4 py-3 font-semibold text-[#4c5261] sm:min-w-32 sm:px-6" type="button" onClick={() => respond("decline")}>Decline</button><button className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-[#0649ad] px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 sm:min-w-60 sm:gap-3 sm:px-8" type="button" onClick={() => respond("accept")}><CheckCircle2 className="hidden size-5 min-[380px]:block" /> Accept Request</button></div>
      </footer>
    </div>
  );
};

const CareNeed = ({ icon: Icon, label, tone }) => {
  const tones = { blue: "bg-blue-50 text-blue-600", purple: "bg-purple-50 text-purple-600", orange: "bg-orange-50 text-orange-600" };
  return <div className="mt-5 flex items-center gap-4"><span className={`grid size-10 place-items-center rounded-full ${tones[tone]}`}><Icon className="size-5" /></span><span>{label}</span></div>;
};

const StatusDot = ({ color, label }) => <p className="mt-5 flex items-center gap-3 text-sm"><span className={`size-2 rounded-full ${color}`} /> {label}</p>;

const LocationCard = ({ client }) => (
  <section className="overflow-hidden rounded-2xl border border-[#c5cad8] bg-white">
    <div className="relative h-48 overflow-hidden">
      <img
        className="h-full w-full object-cover opacity-70"
        src={mapImage}
        alt={`Map of ${client.area}`}
      />
      <span className="absolute inset-0 grid place-items-center bg-white/25">
        <span className="grid size-12 place-items-center rounded-full border-4 border-white bg-[#0649ad] text-white shadow-lg">
          <MapPin className="size-6" />
        </span>
      </span>
    </div>
    <div className="p-5 sm:p-6">
      <p className="leading-6 text-[#4c5261]">
        Located in {client.area}, near the main road. Easy access via local
        transport.
      </p>
      <button
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0649ad] px-4 py-3 font-semibold text-[#0649ad]"
        type="button"
      >
        <Map className="size-5" /> View Route Map
      </button>
    </div>
  </section>
);

export default CaregiverRequestDetail;
