import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import caregiverAllexus from "../../assets/caregiver-allexus.jpg";
import caregiverKelly from "../../assets/caregiver-kelly.jpg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareSarah from "../../assets/find-care-sarah.jpg";

const INITIAL_DATE = new Date();
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const assignments = [
  {
    id: 1,
    day: 0,
    start: 8,
    duration: 3,
    service: "Nursing",
    client: "Mrs. Jahanara",
    caregiver: "Samuel Jackson",
    caregiverImage: caregiverKelly,
    status: "Confirmed",
    tone: "blue",
    location: "Gulshan 2, Dhaka",
    time: "08:00 AM – 11:00 AM",
  },
  {
    id: 2,
    day: 1,
    start: 7,
    duration: 2,
    service: "Elder Care",
    client: "David Chen",
    caregiver: "Unassigned",
    caregiverImage: caregiverAllexus,
    status: "Missed",
    tone: "red",
    location: "Banani, Dhaka",
    time: "07:00 AM – 09:00 AM",
  },
  {
    id: 3,
    day: 2,
    start: 9,
    duration: 3,
    service: "Physical Therapy",
    client: "Dr. Anisur",
    caregiver: "Elena Rodriguez",
    caregiverImage: caregiverSarah,
    status: "In Progress",
    tone: "green",
    location: "Dhanmondi, Dhaka",
    time: "09:00 AM – 12:00 PM",
  },
  {
    id: 4,
    day: 3,
    start: 6,
    duration: 2,
    service: "Companion Care",
    client: "Farina T.",
    caregiver: "Marcus King",
    caregiverImage: findCareSarah,
    status: "Confirmed",
    tone: "amber",
    location: "Uttara, Dhaka",
    time: "06:00 AM – 08:00 AM",
  },
  {
    id: 5,
    day: 4,
    start: 10,
    duration: 2,
    service: "Care Conflict",
    client: "Overlapping visits",
    caregiver: "Requires review",
    caregiverImage: caregiverKelly,
    status: "Conflict",
    tone: "red",
    location: "Dhaka North",
    time: "10:00 AM – 12:00 PM",
    conflict: true,
  },
  {
    id: 6,
    day: 5,
    start: 14,
    duration: 2.5,
    service: "Post-Op Care",
    client: "Abdul Karim",
    caregiver: "Rahima Khatun",
    caregiverImage: caregiverSarah,
    status: "Confirmed",
    tone: "blue",
    location: "Bashundhara, Dhaka",
    time: "02:00 PM – 04:30 PM",
  },
];

const tones = {
  blue: "border-blue-600 bg-blue-50 text-blue-900",
  green: "border-emerald-600 bg-emerald-50 text-emerald-900",
  amber: "border-amber-500 bg-amber-50 text-amber-900",
  red: "border-red-500 bg-red-50 text-red-800",
};

