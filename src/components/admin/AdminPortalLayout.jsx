import {
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminAccount } from "../../data/adminPortalData";
import useAuth from "../../hooks/useAuth";
import { logoutAdmin } from "../../services/adminAuthService";

const navItems = [
  { label: "Overview Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Caregivers", icon: Users, to: "/admin/caregivers" },
  { label: "Clients", icon: UserCog, to: "/admin/clients" },
  { label: "Requests & Matching", icon: Users, to: "/admin/requests" },
  { label: "Live Operations", icon: Radio, to: "/admin/live-operations" },
  { label: "Schedule", icon: CalendarDays, to: "/admin/schedule" },
  { label: "Verification Center", icon: ShieldCheck, to: "/admin/verification" },
  { label: "Messages & Calls", icon: MessageSquare, to: "/admin/messages" },
  { label: "Payments & Finance", icon: WalletCards, to: "/admin/finance" },
  { label: "Documents", icon: FileText, to: "/admin/documents" },
  { label: "Reports", icon: BarChart3, to: "/admin/reports" },
  { label: "Disputes & SOS", icon: AlertTriangle, to: "/admin/disputes" },
  { label: "Website CMS", icon: LayoutDashboard, to: "/admin/cms" },
  { label: "Admin Users", icon: UserCog, to: "/admin/users" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

const pageTitles = {
  "/admin/dashboard": "Operations Overview",
  "/admin/caregivers": "Caregivers",
  "/admin/clients": "Clients",
  "/admin/requests": "Requests & Matching",
  "/admin/live-operations": "Live Operations",
  "/admin/schedule": "Schedule & Assignments",
  "/admin/verification": "Verification Center",
  "/admin/finance": "Payments & Finance",
  "/admin/messages": "Messages & Calls Oversight",
  "/admin/documents": "Documents Management",
  "/admin/reports": "Analytics & Reports",
  "/admin/cms": "Website CMS",
  "/admin/disputes": "Disputes & Incidents",
  "/admin/settings": "System Settings",
  "/admin/users": "Admin Management",
};

const AdminPortalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { claims, user } = useAuth();
  const title = pageTitles[location.pathname] ?? "Admin Panel";
  const usesPageHeader = ["/admin/messages", "/admin/documents", "/admin/disputes"].includes(location.pathname);

  const logout = async () => {
    await logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  const adminName = user?.displayName || user?.email || adminAccount.name;
  const adminEmail = user?.email || adminAccount.email;
  const adminRole = String(claims.role || adminAccount.role).replaceAll("_", " ");
  const adminImage = user?.photoURL || adminAccount.image;

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-[#111c2c]">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#071b2c] text-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center gap-3 px-5">
          <span className="grid size-10 place-items-center rounded-xl bg-[#1974d2] text-lg font-semibold">S</span>
          <div>
            <b className="block">SwiftOpsBD</b>
            <small className="uppercase tracking-[0.14em] text-slate-400">Admin Panel</small>
          </div>
          <button className="ml-auto lg:hidden" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="hide-scrollbar flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {navItems.map(({ label, icon: Icon, to }) =>
            to ? (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg border-l-4 px-3 py-3 text-sm transition ${isActive ? "border-[#1683ff] bg-[#0c3764] text-white" : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"}`
                }
                key={label}
                to={to}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="size-5 shrink-0" /> {label}
              </NavLink>
            ) : (
              <span className="flex cursor-default items-center gap-3 rounded-lg border-l-4 border-transparent px-3 py-3 text-sm text-slate-500" key={label}>
                <Icon className="size-5 shrink-0" /> {label}
              </span>
            ),
          )}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <img className="size-10 rounded-full object-cover" src={adminImage} alt={adminName} />
            <div className="min-w-0">
              <b className="block truncate text-sm">{adminName}</b>
              <small className="block truncate text-slate-400">{adminEmail}</small>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg border border-white/15 px-3 py-2 text-left text-sm text-red-300 hover:bg-white/5" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-60">
        <header className={`sticky top-0 z-30 h-16 items-center border-b border-[#c9cfdd] bg-white px-4 sm:px-6 ${usesPageHeader ? "flex lg:hidden" : "flex"}`}>
          <button className="mr-3 lg:hidden" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open admin navigation">
            <Menu className="size-6" />
          </button>
          <div className="hidden w-full max-w-md items-center gap-2 rounded-xl bg-[#f1f3fa] px-3 py-2 text-[#606878] sm:flex">
            <Search className="size-5" />
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search users, caregivers, clients..." />
          </div>
          <b className="truncate text-base sm:hidden">{title}</b>
          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            <button type="button" aria-label="Notifications"><Bell className="size-5" /></button>
            <div className="hidden border-l border-[#c9cfdd] pl-5 text-right md:block">
              <b className="block text-sm">{adminName}</b>
              <small className="capitalize text-[#606878]">{adminRole}</small>
            </div>
            <img className="size-9 rounded-lg object-cover" src={adminImage} alt={adminName} />
          </div>
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminPortalLayout;
