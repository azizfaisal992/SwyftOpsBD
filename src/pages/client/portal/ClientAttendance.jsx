import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  LoaderCircle,
  MapPin,
  Radio,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BarikoiMap from "../../../components/maps/BarikoiMap";
import PortalCard from "../../../components/client/portal/PortalCard";
import { getMyAttendance } from "../../../services/assignmentService";

const DHAKA_TIME = {
  timeZone: "Asia/Dhaka",
  hour: "2-digit",
  minute: "2-digit",
};

const formatTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-BD", DHAKA_TIME).format(date);
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-BD", {
        timeZone: "Asia/Dhaka",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const monthTitle = (date) =>
  new Intl.DateTimeFormat("en-BD", {
    month: "long",
    year: "numeric",
  }).format(date);

const dateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const calendarCells = (month) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const cells = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(day);
  while (cells.length % 7) cells.push(null);
  return cells;
};

const statusStyles = {
  completed: "border-emerald-500 bg-emerald-50 text-emerald-800",
  active: "border-[#0755d3] bg-[#0755d3] text-white",
  scheduled: "border-blue-200 bg-blue-50 text-[#0649ad]",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const ClientAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const refresh = () =>
      getMyAttendance()
        .then((record) => {
          if (active) {
            setAttendance(record);
            setError("");
          }
        })
        .catch((requestError) => {
          if (active) setError(requestError.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    void refresh();
    const timer = window.setInterval(refresh, 10000);
    const handleFocus = () => void refresh();
    window.addEventListener("focus", handleFocus);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const visitsByDate = useMemo(() => {
    const grouped = new Map();
    (attendance?.visits || []).forEach((visit) => {
      const records = grouped.get(visit.date) || [];
      records.push(visit);
      grouped.set(visit.date, records);
    });
    return grouped;
  }, [attendance?.visits]);

  const logs = useMemo(
    () =>
      (attendance?.visits || [])
        .flatMap((visit) => [
          visit.clockInAt
            ? {
                id: `${visit.visitId}-in`,
                caregiverName: visit.caregiverName,
                occurredAt: visit.clockInAt,
                type: "Check-in",
                visitDate: visit.date,
                durationSeconds: visit.durationSeconds,
                verified: visit.status === "completed" ? visit.verified : true,
              }
            : null,
          visit.clockOutAt
            ? {
                id: `${visit.visitId}-out`,
                caregiverName: visit.caregiverName,
                occurredAt: visit.clockOutAt,
                type: "Check-out",
                visitDate: visit.date,
                durationSeconds: visit.durationSeconds,
                verified: visit.verified,
              }
            : null,
        ])
        .filter(Boolean)
        .sort(
          (left, right) =>
            new Date(right.occurredAt).getTime() -
            new Date(left.occurredAt).getTime(),
        )
        .slice(0, 8),
    [attendance?.visits],
  );

  const moveMonth = (difference) =>
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + difference, 1),
    );

  const exportCsv = () => {
    if (!attendance?.visits?.length) return;
    const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      [
        "Date",
        "Caregiver",
        "Care Type",
        "Scheduled Start",
        "Scheduled End",
        "Clock In",
        "Clock Out",
        "Hours",
        "Status",
        "Verified",
      ],
      ...attendance.visits.map((visit) => [
        visit.date,
        visit.caregiverName,
        visit.careType,
        visit.scheduledStartLocal,
        visit.scheduledEndLocal,
        visit.clockInAt || "",
        visit.clockOutAt || "",
        (visit.durationSeconds / 3600).toFixed(2),
        visit.status,
        visit.verified ? "Yes" : "No",
      ]),
    ];
    const blob = new Blob(
      [rows.map((row) => row.map(escape).join(",")).join("\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "SwiftOpsBD-Client-Attendance.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="grid min-h-[65vh] place-items-center">
        <LoaderCircle className="size-9 animate-spin text-[#0649ad]" />
      </div>
    );
  }

  const currentStatus = {
    on_visit: "On Visit",
    on_duty: "On Duty",
    off_duty: "Off Duty",
  }[attendance?.currentStatus] || "Off Duty";
  const statusActive = attendance?.currentStatus !== "off_duty";
  const currentPeriod = attendance?.servicePeriods
    ?.filter((period) => period.status !== "cancelled")
    .sort((left, right) =>
      String(right.serviceStartDate || "").localeCompare(
        String(left.serviceStartDate || ""),
      ),
    )[0];
  const cells = calendarCells(month);

  return (
    <div className="mx-auto max-w-[1180px] p-4 sm:p-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <header>
          <h1 className="text-3xl font-semibold tracking-[-0.03em]">
            Attendance Tracking
          </h1>
          <p className="mt-2 max-w-xl text-[#4c5261]">
            Authenticated caregiver visit hours and live duty status for your
            assigned care team.
          </p>
          {currentPeriod?.serviceStartDate && (
            <p className="mt-3 inline-flex rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-[#0649ad]">
              Service period: {currentPeriod.serviceStartDate}
              {currentPeriod.serviceEndDate
                ? ` → ${currentPeriod.serviceEndDate}`
                : ""}
            </p>
          )}
        </header>
        <div className="grid gap-3 text-xs sm:grid-cols-3">
          <Metric
            icon={Clock3}
            label="Total Hours"
            value={`${Number(attendance?.totalHours || 0).toFixed(1)} hrs`}
          />
          <Metric
            icon={ShieldCheck}
            label="Verified Visits"
            value={`${attendance?.verifiedVisits || 0} / ${attendance?.completedVisits || 0}`}
            green
          />
          <Metric
            icon={Radio}
            label="Current Status"
            value={currentStatus}
            dark
            active={statusActive}
          />
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_315px]">
        <PortalCard className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#eef2ff] p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-5">
              <button
                className="rounded-lg p-2 hover:bg-white"
                type="button"
                onClick={() => moveMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-5" />
              </button>
              <h2 className="min-w-[170px] text-center text-xl font-semibold sm:text-2xl">
                {monthTitle(month)}
              </h2>
              <button
                className="rounded-lg p-2 hover:bg-white"
                type="button"
                onClick={() => moveMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
            <button
              className="rounded-lg border border-[#c5cad8] bg-white px-3 py-2 text-xs font-semibold text-[#0649ad]"
              type="button"
              onClick={() =>
                setMonth(
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1,
                  ),
                )
              }
            >
              Today
            </button>
          </div>

          <div className="overflow-x-auto p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap gap-3 text-xs">
              <Legend color="border-blue-200 bg-blue-50" label="Scheduled" />
              <Legend
                color="border-[#0755d3] bg-[#0755d3]"
                label="Clocked in"
              />
              <Legend
                color="border-emerald-500 bg-emerald-50"
                label="Clocked out / Completed"
              />
              <Legend
                color="border-red-200 bg-red-50"
                label="Cancelled"
              />
            </div>
            <div className="min-w-[700px]">
              <div className="grid grid-cols-7 text-center text-xs font-semibold">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <span
                      className="border border-[#c5cad8] bg-[#f7f8fb] p-3"
                      key={day}
                    >
                      {day}
                    </span>
                  ),
                )}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((day, index) => {
                  const key = day
                    ? dateKey(month.getFullYear(), month.getMonth(), day)
                    : "";
                  const dayVisits = visitsByDate.get(key) || [];
                  const today =
                    key === new Date().toLocaleDateString("en-CA", {
                      timeZone: "Asia/Dhaka",
                    });
                  return (
                    <div
                      className={`min-h-32 border border-[#c5cad8] p-2 text-xs ${
                        today ? "bg-[#e6f0ff] ring-2 ring-inset ring-[#0649ad]" : "bg-white"
                      }`}
                      key={`${month.toISOString()}-${index}`}
                    >
                      {day && (
                        <>
                          <span className={today ? "font-bold text-[#0649ad]" : ""}>
                            {day}
                          </span>
                          <div className="mt-2 space-y-1.5">
                            {dayVisits.slice(0, 2).map((visit) => (
                              <VisitChip visit={visit} key={visit.visitId} />
                            ))}
                            {dayVisits.length > 2 && (
                              <p className="text-center font-semibold text-[#596174]">
                                +{dayVisits.length - 2} more
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PortalCard>

        <div className="space-y-4">
          <DutyStatus
            activeShifts={attendance?.activeCaregiverShifts || []}
            activeVisit={attendance?.activeVisit}
            currentStatus={attendance?.currentStatus}
          />

          {attendance?.activeVisit?.activeLocation && (
            <PortalCard className="overflow-hidden">
              <div className="flex justify-between bg-[#eef2ff] p-4 text-sm font-semibold">
                <span>Active Visit Location</span>
                <span className="bg-[#9df2c8] px-2 py-1 text-[9px] text-emerald-700">
                  GPS SECURE
                </span>
              </div>
              <BarikoiMap
                center={attendance.activeVisit.activeLocation}
                markers={[
                  {
                    ...attendance.activeVisit.activeLocation,
                    label: attendance.activeVisit.caregiverName,
                  },
                ]}
                className="h-48 w-full"
                interactive={false}
                zoom={15}
              />
              <div className="p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <MapPin className="size-5 text-[#0649ad]" />
                  Current authenticated visit
                </h3>
                <p className="mt-2 text-xs text-[#4c5261]">
                  {attendance.activeVisit.caregiverName} · Last GPS update
                  available during this assigned visit.
                </p>
              </div>
            </PortalCard>
          )}

          <PortalCard className="overflow-hidden">
            <div className="flex justify-between bg-[#eef2ff] p-4">
              <h2 className="font-semibold">Attendance Log</h2>
              <button
                className="flex items-center gap-1 text-xs text-[#0649ad] disabled:opacity-50"
                type="button"
                disabled={!attendance?.visits?.length}
                onClick={exportCsv}
              >
                <Download className="size-3" />
                Export CSV
              </button>
            </div>
            {logs.map((log) => (
              <div
                className="flex items-center gap-3 border-b border-[#c5cad8] p-4"
                key={log.id}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#dce8ff] font-bold text-[#0649ad]">
                  {log.caregiverName?.slice(0, 1) || "C"}
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block text-sm">{formatDateTime(log.occurredAt)}</b>
                  <p className="truncate text-xs font-semibold">
                    {log.caregiverName}
                  </p>
                  <p className="text-[11px] text-[#687184]">
                    {log.visitDate}
                    {log.type === "Check-out" && log.durationSeconds
                      ? ` · ${(log.durationSeconds / 3600).toFixed(2)} hours completed`
                      : ""}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-[9px] font-semibold uppercase ${
                    log.verified
                      ? "bg-[#d8f7e9] text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {log.type}
                </span>
              </div>
            ))}
            {!logs.length && (
              <p className="p-6 text-center text-sm text-[#687184]">
                No caregiver check-in records yet.
              </p>
            )}
          </PortalCard>
        </div>
      </div>
    </div>
  );
};

const VisitChip = ({ visit }) => (
  <div
    className={`rounded border p-2 leading-4 ${
      statusStyles[visit.status] || statusStyles.scheduled
    }`}
    title={`${visit.caregiverName} · ${visit.careType}`}
  >
    <b className="block truncate">
      {visit.status === "active"
        ? `Clocked in · ${formatTime(visit.clockInAt)}`
        : visit.status === "completed"
          ? `Completed · ${formatTime(visit.clockOutAt)}`
          : `${visit.scheduledStartLocal || "Scheduled"}`}
    </b>
    <span className="block truncate">
      {visit.status === "completed"
        ? `${(visit.durationSeconds / 3600).toFixed(1)} hrs · ${
            visit.verified ? "Verified" : "Unverified"
          }`
        : visit.caregiverName}
    </span>
  </div>
);

const Legend = ({ color, label }) => (
  <span className="flex items-center gap-2">
    <span className={`size-3 rounded border ${color}`} />
    {label}
  </span>
);

const Metric = ({
  active = false,
  dark = false,
  green = false,
  icon: Icon,
  label,
  value,
}) => (
  <div
    className={`min-w-36 rounded-lg border border-[#c5cad8] p-4 ${
      dark ? "bg-[#06449d] text-white" : "bg-white"
    }`}
  >
    <span className="flex items-center gap-2 uppercase tracking-[0.08em]">
      <Icon className="size-4" />
      {label}
    </span>
    <strong
      className={`mt-2 flex items-center gap-2 text-xl ${
        green ? "text-emerald-600" : dark ? "text-white" : "text-[#0649ad]"
      }`}
    >
      {dark && (
        <span
          className={`size-2 rounded-full ${
            active ? "bg-lime-300" : "bg-slate-300"
          }`}
        />
      )}
      {value}
    </strong>
  </div>
);

const DutyStatus = ({ activeShifts, activeVisit, currentStatus }) => (
  <PortalCard className="overflow-hidden">
    <div className="flex items-center justify-between bg-[#eef2ff] p-4">
      <h2 className="font-semibold">Assigned Caregiver Status</h2>
      <span
        className={`rounded-full px-3 py-1 text-[9px] font-semibold uppercase ${
          currentStatus === "off_duty"
            ? "bg-slate-200 text-slate-700"
            : "bg-[#9df2c8] text-emerald-800"
        }`}
      >
        {currentStatus === "on_visit"
          ? "On Visit"
          : currentStatus === "on_duty"
            ? "On Duty"
            : "Off Duty"}
      </span>
    </div>
    <div className="p-4">
      {activeVisit ? (
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CalendarCheck2 className="size-5" />
          </span>
          <div>
            <b className="block">{activeVisit.caregiverName}</b>
            <p className="mt-1 text-xs text-[#596174]">
              Active care visit · Checked in {formatTime(activeVisit.clockInAt)}
            </p>
          </div>
        </div>
      ) : activeShifts.length ? (
        <div className="space-y-3">
          {activeShifts.map((shift) => (
            <div className="flex items-start gap-3" key={shift.shiftId}>
              <span className="grid size-10 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <UserRoundCheck className="size-5" />
              </span>
              <div>
                <b className="block">{shift.caregiverName}</b>
                <p className="mt-1 text-xs text-[#596174]">
                  On duty since {formatTime(shift.startedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-[#596174]">
          Your assigned caregivers are currently off duty. This status updates
          automatically when a caregiver clocks in or out of their shift.
        </p>
      )}
    </div>
  </PortalCard>
);

export default ClientAttendance;
