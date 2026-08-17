import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  BriefcaseMedical,
  CalendarDays,
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
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useCmsContent from "../hooks/useCmsContent";
import useAuth from "../hooks/useAuth";
import { createCarePlan } from "../services/careRequestService";
import {
  listPublicCaregivers,
  publicCaregiverPhotoUrl,
} from "../services/publicDirectoryService";

const careTasks = [
  ["Medication Reminders", BriefcaseMedical],
  ["Mobility Assistance", Activity],
  ["Meal Preparation", Salad],
  ["Personal Hygiene", ShowerHead],
  ["Vitals Monitoring", HeartPulse],
  ["Dementia Care", UserRound],
];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeDefaults = {
  Mornings: "09:00",
  Afternoons: "14:00",
  Evenings: "18:00",
  "Full Day": "08:00",
};
const localDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const addDateDays = (date, days) => {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};
const servicePeriod = (startDate, endDate, days, hoursPerWeek) => {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start ||
    !days.length
  ) {
    return { visits: 0, hours: 0 };
  }
  const allowed = new Set(days);
  let visits = 0;
  for (
    const cursor = new Date(start);
    cursor <= end;
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  ) {
    if (allowed.has(weekDays[(cursor.getUTCDay() + 6) % 7])) visits += 1;
  }
  return {
    visits,
    hours: visits * (hoursPerWeek / days.length),
  };
};

