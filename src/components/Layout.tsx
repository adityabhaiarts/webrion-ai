import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { webrionConfig, whatsappUrl } from "../config/webrion";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-8rem] h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-40 h-[28rem] w-[28rem] rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-10 w-10 rounded-xl shadow-lg shadow-emerald-500/20" />
            <div>
              <div className="text-lg font-bold leading-tight">{webrionConfig.productName}</div>
              <div className="text-xs text-emerald-300">Deployed at ai.webrion.online</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            <a
              href={webrionConfig.mainWebsite}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Webrion Website
            </a>
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-300"
            >
              Get Started
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="rounded-xl border border-white/10 p-2 text-slate-200 md:hidden"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <a href={webrionConfig.mainWebsite} target="_blank" rel="noreferrer" className="rounded-xl px-3 py-3 text-slate-300">
                Webrion Website
              </a>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-xl px-3 py-3 text-slate-300">
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl bg-emerald-400 px-3 py-3 text-center font-bold text-slate-950"
              >
                Get Started
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-9 w-9 rounded-xl" />
              <span className="text-lg font-bold">{webrionConfig.productName}</span>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-400">
              AI website generation by Webrion. Create code, preview output, download ZIP files, and contact Webrion for custom website work.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Product</h3>
            <div className="grid gap-2 text-sm text-slate-300">
              <Link to="/login" className="hover:text-emerald-300">Login</Link>
              <Link to="/signup" className="hover:text-emerald-300">Get Started</Link>
              <a href={webrionConfig.appUrl} className="hover:text-emerald-300">ai.webrion.online</a>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Webrion</h3>
            <div className="grid gap-2 text-sm text-slate-300">
              <a href={webrionConfig.mainWebsite} target="_blank" rel="noreferrer" className="hover:text-emerald-300">Main Website</a>
              <a href={webrionConfig.portfolioPage} target="_blank" rel="noreferrer" className="hover:text-emerald-300">Portfolio</a>
              <a href={webrionConfig.pricingPage} target="_blank" rel="noreferrer" className="hover:text-emerald-300">Pricing</a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-300">WhatsApp Webrion</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

