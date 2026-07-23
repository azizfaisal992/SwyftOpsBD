import { Check, ChevronLeft, ChevronRight, CircleAlert, Clock3, MapPin, MessageSquare, MoreVertical, PlusCircle } from "lucide-react";
import mapImage from "../../../assets/find-care-map.jpg";
import PortalCard from "../../../components/client/portal/PortalCard";
import { careSchedule, connectedCaregiver, serviceReports } from "../../../data/clientPortalData";
import useAuth from "../../../hooks/useAuth";

const ClientDashboard = () => {
  const { user } = useAuth();
  const clientName = user?.displayName?.split(" ")[0] || "Sarah";

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 p-5 sm:p-7">
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">Daily Care Overview</h1>
        <p className="mt-1 text-[#4c5261]">Welcome back, {clientName}. Here is what&apos;s happening today.</p>
      </header>

      <PortalCard className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-semibold">Active Request: Post-Op Care</p><p className="mt-1 text-xs text-[#4c5261]">Request ID: #RQ-8821</p></div>
        <div className="flex items-center gap-2 text-[10px]">
          {["Pending", "Approved"].map((label) => <div className="flex items-center gap-2" key={label}><span className="grid size-8 place-items-center rounded-xl bg-[#34b884] text-white"><Check className="size-4" /></span><span className="text-emerald-700">{label}</span><span className="h-0.5 w-8 bg-[#34b884]" /></div>)}
          <span className="grid size-8 place-items-center rounded-xl bg-[#e4eaff] text-[#06449d]">♙</span><span>Assigned</span>
        </div>
      </PortalCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_315px]">
        <PortalCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <img className="size-12 rounded-full border-2 border-emerald-400 object-cover" src={connectedCaregiver.image} alt={connectedCaregiver.name} />
              <div><h2 className="text-2xl font-semibold">Service Status: Active</h2><p className="uppercase tracking-[0.04em] text-[#4c5261]">Assigned: {connectedCaregiver.name} ({connectedCaregiver.shortRole})</p></div>
            </div>
            <div className="text-right"><span className="inline-flex items-center gap-2 rounded-full bg-[#dce8ff] px-4 py-2 text-sm text-[#0649ad]"><Clock3 className="size-4" /> On-site: 03h 45m</span><button className="mt-2 flex items-center gap-1 text-sm text-red-600 sm:ml-auto" type="button"><CircleAlert className="size-4" /> Report Issue</button></div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 border-y border-[#c5cad8] py-3 text-xs">
            <div><span className="text-[#4c5261]">Clock In</span><strong className="block text-base font-medium text-[#0649ad]">08:00 AM</strong></div>
            <div><span className="text-[#4c5261]">Target Clock Out</span><strong className="block text-base font-medium">04:00 PM</strong></div>
            <div><span className="text-[#4c5261]">Distance from Base</span><strong className="block text-base font-medium">1.2 miles</strong></div>
          </div>
          <div className="relative mt-4 h-64 overflow-hidden rounded-lg border border-[#c5cad8]">
            <img className="h-full w-full object-cover" src={mapImage} alt="Live caregiver GPS location" />
            <span className="absolute right-4 top-4 rounded-lg bg-white px-4 py-2 text-sm shadow"><i className="mr-1 inline-block size-2 rounded-full bg-emerald-500" />Live GPS Signal</span>
            <span className="absolute bottom-4 left-4 rounded-lg bg-white px-4 py-2 text-xs shadow"><MapPin className="mr-1 inline size-4 text-[#0649ad]" /><b>Current Location</b><br />North Michigan Ave, Near Plaza</span>
          </div>
        </PortalCard>

        <PortalCard className="p-6">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Service Reports</h2><button className="text-sm font-medium text-[#0649ad]" type="button">View All</button></div>
          <div className="mt-5 space-y-3">
            {serviceReports.map((report) => (
              <article className="rounded-lg border border-[#c5cad8] p-3" key={report.title}>
                <div className="flex justify-between gap-2 text-xs text-[#4c5261]"><span>{report.date}</span><span className="rounded bg-[#d8f7e9] px-2 py-1 text-[9px] font-semibold text-emerald-700">APPROVED</span></div>
                <h3 className="mt-2 text-sm font-medium">{report.title}</h3>
                <p className="mt-2 truncate text-xs text-[#4c5261]"><MessageSquare className="mr-1 inline size-3" />{report.note}</p>
              </article>
            ))}
          </div>
        </PortalCard>
      </div>

      <PortalCard className="p-6">
        <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Upcoming Care Schedule</h2><div className="flex gap-4"><ChevronLeft className="size-5" /><ChevronRight className="size-5" /></div></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {careSchedule.map((item) => (
            <article className="border-l-4 border-[#ccd2e2] bg-[#f9f9ff] p-5" key={`${item.date}-${item.time}`}>
              <div className="flex justify-between"><span className="text-xs font-bold uppercase text-[#0649ad]">{item.date}</span><MoreVertical className="size-4" /></div>
              <p className="mt-4 text-2xl font-semibold">{item.time}</p><p className="text-[#4c5261]">{item.service}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-[#c5cad8] pt-3 text-xs"><img className="size-6 rounded-full object-cover" src={item.caregiver.image} alt="" />{item.caregiver.name}</div>
            </article>
          ))}
          <button className="grid min-h-44 place-items-center rounded-xl border-2 border-dashed border-[#c5cad8] bg-[#f4f6ff] text-[#4c5261]" type="button"><span><PlusCircle className="mx-auto size-7" /><span className="mt-2 block">Schedule Care</span></span></button>
        </div>
      </PortalCard>
    </div>
  );
};

export default ClientDashboard;
