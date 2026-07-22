import { ArrowRight, MapPin, PlusCircle, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { assignedClients } from "../../../data/caregiverPortalData";

const CaregiverAssignedClients = () => (
  <div className="mx-auto max-w-[1000px] p-5 sm:p-7">
    <header>
      <p className="text-[#4c5261]">
        You have <b>6</b> active patient assignments for this week.
      </p>
    </header>
    <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {assignedClients.map((client) => (
        <article
          className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#c5cad8] bg-white"
          key={client.id}
        >
          <div className="flex flex-1 gap-3 p-4 sm:gap-4 sm:p-5">
            <div className="flex w-20 shrink-0 flex-col items-center">
              <img
                className="size-20 rounded-xl object-cover"
                src={client.image}
                alt={client.name}
              />
              <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-semibold uppercase whitespace-nowrap">
                {client.status}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 min-h-12 text-lg font-semibold leading-6 sm:text-xl">
                {client.name}
              </h2>
              <p className="mt-1 text-xs text-[#4c5261]">
                {client.age} Years · {client.gender}
              </p>
              <span className="mt-2 inline-block rounded bg-[#f1f3fa] px-2 py-1 text-xs">
                {client.care}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-[#c5cad8] bg-[#f1f5ff] p-3 text-xs">
            <MapPin className="mr-1 size-4" />
            {client.area}
            <Link
              className="ml-auto flex items-center whitespace-nowrap font-semibold text-[#0649ad]"
              to={`/caregiver/assigned-clients/${client.id}`}
            >
              View Details <ArrowRight className="size-4" />
            </Link>
          </div>
        </article>
      ))}
      <Link
        className="grid min-h-52 place-items-center rounded-xl border-2 border-dashed border-[#b9c1d3] text-center"
        to="/caregiver/requested-clients"
      >
        <span>
          <PlusCircle className="mx-auto size-9 text-[#0649ad]" />
          <b className="mt-3 block">Accept New Assignment</b>
          <span className="mt-2 block text-sm text-[#4c5261]">
            Browse available open care shifts.
          </span>
        </span>
      </Link>
    </div>
    <section className="mt-12 flex flex-col gap-4 rounded-xl bg-[#3a2100] p-6 text-amber-200 sm:flex-row sm:items-center">
      <TriangleAlert className="size-10" />
      <div>
        <h2 className="text-2xl font-semibold">Unconfirmed Shifts!</h2>
        <p>
          You have 2 pending assignments for next week that require confirmation
          by tonight 8:00 PM.
        </p>
      </div>
      <button
        className="w-full rounded-full bg-[#0755d3] px-7 py-3 font-semibold text-white sm:ml-auto sm:w-auto"
        type="button"
      >
        Confirm Shifts Now
      </button>
    </section>
  </div>
);
export default CaregiverAssignedClients;
