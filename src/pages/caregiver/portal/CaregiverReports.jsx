import {
  Accessibility,
  ArrowRight,
  Calculator,
  CalendarDays,
  CircleCheck,
  FileChartColumn,
  Info,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";

const reports = [
  {
    title: "Monthly Visit Log",
    detail: "October 2026 · 2.4 MB",
    icon: FileChartColumn,
    iconClass: "bg-red-100 text-red-600",
  },
  {
    title: "Annual Earnings Summary",
    detail: "FY 2026 · 1.1 MB",
    icon: Calculator,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Certification Hours",
    detail: "Last 12 Months · 450 KB",
    icon: ShieldCheck,
    iconClass: "bg-blue-100 text-[#4c5261]",
  },
];

const performance = [
  {
    name: "Post-Op Care",
    visits: 42,
    revenue: "21,000",
    rating: "4.9",
    trend: "4%",
    direction: "up",
    icon: Stethoscope,
    iconClass: "bg-blue-100 text-[#0649ad]",
  },
  {
    name: "Routine Checkup",
    visits: 88,
    revenue: "17,600",
    rating: "4.8",
    trend: "11%",
    direction: "up",
    icon: CircleCheck,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Elderly Companion",
    visits: 12,
    revenue: "4,250",
    rating: "5.0",
    trend: "2%",
    direction: "down",
    icon: Accessibility,
    iconClass: "bg-orange-100 text-amber-800",
  },
];

const CaregiverReports = () => {
  const [range, setRange] = useState("30");
  const [showFilters, setShowFilters] = useState(false);
  const [service, setService] = useState("All Services");
  const [notice, setNotice] = useState("");

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const visiblePerformance =
    service === "All Services"
      ? performance
      : performance.filter((item) => item.name === service);

  return (
    <div className="mx-auto max-w-[1020px] px-4 py-6 sm:px-8 sm:py-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-[#4c5261]">
            Review your clinical performance and financial summaries.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:ml-auto">
          <label className="flex w-full min-w-0 items-center gap-3 rounded-lg border border-[#c5cad8] bg-white px-4 py-2.5 text-sm sm:w-auto sm:min-w-[260px]">
            <CalendarDays className="size-5" />
            <select
              className="min-w-0 flex-1 bg-transparent outline-none"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days (Oct 12 - Nov 11)</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last 12 Months</option>
            </select>
          </label>
          <button
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white sm:w-auto ${showFilters ? "bg-[#063b8b]" : "bg-[#0755d3]"}`}
            type="button"
            onClick={() => setShowFilters((current) => !current)}
          >
            <SlidersHorizontal className="size-5" /> More Filters
          </button>
        </div>
      </header>

      {showFilters && (
        <section className="mt-5 flex flex-col gap-4 rounded-xl border border-[#c5cad8] bg-white p-5 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm font-medium">
            Service Type
            <select
              className="mt-2 block w-full rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-4 py-3 outline-none"
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              <option>All Services</option>
              {performance.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <button
            className="w-full rounded-lg border border-[#0649ad] px-5 py-3 text-sm font-semibold text-[#0649ad] sm:w-auto"
            type="button"
            onClick={() => {
              setRange("30");
              setService("All Services");
            }}
          >
            Reset Filters
          </button>
        </section>
      )}

      {notice && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CircleCheck className="size-5" /> {notice}
        </div>
      )}

      <section className="mt-7 min-h-[300px] rounded-2xl border border-[#c5cad8] bg-[#eef3ff] p-4 sm:p-6">
        <h2 className="text-lg font-semibold sm:text-xl">Generated Reports &amp; Document Export</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {reports.map(({ title, detail, icon: Icon, iconClass }) => (
            <button
              className="flex min-h-24 w-full items-center gap-4 rounded-xl border border-[#d3d9e7] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#7da5e4] hover:shadow-md sm:min-h-36 sm:gap-5 sm:p-6"
              key={title}
              type="button"
              onClick={() => showNotice(`${title} export will be generated by the reports API.`)}
            >
              <span className={`grid size-12 shrink-0 place-items-center rounded-lg ${iconClass}`}>
                <Icon className="size-6" />
              </span>
              <span>
                <b className="block leading-6">{title}</b>
                <small className="mt-1 block text-[#4c5261]">{detail}</small>
              </span>
            </button>
          ))}
        </div>
        <button
          className="mx-auto mt-6 flex max-w-full items-center justify-center gap-2 text-center text-sm font-medium text-[#0649ad]"
          type="button"
          onClick={() => showNotice("Custom date-range report form is ready for backend integration.")}
        >
          Request Custom Date Range Report <ArrowRight className="size-5" />
        </button>
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
        <header className="flex items-center border-b border-[#c5cad8] bg-[#edf3ff] px-4 py-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#4c5261]">
            Service Performance Breakdown
          </p>
          <button className="ml-auto" type="button" aria-label="Performance information">
            <Info className="size-5 text-[#4c5261]" />
          </button>
        </header>
        <div className="grid gap-3 p-4 md:hidden">
          {visiblePerformance.map(
            ({
              name,
              visits,
              revenue,
              rating,
              trend,
              direction,
              icon: Icon,
              iconClass,
            }) => (
              <article
                className="rounded-xl border border-[#d7dbe7] bg-[#f8faff] p-4"
                key={name}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full ${iconClass}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <b className="min-w-0 flex-1 font-medium">{name}</b>
                  <span
                    className={`text-xs font-semibold ${direction === "up" ? "text-emerald-700" : "text-red-600"}`}
                  >
                    {direction === "up" ? "▲" : "▼"} {trend}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[#d7dbe7] pt-3 text-center">
                  <div>
                    <dt className="text-[10px] uppercase text-[#4c5261]">Visits</dt>
                    <dd className="mt-1 font-semibold">{visits}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-[#4c5261]">Revenue</dt>
                    <dd className="mt-1 font-semibold">৳{revenue}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-[#4c5261]">Rating</dt>
                    <dd className="mt-1 font-semibold text-amber-700">★ {rating}</dd>
                  </div>
                </dl>
              </article>
            ),
          )}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-[#c5cad8] text-xs uppercase tracking-[0.08em] text-[#4c5261]">
              <tr>
                <th className="px-6 py-4 font-medium">Service Type</th>
                <th className="px-6 py-4 font-medium">Visits</th>
                <th className="px-6 py-4 font-medium">Revenue (৳)</th>
                <th className="px-6 py-4 font-medium">Avg. Rating</th>
                <th className="px-6 py-4 text-right font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {visiblePerformance.map(({ name, visits, revenue, rating, trend, direction, icon: Icon, iconClass }) => (
                <tr className="border-b border-[#d7dbe7] last:border-b-0" key={name}>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-3">
                      <span className={`grid size-9 place-items-center rounded-full ${iconClass}`}>
                        <Icon className="size-5" />
                      </span>
                      <b className="font-medium">{name}</b>
                    </span>
                  </td>
                  <td className="px-6 py-4">{visits}</td>
                  <td className="px-6 py-4">{revenue}</td>
                  <td className="px-6 py-4"><span className="text-amber-700">★</span> {rating}</td>
                  <td className={`px-6 py-4 text-right ${direction === "up" ? "text-emerald-700" : "text-red-600"}`}>
                    {direction === "up" ? "▲" : "▼"} {trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CaregiverReports;
