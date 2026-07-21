import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Bell,
  BriefcaseMedical,
  Clock3,
  History,
  Info,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Pill,
  PlayCircle,
  Printer,
  ReceiptText,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import mapImage from "../../../assets/find-care-map.jpg";
import {
  assignedClients,
  caregiverAccount,
} from "../../../data/caregiverPortalData";

const CaregiverClientDetail = () => {
  const { clientId } = useParams();
  const [notice, setNotice] = useState("");
  const client =
    assignedClients.find((item) => item.id === clientId) ?? assignedClients[0];

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const personalInformation = [
    ["Date of Birth", `May 12, 1948 (${client.age} yrs)`],
    ["Gender", client.gender],
    ["NID Status", "VERIFIED"],
    ["Primary Language", "Bengali, English"],
    ["Blood Group", "O Positive"],
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#101c2d]">
      <header className="flex h-16 items-center border-b border-[#c5cad8] bg-white px-3 sm:px-8">
        <Link
          className="flex items-center gap-4 text-[#0649ad]"
          to="/caregiver/assigned-clients"
          aria-label="Back to assigned clients"
        >
          <ArrowLeft className="size-5" />
          <b className="text-lg sm:text-2xl">SwiftOpsBD</b>
        </Link>
        <div className="ml-auto flex items-center gap-3 text-[#3f4655] sm:gap-5">
          <Bell className="hidden size-5 sm:block" />
          <Link to="/caregiver/notifications" aria-label="Messages">
            <MessageSquare className="size-5" />
          </Link>
          <a className="hidden sm:block" href="tel:+8801700000000" aria-label="Call support">
            <Phone className="size-5" />
          </a>
          <img
            className="size-9 rounded-full object-cover"
            src={caregiverAccount.image}
            alt={caregiverAccount.name}
          />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8 sm:py-10">
        {notice && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <BadgeCheck className="size-5" /> {notice}
          </div>
        )}

        <section className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <img
                className="size-24 rounded-2xl border-4 border-white object-cover shadow-md sm:size-32"
                src={client.image}
                alt={client.name}
              />
              <span className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white shadow">
                <BadgeCheck className="size-4" /> Verified
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                {client.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-[#4c5261]">
                <Info className="size-5 text-[#0649ad]" /> Priority Patient · {client.area}
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-4 lg:ml-auto">
            <Link
              className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-[#dce8ff] px-2 py-3 text-sm font-semibold text-[#0649ad] shadow-sm sm:min-w-40 sm:px-6 sm:py-4 sm:text-lg"
              to="/caregiver/notifications"
            >
              <MessageSquare className="size-5" /> Message
            </Link>
            <a
              className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-[#dce8ff] px-2 py-3 text-sm font-semibold text-[#0649ad] shadow-sm sm:min-w-32 sm:px-6 sm:py-4 sm:text-lg"
              href="tel:+8801700000000"
            >
              <Phone className="size-5" /> Call
            </a>
            <Link
              className="col-span-2 flex min-w-0 items-center justify-center gap-2 rounded-xl bg-[#0649ad] px-2 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 sm:min-w-48 sm:px-6 sm:py-4 sm:text-lg"
              to={`/caregiver/visit/${client.id}`}
            >
              <PlayCircle className="size-5" /> Start Visit
            </Link>
          </div>
        </section>

        <div className="mt-6 lg:hidden">
          <AddressLocationCard client={client} />
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[382px_1fr]">
          <article className="rounded-2xl border border-[#d6dbe8] bg-white p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#0649ad]">
              <Info className="size-5" /> Personal Information
            </h2>
            <dl className="mt-5">
              {personalInformation.map(([label, value]) => (
                <div
                  className="flex items-center justify-between gap-5 border-b border-[#e0e4ed] py-4 last:border-b-0"
                  key={label}
                >
                  <dt className="text-sm text-[#4c5261]">{label}</dt>
                  <dd
                    className={`text-right text-sm font-semibold ${
                      label === "Blood Group" ? "text-red-600" : ""
                    }`}
                  >
                    {label === "NID Status" ? (
                      <span className="rounded bg-emerald-200 px-3 py-1 text-xs text-emerald-800">
                        {value}
                      </span>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="rounded-2xl border border-[#d6dbe8] bg-white p-6">
            <header className="flex items-center">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-[#0649ad]">
                <BriefcaseMedical className="size-5" /> Medical Details
              </h2>
              <span className="ml-auto rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold text-amber-900">
                {client.care}
              </span>
            </header>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <section className="rounded-xl bg-[#eef3ff] p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#4c5261]">
                  Current Medications
                </p>
                <Medication name="Amlodipine (5mg)" detail="Daily - Morning" />
                <Medication name="Metformin (500mg)" detail="Twice Daily - Post Meal" />
              </section>
              <section className="rounded-xl bg-[#eef3ff] p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#4c5261]">
                  Visit Schedule
                </p>
                <div className="mt-4 flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#0755d3] font-semibold text-white">
                    3x
                  </span>
                  <div>
                    <b className="block">Frequency</b>
                    <p className="text-sm text-[#4c5261]">Three times a day</p>
                    <div className="mt-5 flex gap-3">
                      <Clock3 className="size-5 text-[#0755d3]" />
                      <span>
                        <b className="block">Preferred Timing</b>
                        <small className="text-[#4c5261]">Mornings &amp; Afternoons</small>
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="hidden lg:block">
            <AddressLocationCard client={client} />
          </div>

          <article className="rounded-2xl border border-[#d6dbe8] bg-white p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#0649ad]">
              <History className="size-5" /> Visit History
            </h2>
            <div className="mt-6">
              <VisitItem
                title="Afternoon Visit"
                time="Today, 02:30 PM"
                note="Patient was resting comfortably. Blood pressure stable (120/80). Administered afternoon medication; mild knee pain reported."
                completed
              />
              <VisitItem
                title="Morning Visit"
                time="Today, 09:15 AM"
                note="Medications verified and assistance with light breakfast provided."
                completed
              />
              <VisitItem
                title="Night Visit"
                time="Upcoming, 08:00 PM"
                note="Schedule: Evening routine and vitals check."
              />
            </div>
          </article>
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#d6dbe8] bg-white p-5 sm:p-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4 lg:mr-auto">
            <Banknote className="size-7 text-[#0649ad]" />
            <div>
              <h2 className="text-xl font-semibold text-[#0649ad]">Financial Summary</h2>
              <p className="text-sm text-[#4c5261]">Overview of your earnings and payments</p>
            </div>
          </div>
          <FinancialMetric label="Total Earnings" value="৳45,500" highlighted />
          <FinancialMetric label="Last Payment" value="৳2,500" />
          <FinancialMetric label="Payment Date" value="Oct 20, 2026" />
          <button
            className="flex items-center justify-center gap-2 rounded-xl border border-[#0649ad] px-5 py-3 text-sm font-semibold text-[#0649ad]"
            type="button"
            onClick={() => showNotice("Invoice history will be loaded from the payments API.")}
          >
            <ReceiptText className="size-4" /> View Invoices
          </button>
        </section>

        <footer className="mt-10 flex flex-col gap-4 border-t border-[#c5cad8] py-7 text-xs text-[#4c5261] sm:flex-row sm:items-center">
          <span>Last updated: Oct 24, 2026 · 04:12 PM</span>
          <div className="flex gap-5 sm:ml-auto">
            <button className="flex items-center gap-2" type="button" onClick={() => window.print()}>
              <Printer className="size-4" /> Print Profile
            </button>
            <button
              className="flex items-center gap-2"
              type="button"
              onClick={() => showNotice("PDF export will be generated by the caregiver API.")}
            >
              <Share2 className="size-4" /> Export PDF
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

const Medication = ({ name, detail }) => (
  <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#c5cad8] bg-white p-3">
    <Pill className="size-5 shrink-0 text-emerald-700" />
    <span>
      <b className="block text-sm">{name}</b>
      <small className="text-[#4c5261]">{detail}</small>
    </span>
  </div>
);

const VisitItem = ({ title, time, note, completed = false }) => (
  <div className="relative border-l-2 border-[#dbe5f5] pb-6 pl-7 last:pb-0">
    <span className={`absolute -left-[11px] top-0 grid size-5 place-items-center rounded-full text-white ${completed ? "bg-emerald-700" : "bg-[#0755d3]"}`}>
      {completed ? "✓" : "•••"}
    </span>
    <div className="flex gap-4">
      <b className="text-sm">{title}</b>
      <small className="ml-auto shrink-0 text-[#4c5261]">{time}</small>
    </div>
    <small className="text-[#4c5261]">Caregiver: {caregiverAccount.name}</small>
    <p className={`mt-2 text-sm leading-5 ${completed ? "rounded-lg border border-[#c5cad8] bg-[#f8f9ff] p-3" : "italic text-[#4c5261]"}`}>
      {note}
    </p>
  </div>
);

const FinancialMetric = ({ label, value, highlighted = false }) => (
  <div className={`min-w-32 rounded-xl px-5 py-3 ${highlighted ? "bg-[#eef3ff]" : ""}`}>
    <small className="block uppercase tracking-[0.08em] text-[#4c5261]">{label}</small>
    <b className="mt-1 block">{value}</b>
  </div>
);

const AddressLocationCard = ({ client }) => (
  <article className="overflow-hidden rounded-2xl border border-[#d6dbe8] bg-white">
    <div className="p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-[#0649ad]">
        <MapPin className="size-5" /> Address &amp; Location
      </h2>
      <p className="mt-2 text-sm text-[#4c5261]">
        House 24, Road 12, Block G, {client.area} 1212
      </p>
    </div>
    <div className="relative h-64 overflow-hidden bg-[#27303b] sm:h-80">
      <img
        className="h-full w-full object-cover"
        src={mapImage}
        alt={`Map showing ${client.area}`}
      />
      <span className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-xs shadow-lg sm:right-auto">
        <Navigation className="size-5 shrink-0 text-[#0649ad]" /> 8 mins from
        your current location
      </span>
    </div>
  </article>
);

export default CaregiverClientDetail;
