import {
  CalendarDays,
  Download,
  Radio,
  ShieldCheck,
  TrendingUp,
  UserRoundCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import mapImage from "../../assets/find-care-map.jpg";

const stats = [
  {
    label: "Total Active Clients",
    value: "2,847",
    change: "+12%",
    note: "vs last month",
    icon: Users,
    tone: "blue",
  },
  {
    label: "Active Caregivers",
    value: "1,203",
    change: "+5%",
    note: "new registrations",
    icon: UserRoundCheck,
    tone: "green",
  },
  {
    label: "Visits Today",
    value: "342",
    change: "-2%",
    note: "from yesterday",
    icon: CalendarDays,
    tone: "blue",
  },
  {
    label: "Live Visits Now",
    value: "89",
    change: "Live",
    note: "geolocation tracking",
    icon: Radio,
    tone: "green",
  },
  {
    label: "Pending Verifications",
    value: "24",
    change: "Urgent 4",
    note: "queue depth",
    icon: ShieldCheck,
    tone: "amber",
  },
  {
    label: "Pending Requests",
    value: "17",
    change: "8 ready",
    note: "matches to review",
    icon: CalendarDays,
    tone: "amber",
  },
  {
    label: "Today's Revenue",
    value: "৳284,500",
    change: "+24%",
    note: "from average day",
    icon: WalletCards,
    tone: "green",
  },
  {
    label: "Payout Liability",
    value: "৳198,300",
    change: "Due in 48h",
    note: "settlement required",
    icon: WalletCards,
    tone: "red",
  },
];

const tones = {
  blue: "bg-blue-100 text-[#0755d3]",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-600",
};

const AdminDashboard = () => (
  <div className="mx-auto max-w-[1280px] p-4 sm:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div>
        <h1 className="text-2xl font-semibold">Operations Overview</h1>
        <p className="mt-1 text-sm text-[#515867]">
          Welcome back, administrator. Here is what is happening at SwiftOpsBD
          today.
        </p>
      </div>
      <div className="flex gap-2 sm:ml-auto">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c5cad8] bg-white px-4 py-2.5 text-sm sm:flex-none"
          type="button"
        >
          <CalendarDays className="size-4" /> Jul 22, 2026
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-4 py-2.5 text-sm font-semibold text-white sm:flex-none"
          type="button"
        >
          <Download className="size-4" /> Export
        </button>
      </div>
    </div>

    <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
      {stats.map(({ label, value, change, note, icon: Icon, tone }) => (
        <article
          className="h-full min-h-36 rounded-xl border-2 border-[#cbd3e1] bg-white p-4 shadow-sm transition hover:border-[#9eb2d3] hover:shadow-md sm:p-5"
          key={label}
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#606878] sm:text-sm">
                {label}
              </p>
              <b className="mt-2 block text-xl sm:text-2xl">{value}</b>
            </div>
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}
            >
              <Icon className="size-5" />
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs">
            <span className={`rounded px-2 py-1 font-semibold ${tones[tone]}`}>
              {change}
            </span>
            <span className="text-[#606878]">{note}</span>
          </div>
        </article>
      ))}
    </section>

    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <article className="rounded-xl border border-[#d2d7e4] bg-white p-5 sm:p-6">
        <header className="flex flex-wrap items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold">Revenue vs Payout</h2>
            <p className="text-xs text-[#606878]">
              Financial distribution — last 30 days
            </p>
          </div>
          <div className="ml-auto flex gap-3 text-xs">
            <span className="text-[#0755d3]">● Billing</span>
            <span className="text-emerald-700">● Payout</span>
          </div>
        </header>
        <div className="mt-7 flex h-60 items-end justify-around gap-2 border-b border-l border-[#c5cad8] px-3">
          {[42, 65, 52, 78, 62, 88, 70, 92, 76, 96].map((height) => (
            <div className="flex h-full flex-1 items-end gap-0.5" key={height}>
              <span
                className="w-1/2 rounded-t bg-[#0755d3]"
                style={{ height: `${height}%` }}
              />
              <span
                className="w-1/2 rounded-t bg-emerald-500"
                style={{ height: `${Math.max(25, height - 18)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-[#606878]">
          <span>Jun 22</span>
          <span>Jul 01</span>
          <span>Jul 10</span>
          <span>Today</span>
        </div>
      </article>

      <article className="overflow-hidden rounded-xl border border-[#d2d7e4] bg-white">
        <header className="flex items-center p-5">
          <h2 className="text-lg font-semibold">Active Visits Right Now</h2>
          <span className="ml-3 rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
            ● 89 LIVE
          </span>
          <Link
            className="ml-auto text-xs font-semibold text-[#0649ad] hover:underline"
            to="/admin/live-operations"
          >
            View Full Map
          </Link>
        </header>
        <div className="relative h-72 bg-slate-700 sm:h-[330px]">
          <img
            className="h-full w-full object-cover opacity-55 grayscale"
            src={mapImage}
            alt="Map showing current active visits"
          />
          <div className="absolute inset-0">
            <MapMarker className="left-[28%] top-[34%]" color="bg-blue-500" />
            <MapMarker className="left-[51%] top-[57%]" color="bg-red-500" />
            <MapMarker className="left-[72%] top-[38%]" color="bg-blue-500" />
            <MapMarker className="left-[77%] top-[66%]" color="bg-red-500" />
          </div>
        </div>
      </article>
    </section>
  </div>
);

const MapMarker = ({ className, color }) => (
  <span
    className={`absolute grid size-5 place-items-center rounded-full border-4 border-white shadow ${className} ${color}`}
  >
    <TrendingUp className="size-2 text-white" />
  </span>
);

export default AdminDashboard;
