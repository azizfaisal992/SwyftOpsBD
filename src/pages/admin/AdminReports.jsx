import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  RefreshCw,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAdminReportsOverview } from "../../services/adminOverviewService";

const ranges = [
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "year", label: "This Year" },
];

const money = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;

const decimal = (value) =>
  Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 1,
  });

const escapeCsv = (value) =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;

const AdminReports = () => {
  const [range, setRange] = useState("30d");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const retrieveReport = useCallback(
    () => getAdminReportsOverview(range),
    [range],
  );

  const refreshReport = async () => {
    setLoading(true);
    setError("");
    try {
      setReport(await retrieveReport());
    } catch (requestError) {
      setError(requestError.message || "The report could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    retrieveReport()
      .then((data) => {
        if (active) setReport(data);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "The report could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retrieveReport]);

  const exportReport = () => {
    if (!report) return;
    const rows = [
      ["SwiftOpsBD Analytics Report"],
      ["Period start", report.period.from],
      ["Period end", report.period.to],
      [],
      ["Summary", "Value"],
      ["Gross client billing", report.summary.grossRevenue],
      ["Caregiver payouts", report.summary.caregiverPayouts],
      ["Platform revenue", report.summary.platformNetRevenue],
      ["Completed visits", report.summary.completedVisits],
      ["Care hours", report.summary.careHours],
      ["Incidents", report.summary.incidents],
      ["Active clients", report.summary.activeClients],
      ["Active caregivers", report.summary.activeCaregivers],
      ["Open requests", report.summary.openRequests],
      [],
      [
        "Service",
        "Visits",
        "Completed",
        "Completion rate",
        "Care hours",
        "Revenue",
      ],
      ...report.servicePerformance.map((item) => [
        item.service,
        item.visits,
        item.completedVisits,
        `${item.completionRate}%`,
        item.careHours,
        item.revenue,
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `swiftopsbd-report-${report.period.key}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-[1380px] p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Live operational, financial, quality, and service performance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:ml-auto">
          <label className="flex min-w-44 flex-1 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 sm:flex-none">
            <CalendarDays className="size-4 text-slate-500" />
            <select
              className="w-full bg-transparent py-2.5 text-sm outline-none"
              value={range}
              onChange={(event) => {
                setLoading(true);
                setError("");
                setRange(event.target.value);
              }}
            >
              {ranges.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="grid size-10 place-items-center rounded-lg border border-slate-300 bg-white text-[#0755b7] disabled:opacity-50"
            type="button"
            title="Refresh report"
            disabled={loading}
            onClick={refreshReport}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755b7] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:flex-none"
            type="button"
            disabled={!report}
            onClick={exportReport}
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </header>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !report ? (
        <ReportSkeleton />
      ) : report ? (
        <ReportContent report={report} />
      ) : null}
    </main>
  );
};

const ReportContent = ({ report }) => {
  const summaryCards = [
    {
      label: "Gross Client Billing",
      value: money(report.summary.grossRevenue),
      note: `${money(report.summary.platformNetRevenue)} platform revenue`,
      icon: WalletCards,
      tone: "blue",
    },
    {
      label: "Completed Visits",
      value: report.summary.completedVisits.toLocaleString(),
      note: `${report.quality.visitCompletion}% completion rate`,
      icon: CheckCircle2,
      tone: "green",
    },
    {
      label: "Care Hours",
      value: decimal(report.summary.careHours),
      note: `${money(report.summary.caregiverPayouts)} caregiver payouts`,
      icon: Clock3,
      tone: "purple",
    },
    {
      label: "Incident Rate",
      value: `${report.summary.incidentRate}%`,
      note: `${report.summary.incidents} incidents in this period`,
      icon: ShieldCheck,
      tone: "amber",
    },
  ];
  return (
    <>
      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <SummaryCard item={item} key={item.label} />
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <FinancialTrend trends={report.trends} />
        <OperationsSnapshot summary={report.summary} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <ServicePerformance rows={report.servicePerformance} />
        <div className="grid gap-5">
          <QualityOverview quality={report.quality} />
          <ServiceMix rows={report.serviceMix} />
        </div>
      </section>

      <footer className="mt-5 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center">
        <span className="flex items-center gap-2">
          <FileSpreadsheet className="size-4 text-[#0755b7]" />
          Report calculated from Firebase visits, payments, requests,
          verifications, and incidents.
        </span>
        <span className="sm:ml-auto">
          Generated {new Date(report.generatedAt).toLocaleString("en-BD")}
        </span>
      </footer>
    </>
  );
};

const tones = {
  blue: "bg-blue-100 text-[#0755d3]",
  green: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700",
  amber: "bg-amber-100 text-amber-700",
};

const SummaryCard = ({ item }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <span
      className={`grid size-10 place-items-center rounded-lg ${tones[item.tone]}`}
    >
      <item.icon className="size-5" />
    </span>
    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {item.label}
    </p>
    <strong className="mt-1 block text-2xl">{item.value}</strong>
    <small className="mt-2 block text-slate-500">{item.note}</small>
  </article>
);

const FinancialTrend = ({ trends }) => {
  const maximum = Math.max(
    1,
    ...trends.flatMap((item) => [item.revenue, item.payout]),
  );
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <header className="flex flex-wrap items-start gap-3">
        <div>
          <h2 className="text-lg font-semibold">Billing & Payout Trend</h2>
          <p className="text-xs text-slate-500">
            Actual successful payments by period
          </p>
        </div>
        <div className="ml-auto flex gap-3 text-[10px]">
          <Legend color="bg-[#0755b7]">Client billing</Legend>
          <Legend color="bg-emerald-500">Caregiver payout</Legend>
        </div>
      </header>
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex h-64 min-w-[560px] items-end gap-4 border-b border-slate-200 px-2">
          {trends.map((item) => (
            <div
              className="group relative flex h-full flex-1 items-end justify-center gap-1"
              key={item.label}
            >
              <span
                className="w-1/2 rounded-t bg-[#0755b7]"
                style={{ height: `${Math.max(2, item.revenue / maximum * 100)}%` }}
              />
              <span
                className="w-1/2 rounded-t bg-emerald-400"
                style={{ height: `${Math.max(2, item.payout / maximum * 100)}%` }}
              />
              <span className="invisible absolute top-1 z-10 rounded bg-slate-900 px-2 py-1 text-[10px] whitespace-nowrap text-white group-hover:visible">
                {money(item.revenue)} billed · {money(item.payout)} paid
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex min-w-[560px] justify-around text-[10px] text-slate-500">
          {trends.map((item) => <span key={item.label}>{item.label}</span>)}
        </div>
      </div>
    </article>
  );
};

const OperationsSnapshot = ({ summary }) => {
  const metrics = [
    {
      label: "Active clients",
      value: summary.activeClients,
      icon: Users,
      color: "text-blue-700 bg-blue-100",
    },
    {
      label: "Active caregivers",
      value: summary.activeCaregivers,
      icon: Activity,
      color: "text-emerald-700 bg-emerald-100",
    },
    {
      label: "Open requests",
      value: summary.openRequests,
      icon: BarChart3,
      color: "text-amber-700 bg-amber-100",
    },
    {
      label: "Requests submitted",
      value: summary.requestsCreated,
      icon: CalendarDays,
      color: "text-purple-700 bg-purple-100",
    },
  ];
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Operations Snapshot</h2>
      <p className="text-xs text-slate-500">
        Current workforce plus activity in the selected period
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div className="rounded-lg border border-slate-200 p-3" key={label}>
            <span className={`grid size-8 place-items-center rounded ${color}`}>
              <Icon className="size-4" />
            </span>
            <strong className="mt-3 block text-xl">{value}</strong>
            <small className="text-slate-500">{label}</small>
          </div>
        ))}
      </div>
    </article>
  );
};

const ServicePerformance = ({ rows }) => (
  <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <header className="p-5">
      <h2 className="text-lg font-semibold">Service Performance</h2>
      <p className="text-xs text-slate-500">
        Completed work and billing by care category
      </p>
    </header>
    {rows.length ? (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-xs">
          <thead className="bg-slate-50 uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Service</th>
              <th className="px-3 py-3">Visits</th>
              <th className="px-3 py-3">Completed</th>
              <th className="px-3 py-3">Care hours</th>
              <th className="px-3 py-3">Revenue</th>
              <th className="px-5 py-3">Completion</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t border-slate-200" key={row.service}>
                <td className="px-5 py-4 font-semibold">{row.service}</td>
                <td className="px-3 py-4">{row.visits}</td>
                <td className="px-3 py-4">{row.completedVisits}</td>
                <td className="px-3 py-4">{decimal(row.careHours)}</td>
                <td className="px-3 py-4">{money(row.revenue)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-16 overflow-hidden rounded bg-slate-200">
                      <i
                        className="block h-full rounded bg-emerald-500"
                        style={{ width: `${row.completionRate}%` }}
                      />
                    </span>
                    {row.completionRate}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <EmptyState text="No service activity exists in this period." />
    )}
  </article>
);

const QualityOverview = ({ quality }) => {
  const metrics = [
    { label: "Visit completion", value: quality.visitCompletion },
    { label: "Care task completion", value: quality.taskCompletion },
    { label: "GPS geofence compliance", value: quality.geofenceCompliance },
    { label: "Incident resolution", value: quality.incidentResolution },
  ];
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Care Quality</h2>
      <p className="text-xs text-slate-500">Calculated compliance indicators</p>
      <div className="mt-5 space-y-4">
        {metrics.map((item) => (
          <div key={item.label}>
            <div className="flex text-xs">
              <span>{item.label}</span>
              <strong className="ml-auto">{item.value}%</strong>
            </div>
            <span className="mt-2 block h-2 overflow-hidden rounded bg-slate-200">
              <i
                className="block h-full rounded bg-[#0755b7]"
                style={{ width: `${item.value}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    </article>
  );
};

const ServiceMix = ({ rows }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-5">
    <h2 className="text-lg font-semibold">Service Mix</h2>
    <p className="text-xs text-slate-500">Share of scheduled visits</p>
    {rows.length ? (
      <div className="mt-4 space-y-3">
        {rows.slice(0, 6).map((item) => (
          <div key={item.service}>
            <div className="flex text-xs">
              <span>{item.service}</span>
              <strong className="ml-auto">
                {item.visits} · {item.percentage}%
              </strong>
            </div>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded bg-slate-200">
              <i
                className="block h-full rounded bg-emerald-500"
                style={{ width: `${item.percentage}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    ) : (
      <EmptyState text="No visit mix is available." />
    )}
  </article>
);

const Legend = ({ children, color }) => (
  <span className="flex items-center gap-1.5">
    <i className={`size-2.5 rounded-full ${color}`} />
    {children}
  </span>
);

const EmptyState = ({ text }) => (
  <div className="p-8 text-center text-sm text-slate-500">{text}</div>
);

const ReportSkeleton = () => (
  <div className="mt-6 grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }, (_, index) => (
      <div className="h-40 rounded-xl bg-slate-200" key={index} />
    ))}
  </div>
);

export default AdminReports;
