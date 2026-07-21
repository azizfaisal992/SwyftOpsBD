import {
  ArrowLeft,
  Check,
  Clock3,
  Phone,
  Pill,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { assignedClients } from "../../../data/caregiverPortalData";

const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
};

const CaregiverActiveVisit = () => {
  const { clientId } = useParams();
  const client = assignedClients.find((item) => item.id === clientId) ?? assignedClients[0];
  const [elapsedSeconds, setElapsedSeconds] = useState(5070);
  const [administered, setAdministered] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleItem = (setter, item) => setter((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);

  return (
    <div className="min-h-screen bg-[#f6f8ff] text-[#101c2d]">
      <main className="mx-auto max-w-[1280px] p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 border-b border-[#c5cad8] pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link className="flex items-center gap-2 text-sm font-medium text-[#0649ad] sm:text-base" to="/caregiver/dashboard"><ArrowLeft className="size-5" /> Back to Dashboard</Link>
            <span className="mt-4 inline-flex items-center gap-2 rounded bg-[#dce8ff] px-3 py-1 text-xs font-semibold uppercase text-[#0649ad]"><span className="size-2 rounded-full bg-[#0649ad]" /> Active Visit</span>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{client.name}</h1>
            <p className="text-sm text-[#4c5261]">{client.care}</p>
          </div>
          <section className="w-full rounded-xl border border-[#c5cad8] bg-white p-4 sm:p-5 lg:w-auto lg:min-w-[470px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <small className="block uppercase tracking-[0.1em] text-[#4c5261]">Visit Duration</small>
                <strong className="block font-mono text-3xl text-[#0649ad] sm:text-4xl">{formatDuration(elapsedSeconds)}</strong>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-5 py-3 font-semibold text-white" type="button"><Clock3 className="size-5" /> Clock In</button>
              <button className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white" type="button" onClick={() => setNotice("Emergency end request is ready for backend confirmation.")}>End Emergency</button>
            </div>
          </section>
        </header>

        {notice && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}

        <div className="mt-6 grid gap-6 xl:grid-cols-[285px_minmax(0,1fr)_390px]">
          <div className="grid gap-6 sm:grid-cols-2 xl:block xl:space-y-6">
            <section className="rounded-xl border border-[#c5cad8] bg-white p-5 text-center">
              <img className="mx-auto size-24 rounded-full object-cover" src={client.image} alt={client.name} />
              <h2 className="mt-3 text-xl font-semibold">{client.shortName ?? client.name}</h2>
              <p className="text-xs text-[#4c5261]">ID: #C-84729</p>
              <a className="mt-5 flex items-center justify-center gap-2 text-sm text-[#0649ad] xl:justify-start" href="tel:+8801700000000"><Phone className="size-4" /> Emergency Contact</a>
              <p className="mt-3 text-sm text-[#4c5261]">Last visit: Yesterday, 14:00</p>
            </section>
            <section className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
              <h2 className="bg-[#eef3ff] px-4 py-3 text-lg font-semibold">Care Notes</h2>
              <div className="p-4"><textarea className="min-h-48 w-full resize-y rounded-lg border border-[#c5cad8] bg-[#f8f9ff] p-3 outline-none" placeholder="Record patient observations..." /></div>
            </section>
          </div>

          <section className="rounded-xl border border-[#c5cad8] bg-white">
            <header className="flex items-center bg-[#eef3ff] px-4 py-3"><h2 className="text-lg font-semibold sm:text-xl">Medication Schedule</h2><span className="ml-auto rounded bg-[#dce8ff] px-3 py-1 text-xs">{2 - administered.length} Pending</span></header>
            <div className="space-y-4 p-4">
              {["Amlodipine", "Metformin"].map((medicine) => {
                const done = administered.includes(medicine);
                return <article className="rounded-xl border border-[#c5cad8] p-4" key={medicine}><div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#dce8ff] text-[#0649ad]"><Pill className="size-6" /></span><div><b>{medicine}</b><p className="text-sm text-[#4c5261]">500mg · Oral · With Meals</p></div></div><button className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-medium text-white ${done ? "bg-emerald-700" : "bg-[#0755d3]"}`} type="button" onClick={() => toggleItem(setAdministered, medicine)}>{done ? <RotateCcw className="size-4" /> : <Check className="size-4" />}{done ? "Undo Administration" : "Administer"}</button></article>;
              })}
            </div>
          </section>

          <div>
            <section className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
              <h2 className="bg-[#eef3ff] px-5 py-3 text-lg font-semibold sm:text-xl">Care Tasks</h2>
              <div className="px-5">
                {["Wound Dressing Change", "Bathing Assistance", "Mobility Exercises (15 mins)"].map((task) => <label className="flex min-h-16 cursor-pointer items-center gap-4 border-b py-4 last:border-b-0" key={task}><input className="size-5 shrink-0 accent-[#0755d3]" type="checkbox" checked={tasks.includes(task)} onChange={() => toggleItem(setTasks, task)} /><span>{task}</span></label>)}
              </div>
            </section>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0755d3] px-4 py-4 text-base font-semibold text-white sm:text-xl" type="button" onClick={() => setNotice("Visit report is ready for API submission.")}><RotateCcw className="size-5" /> Submit Report &amp; End Visit</button>
          </div>
        </div>
      </main>
      <footer className="mt-12 flex items-center justify-center gap-2 border-t border-[#c5cad8] bg-[#eef3ff] py-6 text-xs tracking-[0.16em] text-[#4c5261] sm:text-sm sm:tracking-[0.2em]"><ShieldCheck className="size-5 text-[#0649ad]" /> SWIFTOPSBD SECURITY</footer>
    </div>
  );
};

export default CaregiverActiveVisit;
