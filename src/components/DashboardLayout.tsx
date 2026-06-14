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
    applyDashboardPreferences(profile?.theme || "Light Clean", profile?.font || "Inter");
  }, [profile?.theme, profile?.font]);

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    navigate("/");
  };

  const displayName = profile?.fullName || user?.displayName || "Webrion User";
  const plan = profile?.plan || "free";

  const sidebar = (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-800 shadow-2xl shadow-slate-200/70">
      <div className="border-b border-slate-200 p-4">
        <Link to="/dashboard/generator" className="flex items-center gap-3">
          <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-11 w-11 rounded-2xl shadow-lg shadow-emerald-100" />
          <div>
            <div className="text-lg font-black text-slate-950">{webrionConfig.productName}</div>
            <div className="text-xs font-semibold text-emerald-700">AI website builder</div>
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
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                    : item.name === "New Chat"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Webrion links</p>
          <div className="grid gap-2 text-sm">
            <a href={webrionConfig.mainWebsite} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-white hover:text-slate-950">
              Visit Website <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-white hover:text-slate-950">
              Contact Webrion <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3">
          {profile?.photoURL || user?.photoURL ? (
            <img src={profile?.photoURL || user?.photoURL || ""} alt={displayName} className="h-11 w-11 rounded-2xl object-cover" />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 font-black text-white">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-950">{displayName}</div>
            <div className="truncate text-xs text-slate-500">{user?.email}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{plan} plan</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--dashboard-bg)] text-slate-950">
      <div className="hidden md:block">{sidebar}</div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <Link to="/dashboard/generator" className="flex items-center gap-2">
            <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-9 w-9 rounded-xl" />
            <span className="font-black">{webrionConfig.productName}</span>
          </Link>
          <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="rounded-xl border border-slate-200 p-2">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div className="relative h-full">
              {sidebar}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute left-[18.5rem] top-4 rounded-xl border border-slate-200 bg-white p-2 text-slate-950 shadow-lg"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_30%),var(--dashboard-bg)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
