import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  MoreHorizontal,
  PieChart,
  Plus,
  RefreshCw,
  ShieldCheck,
  Star,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const summaryData = {
  "Last 30 Days": [
    {
      label: "Gross Revenue",
      value: "৳2.84M",
      change: "+12.5%",
      note: "vs previous period",
      icon: WalletCards,
      tone: "blue",
      direction: "up",
    },
    {
      label: "Completed Visits",
      value: "3,428",
      change: "+8.1%",
      note: "96.2% completion",
      icon: CheckCircle2,
      tone: "green",
      direction: "up",
    },
    {
      label: "Care Hours",
      value: "18,640",
      change: "+6.4%",
      note: "5.4 hours per visit",
      icon: Clock3,
      tone: "purple",
      direction: "up",
    },
    {
      label: "Incident Rate",
      value: "0.7%",
      change: "-0.3%",
      note: "24 cases reviewed",
      icon: ShieldCheck,
      tone: "amber",
      direction: "down",
    },
  ],
  "Last 90 Days": [
    {
      label: "Gross Revenue",
      value: "৳7.91M",
      change: "+18.2%",
      note: "vs previous period",
      icon: WalletCards,
      tone: "blue",
      direction: "up",
    },
    {
      label: "Completed Visits",
      value: "9,704",
      change: "+11.4%",
      note: "95.8% completion",
      icon: CheckCircle2,
      tone: "green",
      direction: "up",
    },
    {
      label: "Care Hours",
      value: "53,280",
      change: "+9.7%",
      note: "5.5 hours per visit",
      icon: Clock3,
      tone: "purple",
      direction: "up",
    },
    {
      label: "Incident Rate",
      value: "0.9%",
      change: "-0.1%",
      note: "87 cases reviewed",
      icon: ShieldCheck,
      tone: "amber",
      direction: "down",
    },
  ],
  "This Year": [
    {
      label: "Gross Revenue",
      value: "৳28.6M",
      change: "+22.4%",
      note: "year over year",
      icon: WalletCards,
      tone: "blue",
      direction: "up",
    },
    {
      label: "Completed Visits",
      value: "34,920",
      change: "+16.8%",
      note: "96.5% completion",
      icon: CheckCircle2,
      tone: "green",
      direction: "up",
    },
    {
      label: "Care Hours",
      value: "192,340",
      change: "+14.1%",
      note: "5.5 hours per visit",
      icon: Clock3,
      tone: "purple",
      direction: "up",
    },
    {
      label: "Incident Rate",
      value: "0.8%",
      change: "-0.4%",
      note: "279 cases reviewed",
      icon: ShieldCheck,
      tone: "amber",
      direction: "down",
    },
  ],
};

const reportFiles = [
  {
    id: "RPT-260721",
    name: "Monthly Operations Summary",
    category: "Operations",
    period: "Jul 1–21, 2026",
    generated: "Today, 09:42 AM",
    format: "PDF",
    size: "2.8 MB",
    status: "Ready",
  },
  {
    id: "RPT-260718",
    name: "Caregiver Payout Reconciliation",
    category: "Finance",
    period: "Jul 1–18, 2026",
    generated: "Jul 18, 04:15 PM",
    format: "XLSX",
    size: "1.4 MB",
    status: "Ready",
  },
  {
    id: "RPT-260715",
    name: "Care Quality & Incident Audit",
    category: "Compliance",
    period: "Q2 2026",
    generated: "Jul 15, 11:30 AM",
    format: "PDF",
    size: "4.1 MB",
    status: "Ready",
  },
  {
    id: "RPT-260712",
    name: "Client Growth by Service Zone",
    category: "Growth",
    period: "Jan–Jun 2026",
    generated: "Jul 12, 02:05 PM",
    format: "CSV",
    size: "920 KB",
    status: "Ready",
  },
];

const serviceRows = [
  {
    service: "Post-Op Care",
    visits: 1248,
    revenue: "৳1,084,000",
    completion: 98,
    rating: 4.9,
    trend: 14,
  },
  {
    service: "Senior Companion",
    visits: 934,
    revenue: "৳726,500",
    completion: 96,
    rating: 4.8,
    trend: 9,
  },
  {
    service: "Nursing Care",
    visits: 682,
    revenue: "৳618,000",
    completion: 95,
    rating: 4.7,
    trend: 11,
  },
  {
    service: "Physiotherapy",
    visits: 397,
    revenue: "৳302,500",
    completion: 93,
    rating: 4.8,
    trend: 6,
  },
  {
    service: "Dementia Care",
    visits: 167,
    revenue: "৳114,000",
    completion: 97,
    rating: 4.9,
    trend: -2,
  },
];

