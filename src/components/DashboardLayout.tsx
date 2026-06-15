import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Blocks,
  CreditCard,
  LayoutPanelLeft,
  LogOut,
  Menu,
  MessageSquarePlus,
  MessagesSquare,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { useAuth } from "../lib/auth";
import { cn } from "../lib/utils";
import { applyDashboardPreferences } from "../utils/theme";
import { webrionConfig } from "../config/webrion";

const navItems = [
  { name: "Generator", path: "/dashboard/generator", icon: Sparkles },
  { name: "Chats", path: "/dashboard/chats", icon: MessagesSquare },
  { name: "Websites", path: "/dashboard/websites", icon: LayoutPanelLeft },
  { name: "Templates", path: "/dashboard/templates", icon: Blocks },
  { name: "Pricing", path: "/dashboard/pricing", icon: CreditCard },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileNav = navItems.map((item) => ({
    name: item.name,
    path: item.path,
    Icon: item.icon,
  }));


  useEffect(() => {
    applyDashboardPreferences(profile?.theme || "Light Clean", profile?.font || "Inter");
  }, [profile?.theme, profile?.font]);

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    navigate("/login");
  };

  const startNewChat = () => {
    setIsMobileMenuOpen(false);
    navigate("/dashboard/generator", { state: { newChat: Date.now() } });
  };

  const displayName = profile?.fullName || user?.displayName || "Webrion User";
  const plan = profile?.plan || "free";

  const sidebar = (
    <aside className="flex h-full w-[18.5rem] shrink-0 flex-col border-r border-slate-200 bg-white text-slate-800">
      <div className="border-b border-white/10 bg-white/60 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <Link
          to="/dashboard/generator"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-slate-950/5 ring-1 ring-emerald-500/20">
            <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-8 w-8 rounded-xl" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-black text-slate-950">{webrionConfig.productName}</div>
            <div className="text-xs font-semibold text-emerald-700">Webrion AI workspace</div>
          </div>
        </Link>
      </div>


      <div className="p-3">
        <button
          type="button"
          onClick={startNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-700/90 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20 transition hover:from-emerald-700 hover:to-slate-950"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </button>
      </div>


      <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-3">
        <div className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            {profile?.photoURL || user?.photoURL ? (
              <img src={profile?.photoURL || user?.photoURL || ""} alt={displayName} className="h-10 w-10 rounded-xl object-cover" />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 font-black text-white">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-950">{displayName}</div>
              <div className="truncate text-xs text-slate-500">{user?.email}</div>
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            {plan} plan
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#f7f7f8] text-slate-950">
      {/* Decorative glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />

      <div className="hidden lg:block">{sidebar}</div>

      <div className="relative flex min-w-0 flex-1 flex-col">


        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <Link to="/dashboard/generator" className="flex items-center gap-2">
            <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-9 w-9 rounded-xl" />
            <span className="font-black">{webrionConfig.productName}</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-xl border border-white/10 bg-white/70 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/60"
          >
            <Menu className="h-5 w-5 text-slate-900" />
          </button>

        </header>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/30"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div className="relative h-full">
              {sidebar}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute left-[19.25rem] top-4 rounded-xl border border-slate-200 bg-white p-2 text-slate-950 shadow-lg"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#f7f7f8] pb-16 lg:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:hidden">
          <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
            {mobileNav.map((item) => {
              const Icon = item.Icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-1 text-[11px] font-bold transition",
                    isActive
                      ? "text-emerald-700"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive
                        ? "text-emerald-700"
                        : "text-slate-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

      </div>
    </div>
  );
}
