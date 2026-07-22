import { MapPin, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { requestedClients } from "../../../data/caregiverPortalData";

const CaregiverRequestedClients = () => (
  <div className="mx-auto max-w-[980px] p-5 sm:p-7">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <header>
        <p className="text-sm text-[#4c5261]">
          ● You have <b className="text-[#0649ad]">4 new</b> care requests
          matching your profile.
        </p>
      </header>
      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#0755d3] px-4 py-2 text-sm text-[#0649ad] sm:w-auto"
        type="button"
      >
        <SlidersHorizontal className="size-4" />
        Filter By Proximity
      </button>
    </div>
    <div className="mt-7 grid gap-6 lg:grid-cols-2">
      {requestedClients.map((client) => (
        <article
          className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#c5cad8] bg-white"
          key={client.id}
        >
          <div className="flex flex-wrap items-center gap-3 bg-[#eef2ff] p-4 sm:flex-nowrap sm:gap-4 sm:p-5">
            <img
              className="size-14 rounded-full object-cover"
              src={client.image}
              alt=""
            />
            <div>
              <h2 className="text-xl font-semibold">{client.name}</h2>
              <p className="text-xs uppercase tracking-[.08em] text-[#747b8a]">
                {client.age} years • {client.gender}
              </p>
            </div>
            <span className="rounded-full bg-[#9df2c8] px-3 py-1 text-[10px] font-semibold uppercase sm:ml-auto">
              {client.care}
            </span>
          </div>
          <div className="grid flex-1 content-start gap-4 p-5 text-sm sm:grid-cols-2 sm:p-6">
            <div>
              <b className="block text-xs uppercase text-[#4c5261]">Location</b>
              <span className="flex gap-1 font-semibold">
                <MapPin className="size-4 text-[#0755d3]" />
                {client.area}
              </span>
            </div>
            <div>
              <b className="block text-xs uppercase text-[#4c5261]">Pay Rate</b>
              <span className="font-semibold text-emerald-700">
                {client.rate}
              </span>
            </div>
            <div className="sm:col-span-2">
              <b className="block text-xs uppercase text-[#4c5261]">
                Requested Schedule
              </b>
              <div className="mt-2 flex flex-wrap gap-2">
                {client.schedule.map((item) => (
                  <span
                    className="rounded bg-[#dce8ff] px-3 py-1 text-xs"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-3 border-t border-[#c5cad8] p-4 sm:grid-cols-2">
            <Link
              className="rounded-lg border border-[#c5cad8] px-4 py-3 text-center font-semibold"
              to={`/caregiver/requested-clients/${client.id}`}
            >
              Details
            </Link>
            <button
              className="rounded-lg bg-[#0649ad] px-4 py-3 font-semibold text-white"
              type="button"
            >
              Accept Request
            </button>
          </div>
        </article>
      ))}
    </div>
  </div>
);
export default CaregiverRequestedClients;