const tones = {
  blue: "bg-blue-100 text-[#0755d3]",
  green: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700",
  amber: "bg-amber-100 text-amber-700",
};

const AdminReports = () => {
  const [period, setPeriod] = useState("Last 30 Days");
  const [zone, setZone] = useState("All Zones");
  const [reportCategory, setReportCategory] = useState("All Reports");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const summaries = summaryData[period];
  const reports = useMemo(
    () =>
      reportCategory === "All Reports"
        ? reportFiles
        : reportFiles.filter((item) => item.category === reportCategory),
    [reportCategory],
  );

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="mx-auto max-w-[1380px] p-4 sm:p-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-[#555d6d]">
            Operational, financial, and quality insights across SwiftOpsBD.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 xl:ml-auto">
          <SelectControl
            icon={CalendarDays}
            value={period}
            onChange={setPeriod}
            options={["Last 30 Days", "Last 90 Days", "This Year"]}
          />
          <SelectControl
            icon={Filter}
            value={zone}
            onChange={setZone}
            options={[
              "All Zones",
              "Dhaka North",
              "Dhaka South",
              "Uttara",
              "Gulshan",
            ]}
          />
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#aeb7c8] bg-white px-4 py-2.5 text-sm font-semibold text-[#0649ad] sm:flex-none"
            type="button"
            onClick={() =>
              flash(`${period} report package prepared for export.`)
            }
          >
            <Download className="size-4" />
            Export All
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755b7] px-4 py-2.5 text-sm font-semibold text-white sm:flex-none"
            type="button"
            onClick={() => setBuilderOpen(true)}
          >
            <Plus className="size-4" />
            Build Report
          </button>
        </div>
      </header>

      {notice && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="size-4" />
          {notice}
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {summaries.map((item) => (
          <SummaryCard item={item} key={item.label} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <TrendChart period={period} zone={zone} />
        <CareDistribution />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <ServicePerformance />
        <QualityOverview />
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-[#c8cfde] bg-white">
        <header className="flex flex-col gap-3 border-b border-[#c8cfde] p-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-semibold">Generated Reports</h2>
            <p className="text-xs text-[#687184]">
              Download, regenerate, and audit previously created reports.
            </p>
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-[#c8cfde] px-3 sm:ml-auto">
            <Filter className="size-4" />
            <select
              className="bg-transparent py-2.5 text-sm outline-none"
              value={reportCategory}
              onChange={(event) => setReportCategory(event.target.value)}
            >
              <option>All Reports</option>
              <option>Operations</option>
              <option>Finance</option>
              <option>Compliance</option>
              <option>Growth</option>
            </select>
          </label>
        </header>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#f0f3fb] text-[10px] uppercase tracking-[.08em] text-[#606878]">
              <tr>
                <th className="px-6 py-4">Report</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Period</th>
                <th className="px-4 py-4">Generated</th>
                <th className="px-4 py-4">Format</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <ReportRow report={report} key={report.id} onAction={flash} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-[#d8dde7] md:hidden">
          {reports.map((report) => (
            <ReportCard report={report} key={report.id} onAction={flash} />
          ))}
        </div>
      </section>

      {builderOpen && (
        <ReportBuilder
          onClose={() => setBuilderOpen(false)}
          onCreate={(name) => {
            setBuilderOpen(false);
            flash(`${name} was added to the report generation queue.`);
          }}
        />
      )}
    </div>
  );
};

const SelectControl = ({ icon: Icon, onChange, options, value }) => (
  <label className="flex flex-1 items-center gap-2 rounded-lg border border-[#aeb7c8] bg-white px-3 text-sm sm:flex-none">
    <Icon className="size-4 text-[#515867]" />
    <select
      className="bg-transparent py-2.5 outline-none"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
    <ChevronDown className="size-3" />
  </label>
);

const SummaryCard = ({ item }) => {
  const Direction = item.direction === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <article className="rounded-xl border-2 border-[#d0d6e2] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start">
        <span
          className={`grid size-9 place-items-center rounded-lg ${tones[item.tone]}`}
        >
          <item.icon className="size-5" />
        </span>
        <span
          className={`ml-auto flex items-center text-[10px] font-semibold sm:text-xs ${item.direction === "down" ? "text-emerald-700" : "text-emerald-700"}`}
        >
          <Direction className="size-3.5" />
          {item.change}
        </span>
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[.08em] text-[#687184] sm:text-xs">
        {item.label}
      </p>
      <b className="mt-1 block text-xl sm:text-2xl">{item.value}</b>
      <small className="mt-2 block text-[10px] text-[#687184] sm:text-xs">
        {item.note}
      </small>
    </article>
  );
};

const TrendChart = ({ period, zone }) => {
  const revenue = [42, 50, 47, 61, 66, 63, 75, 82, 79, 91, 96, 100];
  const payout = [28, 34, 31, 40, 44, 42, 51, 55, 53, 61, 65, 69];
  return (
    <article className="rounded-xl border border-[#c8cfde] bg-white p-4 sm:p-6">
      <header className="flex flex-wrap items-start gap-3">
        <div>
          <h2 className="text-lg font-semibold">Revenue & Payout Trend</h2>
          <p className="text-xs text-[#687184]">
            {period} · {zone}
          </p>
        </div>
        <div className="ml-auto flex gap-3 text-[10px]">
          <Legend color="bg-[#0755b7]">Client Revenue</Legend>
          <Legend color="bg-emerald-500">Caregiver Payout</Legend>
        </div>
      </header>
      <div className="mt-7 flex h-56 items-end gap-2 border-b border-[#c8cfde] sm:h-64 sm:gap-3">
        {revenue.map((height, index) => (
          <div
            className="group relative flex h-full flex-1 items-end justify-center gap-px"
            key={`${height}-${index}`}
          >
            <span
              className="w-1/2 rounded-t bg-[#0755b7]"
              style={{ height: `${height}%` }}
            />
            <span
              className="w-1/2 rounded-t bg-emerald-400"
              style={{ height: `${payout[index]}%` }}
            />
            <span className="invisible absolute -top-1 left-1/2 z-10 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[9px] whitespace-nowrap text-white group-hover:visible">
              Revenue ৳{height * 4}k
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[9px] uppercase text-[#687184]">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Today</span>
      </div>
    </article>
  );
};

const CareDistribution = () => {
  const items = [
    { label: "Post-Op Care", value: 36, color: "bg-[#0755b7]" },
    { label: "Senior Companion", value: 27, color: "bg-emerald-500" },
    { label: "Nursing Care", value: 20, color: "bg-purple-500" },
    { label: "Physiotherapy", value: 12, color: "bg-amber-400" },
    { label: "Other", value: 5, color: "bg-slate-300" },
  ];
  return (
    <article className="rounded-xl border border-[#c8cfde] bg-white p-4 sm:p-6">
      <header className="flex items-center">
        <div>
          <h2 className="text-lg font-semibold">Service Mix</h2>
          <p className="text-xs text-[#687184]">Share of completed visits</p>
        </div>
        <PieChart className="ml-auto size-5 text-[#0755b7]" />
      </header>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
        <div
          className="relative size-40 rounded-full"
          style={{
            background:
              "conic-gradient(#0755b7 0 36%, #10b981 36% 63%, #8b5cf6 63% 83%, #fbbf24 83% 95%, #cbd5e1 95% 100%)",
          }}
        >
          <span className="absolute inset-8 grid place-items-center rounded-full bg-white text-center">
            <span>
              <b className="block text-xl">3,428</b>
              <small className="text-[#687184]">Visits</small>
            </span>
          </span>
        </div>
        <div className="w-full flex-1 space-y-3">
          {items.map((item) => (
            <div className="flex items-center text-xs" key={item.label}>
              <i className={`mr-2 size-2.5 rounded-full ${item.color}`} />
              <span>{item.label}</span>
              <b className="ml-auto">{item.value}%</b>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

const ServicePerformance = () => (
  <article className="overflow-hidden rounded-xl border border-[#c8cfde] bg-white">
    <header className="flex items-center p-5">
      <div>
        <h2 className="text-lg font-semibold">Service Performance</h2>
        <p className="text-xs text-[#687184]">
          Operational results by care category
        </p>
      </div>
      <BarChart3 className="ml-auto size-5 text-[#0755b7]" />
    </header>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-xs">
        <thead className="bg-[#f0f3fb] uppercase tracking-[.06em] text-[#687184]">
          <tr>
            <th className="px-5 py-3">Service</th>
            <th className="px-3 py-3">Visits</th>
            <th className="px-3 py-3">Revenue</th>
            <th className="px-3 py-3">Completion</th>
            <th className="px-3 py-3">Rating</th>
            <th className="px-5 py-3">Trend</th>
          </tr>
        </thead>
        <tbody>
          {serviceRows.map((row) => (
            <tr className="border-t border-[#d8dde7]" key={row.service}>
              <td className="px-5 py-4 font-semibold">{row.service}</td>
              <td className="px-3 py-4">{row.visits.toLocaleString()}</td>
              <td className="px-3 py-4">{row.revenue}</td>
              <td className="px-3 py-4">
                <span className="flex items-center gap-2">
                  <i className="h-1.5 w-14 rounded bg-[#e2e6ee]">
                    <i
                      className="block h-full rounded bg-emerald-500"
                      style={{ width: `${row.completion}%` }}
                    />
                  </i>
                  {row.completion}%
                </span>
              </td>
              <td className="px-3 py-4">
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {row.rating}
                </span>
              </td>
              <td
                className={`px-5 py-4 font-semibold ${row.trend >= 0 ? "text-emerald-700" : "text-red-600"}`}
              >
                {row.trend >= 0 ? "▲" : "▼"} {Math.abs(row.trend)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </article>
);

const QualityOverview = () => {
  const metrics = [
    {
      label: "Client Satisfaction",
      value: "94%",
      icon: Star,
      color: "bg-amber-400",
      width: 94,
    },
    {
      label: "On-Time Arrival",
      value: "91%",
      icon: Clock3,
      color: "bg-[#0755b7]",
      width: 91,
    },
    {
      label: "Medication Compliance",
      value: "97%",
      icon: ShieldCheck,
      color: "bg-emerald-500",
      width: 97,
    },
    {
      label: "Care Plan Completion",
      value: "93%",
      icon: Activity,
      color: "bg-purple-500",
      width: 93,
    },
  ];
  return (
    <article className="rounded-xl border border-[#c8cfde] bg-white p-5">
      <header>
        <h2 className="text-lg font-semibold">Care Quality Index</h2>
        <p className="text-xs text-[#687184]">
          Aggregated service quality indicators
        </p>
      </header>
      <div className="mt-6 space-y-5">
        {metrics.map(({ label, value, icon: Icon, color, width }) => (
          <div key={label}>
            <div className="flex items-center text-xs">
              <Icon className="mr-2 size-4 text-[#515867]" />
              <span>{label}</span>
              <b className="ml-auto">{value}</b>
            </div>
            <span className="mt-2 block h-2 rounded bg-[#e6e9f0]">
              <i
                className={`block h-full rounded ${color}`}
                style={{ width: `${width}%` }}
              />
            </span>
          </div>
        ))}
      </div>
      <button
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#c8cfde] px-4 py-2.5 text-sm font-semibold text-[#0755b7]"
        type="button"
      >
        View Quality Audit <ArrowRight className="size-4" />
      </button>
    </article>
  );
};

const Legend = ({ children, color }) => (
  <span className="flex items-center gap-1.5">
    <i className={`size-2.5 rounded-full ${color}`} />
    {children}
  </span>
);
const FormatIcon = ({ format }) =>
  format === "XLSX" || format === "CSV" ? (
    <FileSpreadsheet className="size-5" />
  ) : (
    <FileText className="size-5" />
  );

const ReportRow = ({ onAction, report }) => (
  <tr className="border-t border-[#d8dde7] hover:bg-[#fafbfe]">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-[#0755b7]">
          <FormatIcon format={report.format} />
        </span>
        <span>
          <b className="block">{report.name}</b>
          <small className="text-[#687184]">{report.id}</small>
        </span>
      </div>
    </td>
    <td className="px-4 py-4">{report.category}</td>
    <td className="px-4 py-4">{report.period}</td>
    <td className="px-4 py-4 text-[#515867]">{report.generated}</td>
    <td className="px-4 py-4">
      <b>{report.format}</b>
      <small className="block text-[#687184]">{report.size}</small>
    </td>
    <td className="px-4 py-4">
      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-semibold text-emerald-700">
        ● {report.status}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex justify-end">
        <button
          className="grid size-8 place-items-center rounded text-[#0755b7] hover:bg-blue-50"
          type="button"
          title="Download"
          onClick={() =>
            onAction(
              `${report.name} download is ready for backend integration.`,
            )
          }
        >
          <Download className="size-4" />
        </button>
        <button
          className="grid size-8 place-items-center rounded text-[#0755b7] hover:bg-blue-50"
          type="button"
          title="Regenerate"
          onClick={() =>
            onAction(`${report.name} was added to the regeneration queue.`)
          }
        >
          <RefreshCw className="size-4" />
        </button>
        <button
          className="grid size-8 place-items-center rounded hover:bg-slate-100"
          type="button"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </td>
  </tr>
);

const ReportCard = ({ onAction, report }) => (
  <article className="p-4">
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-100 text-[#0755b7]">
        <FormatIcon format={report.format} />
      </span>
      <div className="min-w-0 flex-1">
        <b className="block text-sm">{report.name}</b>
        <small className="text-[#687184]">
          {report.id} · {report.category}
        </small>
      </div>
      <span className="rounded bg-emerald-100 px-2 py-1 text-[9px] font-semibold text-emerald-700">
        Ready
      </span>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-[#f4f6fb] p-3 text-xs">
      <span>
        <small className="block text-[#687184]">Period</small>
        {report.period}
      </span>
      <span>
        <small className="block text-[#687184]">Format</small>
        {report.format} · {report.size}
      </span>
    </div>
    <button
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-[#0755b7]"
      type="button"
      onClick={() =>
        onAction(`${report.name} download is ready for backend integration.`)
      }
    >
      <Download className="size-4" />
      Download Report
    </button>
  </article>
);

const ReportBuilder = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [metrics, setMetrics] = useState(["Visits"]);
  const toggleMetric = (metric) =>
    setMetrics((current) =>
      current.includes(metric)
        ? current.filter((item) => item !== metric)
        : [...current, metric],
    );
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4">
      <form
        className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(name);
        }}
      >
        <header className="flex">
          <div>
            <h2 className="text-xl font-semibold">Build Custom Report</h2>
            <p className="text-sm text-[#687184]">
              Choose the scope and metrics for this report.
            </p>
          </div>
          <button className="ml-auto" type="button" onClick={onClose}>
            <X className="size-5" />
          </button>
        </header>
        <label className="mt-5 block text-sm font-semibold">
          Report name
          <input
            className="mt-1 w-full rounded-lg border border-[#c8cfde] px-3 py-2.5 font-normal outline-none focus:border-[#0755d3]"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Weekly Dhaka Operations"
          />
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <BuilderField label="Report type">
            <select>
              <option>Operational summary</option>
              <option>Financial reconciliation</option>
              <option>Quality and compliance</option>
              <option>Caregiver performance</option>
            </select>
          </BuilderField>
          <BuilderField label="Format">
            <select>
              <option>PDF</option>
              <option>XLSX</option>
              <option>CSV</option>
            </select>
          </BuilderField>
          <BuilderField label="Start date">
            <input type="date" required />
          </BuilderField>
          <BuilderField label="End date">
            <input type="date" required />
          </BuilderField>
        </div>
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold">Include metrics</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              "Visits",
              "Revenue",
              "Payouts",
              "Care Hours",
              "Ratings",
              "Incidents",
            ].map((metric) => (
              <label
                className={`flex items-center gap-2 rounded-lg border p-3 text-xs ${metrics.includes(metric) ? "border-[#0755d3] bg-blue-50 text-[#0755b7]" : "border-[#c8cfde]"}`}
                key={metric}
              >
                <input
                  type="checkbox"
                  checked={metrics.includes(metric)}
                  onChange={() => toggleMetric(metric)}
                />
                {metric}
              </label>
            ))}
          </div>
        </fieldset>
        <footer className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-lg border px-4 py-2.5 text-sm font-semibold"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-[#0755b7] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            type="submit"
            disabled={!metrics.length}
          >
            Generate Report
          </button>
        </footer>
      </form>
    </div>
  );
};

const BuilderField = ({ children, label }) => (
  <label className="text-sm font-semibold">
    {label}
    <span className="mt-1 block [&>*]:w-full [&>*]:rounded-lg [&>*]:border [&>*]:border-[#c8cfde] [&>*]:px-3 [&>*]:py-2.5 [&>*]:font-normal [&>*]:outline-none">
      {children}
    </span>
  </label>
);

export default AdminReports;
