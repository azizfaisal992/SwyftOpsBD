import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const ClientOnboardingLayout = ({ children, wide = false }) => (
  <div className="min-h-screen bg-[#f5f6f8] text-[#111c2c]">
    <header className="border-b border-[#c8cedc] bg-white">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-7">
        <div className="flex items-center gap-4">
          <Link className="text-2xl font-bold tracking-[-0.02em] text-[#06449d]" to="/">SwiftOpsBD</Link>
          <span className="rounded-sm bg-[#f0f3fb] px-2.5 py-1 text-xs text-[#434654]">Client Portal</span>
        </div>
        <Link className="flex items-center gap-2 text-sm font-semibold text-[#434654]" to="/">
          <LogOut className="size-5" /> Save &amp; Exit
        </Link>
      </div>
    </header>

    <main className={`mx-auto px-5 py-8 sm:px-7 ${wide ? "max-w-[1080px]" : "max-w-[820px]"}`}>
      {children}
    </main>

    <footer className="mt-8 border-t border-[#c8cedc]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-6 py-7 text-xs text-[#565d6d] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-[#111c2c]">© 2026 SwiftOpsBD Dhaka. All rights reserved.</p>
        <nav className="flex flex-wrap gap-5">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#support">Contact Support</a>
        </nav>
      </div>
    </footer>
  </div>
);

export default ClientOnboardingLayout;
