import {
  Banknote,
  CalendarCheck,
  CalendarClock,
  Clock3,
  Power,
  Star,
  TriangleAlert,
} from "lucide-react";
import CaregiverCard from "../../../components/caregiver/portal/CaregiverCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  clockInCaregiverShift,
  clockOutCaregiverShift,
  getActiveCaregiverShift,
  listCaregiverShifts,
  updateCaregiverShiftLocation,
} from "../../../services/caregiverShiftService";
import {
  getBrowserLocation,
  watchBrowserLocation,
} from "../../../services/browserLocationService";
import { listMyVisits } from "../../../services/assignmentService";
import { listAvailableCareRequests } from "../../../services/careRequestService";
import { getPaymentSummary } from "../../../services/paymentService";
import useAuth from "../../../hooks/useAuth";

const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
};

const formatTime = (value) => new Date(value).toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const buildEarningsBuckets = (ledger = [], now = new Date()) => {
  const buckets = Array.from({ length: 12 }, (_, index) => {
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    end.setDate(end.getDate() - (11 - index) * 7);
    const start = new Date(end);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);
    return {
      key: start.toISOString(),
      label: start.toLocaleDateString([], { month: "short", day: "numeric" }),
      start,
      end,
      amount: 0,
    };
  });
  ledger
    .filter(
      (entry) => entry.type === "earning" && entry.status === "completed",
    )
    .forEach((entry) => {
      const occurredAt = new Date(entry.createdAt || entry.updatedAt || 0);
      const bucket = buckets.find(
        (item) => occurredAt >= item.start && occurredAt <= item.end,
      );
      if (bucket) bucket.amount += Number(entry.amount || 0);
    });
  return buckets;
};

