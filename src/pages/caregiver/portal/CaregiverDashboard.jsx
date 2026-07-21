import {
  Banknote,
  CalendarCheck,
  CalendarClock,
  Clock3,
  Power,
  Star,
  TriangleAlert,
} from "lucide-react";
import { caregiverAccount } from "../../../data/caregiverPortalData";
import CaregiverCard from "../../../components/caregiver/portal/CaregiverCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  clockInCaregiver,
  clockOutCaregiver,
  getActiveShift,
  getTodayCompletedShiftSeconds,
} from "../../../services/shiftTrackingService";

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

const CaregiverDashboard = () => {
  const [activeShift, setActiveShift] = useState(() => getActiveShift());
  const [now, setNow] = useState(() => Date.now());
  const [todayCompletedSeconds, setTodayCompletedSeconds] = useState(() => getTodayCompletedShiftSeconds());
  const [lastCompletedShift, setLastCompletedShift] = useState(null);
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

  const handleShiftAction = () => {
    if (activeShift) {
      const completedShift = clockOutCaregiver();
      setLastCompletedShift(completedShift);
      setActiveShift(null);
      setTodayCompletedSeconds(getTodayCompletedShiftSeconds());
      setNow(Date.now());
      return;
    }
    const shift = clockInCaregiver({ caregiverName: caregiverAccount.name });
    setLastCompletedShift(null);
    setActiveShift(shift);
    setNow(Date.now());
  };
  return (
    <div className="mx-auto max-w-[1020px] space-y-7 p-5 sm:p-7">
      <header>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          {greeting}, {caregiverAccount.name.split(" ")[0]}
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
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric
          icon={CalendarCheck}
          label="Total Visits"
          value="142"
          change="+12%"
        />
        <Metric icon={Clock3} label="Hours Worked" value="528" change="+5%" />
        <Metric
          icon={Banknote}
          label="Net Earnings"
          value="৳42,850"
          change="+8%"
          green
        />
        <Metric
          icon={Star}
          label="Avg. Patient Rating"
          value="4.9/5.0"
          change="Stable"
          amber
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_305px]">
        <CaregiverCard className="p-6">
          <h2 className="text-xl font-semibold">Earnings Analytics</h2>
          <div className="mt-8 flex h-52 items-end gap-1 border-b border-[#c5cad8] sm:h-64 sm:gap-2">
            {[35, 52, 68, 95, 46, 62, 78, 100, 40, 58, 74, 88, 52, 35].map(
              (height, index) => (
                <span
                  className={`flex-1 ${index % 4 === 3 ? "bg-[#0649ad]" : "bg-[#dce8ff]"}`}
                  style={{ height: `${height}%` }}
                  key={index}
                />
              ),
            )}
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase text-[#4c5261]">
            <span>Oct 12</span>
            <span>Oct 19</span>
            <span>Oct 26</span>
            <span>Nov 02</span>
            <span>Nov 11</span>
          </div>
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
              >
                <Power />
                {onShift ? "Clock Out" : "Clock In"}
              </button>
              {lastCompletedShift && (
                <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
                  Shift completed: {formatDuration(lastCompletedShift.durationSeconds)}. Saved locally and ready for future database sync.
                </p>
              )}
            </div>
          </CaregiverCard>
          <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-800">
            <h3 className="flex gap-2 text-lg font-semibold">
              <TriangleAlert />
              Pending Request
            </h3>
            <p className="mt-2 text-sm">
              1 new shift request for tomorrow requires your approval.
            </p>
            <Link
              className="mt-3 block text-sm underline"
              to="/caregiver/requested-clients"
            >
              Review Now
            </Link>
          </div>
        </div>
      </div>
      <CaregiverCard>
        <div className="flex justify-between bg-[#eef2f7] p-5">
          <h2 className="text-xl font-semibold">Today&apos;s Agenda</h2>
          <span className="text-xs text-[#0649ad]">View Full Calendar</span>
        </div>
        {[
          ["09:00 AM", "Morning Routine & Meds", "Mrs. Rahman"],
          ["14:30 PM", "Physical Therapy Assist", "Mr. Ahmed"],
        ].map(([time, title, client], i) => (
          <div className="flex flex-col gap-3 border-t border-[#c5cad8] p-5 sm:flex-row sm:gap-5 sm:p-6" key={time}>
            <strong className="w-20 text-lg sm:text-xl">{time}</strong>
            <div
              className={`border-l-4 pl-4 ${i ? "border-[#c5cad8]" : "border-[#0755d3]"}`}
            >
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-[#4c5261]">{client}</p>
              {!i && (
                <Link
                  className="mt-3 inline-block rounded bg-[#0755d3] px-4 py-2 text-sm text-white"
                  to="/caregiver/visit/jahanara"
                >
                  Start Visit
                </Link>
              )}
            </div>
          </div>
        ))}
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
      >
        <Power className="size-5" />
        {onShift ? "Clock Out" : "Clock In"}
      </button>
    </div>
  </CaregiverCard>
);
export default CaregiverDashboard;
