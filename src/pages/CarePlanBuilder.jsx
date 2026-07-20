import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  BriefcaseMedical,
  Clock3,
  HeartPulse,
  Salad,
  ShieldCheck,
  ShowerHead,
  Stethoscope,
  Sun,
  Sunset,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { caregivers } from "../data/findCareData";

const careTasks = [
  ["Medication Reminders", BriefcaseMedical],
  ["Mobility Assistance", Activity],
  ["Meal Preparation", Salad],
  ["Personal Hygiene", ShowerHead],
  ["Vitals Monitoring", HeartPulse],
  ["Dementia Care", UserRound],
];

const CarePlanBuilder = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const caregiver =
    caregivers.find((item) => item.id === Number(params.get("caregiver"))) ||
    caregivers[0];
  const [careType, setCareType] = useState("Senior Care");
  const [tasks, setTasks] = useState([
    "Medication Reminders",
    "Mobility Assistance",
  ]);
  const [hours, setHours] = useState(20);
  const [time, setTime] = useState("Mornings");
  const [gender, setGender] = useState("No Preference");
  const [budget, setBudget] = useState("৳15,000 - ৳25,000");
  const [transportation, setTransportation] = useState("");

  const estimate = useMemo(() => {
    const careHours = caregiver.rate * hours * 4;
    const medicalPremium = careType === "Nursing Care" ? 5000 : 2500;
    const platformFee = 2500;
    return {
      careHours,
      medicalPremium,
      platformFee,
      total: careHours + medicalPremium + platformFee,
    };
  }, [careType, caregiver.rate, hours]);

  const toggleTask = (task) =>
    setTasks((current) =>
      current.includes(task)
        ? current.filter((item) => item !== task)
        : [...current, task],
    );
  const finalize = () => {
    sessionStorage.setItem(
      "swiftopsbd-care-plan",
      JSON.stringify({
        caregiverId: caregiver.id,
        careType,
        tasks,
        hours,
        time,
        gender,
        budget,
        transportation,
        estimate,
      }),
    );
    navigate(`/care-checkout?caregiver=${caregiver.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#111c2c]">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6">
          <Link className="text-2xl font-bold text-[#0649ad]" to="/">
            SwiftOpsBD
          </Link>
          <b className="border-b-2 border-[#0649ad] py-5 text-sm text-[#0649ad]">
            Personalized Plan
          </b>
          <div className="ml-auto flex items-center gap-5">
            <Link to="/login">Sign In</Link>
            <Link
              className="rounded bg-[#0649ad] px-5 py-2 text-white"
              to="/register?type=family"
            >
              Register
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-5 sm:p-6">
        <section className="flex flex-col justify-between gap-5 rounded-xl border bg-white p-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold">Care Plan Builder</h1>
            <p className="text-[#4c5261]">
              Configure your personalized home healthcare journey.
            </p>
          </div>
          <div className="flex gap-5 text-sm">
            <b className="text-[#0649ad]">① Customization</b>
            <span>② Schedule</span>
            <span>③ Review</span>
          </div>
        </section>
        <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_365px]">
          <div className="space-y-7">
            <PlanSection number="1" title="Care Customization">
              <p className="plan-label">Type of care needed</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {["Senior Care", "Nursing Care"].map((type) => (
                  <button
                    className={`rounded-lg border p-5 text-left ${careType === type ? "border-[#0755d3] bg-[#eef2ff]" : ""}`}
                    type="button"
                    onClick={() => setCareType(type)}
                    key={type}
                  >
                    <b>◉ {type}</b>
                    <small className="block text-[#4c5261]">
                      {type === "Senior Care"
                        ? "Companion & non-medical support"
                        : "Specialized medical assistance"}
                    </small>
                  </button>
                ))}
              </div>
              <p className="plan-label mt-8">Medical conditions & tasks</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {careTasks.map(([task, Icon]) => (
                  <button
                    className={`rounded-lg border p-5 ${tasks.includes(task) ? "border-[#0755d3] bg-[#eef2ff] text-[#0649ad]" : ""}`}
                    type="button"
                    onClick={() => toggleTask(task)}
                    key={task}
                  >
                    <Icon className="mx-auto" />
                    <span className="mt-2 block">{task}</span>
                  </button>
                ))}
              </div>
            </PlanSection>
            <PlanSection number="2" title="Service Schedule">
              <div className="flex justify-between">
                <p>
                  <b className="plan-label">Hours per week</b>
                  <small className="text-[#4c5261]">
                    Select total care intensity.
                  </small>
                </p>
                <b className="text-3xl text-[#0649ad]">{hours} hrs</b>
              </div>
              <input
                className="mt-6 w-full accent-[#0755d3]"
                type="range"
                min="4"
                max="40"
                step="4"
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
              />
              <div className="flex justify-between text-xs">
                <span>Part-time (4h)</span>
                <span>Full-time (40h)</span>
              </div>
              <p className="plan-label mt-8">Preferred time of day</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Mornings", Sun],
                  ["Afternoons", Sunset],
                  ["Evenings", Clock3],
                  ["Full Day", BedDouble],
                ].map(([label, Icon]) => (
                  <button
                    className={`rounded-lg border p-4 ${time === label ? "border-[#0755d3] bg-[#eef2ff]" : ""}`}
                    type="button"
                    onClick={() => setTime(label)}
                    key={label}
                  >
                    <Icon className="mx-auto" />
                    {label}
                  </button>
                ))}
              </div>
            </PlanSection>
            <PlanSection number="3" title="Final Logistics">
              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="plan-label">Required caregiver gender</span>
                  <select
                    className="client-input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>No Preference</option>
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </label>
                <label>
                  <span className="plan-label">Budget range</span>
                  <select
                    className="client-input"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option>৳15,000 - ৳25,000</option>
                    <option>৳25,000 - ৳50,000</option>
                    <option>৳50,000+</option>
                  </select>
                </label>
              </div>
              <label className="mt-6 block">
                <span className="plan-label">Transportation requirements</span>
                <textarea
                  className="client-input min-h-28"
                  value={transportation}
                  onChange={(e) => setTransportation(e.target.value)}
                  placeholder="Does the caregiver need to accompany the patient?"
                />
              </label>
            </PlanSection>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="overflow-hidden rounded-2xl border bg-white shadow-lg">
              <div className="bg-[#0649ad] p-6 text-white">
                <h2 className="text-2xl font-semibold">Monthly Estimate</h2>
                <p className="text-sm">Calculated from your preferences</p>
              </div>
              <dl className="space-y-5 p-6">
                {[
                  ["Care Hours", estimate.careHours],
                  ["Medical Premium", estimate.medicalPremium],
                  ["Service Fee", estimate.platformFee],
                ].map(([label, value]) => (
                  <div className="flex justify-between" key={label}>
                    <dt>{label}</dt>
                    <dd>৳{value.toLocaleString()}</dd>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-5 text-2xl font-bold">
                  <dt>Total Plan</dt>
                  <dd className="text-emerald-700">
                    ৳{estimate.total.toLocaleString()}
                  </dd>
                </div>
              </dl>
              <button
                className="mx-6 mb-6 flex w-[calc(100%-3rem)] justify-center gap-2 rounded-lg bg-[#0649ad] py-4 font-semibold text-white"
                type="button"
                onClick={finalize}
              >
                Finalize & Request <ArrowRight />
              </button>
              <p className="pb-6 text-center text-xs">
                <ShieldCheck className="inline size-4" /> Secure payment via
                SSLCommerz
              </p>
            </section>
            <section className="rounded-xl border bg-white p-6">
              <div className="flex gap-4">
                <img
                  className="size-16 rounded-xl object-cover"
                  src={caregiver.image}
                  alt={caregiver.name}
                />
                <div>
                  <h3 className="font-semibold">{caregiver.name}</h3>
                  <p className="text-xs">{caregiver.role}</p>
                  <p>⭐ {caregiver.rating}</p>
                </div>
              </div>
              <p className="mt-5 rounded border p-3 text-sm text-emerald-700">
                <BadgeCheck className="mr-2 inline size-4" />
                Background Checked
              </p>
              <p className="mt-3 rounded border p-3 text-sm">
                <Stethoscope className="mr-2 inline size-4" />
                Licensed Practitioner
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

const PlanSection = ({ number, title, children }) => (
  <section className="rounded-xl border bg-white p-6 sm:p-8">
    <h2 className="mb-7 flex items-center gap-3 text-lg">
      <span className="grid size-8 place-items-center rounded-xl bg-[#0755d3] text-white">
        {number}
      </span>
      {title}
    </h2>
    {children}
  </section>
);
export default CarePlanBuilder;
