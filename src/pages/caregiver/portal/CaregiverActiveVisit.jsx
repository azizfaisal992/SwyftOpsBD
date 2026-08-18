import {
  ArrowLeft,
  Check,
  Clock3,
  LoaderCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getBrowserLocation,
  watchBrowserLocation,
} from "../../../services/browserLocationService";
import { getMyAssignment } from "../../../services/assignmentService";
import {
  clockInVisit,
  completeVisit,
  saveVisitProgress,
  updateVisitLocation,
} from "../../../services/visitExecutionService";
import { createIncident } from "../../../services/incidentService";

const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

const CaregiverActiveVisit = () => {
  const { clientId: assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clockedIn, setClockedIn] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getMyAssignment(assignmentId)
      .then((record) => {
        if (!active) return;
        const selectedVisit =
          record.visits?.find((item) => item.status === "active") ||
          record.visits?.find((item) => item.status === "scheduled") ||
          record.visits?.[0] ||
          null;
        setAssignment(record);
        setVisit(selectedVisit);
        setClockedIn(selectedVisit?.status === "active");
        setCompletedTasks(selectedVisit?.completedTasks || []);
        setNotes(selectedVisit?.careNotes || "");
        if (selectedVisit?.clockInAt) {
          setElapsedSeconds(
            Math.max(
              0,
              Math.floor(
                (Date.now() - new Date(selectedVisit.clockInAt).getTime()) /
                  1000,
              ),
            ),
          );
        }
      })
      .catch((error) => {
        if (active) setNotice(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [assignmentId]);

  useEffect(() => {
    if (!clockedIn || !visit?.clockInAt) return undefined;
    const timer = window.setInterval(() => {
      setElapsedSeconds(
        Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(visit.clockInAt).getTime()) / 1000,
          ),
        ),
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [clockedIn, visit?.clockInAt]);

  useEffect(() => {
    if (!clockedIn || !visit?.visitId) return undefined;
    let mounted = true;
    let lastSentAt = 0;
    const stopWatching = watchBrowserLocation(async (location) => {
      const now = Date.now();
      if (now - lastSentAt < 15000) return;
      lastSentAt = now;
      try {
        const updated = await updateVisitLocation(visit.visitId, location);
        if (mounted) setVisit(updated);
      } catch (error) {
        if (mounted) setNotice(`Live GPS paused: ${error.message}`);
      }
    });
    return () => {
      mounted = false;
      stopWatching();
    };
  }, [clockedIn, visit?.visitId]);

  if (loading) {
    return <div className="grid min-h-screen place-items-center"><LoaderCircle className="size-9 animate-spin text-[#0755d3]" /></div>;
  }
  if (!assignment) {
    return <div className="grid min-h-screen place-items-center p-6"><p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{notice || "Assignment not found."}</p></div>;
  }

  const client = assignment.client;
  const firstVisit = visit;
  const toggleTask = async (task) => {
    const nextTasks = completedTasks.includes(task)
      ? completedTasks.filter((item) => item !== task)
      : [...completedTasks, task];
    setCompletedTasks(nextTasks);
    if (!clockedIn || !visit) return;
    try {
      const updated = await saveVisitProgress(visit.visitId, {
        completedTasks: nextTasks,
        careNotes: notes,
      });
      setVisit(updated);
    } catch (error) {
      setNotice(error.message);
    }
  };

  const handleClockIn = async () => {
    if (!visit || clockedIn || saving) return;
    setSaving(true);
    setNotice("Requesting your location and starting the visit...");
    try {
      const location = await getBrowserLocation();
      const updated = await clockInVisit(visit.visitId, location);
      setVisit(updated);
      setClockedIn(true);
      setElapsedSeconds(0);
      setNotice(
        location
          ? "Visit clocked in with GPS."
          : "Visit clocked in. GPS was not available.",
      );
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    if (!clockedIn || !visit || saving) return;
    setSaving(true);
    try {
      const updated = await saveVisitProgress(visit.visitId, {
        completedTasks,
        careNotes: notes,
      });
      setVisit(updated);
      setNotice("Visit progress saved.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteVisit = async () => {
    if (!clockedIn || !visit || saving) return;
    setSaving(true);
    setNotice("Saving the care report...");
    try {
      const location = await getBrowserLocation();
      const updated = await completeVisit(visit.visitId, {
        completedTasks,
        careNotes: notes,
        location,
      });
      setVisit(updated);
      setClockedIn(false);
      setElapsedSeconds(updated.durationSeconds || elapsedSeconds);
      setNotice("Care report submitted and visit completed.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEmergency = async () => {
    if (!visit?.visitId || saving) {
      setNotice("Start the assigned visit before sending an emergency SOS.");
      return;
    }
    if (!window.confirm(
      "Send an emergency SOS to SwiftOpsBD operations for this visit?",
    )) return;
    setSaving(true);
    setNotice("Sending emergency SOS...");
    try {
      const location = await getBrowserLocation();
      const incident = await createIncident({
        type: "sos",
        visitId: visit.visitId,
        location,
      });
      setNotice(
        `Emergency SOS sent. Case #${incident.incidentId
          .slice(0, 8)
          .toUpperCase()} is now under review.`,
      );
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8ff] text-[#101c2d]">
      <main className="mx-auto max-w-[1280px] p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 border-b border-[#c5cad8] pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link className="flex items-center gap-2 font-medium text-[#0649ad]" to="/caregiver/assigned-clients"><ArrowLeft className="size-5" />Back to assigned clients</Link>
            <span className="mt-4 inline-flex items-center gap-2 rounded bg-[#dce8ff] px-3 py-1 text-xs font-semibold uppercase text-[#0649ad]"><span className="size-2 rounded-full bg-[#0649ad]" />Scheduled Visit</span>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{client.fullName}</h1>
            <p className="text-sm text-[#4c5261]">{assignment.careType}</p>
          </div>
          <section className="w-full rounded-xl border border-[#c5cad8] bg-white p-5 lg:w-auto lg:min-w-[450px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1"><small className="block uppercase tracking-widest text-[#4c5261]">Visit Duration</small><strong className="block font-mono text-4xl text-[#0649ad]">{formatDuration(elapsedSeconds)}</strong></div>
              <button className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white ${clockedIn ? "bg-emerald-700" : "bg-[#0755d3]"}`} type="button" onClick={handleClockIn} disabled={clockedIn || saving || !visit}><Clock3 className="size-5" />{saving ? "Saving..." : clockedIn ? "Clocked In" : "Clock In"}</button>
              <button className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white disabled:opacity-50" type="button" onClick={handleEmergency} disabled={!visit || saving}>Emergency</button>
            </div>
          </section>
        </header>

        {notice && <p className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{notice}</p>}

        <div className="mt-6 grid gap-6 xl:grid-cols-[285px_minmax(0,1fr)_390px]">
          <div className="space-y-6">
            <section className="rounded-xl border border-[#c5cad8] bg-white p-5 text-center">
              <span className="mx-auto grid size-24 place-items-center rounded-full bg-[#dce8ff] text-3xl font-bold text-[#0649ad]">{client.fullName?.slice(0, 1)}</span>
              <h2 className="mt-3 text-xl font-semibold">{client.fullName}</h2>
              <p className="text-xs text-[#4c5261]">#{assignment.assignmentId.slice(0, 8).toUpperCase()}</p>
              <a className="mt-5 flex items-center justify-center gap-2 text-sm text-[#0649ad]" href={`tel:${client.phone}`}><Phone className="size-4" />Client contact</a>
              <p className="mt-3 text-sm text-[#4c5261]">Scheduled: {firstVisit ? `${firstVisit.date}, ${firstVisit.scheduledStartLocal}` : "Not available"}</p>
            </section>
            <section className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
              <h2 className="bg-[#eef3ff] px-4 py-3 text-lg font-semibold">Care Notes</h2>
              <div className="p-4"><textarea className="min-h-48 w-full resize-y rounded-lg border border-[#c5cad8] bg-[#f8f9ff] p-3 outline-none" value={notes} onChange={(event) => setNotes(event.target.value)} onBlur={saveNotes} placeholder="Record patient observations…" /></div>
            </section>
          </div>

          <section className="rounded-xl border border-[#c5cad8] bg-white">
            <header className="bg-[#eef3ff] px-5 py-4"><h2 className="text-xl font-semibold">Assigned Care Plan</h2></header>
            <div className="space-y-4 p-5">
              <article className="rounded-xl border p-5"><b>{assignment.careType}</b><p className="mt-2 text-sm text-[#4c5261]">{assignment.hoursPerWeek} hours weekly · {assignment.preferredDays.join(", ")} · {assignment.preferredStartTime || assignment.preferredTime}</p><p className="mt-2 text-xs text-[#687184]">Service starts {assignment.serviceStartDate || "after confirmation"}</p></article>
              <article className="rounded-xl border p-5"><b>Service address</b><p className="mt-2 text-sm text-[#4c5261]">{[client.house, client.road, client.area].filter(Boolean).join(", ")}</p></article>
              {assignment.transportation && <article className="rounded-xl border p-5"><b>Transportation requirements</b><p className="mt-2 text-sm text-[#4c5261]">{assignment.transportation}</p></article>}
            </div>
          </section>

          <div>
            <section className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
              <h2 className="bg-[#eef3ff] px-5 py-3 text-xl font-semibold">Care Tasks</h2>
              <div className="px-5">
                {assignment.tasks.map((task) => <label className="flex min-h-16 cursor-pointer items-center gap-4 border-b py-4 last:border-b-0" key={task}><input className="size-5 accent-[#0755d3]" type="checkbox" checked={completedTasks.includes(task)} onChange={() => toggleTask(task)} /><span>{task}</span></label>)}
              </div>
            </section>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0755d3] px-4 py-4 text-lg font-semibold text-white disabled:opacity-50" type="button" disabled={!clockedIn || saving} onClick={handleCompleteVisit}><RotateCcw className="size-5" />{saving ? "Saving Report..." : "Submit Report & End Visit"}</button>
            <p className="mt-3 flex items-start gap-2 text-xs text-[#687184]"><Check className="mt-0.5 size-4 shrink-0 text-emerald-700" />Clock events, GPS, completed tasks and care notes are stored through the authenticated visit API.</p>
          </div>
        </div>
      </main>
      <footer className="mt-12 flex items-center justify-center gap-2 border-t border-[#c5cad8] bg-[#eef3ff] py-6 text-xs tracking-widest text-[#4c5261]"><ShieldCheck className="size-5 text-[#0649ad]" />SWIFTOPSBD SECURITY</footer>
    </div>
  );
};

export default CaregiverActiveVisit;
