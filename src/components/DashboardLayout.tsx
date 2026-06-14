import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, LayoutPanelLeft, MessagesSquare, Blocks, Wrench, CreditCard, User, LogOut, ArrowLeft, Settings, Phone, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../lib/auth";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { webrionConfig } from "../config/webrion";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { name: "AI Generator", path: "/dashboard/generator", icon: Sparkles },
    { name: "My Chats", path: "/dashboard/chats", icon: MessagesSquare },
    { name: "Generated Websites", path: "/dashboard/websites", icon: LayoutPanelLeft },
    { name: "Templates", path: "/dashboard/templates", icon: Blocks },
    { name: "Pricing", path: "/dashboard/pricing", icon: CreditCard },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  if (loading || !user) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden font-sans flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white/90 backdrop-blur-xl z-50 mt-safe shadow-sm">
        <Link to="/dashboard/generator" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">W</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">{webrionConfig.brandName} AI</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "absolute md:relative z-40 w-64 h-[calc(100vh-73px)] md:h-screen border-r border-gray-200 bg-white shadow-xl md:shadow-none flex-col transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 border-r-0 md:border-r"
      )}>
        <div className="hidden md:block p-4 border-b border-gray-200 mt-safe">
          <Link to="/dashboard/generator" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">W</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">{webrionConfig.brandName} AI</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-brand-50 text-brand-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-200 flex flex-col gap-1">
           <a href={webrionConfig.mainWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Visit Website
          </a>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left w-full border border-red-200 bg-red-50">
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          <div className="mt-4 break-words px-3">
            <div className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            <div className="text-xs font-semibold text-brand-600 mt-1 uppercase">Free Plan</div>
          </div>
        </div>
      </aside>

      {/* Main Sandbox */}
      <main className="flex-1 relative bg-gray-50 overflow-y-auto h-full">
        <Outlet />
      </main>
    </div>
  );
}
