import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  PlusCircle,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  confirmMyAssignment,
  listMyAssignments,
} from "../../../services/assignmentService";

const ageFrom = (dateOfBirth) => {
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "—";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate())
  ) age -= 1;
  return age;
};

const labelForStatus = {
  pending_confirmation: "Confirm shift",
  confirmed: "Confirmed",
  active: "On duty",
  completed: "Completed",
};

const CaregiverAssignedClients = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setAssignments(await listMyAssignments());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    const refreshTimer = window.setInterval(load, 15000);
    const refreshOnFocus = () => load();
    window.addEventListener("focus", refreshOnFocus);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, []);

  const confirm = async (assignmentId) => {
    setWorkingId(assignmentId);
    setError("");
    try {
      const updated = await confirmMyAssignment(assignmentId);
      setAssignments((current) =>
        current.map((item) =>
          item.assignmentId === assignmentId ? updated : item));
    } catch (confirmError) {
      setError(confirmError.message);
    } finally {
      setWorkingId("");
    }
  };

  const pending = assignments.filter(
    (item) => item.status === "pending_confirmation",
  );

  return (
    <div className="mx-auto max-w-[1050px] p-5 sm:p-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[#4c5261]">
            You have <b>{assignments.length}</b> current patient assignment{assignments.length === 1 ? "" : "s"}.
          </p>
          <p className="mt-1 text-xs text-[#737b8c]">Assignments appear here after administrator matching.</p>
        </div>
        <button className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#0649ad]" type="button" onClick={load}>
          <CalendarClock className="size-4" /> Refresh schedule
        </button>
      </header>

      {error && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading && <div className="grid min-h-72 place-items-center"><LoaderCircle className="size-8 animate-spin text-[#0755d3]" /></div>}
      {!loading && assignments.length === 0 && (
        <section className="mt-8 rounded-2xl border-2 border-dashed border-[#b9c1d3] p-12 text-center">
          <PlusCircle className="mx-auto size-10 text-[#0649ad]" />
          <h2 className="mt-4 text-xl font-semibold">No assigned clients yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#4c5261]">Accept an available care request. An administrator will confirm the match and create your schedule.</p>
          <Link className="mt-5 inline-flex rounded-lg bg-[#0755d3] px-5 py-3 font-semibold text-white" to="/caregiver/requested-clients">Browse requests</Link>
        </section>
      )}

      <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {assignments.map((assignment) => {
          const client = assignment.client || {};
          return (
            <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#c5cad8] bg-white" key={assignment.assignmentId}>
              <div className="flex flex-1 gap-4 p-5">
                <div className="flex w-20 shrink-0 flex-col items-center">
                  <span className="grid size-20 place-items-center rounded-xl bg-[#dce8ff] text-2xl font-bold text-[#0649ad]">{client.fullName?.slice(0, 1) || "C"}</span>
                  <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-semibold uppercase whitespace-nowrap ${assignment.status === "pending_confirmation" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {labelForStatus[assignment.status] || assignment.status}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-2 min-h-12 text-xl font-semibold leading-6">{client.fullName}</h2>
                  <p className="mt-1 text-xs text-[#4c5261]">{ageFrom(client.dateOfBirth)} Years · {client.gender || "Not specified"}</p>
                  <span className="mt-2 inline-block rounded bg-[#f1f3fa] px-2 py-1 text-xs">{assignment.careType}</span>
                  <p className="mt-3 text-xs text-[#687184]">{assignment.preferredDays?.join(", ")} · {assignment.preferredTime}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-[#c5cad8] bg-[#f1f5ff] p-3 text-xs">
                <MapPin className="size-4" />{client.area || "Dhaka"}
                <Link className="ml-auto flex items-center whitespace-nowrap font-semibold text-[#0649ad]" to={`/caregiver/assigned-clients/${assignment.assignmentId}`}>
                  View Details <ArrowRight className="size-4" />
                </Link>
              </div>
              {assignment.status === "pending_confirmation" && (
                <button className="flex items-center justify-center gap-2 bg-[#0755d3] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" type="button" disabled={workingId === assignment.assignmentId} onClick={() => confirm(assignment.assignmentId)}>
                  {workingId === assignment.assignmentId ? <LoaderCircle className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  Confirm assignment
                </button>
              )}
            </article>
          );
        })}
        {assignments.length > 0 && (
          <Link className="grid min-h-52 place-items-center rounded-xl border-2 border-dashed border-[#b9c1d3] text-center" to="/caregiver/requested-clients">
            <span><PlusCircle className="mx-auto size-9 text-[#0649ad]" /><b className="mt-3 block">Accept New Assignment</b><span className="mt-2 block text-sm text-[#4c5261]">Browse available open care shifts.</span></span>
          </Link>
        )}
      </div>

      {pending.length > 0 && (
        <section className="mt-10 flex flex-col gap-4 rounded-xl bg-[#3a2100] p-6 text-amber-200 sm:flex-row sm:items-center">
          <TriangleAlert className="size-10 shrink-0" />
          <div><h2 className="text-2xl font-semibold">Confirmation required</h2><p>{pending.length} assignment{pending.length === 1 ? "" : "s"} must be confirmed before visits can begin.</p></div>
        </section>
      )}
    </div>
  );
};

export default CaregiverAssignedClients;
