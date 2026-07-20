import { ArrowLeft, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { assignedClients } from "../../../data/caregiverPortalData";
const CaregiverActiveVisit = () => {
  const c = assignedClients[0];
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div>
          <Link className="flex gap-2 text-[#0649ad]" to="/caregiver/dashboard">
            <ArrowLeft />
            Back to Dashboard
          </Link>
          <span className="mt-4 inline-block bg-[#dce8ff] px-2 text-xs">
            ● Active Visit
          </span>
          <h1 className="mt-2 text-3xl font-semibold">{c.name}</h1>
          <p>Post-Op Recovery</p>
        </div>
        <section className="rounded-xl border bg-white p-5">
          <small>DURATION</small>
          <strong className="block font-mono text-4xl text-[#0649ad]">
            01:24:30
          </strong>
          <button className="mt-2 bg-red-700 px-5 py-2 text-white">
            End Emergency
          </button>
        </section>
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-[285px_1fr_390px]">
        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-5 text-center">
            <img
              className="mx-auto size-24 rounded-full object-cover"
              src={c.image}
            />
            <h2 className="mt-3 text-xl font-semibold">{c.shortName}</h2>
            <p className="mt-5 text-left text-sm">
              <Phone className="inline size-4" /> Emergency Contact
            </p>
          </section>
          <section className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">Care Notes</h2>
            <textarea
              className="mt-3 min-h-48 w-full border p-3"
              placeholder="Record patient observations..."
            />
          </section>
        </div>
        <section className="rounded-xl border bg-white p-4">
          <h2 className="text-xl font-semibold">Medication Schedule</h2>
          {["Amlodipine", "Metformin"].map((x) => (
            <div className="mt-4 rounded-xl border p-4" key={x}>
              <b>💊 {x}</b>
              <p className="text-sm">500mg • Oral • With Meals</p>
              <button className="mt-5 w-full bg-[#0755d3] py-2 text-white">
                ✓ Administer
              </button>
            </div>
          ))}
        </section>
        <div>
          <section className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-semibold">Care Tasks</h2>
            {[
              "Wound Dressing Change",
              "Bathing Assistance",
              "Mobility Exercises (15 mins)",
            ].map((x) => (
              <label className="flex gap-4 border-b py-5" key={x}>
                <input type="checkbox" />
                {x}
              </label>
            ))}
          </section>
          <button className="mt-6 w-full rounded-xl bg-[#0755d3] py-5 text-xl font-semibold text-white">
            Submit Report & End Visit
          </button>
        </div>
      </div>
      <footer className="mt-40 text-center text-sm tracking-[.2em] text-[#4c5261]">
        🛡 SWIFTOPSBD SECURITY
      </footer>
    </div>
  );
};
export default CaregiverActiveVisit;