const CaregiverDashboard = () => {
  const { account, user } = useAuth();
  const caregiverName =
    user?.displayName ||
    account?.displayName ||
    user?.email?.split("@")[0] ||
    "Caregiver";
  const [activeShift, setActiveShift] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [todayCompletedSeconds, setTodayCompletedSeconds] = useState(0);
  const [lastCompletedShift, setLastCompletedShift] = useState(null);
  const [shiftSaving, setShiftSaving] = useState(false);
  const [shiftNotice, setShiftNotice] = useState("");
  const [agendaVisits, setAgendaVisits] = useState([]);
  const [allVisits, setAllVisits] = useState([]);
  const [wallet, setWallet] = useState({
    completedEarnings: 0,
    ledger: [],
  });
  const [pendingRequests, setPendingRequests] = useState(0);
  const onShift = Boolean(activeShift);
  const activeSeconds = activeShift
    ? Math.max(0, Math.floor((now - new Date(activeShift.startedAt).getTime()) / 1000))
    : 0;
  const todayTotalSeconds = todayCompletedSeconds + activeSeconds;
  const currentDate = new Date(now);
  const greeting = currentDate.getHours() < 12
    ? "Good Morning"
    : currentDate.getHours() < 18
      ? "Good Afternoon"
      : "Good Evening";

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!activeShift?.shiftId) return undefined;
    let mounted = true;
    let lastSentAt = 0;
    const stopWatching = watchBrowserLocation(async (location) => {
      const currentTime = Date.now();
      if (currentTime - lastSentAt < 30000) return;
      lastSentAt = currentTime;
      try {
        const updated = await updateCaregiverShiftLocation(location);
        if (mounted) setActiveShift(updated);
      } catch (error) {
        if (mounted) setShiftNotice(`On-duty GPS paused: ${error.message}`);
      }
    });
    return () => {
      mounted = false;
      stopWatching();
    };
  }, [activeShift?.shiftId]);

  useEffect(() => {
    let active = true;
    const loadAgenda = () => {
      Promise.allSettled([
        listMyVisits(),
        getPaymentSummary(),
        listAvailableCareRequests(),
      ])
        .then(([visitResult, paymentResult, requestResult]) => {
          if (!active) return;
          if (visitResult.status === "fulfilled") {
            setAllVisits(visitResult.value);
            setAgendaVisits(
              visitResult.value
                .filter((visit) =>
                  ["scheduled", "active"].includes(visit.status),
                )
                .slice(0, 5),
            );
          }
          if (paymentResult.status === "fulfilled") {
            setWallet(paymentResult.value);
          }
          if (requestResult.status === "fulfilled") {
            setPendingRequests(requestResult.value.length);
          }
          const failed = [visitResult, paymentResult, requestResult].find(
            (result) => result.status === "rejected",
          );
          if (failed) setShiftNotice(failed.reason.message);
        });
    };
    loadAgenda();
    const refreshTimer = window.setInterval(loadAgenda, 15000);
    window.addEventListener("focus", loadAgenda);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", loadAgenda);
    };
  }, []);

  const completedVisits = allVisits.filter(
    (visit) => visit.status === "completed",
  );
  const hoursWorked = completedVisits.reduce(
    (sum, visit) => sum + Number(visit.durationSeconds || 0),
    0,
  ) / 3600;
  const ratings = completedVisits
    .map((visit) =>
      Number(visit.patientRating ?? visit.clientRating ?? visit.rating),
    )
    .filter((rating) => Number.isFinite(rating) && rating > 0 && rating <= 5);
  const averageRating = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;
  const earningsBuckets = buildEarningsBuckets(wallet.ledger || []);

  useEffect(() => {
    let active = true;
    Promise.all([getActiveCaregiverShift(), listCaregiverShifts()])
      .then(([currentShift, shifts]) => {
        if (!active) return;
        const today = new Date();
        const completedSeconds = shifts
          .filter((shift) => {
            if (!shift.endedAt) return false;
            const endedAt = new Date(shift.endedAt);
            return (
              endedAt.getFullYear() === today.getFullYear() &&
              endedAt.getMonth() === today.getMonth() &&
              endedAt.getDate() === today.getDate()
            );
          })
          .reduce(
            (total, shift) => total + (shift.durationSeconds || 0),
            0,
          );
        setActiveShift(currentShift);
        setTodayCompletedSeconds(completedSeconds);
      })
      .catch((error) => {
        if (active) setShiftNotice(error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleShiftAction = async () => {
    if (shiftSaving) return;
    setShiftSaving(true);
    setShiftNotice("Requesting location...");
    try {
      const location = await getBrowserLocation();
      if (activeShift) {
        const completedShift = await clockOutCaregiverShift(location);
        setLastCompletedShift(completedShift);
        setActiveShift(null);
        setTodayCompletedSeconds(
          (seconds) => seconds + (completedShift.durationSeconds || 0),
        );
        setShiftNotice(
          location
            ? "Shift clocked out with GPS."
            : "Shift clocked out. GPS was unavailable.",
        );
      } else {
        const shift = await clockInCaregiverShift(location);
        setLastCompletedShift(null);
        setActiveShift(shift);
        setShiftNotice(
          location
            ? "Shift clocked in with GPS."
            : "Shift clocked in. GPS was unavailable.",
        );
      }
      setNow(Date.now());
    } catch (error) {
      setShiftNotice(error.message);
    } finally {
      setShiftSaving(false);
    }
  };
  return (
    <div className="mx-auto max-w-[1020px] space-y-7 p-5 sm:p-7">
      <header>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          {greeting}, {caregiverName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-[#4c5261]">
          Here is your overview for today, {currentDate.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}.
        </p>
      </header>
      <div className="xl:hidden">
        <MobileShiftPanel
          activeShift={activeShift}
          activeSeconds={activeSeconds}
          currentDate={currentDate}
          onShift={onShift}
          todayTotalSeconds={todayTotalSeconds}
          onShiftAction={handleShiftAction}
          shiftSaving={shiftSaving}
        />
      </div>
      {shiftNotice && (
        <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {shiftNotice}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric
          icon={CalendarCheck}
          label="Total Visits"
          value={completedVisits.length}
          change="Completed"
        />
        <Metric
          icon={Clock3}
          label="Hours Worked"
          value={hoursWorked.toFixed(1)}
          change="Verified"
        />
        <Metric
          icon={Banknote}
          label="Net Earnings"
          value={`$${Number(wallet.completedEarnings || 0).toLocaleString("en-US")}`}
          change="Lifetime"
          green
        />
        <Metric
          icon={Star}
          label="Avg. Patient Rating"
          value={ratings.length ? `${averageRating.toFixed(1)}/5.0` : "—/5.0"}
          change={`${ratings.length} rating${ratings.length === 1 ? "" : "s"}`}
          amber
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_305px]">
        <CaregiverCard className="p-6">
          <h2 className="text-xl font-semibold">Earnings Analytics</h2>
          {earningsBuckets.some((bucket) => bucket.amount > 0) ? (
            <>
              <div className="mt-8 flex h-52 items-end gap-1 border-b border-[#c5cad8] sm:h-64 sm:gap-2">
                {earningsBuckets.map((bucket) => {
                  const maximum = Math.max(
                    ...earningsBuckets.map((item) => item.amount),
                    1,
                  );
                  return (
                <span
                  className="group relative flex-1 bg-[#0755d3]"
                  style={{
                    height: `${Math.max(4, (bucket.amount / maximum) * 100)}%`,
                  }}
                  key={bucket.key}
                  title={`${bucket.label}: $${bucket.amount.toLocaleString("en-US")}`}
                />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-[10px] uppercase text-[#4c5261]">
                {earningsBuckets
                  .filter((_, index) => index % 3 === 0 || index === 11)
                  .map((bucket) => (
                    <span key={bucket.key}>{bucket.label}</span>
                  ))}
              </div>
            </>
          ) : (
            <div className="mt-8 grid h-64 place-items-center rounded-xl border border-dashed border-[#c5cad8] bg-[#f8faff] text-center text-sm text-[#667085]">
              <p>
                No completed earnings yet.
                <span className="mt-1 block">
                  This chart updates after paid care services.
                </span>
              </p>
            </div>
          )}
        </CaregiverCard>
        <div className="space-y-5">
          <CaregiverCard className="hidden overflow-hidden xl:block">
            <div className="flex justify-between bg-[#eef2f7] p-4">
              <b>Shift Status</b>
              <span
                className={`rounded-full px-3 py-1 text-xs ${onShift ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
              >
                ● {onShift ? "On Shift" : "Off-Duty"}
              </span>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#6b7280]">
                {onShift ? "Current Shift Duration" : "Current Local Time"}
              </p>
              <strong className={`mt-2 block font-mono text-4xl tracking-tight ${onShift ? "text-emerald-700" : "text-[#0649ad]"}`}>
                {onShift
                  ? formatDuration(activeSeconds)
                  : currentDate.toLocaleTimeString([], { hour12: false })}
              </strong>
              <p className="mt-2 text-sm text-[#4c5261]">
                {onShift
                  ? `Clocked in at ${formatTime(activeShift.startedAt)}`
                  : "You are currently offline. Ready to start your shift?"}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-lg bg-[#f4f7ff] p-3">
                  <span className="flex items-center gap-1 text-[10px] uppercase text-[#6b7280]">
                    <CalendarClock className="size-3" /> Today&apos;s Total
                  </span>
                  <b className="mt-1 block font-mono text-sm">{formatDuration(todayTotalSeconds)}</b>
                </div>
                <div className="rounded-lg bg-[#f4f7ff] p-3">
                  <span className="text-[10px] uppercase text-[#6b7280]">Shift Date</span>
                  <b className="mt-1 block text-sm">
                    {currentDate.toLocaleDateString([], { month: "short", day: "numeric" })}
                  </b>
                </div>
              </div>
              <button
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-lg font-semibold text-white ${onShift ? "bg-red-600 hover:bg-red-700" : "bg-[#0755d3] hover:bg-[#0649ad]"}`}
                type="button"
                onClick={handleShiftAction}
                disabled={shiftSaving}
              >
                <Power />
                {shiftSaving ? "Saving..." : onShift ? "Clock Out" : "Clock In"}
              </button>
              {lastCompletedShift && (
                <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
                  Shift completed: {formatDuration(lastCompletedShift.durationSeconds)}. Saved to your authenticated shift history.
                </p>
              )}
            </div>
          </CaregiverCard>
          {pendingRequests > 0 && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-800">
              <h3 className="flex gap-2 text-lg font-semibold">
                <TriangleAlert />
                Pending Request
              </h3>
              <p className="mt-2 text-sm">
                {pendingRequests} care request
                {pendingRequests === 1 ? "" : "s"} available for review.
              </p>
              <Link
                className="mt-3 block text-sm underline"
                to="/caregiver/requested-clients"
              >
                Review Now
              </Link>
            </div>
          )}
        </div>
      </div>
      <CaregiverCard>
        <div className="flex justify-between bg-[#eef2f7] p-5">
          <h2 className="text-xl font-semibold">Today&apos;s Agenda</h2>
          <span className="text-xs text-[#0649ad]">View Full Calendar</span>
        </div>
        {agendaVisits.map((visit, index) => (
          <div className="flex flex-col gap-3 border-t border-[#c5cad8] p-5 sm:flex-row sm:gap-5 sm:p-6" key={visit.visitId}>
            <strong className="w-20 text-lg sm:text-xl">
              {visit.scheduledStartLocal}
            </strong>
            <div
              className={`border-l-4 pl-4 ${index ? "border-[#c5cad8]" : "border-[#0755d3]"}`}
            >
              <h3 className="text-lg font-semibold">
                {visit.careType || "Care Visit"}
              </h3>
              <p className="text-sm text-[#4c5261]">
                {visit.clientName} · {visit.date}
              </p>
              <Link
                className="mt-3 inline-block rounded bg-[#0755d3] px-4 py-2 text-sm text-white"
                to={`/caregiver/visit/${visit.assignmentId}`}
              >
                {visit.status === "active" ? "Continue Visit" : "Start Visit"}
              </Link>
            </div>
          </div>
        ))}
        {!agendaVisits.length && (
          <p className="border-t border-[#c5cad8] p-8 text-center text-sm text-[#667085]">
            No confirmed visits are scheduled yet.
          </p>
        )}
      </CaregiverCard>
    </div>
  );
};
const Metric = ({ icon: Icon, label, value, change, green, amber }) => (
  <CaregiverCard className="min-w-0 p-3 sm:p-6">
    <div className="flex justify-between">
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-lg sm:size-10 ${green ? "bg-emerald-100 text-emerald-700" : amber ? "bg-amber-100 text-amber-700" : "bg-[#e7efff] text-[#0649ad]"}`}
      >
        <Icon className="size-4 sm:size-5" />
      </span>
      <span className="text-[10px] text-emerald-700 sm:text-xs">{change}</span>
    </div>
    <p className="mt-3 text-[10px] uppercase leading-4 tracking-[.04em] text-[#4c5261] sm:text-sm sm:tracking-[.06em]">
      {label}
    </p>
    <strong className="block break-words text-xl leading-tight min-[380px]:text-2xl sm:text-4xl">{value}</strong>
  </CaregiverCard>
);

const MobileShiftPanel = ({
  activeShift,
  activeSeconds,
  currentDate,
  onShift,
  todayTotalSeconds,
  onShiftAction,
  shiftSaving,
}) => (
  <CaregiverCard className="overflow-hidden border-[#9db7e2] shadow-sm">
    <div className="flex items-center justify-between bg-[#eef3ff] px-4 py-2.5">
      <b className="text-sm">Quick Shift Clock</b>
      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
          onShift
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        ● {onShift ? "On Shift" : "Off-Duty"}
      </span>
    </div>
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3 sm:p-4">
      <div className="min-w-0">
        <small className="block text-[10px] font-medium uppercase tracking-[0.1em] text-[#6b7280]">
          {onShift ? "Shift Duration" : "Local Time"}
        </small>
        <strong
          className={`block truncate font-mono text-2xl leading-tight min-[380px]:text-3xl ${
            onShift ? "text-emerald-700" : "text-[#0649ad]"
          }`}
        >
          {onShift
            ? formatDuration(activeSeconds)
            : currentDate.toLocaleTimeString([], { hour12: false })}
        </strong>
        <p className="mt-1 truncate text-[11px] text-[#4c5261]">
          {onShift
            ? `Started ${formatTime(activeShift.startedAt)}`
            : `Today's total ${formatDuration(todayTotalSeconds)}`}
        </p>
      </div>
      <button
        className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm min-[380px]:px-6 ${
          onShift ? "bg-red-600" : "bg-[#0755d3]"
        }`}
        type="button"
        onClick={onShiftAction}
        disabled={shiftSaving}
      >
        <Power className="size-5" />
        {shiftSaving ? "Saving..." : onShift ? "Clock Out" : "Clock In"}
      </button>
    </div>
  </CaregiverCard>
);
export default CaregiverDashboard;
