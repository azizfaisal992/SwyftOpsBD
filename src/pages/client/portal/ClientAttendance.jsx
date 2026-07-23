import { ChevronLeft, ChevronRight, Download, MapPin } from "lucide-react";
import mapImage from "../../../assets/find-care-map.jpg";
import PortalCard from "../../../components/client/portal/PortalCard";
import { connectedCaregiver } from "../../../data/clientPortalData";

const visits = { 1: "08:00", 2: "08:05", 4: "08:02", 6: "08:02", 8: "08:02", 10: "08:02", 12: "08:02" };
const calendarDays = Array.from({ length: 35 }, (_, index) => index < 2 ? null : index - 1);

const ClientAttendance = () => (
  <div className="mx-auto max-w-[1050px] p-5 sm:p-7">
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <header><h1 className="text-3xl font-semibold tracking-[-0.03em]">Attendance Tracking</h1><p className="mt-2 max-w-xl text-[#4c5261]">Real-time caregiver verification and hour logs for November 2024.</p></header>
      <div className="grid grid-cols-3 gap-3 text-xs"><Metric label="Total Hours" value="164.5 hrs" /><Metric label="Verified Visits" value="28 / 30" green /><Metric label="Current Status" value="● On Duty" dark /></div>
    </div>
    <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_315px]">
      <PortalCard className="overflow-hidden">
        <div className="flex items-center justify-between bg-[#eef2ff] p-6"><div className="flex items-center gap-5"><ChevronLeft className="size-5" /><h2 className="text-2xl font-semibold">November 2024</h2><ChevronRight className="size-5" /></div><div className="hidden rounded border border-[#c5cad8] bg-white p-1 text-sm sm:flex"><span className="rounded bg-white px-4 py-2 font-semibold text-[#0649ad] shadow">Calendar</span><span className="px-4 py-2">List View</span></div></div>
        <div className="p-4">
          <div className="grid grid-cols-7 text-center text-xs">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => <span className="border border-[#c5cad8] p-3" key={day}>{day}</span>)}</div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => <div className={`min-h-28 border border-[#c5cad8] p-2 text-xs ${day === 14 ? "bg-[#e6f0ff] ring-2 ring-inset ring-[#0649ad]" : "bg-white"}`} key={index}>{day && <><span>{day}</span>{day === 14 ? <div className="mt-3 rounded bg-[#0649ad] p-2 text-white"><b>Active: 08:00 AM</b><br />● In Progress</div> : visits[day] && <div className="mt-3 rounded border border-emerald-600 bg-emerald-50 p-2 text-emerald-800"><b>Check-in: {visits[day]}</b><br /><span>8.0 hrs logged</span></div>}</>}</div>)}
          </div>
        </div>
      </PortalCard>
      <div className="space-y-4">
        <PortalCard className="overflow-hidden">
          <div className="flex justify-between bg-[#eef2ff] p-4 text-sm font-semibold"><span>Location Verification</span><span className="bg-[#9df2c8] px-2 py-1 text-[9px] text-emerald-700">GPS SECURE</span></div>
          <img className="h-48 w-full object-cover" src={mapImage} alt="Verified caregiver location" />
          <div className="p-4"><h3 className="flex items-center gap-2 font-semibold"><MapPin className="size-5 text-[#0649ad]" /> Current Check-in Location</h3><p className="mt-1 pl-7 text-xs text-[#4c5261]">1248 North Hills Ave, Unit 4B<br />Los Angeles, CA 90024</p><p className="mt-2 pl-7 text-xs font-semibold text-emerald-600">✣ Within 50m of designated site</p></div>
        </PortalCard>
        <PortalCard className="overflow-hidden">
          <div className="flex justify-between bg-[#eef2ff] p-4"><h2 className="font-semibold">Live Log Feed</h2><button className="flex items-center gap-1 text-xs text-[#0649ad]" type="button"><Download className="size-3" /> Export CSV</button></div>
          {[["Today, 08:00 AM","Check-in"],["Nov 13, 04:30 PM","Check-out"],["Nov 13, 08:00 AM","Check-in"]].map(([date,status]) => <div className="flex items-center gap-3 border-b border-[#c5cad8] p-4" key={`${date}${status}`}><img className="size-9 rounded-full object-cover" src={connectedCaregiver.image} alt="" /><div className="min-w-0 flex-1"><b className="text-sm">{date}</b><p className="text-xs font-semibold">{connectedCaregiver.name}</p></div><span className="bg-[#d8f7e9] px-2 py-1 text-[9px] font-semibold uppercase text-emerald-700">{status}</span></div>)}
          <button className="w-full bg-[#f7f8fb] p-4 text-sm font-semibold" type="button">View Full History Log »</button>
        </PortalCard>
      </div>
    </div>
  </div>
);

const Metric = ({ label, value, green, dark }) => <div className={`min-w-32 rounded-lg border border-[#c5cad8] p-4 ${dark ? "bg-[#06449d] text-white" : "bg-white"}`}><span className="block uppercase tracking-[0.08em]">{label}</span><strong className={`mt-2 block text-2xl ${green ? "text-emerald-500" : dark ? "text-white" : "text-[#0649ad]"}`}>{value}</strong></div>;

export default ClientAttendance;
