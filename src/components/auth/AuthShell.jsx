import { Link } from "react-router-dom";
import logoImage from "../../assets/F.png";

const AuthShell = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-[#f9f9ff] text-[#101c2d]">
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#c3c6d6] bg-white px-5 sm:px-6">
      <Link to="/">
        <img src={logoImage} alt="SwiftOpsBD" className="h-18 w-auto" />
      </Link>
      <Link className="grid size-9 place-items-center rounded-full text-lg text-[#434654] hover:bg-[#f0f3ff]" to="/" aria-label="Help">?</Link>
    </header>

    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-12 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b2c5ff]/15 blur-3xl" />
      <div className="relative w-full">{children}</div>
    </main>

    <footer className="flex min-h-10 flex-col justify-between gap-3 bg-[#253143] px-5 py-3 text-xs text-[#c3c6d6] sm:flex-row sm:items-center sm:px-6">
      <p>© 2026 SwiftOpsBD Management System. All rights reserved.</p>
      <nav className="flex flex-wrap gap-6">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#compliance">Compliance</a>
      </nav>
    </footer>
  </div>
);

export default AuthShell;
