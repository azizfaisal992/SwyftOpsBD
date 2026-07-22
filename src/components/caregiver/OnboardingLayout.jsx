import {
  Bell,
  ClipboardList,
  FileCheck2,
  HelpCircle,
  LockKeyhole,
  LogOut,
  UserRound,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoImage from "../../assets/Logo.png";
import useAuth from "../../hooks/useAuth";
import useCaregiverOnboarding from "../../hooks/useCaregiverOnboarding";
import { logout } from "../../services/authService";

const steps = [
  { id: "profile", label: "Profile Setup", path: "/caregiver/profile-setup", icon: UserRound },
  { id: "credentials", label: "Credentials", path: "/caregiver/credentials", icon: FileCheck2 },
  { id: "assessment", label: "Assessment", path: "/caregiver/assessment", icon: ClipboardList },
];

const OnboardingLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, record } = useCaregiverOnboarding();
  const accountName = user?.displayName || user?.email?.split("@")[0] || "Caregiver";
  const accountInitial = accountName.charAt(0).toUpperCase();
  const statusLabel = {
    draft: "In progress",
    under_review: "Under review",
    changes_required: "Changes required",
    approved: "Approved",
  }[record.verificationStatus] || "In progress";

  const canOpenStep = (stepId) => {
    if (stepId === "profile") return true;
    if (stepId === "credentials") return record.profileCompleted;
    return record.profileCompleted && record.credentialsCompleted;
  };

  const isStepComplete = (stepId) => {
    if (stepId === "profile") return record.profileCompleted;
    if (stepId === "credentials") return record.credentialsCompleted;
    return record.assessmentSubmitted;
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#101c2d]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#c3c6d6] bg-white px-4 shadow-sm sm:px-6">
        <Link to="/">
          <img src={logoImage} alt="SwiftOpsBD" className="h-7 w-auto max-w-40 sm:h-8" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#434654] md:flex">
          <a href="#dashboard">Dashboard</a>
          <span className="border-b-2 border-[#003d9b] py-5 text-[#003d9b]">Onboarding</span>
          <a href="#resources">Resources</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="grid size-9 place-items-center rounded-lg hover:bg-[#f0f3ff]" type="button" aria-label="Notifications">
            <Bell className="size-5" />
          </button>
          {user?.photoURL ? (
            <img className="size-8 rounded-lg border border-[#c3c6d6] object-cover" src={user.photoURL} alt={accountName} referrerPolicy="no-referrer" />
          ) : (
            <span className="grid size-8 place-items-center rounded-lg border border-[#c3c6d6] bg-[#dee9ff] text-xs font-bold text-[#003d9b]">{accountInitial}</span>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px] items-stretch">
        <aside className="hidden min-h-[calc(100vh-64px)] w-64 shrink-0 flex-col overflow-y-auto border-r border-[#c3c6d6] bg-[#f0f3ff] p-4 md:flex lg:w-[300px]">
          <div className="pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#434654]">Onboarding progress</p>
            <h2 className="mt-1 text-xl font-semibold text-[#003d9b]">{progress}% Complete</h2>
            <p className="mt-1 text-xs font-semibold text-[#434654]">{statusLabel}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#d7e3fb]">
              <div className="h-full rounded-full bg-[#36b37e]" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <nav className="space-y-2">
            {steps.map(({ id, label, path, icon: StepIcon }) => {
              const unlocked = canOpenStep(id);
              if (!unlocked) {
                return <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#8b8e99]" key={path}><LockKeyhole className="size-5" />{label}</span>;
              }
              return (
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                      isActive ? "bg-[#9df5c5] text-[#10734d]" : "text-[#434654] hover:bg-white/70"
                    }`
                  }
                  to={path}
                  key={path}
                >
                  <StepIcon className="size-5" />
                  <span className="flex-1">{label}</span>
                  {isStepComplete(id) && <span aria-label="Completed">✓</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto space-y-1 border-t border-[#c3c6d6] pt-4 text-sm text-[#434654]">
            <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/70" href="#help">
              <HelpCircle className="size-5" /> Help Center
            </a>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/70" type="button" onClick={handleSignOut}>
              <LogOut className="size-5" /> Sign Out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border-b border-[#c3c6d6] bg-[#f0f3ff] p-4 md:hidden">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold">
              <span>Onboarding progress</span><span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#d7e3fb]">
              <div className="h-full bg-[#36b37e]" style={{ width: `${progress}%` }} />
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto">
              {steps.map(({ id, label, path }) => canOpenStep(id) ? (
                <NavLink className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${isActive ? "bg-[#9df5c5] text-[#10734d]" : "bg-white text-[#434654]"}`} to={path} key={path}>
                  {label}{isStepComplete(id) ? " ✓" : ""}
                </NavLink>
              ) : <span className="whitespace-nowrap rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-500" key={path}>{label} 🔒</span>)}
            </nav>
          </div>

          <main className="mx-auto max-w-5xl p-4 sm:p-8 lg:p-12">{children}</main>
          <footer className="flex flex-col gap-3 border-t border-[#c3c6d6] px-4 py-6 text-xs text-[#434654] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8">
            <p>© 2026 SwiftOpsBD. Trusted Healthcare Solutions.</p>
            <nav className="flex flex-wrap gap-5">
              <a href="#privacy">Privacy Policy</a><a href="#terms">Terms of Service</a><a href="#hipaa">HIPAA Compliance</a><a href="#trust">Trust Center</a>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
