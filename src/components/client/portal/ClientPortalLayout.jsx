import {
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileUp,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Plus,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { logout } from "../../../services/authService";
import NotificationBell from "../../communication/NotificationBell";

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
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { account, user } = useAuth();
  const portalContext = useOutletContext();
  const navigate = useNavigate();
  const accountName =
    user?.displayName ||
    account?.displayName ||
    user?.email?.split("@")[0] ||
    "Client";
  const accountInitial = accountName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setSigningOut(true);

    try {
      await logout();
      setAccountOpen(false);
      setSidebarOpen(false);
      navigate("/login", { replace: true });
    } finally {
      setSigningOut(false);
    }
  };

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
            <NotificationBell messagePath="/client/messages" />
            <button type="button" aria-label="Help"><CircleHelp className="size-5" /></button>
            <button className="hidden sm:block" type="button" aria-label="Settings"><Settings className="size-5" /></button>

            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-[#f0f3ff]"
                type="button"
                aria-label="Open client account menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((current) => !current)}
              >
                {user?.photoURL ? (
                  <img
                    className="size-9 rounded-lg border border-[#9da6ba] object-cover"
                    src={user.photoURL}
                    alt={accountName}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="grid size-9 place-items-center rounded-lg border border-[#9da6ba] bg-[#dee9ff] text-sm font-bold text-[#06449d]">
                    {accountInitial || <UserRound className="size-5" />}
                  </span>
                )}
                <span className="hidden max-w-40 text-left md:block">
                  <b className="block truncate text-sm text-[#111c2c]">
                    {accountName}
                  </b>
                  <span className="block text-xs text-[#6b7280]">
                    Client
                  </span>
                </span>
                <ChevronDown className="hidden size-4 sm:block" />
              </button>

              {accountOpen && (
                <>
                  <button
                    className="fixed inset-0 z-40 cursor-default"
                    type="button"
                    aria-label="Close client account menu"
                    onClick={() => setAccountOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-[#c5cad8] bg-white p-2 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
                      {user?.photoURL ? (
                        <img
                          className="size-10 rounded-lg border border-[#9da6ba] object-cover"
                          src={user.photoURL}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#dee9ff] font-bold text-[#06449d]">
                          {accountInitial}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#111c2c]">{accountName}</p>
                        <p className="truncate text-xs text-[#6b7280]">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      type="button"
                      disabled={signingOut}
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      {signingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-112px)]">
          <Outlet context={portalContext} />
        </main>
        <footer className="flex flex-col gap-3 bg-[#263449] px-6 py-4 text-xs text-[#c7cfdd] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SwiftOpsBD Management System. All rights reserved.</p>
          <nav className="flex flex-wrap gap-5"><a href="#privacy">Privacy Policy</a><a href="#terms">Terms of Service</a><a href="#compliance">Compliance</a><a href="#disputes">Dispute Resolution</a></nav>
        </footer>
      </div>
    </div>
  );
};

export default ClientPortalLayout;
