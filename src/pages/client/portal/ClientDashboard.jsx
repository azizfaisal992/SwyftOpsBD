import { Check, ChevronLeft, ChevronRight, CircleAlert, Clock3, MapPin, MessageSquare, MoreVertical, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import BarikoiMap from "../../../components/maps/BarikoiMap";
import PortalCard from "../../../components/client/portal/PortalCard";
import useAuth from "../../../hooks/useAuth";
import {
  listMyAssignments,
  listMyVisits,
} from "../../../services/assignmentService";
import { listMyCareRequests } from "../../../services/careRequestService";

const ClientDashboard = () => {
  const { account, user } = useAuth();
  const { onboarding } = useOutletContext() || {};
  const clientName = (
    user?.displayName ||
    account?.displayName ||
    user?.email?.split("@")[0] ||
    "Client"
  ).split(" ")[0];
  const [activeRequest, setActiveRequest] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [careRequests, setCareRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    let active = true;
    const loadDashboard = () => {
      Promise.all([
        listMyCareRequests(),
        listMyAssignments(),
        listMyVisits(),
      ])
        .then(([requests, assignments, scheduledVisits]) => {
          if (!active) return;
          setCareRequests(requests);
          setAssignments(assignments);
          const currentAssignments = assignments.filter((item) =>
            ["pending_confirmation", "confirmed", "active"].includes(
              item.status,
            ),
          );
          const currentRequest =
            requests.find(
              (careRequest) =>
                ["open", "held"].includes(careRequest.status) ||
                (careRequest.status === "assigned" &&
                  currentAssignments.some(
                    (item) => item.requestId === careRequest.requestId,
                  )),
            ) || null;
          setActiveRequest(currentRequest);
          setAssignment(
            currentAssignments.find(
              (item) => item.requestId === currentRequest?.requestId,
            ) ||
              currentAssignments[0] ||
              null,
          );
          const currentAssignmentIds = new Set(
            currentAssignments.map((item) => item.assignmentId),
          );
          setVisits(
            scheduledVisits
              .filter(
                (visit) =>
                  currentAssignmentIds.has(visit.assignmentId) &&
                  visit.status !== "completed" &&
                  visit.status !== "cancelled",
              )
              .slice(0, 8),
          );
          setReports(
            scheduledVisits
              .filter((visit) => visit.status === "completed")
              .sort((a, b) =>
                String(b.clockOutAt || b.date).localeCompare(
                  String(a.clockOutAt || a.date),
                ),
              )
              .slice(0, 5),
          );
        })
        .catch(() => {
          // Other dashboard sections can still render before a request exists.
        });
    };
    loadDashboard();
    const refreshTimer = window.setInterval(loadDashboard, 15000);
    window.addEventListener("focus", loadDashboard);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", loadDashboard);
    };
  }, []);

  const requestConfirmed = Boolean(
    activeRequest &&
      assignment?.requestId === activeRequest.requestId &&
      ["confirmed", "active"].includes(assignment.status),
  );
  const activeVisit = visits.find((visit) => visit.status === "active");
  const caregiverLocation =
    activeVisit?.currentLocation || activeVisit?.clockInLocation || null;
  const liveLocationLabel = activeVisit?.lastLocationAt
    ? `Live GPS · updated ${new Date(activeVisit.lastLocationAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : caregiverLocation
      ? "Caregiver GPS available"
      : "Waiting for visit clock-in";
  const serviceLocation = assignment?.client?.latitude
    && assignment?.client?.longitude
    ? {
        latitude: Number(assignment.client.latitude),
        longitude: Number(assignment.client.longitude),
      }
    : null;

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 p-5 sm:p-7">
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">Daily Care Overview</h1>
        <p className="mt-1 text-[#4c5261]">Welcome back, {clientName}. Here is what&apos;s happening today.</p>
      </header>

      {onboarding?.verificationStatus !== "approved" && (
        <PortalCard className={`border-l-4 p-4 ${onboarding?.verificationStatus === "rejected" ? "border-l-red-600 bg-red-50" : "border-l-amber-500 bg-amber-50"}`}>
          <p className="font-semibold">
            {onboarding?.verificationStatus === "rejected"
              ? "Client verification was not approved"
              : "Client verification is under review"}
          </p>
          <p className="mt-1 text-sm text-[#4c5261]">
            {onboarding?.reviewFeedback ||
              "An administrator must approve your identity documents before you can publish a care request."}
          </p>
        </PortalCard>
      )}

      {activeRequest && (
        <PortalCard className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between" aria-live="polite">
          <div><p className="text-sm font-semibold">Active Request: {activeRequest.careType || "Care request"}</p><p className="mt-1 text-xs text-[#4c5261]">Request ID: #{activeRequest.requestId.slice(0, 8).toUpperCase()}</p></div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-[#34b884] text-white"><Check className="size-4" /></span>
              <span className="font-medium text-emerald-700">Submitted</span>
              <span className={`h-0.5 w-8 ${requestConfirmed ? "bg-[#34b884]" : "bg-[#c5cad8]"}`} />
            </div>
            <span className={`grid size-8 place-items-center rounded-xl ${requestConfirmed ? "bg-[#34b884] text-white" : "bg-[#e4eaff] text-[#0649ad]"}`}>
              {requestConfirmed ? <Check className="size-4" /> : "2"}
            </span>
            <span className={requestConfirmed ? "font-medium text-emerald-700" : "text-[#4c5261]"}>Confirmed</span>
          </div>
        </PortalCard>
      )}

      <PortalCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">My Care Requests</h2>
            <p className="mt-1 text-sm text-[#4c5261]">
              Every request remains connected to your account. You can request
              another caregiver for a different service or schedule.
            </p>
          </div>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0649ad] px-5 py-3 text-sm font-semibold text-white"
            to="/find-care"
          >
            <PlusCircle className="size-5" />
            Request Another Caregiver
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {careRequests.map((careRequest) => {
            const matchedAssignment = assignments.find(
              (item) => item.requestId === careRequest.requestId,
            );
            const status = matchedAssignment?.status || careRequest.status;
            const statusLabel = String(status || "submitted")
              .replaceAll("_", " ");
            const assigned = Boolean(matchedAssignment);

            return (
              <article
                className="rounded-xl border border-[#c5cad8] bg-[#f9faff] p-4"
                key={careRequest.requestId}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {careRequest.careType || "Care service"}
                    </h3>
                    <p className="mt-1 text-xs text-[#687184]">
                      #{careRequest.requestId.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                      assigned
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-[#0649ad]"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-[#4c5261] sm:grid-cols-2">
                  <p>
                    <b className="text-[#111c2c]">Service:</b>{" "}
                    {careRequest.serviceStartDate || "Date pending"}
                    {careRequest.serviceEndDate
                      ? ` → ${careRequest.serviceEndDate}`
                      : ""}
                  </p>
                  <p>
                    <b className="text-[#111c2c]">Caregiver:</b>{" "}
                    {matchedAssignment?.caregiver?.fullName ||
                      careRequest.selectedCaregiver?.name ||
                      (assigned ? "Assigned caregiver" : "Awaiting assignment")}
                  </p>
                </div>
              </article>
            );
          })}

          {!careRequests.length && (
            <div className="rounded-xl border-2 border-dashed border-[#c5cad8] p-7 text-center md:col-span-2">
              <p className="font-semibold">No care requests yet</p>
              <p className="mt-1 text-sm text-[#687184]">
                Choose a caregiver and create your first personalized care plan.
              </p>
              <Link
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0649ad] px-5 py-3 text-sm font-semibold text-white"
                to="/find-care"
              >
                <PlusCircle className="size-5" />
                Find a Caregiver
              </Link>
            </div>
          )}
        </div>
      </PortalCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_315px]">
        <PortalCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full border-2 border-emerald-400 bg-[#dce8ff] font-bold text-[#0649ad]">{assignment?.caregiver?.fullName?.slice(0, 1) || "—"}</span>
              <div><h2 className="text-2xl font-semibold">Service Status: {activeVisit ? "Caregiver on visit" : assignment?.status ? assignment.status.replaceAll("_", " ") : "Waiting for assignment"}</h2><p className="uppercase tracking-[0.04em] text-[#4c5261]">{activeVisit ? `${activeVisit.caregiverName || assignment?.caregiver?.fullName || "Caregiver"} clocked in for this visit` : assignment ? `Assigned: ${assignment.caregiver?.fullName || "Caregiver"} (${assignment.careType || "Care service"})` : "Your administrator has not assigned a caregiver yet"}</p></div>
            </div>
            <div className="text-right"><span className="inline-flex items-center gap-2 rounded-full bg-[#dce8ff] px-4 py-2 text-sm text-[#0649ad]"><Clock3 className="size-4" /> {visits.length} visits scheduled</span><button className="mt-2 flex items-center gap-1 text-sm text-red-600 sm:ml-auto" type="button"><CircleAlert className="size-4" /> Report Issue</button></div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 border-y border-[#c5cad8] py-3 text-xs">
            <div><span className="text-[#4c5261]">Next visit</span><strong className="block text-base font-medium text-[#0649ad]">{visits[0]?.date || "Not scheduled"}</strong></div>
            <div><span className="text-[#4c5261]">Start time</span><strong className="block text-base font-medium">{visits[0]?.scheduledStartLocal || "—"}</strong></div>
            <div><span className="text-[#4c5261]">Weekly hours</span><strong className="block text-base font-medium">{assignment ? `${assignment.hoursPerWeek} hrs` : "—"}</strong></div>
          </div>
          <div className="relative mt-4 h-64 overflow-hidden rounded-lg border border-[#c5cad8]">
            <BarikoiMap
              className="h-full w-full"
              center={caregiverLocation || serviceLocation}
              markers={[
                ...(serviceLocation ? [{ ...serviceLocation, label: "Service location" }] : []),
                ...(caregiverLocation ? [{ ...caregiverLocation, label: "Caregiver live location" }] : []),
              ]}
              zoom={serviceLocation ? 15 : 11}
            />
            <span className="absolute right-4 top-4 rounded-lg bg-white px-4 py-2 text-sm shadow"><i className={`mr-1 inline-block size-2 rounded-full ${activeVisit && caregiverLocation ? "animate-pulse bg-emerald-500" : "bg-slate-400"}`} />{liveLocationLabel}</span>
            <span className="absolute bottom-4 left-4 rounded-lg bg-white px-4 py-2 text-xs shadow"><MapPin className="mr-1 inline size-4 text-[#0649ad]" /><b>Service Location</b><br />{assignment ? [assignment.client?.house, assignment.client?.road, assignment.client?.area].filter(Boolean).join(", ") || "Location not provided" : "Saved during client onboarding"}</span>
          </div>
        </PortalCard>

        <PortalCard className="p-6">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Service Reports</h2><button className="text-sm font-medium text-[#0649ad]" type="button">View All</button></div>
          <div className="mt-5 space-y-3">
            {reports.map((report) => (
              <article className="rounded-lg border border-[#c5cad8] p-3" key={report.visitId}>
                <div className="flex justify-between gap-2 text-xs text-[#4c5261]"><span>{report.date}</span><span className="rounded bg-[#d8f7e9] px-2 py-1 text-[9px] font-semibold text-emerald-700">COMPLETED</span></div>
                <h3 className="mt-2 text-sm font-medium">{report.careType || "Care visit"}</h3>
                <p className="mt-2 truncate text-xs text-[#4c5261]"><MessageSquare className="mr-1 inline size-3" />{report.careNotes || `${report.completedTasks?.length || 0} care tasks completed.`}</p>
              </article>
            ))}
            {!reports.length && (
              <p className="rounded-lg border border-dashed border-[#c5cad8] p-5 text-center text-sm text-[#667085]">
                Completed visit reports will appear here.
              </p>
            )}
          </div>
        </PortalCard>
      </div>

      <PortalCard className="p-6">
        <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Upcoming Care Schedule</h2><div className="flex gap-4"><ChevronLeft className="size-5" /><ChevronRight className="size-5" /></div></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visits.map((visit) => (
            <article className="border-l-4 border-[#ccd2e2] bg-[#f9f9ff] p-5" key={visit.visitId}>
              <div className="flex justify-between"><span className="text-xs font-bold uppercase text-[#0649ad]">{visit.date}</span><MoreVertical className="size-4" /></div>
              <p className="mt-4 text-2xl font-semibold">{visit.scheduledStartLocal}</p><p className="text-[#4c5261]">{visit.careType}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-[#c5cad8] pt-3 text-xs"><span className="grid size-6 place-items-center rounded-full bg-[#dce8ff] font-bold text-[#0649ad]">{visit.caregiverName?.slice(0, 1)}</span>{visit.caregiverName}</div>
            </article>
          ))}
          <Link className="grid min-h-44 place-items-center rounded-xl border-2 border-dashed border-[#c5cad8] bg-[#f4f6ff] text-[#4c5261]" to="/find-care"><span><PlusCircle className="mx-auto size-7" /><span className="mt-2 block">Request Another Caregiver</span></span></Link>
        </div>
      </PortalCard>
    </div>
  );
};

export default ClientDashboard;