const CarePlanBuilder = () => {
  const { publishedContent } = useCmsContent();
  const cms = publishedContent["care-plan"];
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { account, user } = useAuth();
  const [caregivers, setCaregivers] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    listPublicCaregivers()
      .then((records) =>
        setCaregivers(
          records.map((record) => ({
            ...record,
            image: record.hasPhoto
              ? publicCaregiverPhotoUrl(record.id)
              : "",
          })),
        ),
      )
      .catch((requestError) => setError(requestError.message));
  }, []);
  const caregiver =
    caregivers.find(
      (item) => String(item.id) === String(params.get("caregiver")),
    ) ||
    caregivers[0] || {
      id: "",
      name: "Select a caregiver",
      role: "Verified caregiver",
      rate: 0,
      image: "",
      tags: [],
    };
  const [careType, setCareType] = useState("Senior Care");
  const [tasks, setTasks] = useState([
    "Medication Reminders",
    "Mobility Assistance",
  ]);
  const [hours, setHours] = useState(20);
  const [time, setTime] = useState("Mornings");
  const [preferredStartTime, setPreferredStartTime] = useState("09:00");
  const [serviceStartDate, setServiceStartDate] = useState(localDate);
  const [serviceEndDate, setServiceEndDate] = useState(
    addDateDays(localDate(), 27),
  );
  const [preferredDays, setPreferredDays] = useState(["Mon", "Wed", "Fri"]);
  const [gender, setGender] = useState("No Preference");
  const [budget, setBudget] = useState("$15,000 - $25,000");
  const [transportation, setTransportation] = useState("");
  const [saving, setSaving] = useState(false);

  const estimate = useMemo(() => {
    const period = servicePeriod(
      serviceStartDate,
      serviceEndDate,
      preferredDays,
      hours,
    );
    const careHours = Math.round(caregiver.rate * period.hours * 100) / 100;
    const medicalPremium = careType === "Nursing Care" ? 5000 : 2500;
    const platformFee = 2500;
    return {
      careHours,
      medicalPremium,
      platformFee,
      total: careHours + medicalPremium + platformFee,
      visits: period.visits,
      totalServiceHours: period.hours,
    };
  }, [
    careType,
    caregiver.rate,
    hours,
    preferredDays,
    serviceEndDate,
    serviceStartDate,
  ]);

  const toggleTask = (task) =>
    setTasks((current) =>
      current.includes(task)
        ? current.filter((item) => item !== task)
        : [...current, task],
    );
  const toggleDay = (day) =>
    setPreferredDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day],
    );

  const finalize = async () => {
    setError("");
    if (!caregiver.id) {
      setError("Select a published caregiver before creating a care plan.");
      return;
    }
    if (!user || account?.role !== "client") {
      navigate("/login?type=family", {
        state: { from: `${location.pathname}${location.search}` },
      });
      return;
    }
    if (!preferredDays.length) {
      setError("Select at least one preferred service day.");
      return;
    }
    if (!serviceEndDate || serviceEndDate < serviceStartDate) {
      setError("Select a last service date on or after the first date.");
      return;
    }
    setSaving(true);
    const payload = {
      selectedCaregiverId: caregiver.id || "",
      selectedCaregiver: {
        name: caregiver.name,
        role: caregiver.role,
        rate: caregiver.rate,
        image: caregiver.image,
        tags: caregiver.tags || [],
      },
      careType,
      tasks,
      hoursPerWeek: hours,
      preferredTime: time,
      preferredStartTime,
      serviceStartDate,
      serviceEndDate,
      preferredDays,
      caregiverGender: gender,
      budgetRange: budget,
      transportation,
    };
    try {
      const saved = await createCarePlan(payload);
      sessionStorage.setItem(
        "swiftopsbd-care-plan",
        JSON.stringify({ ...payload, carePlanId: saved.carePlanId, estimate }),
      );
      navigate(
        `/care-checkout?caregiver=${caregiver.id}&plan=${saved.carePlanId}`,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-3xl font-semibold">{cms.headline}</h1>
            <p className="text-[#4c5261]">
              {cms.subheadline}
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
                    onClick={() => {
                      setTime(label);
                      setPreferredStartTime(timeDefaults[label]);
                    }}
                    key={label}
                  >
                    <Icon className="mx-auto" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-4 rounded-xl border border-blue-200 bg-[#f7f9ff] p-4 sm:grid-cols-3">
                <label>
                  <span className="plan-label flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#0755d3]" />
                    First service date
                  </span>
                  <input
                    className="client-input mt-2"
                    type="date"
                    min={localDate()}
                    value={serviceStartDate}
                    onChange={(event) => {
                      const nextStart = event.target.value;
                      setServiceStartDate(nextStart);
                      if (serviceEndDate < nextStart) {
                        setServiceEndDate(addDateDays(nextStart, 27));
                      }
                    }}
                    required
                  />
                </label>
                <label>
                  <span className="plan-label flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#0755d3]" />
                    Last service date
                  </span>
                  <input
                    className="client-input mt-2"
                    type="date"
                    min={serviceStartDate}
                    value={serviceEndDate}
                    onChange={(event) =>
                      setServiceEndDate(event.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  <span className="plan-label flex items-center gap-2">
                    <Clock3 className="size-4 text-[#0755d3]" />
                    Exact visit start time
                  </span>
                  <input
                    className="client-input mt-2"
                    type="time"
                    value={preferredStartTime}
                    onChange={(event) =>
                      setPreferredStartTime(event.target.value)
                    }
                    required
                  />
                </label>
                <p className="text-xs leading-5 text-[#606878] sm:col-span-3">
                  The administrator will generate the caregiver&apos;s visits
                  from this date, on your selected days, at this exact time.
                </p>
              </div>
              <p className="plan-label mt-8">Preferred service days</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {weekDays.map((day) => (
                  <button
                    className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                      preferredDays.includes(day)
                        ? "border-[#0755d3] bg-[#0755d3] text-white"
                        : "bg-white text-[#4c5261]"
                    }`}
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
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
                    <option>$15,000 - $25,000</option>
                    <option>$25,000 - $50,000</option>
                    <option>$50,000+</option>
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
                <h2 className="text-2xl font-semibold">Care Period Estimate</h2>
                <p className="text-sm">
                  {estimate.visits} visits ·{" "}
                  {estimate.totalServiceHours.toLocaleString()} care hours
                </p>
              </div>
              <dl className="space-y-5 p-6">
                {[
                  ["Care Hours", estimate.careHours],
                  ["Medical Premium", estimate.medicalPremium],
                  ["Service Fee", estimate.platformFee],
                ].map(([label, value]) => (
                  <div className="flex justify-between" key={label}>
                    <dt>{label}</dt>
                    <dd>${value.toLocaleString()}</dd>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-5 text-2xl font-bold">
                  <dt>Total Plan</dt>
                  <dd className="text-emerald-700">
                    ${estimate.total.toLocaleString()}
                  </dd>
                </div>
              </dl>
              <button
                className="mx-6 mb-6 flex w-[calc(100%-3rem)] justify-center gap-2 rounded-lg bg-[#0649ad] py-4 font-semibold text-white"
                type="button"
                onClick={finalize}
                disabled={saving}
              >
                {saving ? "Saving care plan..." : cms.primaryButton} <ArrowRight />
              </button>
              {error && (
                <p className="mx-6 mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}
              <p className="pb-6 text-center text-xs">
                <ShieldCheck className="inline size-4" /> Secure test payment
                via Stripe
              </p>
            </section>
            <section className="rounded-xl border bg-white p-6">
              <div className="flex gap-4">
                {caregiver.image ? (
                  <img
                    className="size-16 rounded-xl object-cover"
                    src={caregiver.image}
                    alt={caregiver.name}
                  />
                ) : (
                  <span className="grid size-16 place-items-center rounded-xl bg-blue-100 font-semibold text-[#0649ad]">
                    CG
                  </span>
                )}
                <div>
                  <h3 className="font-semibold">{caregiver.name}</h3>
                  <p className="text-xs">{caregiver.role}</p>
                  <p className="mt-1 text-sm font-semibold text-[#0649ad]">
                    {caregiver.rate > 0
                      ? `$${caregiver.rate}/hour`
                      : "Rate unavailable"}
                  </p>
                </div>
              </div>
              {!!caregiver.tags?.length && (
                <p className="mt-4 text-xs text-[#4c5261]">
                  {caregiver.tags.join(" · ")}
                </p>
              )}
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
