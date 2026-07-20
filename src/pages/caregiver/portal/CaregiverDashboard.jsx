import {
  Banknote,
  CalendarCheck,
  Clock3,
  Power,
  Star,
  TriangleAlert,
} from "lucide-react";
import { caregiverAccount } from "../../../data/caregiverPortalData";
import CaregiverCard from "../../../components/caregiver/portal/CaregiverCard";
import { useState } from "react";
import { Link } from "react-router-dom";

const CaregiverDashboard = () => {
  const [onShift, setOnShift] = useState(false);
  return (
    <div className="mx-auto max-w-[1020px] space-y-7 p-5 sm:p-7">
      <header>
        <h1 className="text-4xl font-semibold">
          Good Morning, {caregiverAccount.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-[#4c5261]">
          Here is your overview for today, Oct 24.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          <div className="mt-8 flex h-64 items-end gap-2 border-b border-[#c5cad8]">
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
          <CaregiverCard className="overflow-hidden">
            <div className="flex justify-between bg-[#eef2f7] p-4">
              <b>Shift Status</b>
              <span
                className={`rounded-full px-3 py-1 text-xs ${onShift ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
              >
                ● {onShift ? "On Shift" : "Off-Duty"}
              </span>
            </div>
            <div className="p-7 text-center">
              <p className="text-sm text-[#4c5261]">
                {onShift
                  ? "Your shift is currently active."
                  : "You are currently offline. Ready to start your shift?"}
              </p>
              <button
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0755d3] px-5 py-4 text-lg font-semibold text-white"
                type="button"
                onClick={() => setOnShift(!onShift)}
              >
                <Power />
                {onShift ? "Clock Out" : "Clock In"}
              </button>
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
          <div className="flex gap-5 border-t border-[#c5cad8] p-6" key={time}>
            <strong className="w-20 text-xl">{time}</strong>
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
  <CaregiverCard className="p-6">
    <div className="flex justify-between">
      <span
        className={`grid size-10 place-items-center rounded-lg ${green ? "bg-emerald-100 text-emerald-700" : amber ? "bg-amber-100 text-amber-700" : "bg-[#e7efff] text-[#0649ad]"}`}
      >
        <Icon className="size-5" />
      </span>
      <span className="text-xs text-emerald-700">{change}</span>
    </div>
    <p className="mt-3 text-sm uppercase tracking-[.06em] text-[#4c5261]">
      {label}
    </p>
    <strong className="text-4xl">{value}</strong>
  </CaregiverCard>
);
export default CaregiverDashboard;
