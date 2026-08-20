import {
  CalendarDays,
  Download,
  Radio,
  ShieldCheck,
  UserRoundCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BarikoiMap from "../../components/maps/BarikoiMap";
import { getAdminDashboardOverview } from "../../services/adminOverviewService";

const emptyOverview = {
  date: "",
  totalActiveClients: 0,
  activeCaregivers: 0,
  visitsToday: 0,
  liveVisitsNow: 0,
  pendingVerifications: 0,
  pendingCaregiverVerifications: 0,
  pendingClientVerifications: 0,
  pendingRequests: 0,
  todaysRevenue: 0,
  payoutLiability: 0,
  reservedPayouts: 0,
  liveVisits: [],
};

const tones = {
  blue: "bg-blue-100 text-[#0755d3]",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-600",
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-BD");
const formatMoney = (value) => `$${formatNumber(value)}`;
const formatDate = (value) => {
  if (!value) return "Today";
  const date = new Date(`${value}T00:00:00+06:00`);
  return date.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeLocation = (location) => {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
};

const AdminDashboard = () => {
  const [overview, setOverview] = useState(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const load = () =>
      getAdminDashboardOverview()
        .then((data) => {
          if (!active) return;
          setOverview(data);
          setNotice("");
        })
        .catch((error) => {
          if (active) setNotice(error.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    load();
    const timer = window.setInterval(load, 15000);
    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", load);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Total Active Clients",
        value: formatNumber(overview.totalActiveClients),
        change: "Approved",
        note: "verified client profiles",
        icon: Users,
        tone: "blue",
      },
      {
        label: "Active Caregivers",
        value: formatNumber(overview.activeCaregivers),
        change: "Approved",
        note: "verified caregivers",
        icon: UserRoundCheck,
        tone: "green",
      },
      {
        label: "Visits Today",
        value: formatNumber(overview.visitsToday),
        change: overview.date || "Today",
        note: "all scheduled visit records",
        icon: CalendarDays,
        tone: "blue",
      },
      {
        label: "Live Visits Now",
        value: formatNumber(overview.liveVisitsNow),
        change: "Live",
        note: "GPS-enabled active visits",
        icon: Radio,
        tone: "green",
      },
      {
        label: "Pending Verifications",
        value: formatNumber(overview.pendingVerifications),
        change: `${overview.pendingCaregiverVerifications} caregiver`,
        note: `${overview.pendingClientVerifications} client`,
        icon: ShieldCheck,
        tone: "amber",
      },
      {
        label: "Pending Requests",
        value: formatNumber(overview.pendingRequests),
        change: "Open",
        note: "awaiting caregiver matching",
        icon: CalendarDays,
        tone: "amber",
      },
      {
        label: "Today's Revenue",
        value: formatMoney(overview.todaysRevenue),
        change: "Received",
        note: "successful client payments today",
        icon: WalletCards,
        tone: "green",
      },
      {
        label: "Payout Liability",
        value: formatMoney(overview.payoutLiability),
        change: formatMoney(overview.reservedPayouts),
        note: "reserved or awaiting payout",
        icon: WalletCards,
        tone: "red",
      },
    ],
    [overview],
  );

  const mapMarkers = useMemo(
    () =>
      overview.liveVisits
        .map((visit) => {
          const coordinates = normalizeLocation(
            visit.currentLocation || visit.clockInLocation,
          );
          return coordinates
            ? {
                ...coordinates,
                label: `${visit.clientName || "Client"} · ${
                  visit.caregiverName || "Caregiver"
                }`,
              }
            : null;
        })
        .filter(Boolean),
    [overview.liveVisits],
  );

  const exportOverview = () => {
    const rows = [
      ["Metric", "Value"],
      ...stats.map((stat) => [stat.label, stat.value]),
    ];
    const blob = new Blob(
      [rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `SwiftOpsBD-Overview-${overview.date || "today"}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1280px] p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-semibold">Operations Overview</h1>
          <p className="mt-1 text-sm text-[#515867]">
            Live operational data from SwiftOpsBD.
          </p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <span className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c5cad8] bg-white px-4 py-2.5 text-sm sm:flex-none">
            <CalendarDays className="size-4" /> {formatDate(overview.date)}
          </span>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-4 py-2.5 text-sm font-semibold text-white sm:flex-none"
            type="button"
            onClick={exportOverview}
          >
            <Download className="size-4" /> Export
          </button>
        </div>
      </div>

      {notice && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {notice}
        </p>
      )}

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
                <b className="mt-2 block text-xl sm:text-2xl">
                  {loading ? "—" : value}
                </b>
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

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-xl border border-[#d2d7e4] bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Financial Position Today</h2>
          <p className="mt-1 text-xs text-[#606878]">
            Calculated from successful payments and caregiver settlement data.
          </p>
          <div className="mt-6 space-y-4">
            <FinancialRow
              label="Client revenue received today"
              value={formatMoney(overview.todaysRevenue)}
              tone="text-emerald-700"
            />
            <FinancialRow
              label="Outstanding caregiver liability"
              value={formatMoney(overview.payoutLiability)}
              tone="text-red-600"
            />
            <FinancialRow
              label="Payouts currently reserved"
              value={formatMoney(overview.reservedPayouts)}
              tone="text-amber-700"
            />
          </div>
          <Link
            className="mt-6 inline-flex rounded-lg bg-[#0755d3] px-4 py-2.5 text-sm font-semibold text-white"
            to="/admin/finance"
          >
            Open Finance
          </Link>
        </article>

        <article className="overflow-hidden rounded-xl border border-[#d2d7e4] bg-white">
          <header className="flex items-center gap-3 p-5">
            <div>
              <h2 className="text-lg font-semibold">Active Visits Right Now</h2>
              <p className="text-xs text-[#606878]">
                Compact view of the Live Operations map.
              </p>
            </div>
            <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              ● {overview.liveVisitsNow} LIVE
            </span>
            <Link
              className="ml-auto text-xs font-semibold text-[#0649ad] hover:underline"
              to="/admin/live-operations"
            >
              View Full Map
            </Link>
          </header>
          <BarikoiMap
            className="h-72 w-full sm:h-[330px]"
            markers={mapMarkers}
            zoom={11}
            interactive={false}
          />
        </article>
      </section>
    </div>
  );
};

const FinancialRow = ({ label, value, tone }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f4f7fc] px-4 py-4">
    <span className="text-sm text-[#515867]">{label}</span>
    <b className={tone}>{value}</b>
  </div>
);

export default AdminDashboard;
