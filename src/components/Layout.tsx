import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { webrionConfig, whatsappUrl } from "../config/webrion";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-8rem] h-96 w-96 rounded-full bg-emerald-200/70 blur-3xl" />
        <div className="absolute right-[-10rem] top-40 h-[28rem] w-[28rem] rounded-full bg-teal-100 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-10 w-10 rounded-xl shadow-lg shadow-emerald-100" />
            <div>
              <div className="text-lg font-black leading-tight text-slate-950">{webrionConfig.productName}</div>
              <div className="text-xs font-semibold text-emerald-700">ai.webrion.online</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            <a href={webrionConfig.mainWebsite} target="_blank" rel="noreferrer" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Webrion Website</a>
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Login</Link>
            <Link to="/signup" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-emerald-600">Get Started</Link>
          </nav>

          <button type="button" onClick={() => setIsMenuOpen((value) => !value)} className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden" aria-label="Toggle navigation">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <a href={webrionConfig.mainWebsite} target="_blank" rel="noreferrer" className="rounded-xl px-3 py-3 text-slate-600">Webrion Website</a>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-xl px-3 py-3 text-slate-600">Login</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-slate-950 px-3 py-3 text-center font-bold text-white">Get Started</Link>
            </div>
          </nav>
        )}
      </header>

      <main className="relative z-10"><Outlet /></main>

      <footer className="relative z-10 border-t border-slate-200 bg-white/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3"><img src={webrionConfig.logoPath} alt="Webrion logo" className="h-9 w-9 rounded-xl" /><span className="text-lg font-black">{webrionConfig.productName}</span></div>
            <p className="max-w-lg text-sm leading-6 text-slate-500">AI website generation by Webrion. Create code, preview output, download ZIP files, and contact Webrion for custom website work.</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-400">Product</h3>
            <div className="grid gap-2 text-sm text-slate-600"><Link to="/login" className="hover:text-emerald-700">Login</Link><Link to="/signup" className="hover:text-emerald-700">Get Started</Link><a href={webrionConfig.appUrl} className="hover:text-emerald-700">ai.webrion.online</a></div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-400">Webrion</h3>
            <div className="grid gap-2 text-sm text-slate-600"><a href={webrionConfig.mainWebsite} target="_blank" rel="noreferrer" className="hover:text-emerald-700">Main Website</a><a href={webrionConfig.portfolioPage} target="_blank" rel="noreferrer" className="hover:text-emerald-700">Portfolio</a><a href={webrionConfig.pricingPage} target="_blank" rel="noreferrer" className="hover:text-emerald-700">Pricing</a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-700">WhatsApp Webrion</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
