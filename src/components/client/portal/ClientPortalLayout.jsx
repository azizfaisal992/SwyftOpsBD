import {
  Bell,
  CalendarDays,
  CircleHelp,
  CreditCard,
  FileUp,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Plus,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { connectedCaregiver } from "../../../data/clientPortalData";

const navigation = [
  { label: "Dashboard", path: "/client/dashboard", icon: LayoutDashboard },
  { label: "Upload Medication", path: "/client/medications", icon: FileUp },
  { label: "Attendance", path: "/client/attendance", icon: CalendarDays },
  { label: "Verification", path: "/client/caregiver-verification", icon: ShieldCheck },
  { label: "Payments", path: "/client/payments", icon: CreditCard },
  { label: "Messages", path: "/client/messages", icon: MessageSquareText },
];

const ClientPortalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-[#c5cad8] bg-[#f9f9ff]">
      <div className="flex h-16 items-center px-6 text-2xl font-bold tracking-[-0.02em] text-[#06449d]">SwiftOpsBD</div>
      <nav className="space-y-1 px-3 py-6">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive ? "bg-[#9df2c8] text-[#087755]" : "text-[#4c5261] hover:bg-white"
            }`}
            key={path}
            onClick={() => setSidebarOpen(false)}
            to={path}
          >
            <Icon className="size-5" /> {label}
          </NavLink>
        ))}
      </nav>
      <NavLink className="mx-4 mb-6 mt-auto flex items-center justify-center gap-2 rounded-lg bg-[#0649ad] px-4 py-3 text-sm font-semibold text-white" to="/find-care">
        <Plus className="size-5" /> New Request
      </NavLink>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f5f6f9] text-[#111c2c]">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button className="absolute inset-0 bg-slate-950/35" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
          <div className="relative">
            {sidebar}
            <button className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg bg-white" type="button" onClick={() => setSidebarOpen(false)}><X className="size-5" /></button>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#c5cad8] bg-white px-5 sm:px-7">
          <button className="grid size-10 place-items-center rounded-lg border border-[#c5cad8] lg:hidden" type="button" onClick={() => setSidebarOpen(true)}><Menu className="size-5" /></button>
          <span className="text-xl font-bold text-[#06449d] lg:hidden">SwiftOpsBD</span>
          <div className="ml-auto flex items-center gap-4 text-[#424958]">
            <button className="relative" type="button" aria-label="Notifications"><Bell className="size-5" /><span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-red-600" /></button>
            <CircleHelp className="size-5" />
            <Settings className="hidden size-5 sm:block" />
            <img className="size-9 rounded-lg border border-[#9da6ba] object-cover" src={connectedCaregiver.image} alt="Account" />
          </div>
        </header>

        <main className="min-h-[calc(100vh-112px)]"><Outlet /></main>
        <footer className="flex flex-col gap-3 bg-[#263449] px-6 py-4 text-xs text-[#c7cfdd] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SwiftOpsBD Management System. All rights reserved.</p>
          <nav className="flex flex-wrap gap-5"><a href="#privacy">Privacy Policy</a><a href="#terms">Terms of Service</a><a href="#compliance">Compliance</a><a href="#disputes">Dispute Resolution</a></nav>
        </footer>
      </div>
    </div>
  );
};

export default ClientPortalLayout;
