import { useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#c3c6d6] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-8">
          <a href="/" className="text-2xl font-semibold text-[#003d9b]">
            SwiftOpsBD
          </a>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
            <a className="nav-link" href="#services">
              Find care <span aria-hidden="true">
                
              </span>
            </a>
            <a className="nav-link" href="#caregivers">Find jobs</a>
            <a className="nav-link" href="#how-it-works">Resources</a>
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a className="rounded-lg px-4 py-2 text-sm font-semibold text-[#003d9b]" href="#login">
            Log in
          </a>
          <a className="primary-button !px-6 !py-2" href="#join">
            Join now
          </a>
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
          <a className="mobile-link" href="#services">Find care</a>
          <a className="mobile-link" href="#caregivers">Find jobs</a>
          <a className="mobile-link" href="#how-it-works">Resources</a>
          <a className="mobile-link text-[#003d9b]" href="#login">Log in</a>
          <a className="primary-button mt-2 text-center" href="#join">Join now</a>
        </nav>
      )}
    </header>
  );
};

export default Header;