const AdminSchedule = () => {
  const [view, setView] = useState("Week");
  const [selected, setSelected] = useState(null);
  const [caregiverFilter, setCaregiverFilter] = useState("All Caregivers");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [notice, setNotice] = useState("");
  const [currentDate, setCurrentDate] = useState(INITIAL_DATE);

  const currentWeekDays = useMemo(
    () => buildWeekDays(currentDate),
    [currentDate],
  );
  const selectedDayIndex = (currentDate.getDay() + 6) % 7;
  const calendarLabel = formatCalendarLabel(currentDate, view);

  const visibleAssignments = useMemo(
    () =>
      assignments.filter((assignment) => {
        const caregiverMatch =
          caregiverFilter === "All Caregivers" ||
          assignment.caregiver === caregiverFilter;
        const statusMatch =
          statusFilter === "All Statuses" || assignment.status === statusFilter;
        return caregiverMatch && statusMatch;
      }),
    [caregiverFilter, statusFilter],
  );

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };
  const moveDate = (direction) =>
    setCurrentDate((date) => {
      const next = new Date(date);
      if (view === "Month") next.setMonth(next.getMonth() + direction);
      else next.setDate(next.getDate() + direction * (view === "Week" ? 7 : 1));
      return next;
    });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f7fc] lg:flex lg:h-[calc(100vh-64px)] lg:min-h-0 lg:flex-col lg:overflow-hidden">
      <header className="border-b border-[#c5cad8] bg-white px-4 py-4 sm:px-6 lg:shrink-0">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div>
            <h1 className="text-xl font-semibold">Schedule & Assignments</h1>
            <p className="mt-1 text-sm text-[#606878]">
              Plan visits, resolve conflicts, and manage caregiver coverage.
            </p>
          </div>
          <div className="flex rounded-lg border border-[#c5cad8] bg-[#f7f8fd] p-1 xl:ml-5">
            {["Month", "Week", "Day"].map((item) => (
              <button
                className={`flex-1 rounded px-4 py-2 text-sm font-medium ${view === item ? "bg-white text-[#0649ad] shadow-sm" : "text-[#606878]"}`}
                type="button"
                key={item}
                onClick={() => setView(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex xl:ml-auto">
            <select
              className="rounded-lg border border-[#c5cad8] bg-white px-3 py-2 text-sm"
              value={caregiverFilter}
              onChange={(event) => setCaregiverFilter(event.target.value)}
            >
              <option>All Caregivers</option>
              <option>Samuel Jackson</option>
              <option>Elena Rodriguez</option>
              <option>Marcus King</option>
              <option>Rahima Khatun</option>
            </select>
            <select
              className="rounded-lg border border-[#c5cad8] bg-white px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All Statuses</option>
              <option>Confirmed</option>
              <option>In Progress</option>
              <option>Missed</option>
              <option>Conflict</option>
            </select>
            <button
              className="flex items-center justify-center gap-2 rounded-lg border border-[#c5cad8] px-4 py-2 text-sm"
              type="button"
            >
              <Download className="size-4" /> Export
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-4 py-2 text-sm font-semibold text-white"
              type="button"
              onClick={() =>
                notify("New assignment form is ready for API integration.")
              }
            >
              <Plus className="size-4" /> New Assignment
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-y-2 border-b border-[#c5cad8] bg-white px-4 py-3 sm:px-6 lg:shrink-0">
        <button
          className="grid size-9 place-items-center rounded-lg border border-[#c5cad8]"
          type="button"
          onClick={() => moveDate(-1)}
          aria-label={`Previous ${view.toLowerCase()}`}
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          className="ml-2 rounded-lg border border-[#c5cad8] px-4 py-2 text-sm font-medium"
          type="button"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
        <button
          className="ml-2 grid size-9 place-items-center rounded-lg border border-[#c5cad8]"
          type="button"
          onClick={() => moveDate(1)}
          aria-label={`Next ${view.toLowerCase()}`}
        >
          <ChevronRight className="size-4" />
        </button>
        <div className="ml-4">
          <b>{calendarLabel}</b>
          <small className="ml-3 hidden text-[#606878] sm:inline">
            Local time
          </small>
        </div>
        <div className="ml-auto hidden items-center gap-3 text-xs md:flex">
          <Legend color="bg-blue-500" label="Confirmed" />
          <Legend color="bg-emerald-500" label="In progress" />
          <Legend color="bg-red-500" label="Issue" />
        </div>
      </div>
      {notice && (
        <div className="mx-4 mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 sm:mx-6 lg:shrink-0">
          {notice}
        </div>
      )}

      <main className="hide-scrollbar p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="lg:hidden">
          <MobileAgenda
            assignments={visibleAssignments}
            days={currentWeekDays}
            onSelect={setSelected}
          />
        </div>
        <div className="hidden lg:block">
          {view === "Month" ? (
            <MonthView
              assignments={visibleAssignments}
              currentDate={currentDate}
              onSelect={setSelected}
            />
          ) : view === "Day" ? (
            <DayView
              assignments={visibleAssignments.filter(
                (item) => item.day === selectedDayIndex,
              )}
              currentDate={currentDate}
              onSelect={setSelected}
            />
          ) : (
            <WeekView
              assignments={visibleAssignments}
              days={currentWeekDays}
              onSelect={setSelected}
            />
          )}
        </div>
      </main>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 sm:px-6 lg:static lg:shrink-0">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-500 text-white">
          <AlertTriangle className="size-5" />
        </span>
        <p>
          <b className="block text-sm">
            2 unconfirmed shifts require action before 8:00 PM
          </b>
          <small>Pending assignments may cause service delays.</small>
        </p>
        <button
          className="ml-auto hidden rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white sm:block"
          type="button"
          onClick={() => setStatusFilter("Conflict")}
        >
          Review Issues
        </button>
      </div>
      {selected && (
        <AssignmentDrawer
          assignment={selected}
          onClose={() => setSelected(null)}
          onNotify={notify}
        />
      )}
    </div>
  );
};

const WeekView = ({ assignments: items, days, onSelect }) => (
  <section className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
    <div className="overflow-x-auto">
      <div className="min-w-[1050px]">
        <div className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-[#c5cad8] bg-[#f7f8fd]">
          <div className="p-3 text-xs text-[#606878]">Local</div>
          {days.map((day) => (
            <div
              className={`border-l border-[#d7dbe7] p-3 text-center ${day.isToday ? "bg-blue-50 text-[#0649ad]" : ""}`}
              key={day.key}
            >
              <b className="block text-sm">{day.name}</b>
              <span
                className={`mt-1 inline-grid size-8 place-items-center rounded-full font-semibold ${day.isToday ? "bg-[#0755d3] text-white" : ""}`}
              >
                {day.date}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[72px_repeat(7,1fr)]">
          <div>
            {Array.from({ length: 13 }, (_, index) => (
              <div
                className="h-[60px] border-b border-[#edf0f5] pr-3 pt-1 text-right text-[10px] text-[#737b8c]"
                key={index}
              >
                {formatHour(index + 6)}
              </div>
            ))}
          </div>
          {days.map((day, dayIndex) => (
            <div
              className="relative h-[780px] border-l border-[#d7dbe7] bg-[linear-gradient(to_bottom,transparent_59px,#edf0f5_60px)] bg-[length:100%_60px]"
              key={day.key}
            >
              {items
                .filter((item) => item.day === dayIndex)
                .map((assignment) => (
                  <CalendarEvent
                    assignment={assignment}
                    key={assignment.id}
                    onClick={() => onSelect(assignment)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const CalendarEvent = ({ assignment, onClick }) => (
  <button
    className={`absolute left-2 right-2 overflow-hidden rounded-lg border-l-4 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${tones[assignment.tone]} ${assignment.conflict ? "border-2 border-dashed" : ""}`}
    style={{
      top: `${(assignment.start - 6) * 60 + 4}px`,
      height: `${Math.max(72, assignment.duration * 60 - 8)}px`,
    }}
    type="button"
    onClick={onClick}
  >
    {assignment.conflict ? (
      <span className="flex h-full flex-col items-center justify-center text-xs font-semibold uppercase">
        <AlertTriangle className="mb-2 size-5" /> Conflict
      </span>
    ) : (
      <>
        <small className="font-semibold uppercase">{assignment.service}</small>
        <b className="mt-1 block text-sm">{assignment.caregiver}</b>
        <span className="block text-xs">{assignment.client}</span>
        <span className="mt-2 block text-[10px]">{assignment.time}</span>
      </>
    )}
  </button>
);

const MobileAgenda = ({ assignments: items, days, onSelect }) => (
  <section className="space-y-4">
    {days.map((day, index) => {
      const dayItems = items.filter((item) => item.day === index);
      if (!dayItems.length) return null;
      return (
        <div key={day.key}>
          <h2
            className={`mb-2 text-sm font-semibold ${day.isToday ? "text-[#0649ad]" : "text-[#515867]"}`}
          >
            {day.fullLabel}
          </h2>
          <div className="space-y-2">
            {dayItems.map((assignment) => (
              <button
                className={`flex w-full items-center gap-3 rounded-xl border-l-4 p-4 text-left shadow-sm ${tones[assignment.tone]}`}
                type="button"
                key={assignment.id}
                onClick={() => onSelect(assignment)}
              >
                <div className="w-20 shrink-0">
                  <b className="block text-sm">
                    {assignment.time.split(" – ")[0]}
                  </b>
                  <small>{assignment.duration} hrs</small>
                </div>
                <div className="min-w-0 flex-1">
                  <b className="block">{assignment.service}</b>
                  <small className="text-[#606878]">
                    {assignment.client} • {assignment.caregiver}
                  </small>
                </div>
                <ChevronRight className="size-5" />
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </section>
);

const MonthView = ({ assignments: items, currentDate, onSelect }) => {
  const cells = buildMonthCells(currentDate);
  const activeWeek = buildWeekDays(currentDate);
  return (
    <section className="rounded-xl border border-[#c5cad8] bg-white p-5">
      <div className="grid grid-cols-7 border-b border-[#c5cad8] pb-3 text-center text-xs font-semibold uppercase text-[#606878]">
        {dayNames.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {cells.map((cell) => {
          const activeDayIndex = activeWeek.findIndex(
            (day) => day.key === cell.key,
          );
          const dayItems =
            activeDayIndex >= 0
              ? items.filter((item) => item.day === activeDayIndex)
              : [];
          return (
            <div
              className={`min-h-28 rounded-lg border p-2 ${cell.isToday ? "border-[#0755d3] bg-blue-50" : cell.inMonth ? "border-[#d7dbe7]" : "border-transparent bg-[#f8f9fc] text-slate-400"}`}
              key={cell.key}
            >
              <small
                className={`font-semibold ${cell.isToday ? "inline-grid size-6 place-items-center rounded-full bg-[#0755d3] text-white" : ""}`}
              >
                {cell.date}
              </small>
              {dayItems.slice(0, 2).map((item) => (
                <button
                  className={`mt-2 block w-full truncate rounded border-l-2 px-2 py-1 text-left text-[10px] ${tones[item.tone]}`}
                  type="button"
                  key={item.id}
                  onClick={() => onSelect(item)}
                >
                  {item.service}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};
const DayView = ({ assignments: items, currentDate, onSelect }) => (
  <section className="mx-auto max-w-3xl rounded-xl border border-[#c5cad8] bg-white p-6">
    <h2 className="text-lg font-semibold">
      {currentDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    </h2>
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <button
          className={`flex w-full items-center gap-5 rounded-xl border-l-4 p-5 text-left ${tones[item.tone]}`}
          type="button"
          key={item.id}
          onClick={() => onSelect(item)}
        >
          <b className="w-24">{item.time.split(" – ")[0]}</b>
          <div>
            <b className="block">{item.service}</b>
            <small>
              {item.client} • {item.caregiver}
            </small>
          </div>
        </button>
      ))}
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#b9c1d3] p-10 text-center text-[#606878]">
          No assignments scheduled for this day.
        </div>
      )}
    </div>
  </section>
);

const AssignmentDrawer = ({ assignment, onClose, onNotify }) => (
  <>
    <button
      className="fixed inset-0 z-40 bg-slate-950/40"
      type="button"
      onClick={onClose}
      aria-label="Close assignment details"
    />
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[390px] flex-col bg-white shadow-2xl">
      <header className="flex items-center border-b border-[#c5cad8] p-5">
        <h2 className="text-lg font-semibold">Assignment Details</h2>
        <button className="ml-auto" type="button" onClick={onClose}>
          <X className="size-6" />
        </button>
      </header>
      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center">
            <Status value={assignment.status} />
            <small className="ml-auto text-emerald-700">Updated today</small>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <img
              className="size-12 rounded-full object-cover"
              src={assignment.caregiverImage}
              alt=""
            />
            <div>
              <b className="block">{assignment.caregiver}</b>
              <small className="text-[#606878]">Assigned Caregiver</small>
            </div>
          </div>
        </section>
        <section>
          <small className="font-semibold uppercase text-[#606878]">
            Client & Service
          </small>
          <div className="mt-3 rounded-xl border border-[#c5cad8] p-4">
            <b className="block">{assignment.client}</b>
            <small className="text-[#606878]">{assignment.service}</small>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-3">
          <Detail
            icon={CalendarDays}
            label="Schedule"
            value={assignment.time}
          />
          <Detail icon={MapPin} label="Location" value={assignment.location} />
        </div>
        <section>
          <small className="font-semibold uppercase text-[#606878]">
            Actions
          </small>
          <button
            className="mt-3 flex w-full items-center gap-3 rounded-lg border border-[#c5cad8] p-4 text-left font-semibold"
            type="button"
            onClick={() => onNotify("Reschedule workflow opened.")}
          >
            <Clock3 className="size-5 text-[#0755d3]" /> Reschedule Visit
          </button>
          <button
            className="mt-3 flex w-full items-center gap-3 rounded-lg border border-[#c5cad8] p-4 text-left font-semibold"
            type="button"
            onClick={() => onNotify("Caregiver reassignment opened.")}
          >
            <Users className="size-5 text-[#0755d3]" /> Reassign Caregiver
          </button>
          <button
            className="mt-3 flex w-full items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-left font-semibold text-red-600"
            type="button"
            onClick={() =>
              onNotify("Assignment cancellation requires backend confirmation.")
            }
          >
            <X className="size-5" /> Cancel Assignment
          </button>
        </section>
      </div>
      <footer className="border-t border-[#c5cad8] p-5">
        <button
          className="w-full rounded-lg bg-[#0755d3] py-3 font-semibold text-white"
          type="button"
          onClick={onClose}
        >
          Done
        </button>
      </footer>
    </aside>
  </>
);

const Detail = ({ icon: Icon, label, value }) => (
  <article className="rounded-xl border border-[#c5cad8] p-4">
    <Icon className="size-5 text-[#0755d3]" />
    <small className="mt-3 block uppercase text-[#606878]">{label}</small>
    <b className="mt-1 block text-sm">{value}</b>
  </article>
);
const Status = ({ value }) => (
  <span
    className={`rounded px-2 py-1 text-[9px] font-semibold uppercase ${value === "Conflict" || value === "Missed" ? "bg-red-100 text-red-700" : value === "In Progress" ? "bg-emerald-600 text-white" : "bg-blue-100 text-blue-700"}`}
  >
    {value}
  </span>
);
const Legend = ({ color, label }) => (
  <span className="flex items-center gap-1.5">
    <span className={`size-2 rounded-full ${color}`} /> {label}
  </span>
);
const formatHour = (hour) =>
  `${String(hour > 12 ? hour - 12 : hour).padStart(2, "0")}:00 ${hour >= 12 ? "PM" : "AM"}`;

const buildWeekDays = (date) => {
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return dayNames.map((name, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return {
      name,
      date: day.getDate(),
      key: dateKey(day),
      fullLabel: day.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      isToday: isSameDay(day, INITIAL_DATE),
    };
  });
};

const buildMonthCells = (date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return {
      date: day.getDate(),
      key: dateKey(day),
      inMonth: day.getMonth() === date.getMonth(),
      isToday: isSameDay(day, INITIAL_DATE),
    };
  });
};

const formatCalendarLabel = (date, view) => {
  if (view === "Month")
    return date.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  if (view === "Day")
    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const days = buildWeekDays(date);
  const start = new Date(`${days[0].key}T00:00:00`);
  const end = new Date(`${days[6].key}T00:00:00`);
  if (start.getMonth() === end.getMonth())
    return `${start.toLocaleDateString(undefined, { month: "short" })} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
};

const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const isSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export default AdminSchedule;
