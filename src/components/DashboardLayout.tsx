import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Blocks,
  CreditCard,
  LayoutPanelLeft,
  LogOut,
  Menu,
  MessageSquarePlus,
  MessagesSquare,
  Phone,
  Settings,
  Sparkles,
  X
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { useAuth } from "../lib/auth";
import { cn } from "../lib/utils";
import { applyDashboardPreferences } from "../utils/theme";
import { webrionConfig, whatsappUrl } from "../config/webrion";

const navItems = [
  { name: "New Chat", path: "/dashboard/generator", icon: MessageSquarePlus, state: { newChat: Date.now() } },
  { name: "AI Generator", path: "/dashboard/generator", icon: Sparkles },
  { name: "My Chats", path: "/dashboard/chats", icon: MessagesSquare },
  { name: "Generated Websites", path: "/dashboard/websites", icon: LayoutPanelLeft },
  { name: "Templates", path: "/dashboard/templates", icon: Blocks },
  { name: "Pricing", path: "/dashboard/pricing", icon: CreditCard },
  { name: "Settings", path: "/dashboard/settings", icon: Settings }
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    applyDashboardPreferences(profile?.theme, profile?.font);
  }, [profile?.theme, profile?.font]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const displayName = profile?.fullName || user?.displayName || "Webrion User";
  const plan = profile?.plan || "free";

  const sidebar = (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950/90 text-slate-200 shadow-2xl shadow-black/40 backdrop-blur-2xl">
      <div className="border-b border-white/10 p-4">
        <Link to="/dashboard/generator" className="flex items-center gap-3">
          <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-11 w-11 rounded-2xl shadow-lg shadow-emerald-500/20" />
          <div>
            <div className="text-lg font-black text-white">{webrionConfig.productName}</div>
            <div className="text-xs text-emerald-300">AI website builder</div>
          </div>
        </Link>
      </div>

      <nav className="custom-scrollbar flex-1 overflow-y-auto p-3">
        <div className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.name !== "New Chat" && location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                state={item.state}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : item.name === "New Chat"
                      ? "border border-emerald-400/25 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Webrion links</p>
          <div className="grid gap-2 text-sm">
            <a href={webrionConfig.mainWebsite} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white">
              Visit Webrion Website <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white">
              Contact Webrion <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
          {profile?.photoURL || user?.photoURL ? (
            <img src={profile?.photoURL || user?.photoURL || ""} alt={displayName} className="h-11 w-11 rounded-2xl object-cover" />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400 font-black text-slate-950">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white">{displayName}</div>
            <div className="truncate text-xs text-slate-400">{user?.email}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">{plan} plan</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--dashboard-bg)] text-white">
      <div className="hidden md:block">{sidebar}</div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-2xl md:hidden">
          <Link to="/dashboard/generator" className="flex items-center gap-2">
            <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-9 w-9 rounded-xl" />
            <span className="font-black">{webrionConfig.productName}</span>
          </Link>
          <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="rounded-xl border border-white/10 p-2">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div className="relative h-full">
              {sidebar}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute left-74 top-4 rounded-xl border border-white/10 bg-slate-950 p-2 text-white"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_34%),var(--dashboard-bg)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

