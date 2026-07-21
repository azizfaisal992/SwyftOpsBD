import {
  ArrowLeft,
  Bell,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  UserRound,
  UsersRound,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { caregiverAccount } from "../../../data/caregiverPortalData";
import { logout } from "../../../services/authService";

const items = [
  ["Dashboard", "/caregiver/dashboard", LayoutDashboard],
  ["Assigned Clients", "/caregiver/assigned-clients", UsersRound],
  ["Requested Clients", "/caregiver/requested-clients", UserRoundPlus],
  ["Notifications", "/caregiver/notifications", Bell],
  ["Payments & Wallet", "/caregiver/payments", CreditCard],
  ["Reports", "/caregiver/reports", FileBarChart],
];

const pageTitles = {
  "/caregiver/dashboard": "Dashboard",
  "/caregiver/assigned-clients": "Assigned Clients",
  "/caregiver/requested-clients": "Requested Clients",
  "/caregiver/notifications": "Messages & Communication",
  "/caregiver/payments": "Payments & Wallet",
  "/caregiver/reports": "Analytics & Reports",
};

const CaregiverPortalLayout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isNotifications = location.pathname === "/caregiver/notifications";
  const isRequestDetail = location.pathname.startsWith(
    "/caregiver/requested-clients/",
  );
  const pageTitle = pageTitles[location.pathname];
  const signOut = async () => {
    await logout();
    navigate("/login");
  };
  const sidebar = (
    <aside className="flex h-full w-64 flex-col overflow-y-auto border-r border-[#c5cad8] bg-[#f2f5ff]">
      <div className="px-6 py-7">
        <b className="text-2xl text-[#06449d]">SwiftOpsBD</b>
        <p className="text-xs uppercase tracking-[0.12em] text-[#4c5261]">
          Caregiver Portal
        </p>
      </div>
      <nav className="space-y-1 px-4">
        {items.map(([label, path, Icon]) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${isActive ? "bg-[#0649ad] font-semibold text-white" : "text-[#4c5261] hover:bg-white"}`
            }
            to={path}
            key={path}
            onClick={() => setOpen(false)}
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-2 border-t border-[#c5cad8] p-5">
        <button
          className="flex w-full items-center gap-3 px-2 py-2 text-sm"
          type="button"
        >
          <UserRound className="size-5" />
          Profile
        </button>
        <button
          className="flex w-full items-center gap-3 px-2 py-2 text-sm text-red-600"
          type="button"
          onClick={signOut}
        >
          <LogOut className="size-5" />
          Logout
        </button>
      </div>
    </aside>
  );
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#101c2d]">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {sidebar}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/30"
            type="button"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-64">
            {sidebar}
            <button
              className="absolute right-2 top-2 bg-white p-2"
              type="button"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
      <div className="min-w-0 lg:pl-64">
        <header className="flex h-16 min-w-0 items-center border-b border-[#c5cad8] bg-white px-3 sm:px-5">
          <button
            className="lg:hidden"
            type="button"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          {isRequestDetail && (
            <NavLink className="ml-3 flex min-w-0 items-center gap-2 text-sm font-semibold text-[#0649ad] sm:text-base lg:ml-0" to="/caregiver/requested-clients">
              <ArrowLeft className="size-5 shrink-0" /> <span className="truncate">Back to List</span>
            </NavLink>
          )}
          {!isRequestDetail && pageTitle && (
            <h1 className="ml-3 min-w-0 truncate text-sm font-semibold text-[#06449d] sm:text-lg lg:ml-0">
              {pageTitle}
            </h1>
          )}
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            {isRequestDetail && (
              <label className="hidden w-72 items-center gap-3 rounded-full border border-[#c5cad8] bg-[#edf3ff] px-4 py-2 md:flex">
                <Search className="size-4" />
                <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search requests..." />
              </label>
            )}
            {isNotifications && (
              <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 sm:flex">
                <span className="size-2 rounded-full bg-emerald-600" />
                On shift
              </span>
            )}
            <Bell className="hidden size-5 min-[380px]:block" />
            <MessageSquare className="hidden size-5 sm:block" />
            <img
              className="size-9 rounded-full object-cover"
              src={caregiverAccount.image}
              alt=""
            />
            <div className="hidden md:block">
              <b className="block text-sm">{caregiverAccount.name}</b>
              <span className="text-xs text-[#4c5261]">
                {caregiverAccount.role}
              </span>
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-64px)] min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CaregiverPortalLayout;
