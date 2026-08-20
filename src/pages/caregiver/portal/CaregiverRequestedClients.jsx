import { CheckCircle2, MapPin, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import caregiverKelly from "../../../assets/caregiver-kelly.jpg";
import findCareKelly from "../../../assets/find-care-kelly.jpg";
import findCareSarah from "../../../assets/find-care-sarah.jpg";
import {
  listAvailableCareRequests,
  respondToCareRequest,
} from "../../../services/careRequestService";

const fallbackImages = [findCareSarah, findCareKelly, caregiverKelly];

const scheduleText = (request) =>
  request.preferredDays.map(
    (day) =>
      `${day} (${request.preferredStartTime || request.preferredTime})`,
  );

const CaregiverRequestedClients = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [respondingId, setRespondingId] = useState("");

  useEffect(() => {
    let active = true;
    listAvailableCareRequests()
      .then((records) => {
        if (active) setRequests(records);
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

  const accept = async (request) => {
    setRespondingId(request.requestId);
    setError("");
    try {
      await respondToCareRequest(request.requestId, "accepted");
      setRequests((current) =>
        current.filter((item) => item.requestId !== request.requestId),
      );
      setNotice(
        `${request.client.fullName}'s request was accepted and sent to the admin matching queue.`,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRespondingId("");
    }
  };

  return (
    <div className="mx-auto max-w-[980px] p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <p className="text-sm text-[#4c5261]">
            <span className="text-emerald-700">●</span> You have{" "}
            <b className="text-[#0649ad]">{requests.length} new</b> care
            requests matching your verified profile.
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

      {notice && (
        <p className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="size-5" /> {notice}
        </p>
      )}
      {error && (
        <p className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <p className="mt-7 rounded-xl border bg-white p-8 text-center text-sm text-[#4c5261]">
          Loading available care requests...
        </p>
      )}
      {!loading && !error && requests.length === 0 && (
        <p className="mt-7 rounded-xl border bg-white p-8 text-center text-sm text-[#4c5261]">
          There are no new matching requests right now.
        </p>
      )}

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        {requests.map((request, index) => {
          const rate = request.requestedCaregiver?.rate
            ? `$${request.requestedCaregiver.rate.toLocaleString()} / Visit`
            : "Rate set after review";
          return (
            <article
              className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#c5cad8] bg-white"
              key={request.requestId}
            >
              <div className="flex flex-wrap items-center gap-3 bg-[#eef2ff] p-4 sm:flex-nowrap sm:gap-4 sm:p-5">
                <img
                  className="size-14 rounded-full object-cover"
                  src={fallbackImages[index % fallbackImages.length]}
                  alt=""
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {request.client.fullName}
                  </h2>
                  <p className="text-xs uppercase tracking-[.08em] text-[#747b8a]">
                    {request.client.age ?? "—"} years • {request.client.gender}
                  </p>
                </div>
                <span className="rounded-full bg-[#9df2c8] px-3 py-1 text-[10px] font-semibold uppercase sm:ml-auto">
                  {request.careType}
                </span>
              </div>
              <div className="grid flex-1 content-start gap-4 p-5 text-sm sm:grid-cols-2 sm:p-6">
                <div>
                  <b className="block text-xs uppercase text-[#4c5261]">
                    Location
                  </b>
                  <span className="flex gap-1 font-semibold">
                    <MapPin className="size-4 text-[#0755d3]" />
                    {request.client.area}
                  </span>
                </div>
                <div>
                  <b className="block text-xs uppercase text-[#4c5261]">
                    Pay Rate
                  </b>
                  <span className="font-semibold text-emerald-700">{rate}</span>
                </div>
                <div className="sm:col-span-2">
                  <b className="block text-xs uppercase text-[#4c5261]">
                    Requested Schedule
                  </b>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {scheduleText(request).map((item) => (
                      <span
                        className="rounded bg-[#dce8ff] px-3 py-1 text-xs"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#606878]">
                    Starts {request.serviceStartDate || "after matching"} ·{" "}
                    {request.hoursPerWeek} hours/week
                  </p>
                </div>
              </div>
              <div className="grid gap-3 border-t border-[#c5cad8] p-4 sm:grid-cols-2">
                <Link
                  className="rounded-lg border border-[#c5cad8] px-4 py-3 text-center font-semibold"
                  to={`/caregiver/requested-clients/${request.requestId}`}
                >
                  Details
                </Link>
                <button
                  className="rounded-lg bg-[#0649ad] px-4 py-3 font-semibold text-white disabled:opacity-60"
                  type="button"
                  disabled={respondingId === request.requestId}
                  onClick={() => accept(request)}
                >
                  {respondingId === request.requestId
                    ? "Accepting..."
                    : "Accept Request"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CaregiverRequestedClients;
