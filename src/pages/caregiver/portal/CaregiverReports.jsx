import {
  Calculator,
  CalendarDays,
  CircleCheck,
  FileChartColumn,
  Info,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listMyVisits } from "../../../services/assignmentService";
import { getPaymentSummary } from "../../../services/paymentService";

const money = (value) =>
  Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  });

const recordDate = (record) =>
  new Date(
    record.clockOutAt ||
      record.completedAt ||
      record.createdAt ||
      record.updatedAt ||
      (record.date ? `${record.date}T00:00:00` : 0),
  );

const validRating = (visit) => {
  const value = Number(
    visit.patientRating ?? visit.clientRating ?? visit.rating,
  );
  return value >= 1 && value <= 5 ? value : null;
};

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const downloadCsv = (filename, headers, rows) => {
  const content = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const CaregiverReports = () => {
  const [range, setRange] = useState("30");
  const [showFilters, setShowFilters] = useState(false);
  const [service, setService] = useState("All Services");
  const [visits, setVisits] = useState([]);
  const [wallet, setWallet] = useState({ ledger: [], agreements: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [visitRecords, paymentSummary] = await Promise.all([
          listMyVisits(),
          getPaymentSummary(),
        ]);
        if (!active) return;
        setVisits(visitRecords);
        setWallet(paymentSummary);
        setError("");
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const interval = window.setInterval(load, 60000);
    window.addEventListener("focus", load);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", load);
    };
  }, []);

  const reportData = useMemo(() => {
    const days = Number(range);
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - days);
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - days);

    const completed = visits.filter(
      (visit) =>
        visit.status === "completed" &&
        recordDate(visit) >= currentStart &&
        recordDate(visit) <= now,
    );
    const previous = visits.filter(
      (visit) =>
        visit.status === "completed" &&
        recordDate(visit) >= previousStart &&
        recordDate(visit) < currentStart,
    );
    const earnings = (wallet.ledger || []).filter(
      (entry) =>
        entry.type === "earning" &&
        entry.status === "completed" &&
        recordDate(entry) >= currentStart &&
        recordDate(entry) <= now,
    );
    const agreementTypes = new Map(
      (wallet.agreements || []).map((agreement) => [
        agreement.assignmentId,
        agreement.careType || agreement.serviceType || "Care Services",
      ]),
    );
    const visitTypes = new Map(
      visits.map((visit) => [
        visit.assignmentId,
        visit.careType || "Care Services",
      ]),
    );
    const groups = new Map();
    const ensure = (name) => {
      const key = name || "Care Services";
      if (!groups.has(key)) {
        groups.set(key, {
          name: key,
          visits: 0,
          previousVisits: 0,
          revenue: 0,
          ratings: [],
        });
      }
      return groups.get(key);
    };
    completed.forEach((visit) => {
      const group = ensure(visit.careType);
      group.visits += 1;
      const rating = validRating(visit);
      if (rating) group.ratings.push(rating);
    });
    previous.forEach((visit) => {
      ensure(visit.careType).previousVisits += 1;
    });
    earnings.forEach((entry) => {
      const careType =
        entry.careType ||
        agreementTypes.get(entry.assignmentId) ||
        visitTypes.get(entry.assignmentId) ||
        "Care Services";
      ensure(careType).revenue += Number(entry.amount || 0);
    });
    const performance = [...groups.values()]
      .map((group) => {
        const difference = group.visits - group.previousVisits;
        const trend =
          group.previousVisits > 0
            ? Math.round((Math.abs(difference) / group.previousVisits) * 100)
            : group.visits > 0
              ? 100
              : 0;
        return {
          ...group,
          rating: group.ratings.length
            ? group.ratings.reduce((sum, value) => sum + value, 0) /
              group.ratings.length
            : null,
          trend,
          direction: difference >= 0 ? "up" : "down",
        };
      })
      .sort((left, right) => right.visits - left.visits);
    return { completed, earnings, performance, currentStart, now };
  }, [range, visits, wallet]);

  const selectedService =
    service === "All Services" ||
    reportData.performance.some((item) => item.name === service)
      ? service
      : "All Services";
  const visiblePerformance =
    selectedService === "All Services"
      ? reportData.performance
      : reportData.performance.filter(
          (item) => item.name === selectedService,
        );

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const exportVisits = () => {
    downloadCsv(
      "caregiver-visit-log.csv",
      ["Date", "Service", "Client", "Status", "Hours", "Rating"],
      reportData.completed.map((visit) => [
        visit.date,
        visit.careType || "Care Services",
        visit.clientName || "",
        visit.status,
        (Number(visit.durationSeconds || 0) / 3600).toFixed(2),
        validRating(visit) || "",
      ]),
    );
    showNotice("Visit log downloaded.");
  };

  const exportEarnings = () => {
    downloadCsv(
      "caregiver-earnings-summary.csv",
      ["Date", "Description", "Client", "Amount (BDT)", "Status"],
      reportData.earnings.map((entry) => [
        recordDate(entry).toLocaleString(),
        entry.description || "Care service earning",
        entry.clientName || "",
        entry.amount,
        entry.status,
      ]),
    );
    showNotice("Earnings summary downloaded.");
  };

  const exportPerformance = () => {
    downloadCsv(
      "caregiver-service-performance.csv",
      ["Service", "Visits", "Revenue (BDT)", "Average Rating", "Trend"],
      visiblePerformance.map((item) => [
        item.name,
        item.visits,
        item.revenue,
        item.rating?.toFixed(1) || "",
        `${item.direction === "up" ? "+" : "-"}${item.trend}%`,
      ]),
    );
    showNotice("Service performance report downloaded.");
  };

  const cards = [
    {
      title: "Visit Log",
      detail: `${reportData.completed.length} completed visit${reportData.completed.length === 1 ? "" : "s"}`,
      icon: FileChartColumn,
      iconClass: "bg-red-100 text-red-600",
      action: exportVisits,
    },
    {
      title: "Earnings Summary",
      detail: `${reportData.earnings.length} completed earning entr${reportData.earnings.length === 1 ? "y" : "ies"}`,
      icon: Calculator,
      iconClass: "bg-emerald-100 text-emerald-700",
      action: exportEarnings,
    },
    {
      title: "Service Performance",
      detail: `${reportData.performance.length} active service type${reportData.performance.length === 1 ? "" : "s"}`,
      icon: ShieldCheck,
      iconClass: "bg-blue-100 text-[#4c5261]",
      action: exportPerformance,
    },
  ];

  return (
    <div className="mx-auto max-w-[1020px] px-4 py-6 sm:px-8 sm:py-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <p className="text-[#4c5261]">
          Review your completed visits, earnings, and patient feedback.
        </p>
        <div className="flex flex-wrap gap-3 lg:ml-auto">
          <label className="flex w-full min-w-0 items-center gap-3 rounded-lg border border-[#c5cad8] bg-white px-4 py-2.5 text-sm sm:w-auto sm:min-w-[220px]">
            <CalendarDays className="size-5" />
            <select
              className="min-w-0 flex-1 bg-transparent outline-none"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
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
              value={selectedService}
              onChange={(event) => setService(event.target.value)}
            >
              <option>All Services</option>
              {reportData.performance.map((item) => (
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

      {error && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CircleCheck className="size-5" /> {notice}
        </div>
      )}

      <section className="mt-7 rounded-2xl border border-[#c5cad8] bg-[#eef3ff] p-4 sm:p-6">
        <h2 className="text-lg font-semibold sm:text-xl">
          Reports &amp; Data Export
        </h2>
        <p className="mt-1 text-xs text-[#667085]">
          {reportData.currentStart.toLocaleDateString()} –{" "}
          {reportData.now.toLocaleDateString()}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {cards.map(({ title, detail, icon: Icon, iconClass, action }) => (
            <button
              className="flex min-h-24 w-full items-center gap-4 rounded-xl border border-[#d3d9e7] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#7da5e4] hover:shadow-md sm:min-h-36 sm:gap-5 sm:p-6"
              key={title}
              type="button"
              onClick={action}
              disabled={loading}
            >
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-lg ${iconClass}`}
              >
                <Icon className="size-6" />
              </span>
              <span>
                <b className="block leading-6">{title}</b>
                <small className="mt-1 block text-[#4c5261]">
                  {loading ? "Loading actual records..." : detail}
                </small>
                <small className="mt-2 block font-medium text-[#0649ad]">
                  Download CSV
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
        <header className="flex items-center border-b border-[#c5cad8] bg-[#edf3ff] px-4 py-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#4c5261]">
            Service Performance Breakdown
          </p>
          <Info className="ml-auto size-5 text-[#4c5261]" />
        </header>
        {!loading && !visiblePerformance.length && (
          <p className="p-10 text-center text-sm text-[#667085]">
            No completed visits or earnings exist for this date range.
          </p>
        )}
        <div className="grid gap-3 p-4 md:hidden">
          {visiblePerformance.map((item) => (
            <article
              className="rounded-xl border border-[#d7dbe7] bg-[#f8faff] p-4"
              key={item.name}
            >
              <div className="flex items-center justify-between gap-3">
                <b>{item.name}</b>
                <span
                  className={`text-xs font-semibold ${item.direction === "up" ? "text-emerald-700" : "text-red-600"}`}
                >
                  {item.direction === "up" ? "▲" : "▼"} {item.trend}%
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[#d7dbe7] pt-3 text-center">
                <div>
                  <dt className="text-[10px] uppercase text-[#4c5261]">
                    Visits
                  </dt>
                  <dd className="mt-1 font-semibold">{item.visits}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-[#4c5261]">
                    Revenue
                  </dt>
                  <dd className="mt-1 font-semibold">${money(item.revenue)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-[#4c5261]">
                    Rating
                  </dt>
                  <dd className="mt-1 font-semibold text-amber-700">
                    {item.rating ? `★ ${item.rating.toFixed(1)}` : "Not rated"}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        {!!visiblePerformance.length && (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#c5cad8] text-xs uppercase tracking-[0.08em] text-[#4c5261]">
                <tr>
                  <th className="px-6 py-4 font-medium">Service Type</th>
                  <th className="px-6 py-4 font-medium">Visits</th>
                  <th className="px-6 py-4 font-medium">Revenue ($)</th>
                  <th className="px-6 py-4 font-medium">Avg. Rating</th>
                  <th className="px-6 py-4 text-right font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {visiblePerformance.map((item) => (
                  <tr
                    className="border-b border-[#d7dbe7] last:border-b-0"
                    key={item.name}
                  >
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4">{item.visits}</td>
                    <td className="px-6 py-4">{money(item.revenue)}</td>
                    <td className="px-6 py-4">
                      {item.rating ? `★ ${item.rating.toFixed(1)}` : "Not rated"}
                    </td>
                    <td
                      className={`px-6 py-4 text-right ${item.direction === "up" ? "text-emerald-700" : "text-red-600"}`}
                    >
                      {item.direction === "up" ? "▲" : "▼"} {item.trend}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default CaregiverReports;
