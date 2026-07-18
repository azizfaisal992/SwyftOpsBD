import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/Logo.png";
import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, loading } = useAuth();
  const accountName = user?.displayName || user?.email?.split("@")[0] || "Account";
  const accountInitial = accountName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await logout();
    setAccountOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#c3c6d6] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-semibold text-[#003d9b]">
            <img src={logoImage} alt="SwiftOpsBD" className="h-14 w-auto" />
          </Link>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
            <Link className="nav-link flex items-center" to="/find-care">
              Find care <span aria-hidden="true">
                <ChevronDown className="size-4" />
              </span>
            </Link>
            <Link className="nav-link" to="/find-jobs">Find jobs</Link>
            <a className="nav-link" href="#how-it-works">Resources</a>
          </nav>
        </div>

        <div className="relative hidden items-center gap-2 md:flex">
          {loading ? (
            <span className="h-10 w-28 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <>
              <button
                className="flex items-center gap-3 rounded-full border border-[#c3c6d6] bg-white py-1.5 pl-1.5 pr-3 text-left hover:bg-[#f8faff]"
                type="button"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((current) => !current)}
              >
                {user.photoURL ? (
                  <img className="size-8 rounded-full object-cover" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <span className="grid size-8 place-items-center rounded-full bg-[#dee9ff] text-sm font-bold text-[#003d9b]">{accountInitial}</span>
                )}
                <span className="max-w-36 truncate text-sm font-semibold text-[#101c2d]">{accountName}</span>
                <ChevronDown className="size-4 text-[#434654]" />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-xl border border-[#c3c6d6] bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="truncate text-sm font-semibold">{accountName}</p>
                    <p className="mt-1 truncate text-xs text-[#6b7280]">{user.email}</p>
                  </div>
                  <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#434654] hover:bg-[#f0f3ff]" type="button" onClick={handleSignOut}>
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link className="rounded-lg px-4 py-2 text-sm font-semibold text-[#003d9b]" to="/login">Log in</Link>
              <Link className="primary-button !px-6 !py-2" to="/join">Join now</Link>
            </>
          )}
        </div>

        <button
          className="grid size-10 place-items-center rounded-lg border border-slate-200 md:hidden"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="text-xl">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <nav className="grid gap-1 border-t border-slate-200 bg-white p-4 md:hidden">
          <Link className="mobile-link" to="/find-care">Find care</Link>
          <Link className="mobile-link" to="/find-jobs">Find jobs</Link>
          <a className="mobile-link" href="#how-it-works">Resources</a>
          {user ? (
            <>
              <div className="mt-2 flex items-center gap-3 rounded-lg bg-[#f0f3ff] p-3">
                {user.photoURL ? <img className="size-9 rounded-full object-cover" src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : <UserRound className="size-9 text-[#003d9b]" />}
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{accountName}</p><p className="truncate text-xs text-[#6b7280]">{user.email}</p></div>
              </div>
              <button className="mobile-link flex items-center gap-2 text-left" type="button" onClick={handleSignOut}><LogOut className="size-4" />Sign out</button>
            </>
          ) : (
            <>
              <Link className="mobile-link text-[#003d9b]" to="/login">Log in</Link>
              <Link className="primary-button mt-2 text-center" to="/join">Join now</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
