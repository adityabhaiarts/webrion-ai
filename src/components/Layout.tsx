import { Link, Outlet } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/auth";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden pt-safe pb-safe bg-white text-gray-900">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Badge */}
      <div className="w-full bg-brand-50 border-b border-brand-100 text-center py-2 px-2 text-sm text-brand-700 backdrop-blur-md">
        <span className="font-semibold text-brand-600">Powered by Webrion</span> — The premium AI website generator for local businesses.
      </div>

      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">W</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Webrion AI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
            {!user ? (
              <>
                <Link to="/login" className="hover:text-brand-600 transition-colors text-gray-800 font-semibold">Login</Link>
                <Link to="/signup" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)]">
                  Get Started
                </Link>
              </>
            ) : (
              <Link to="/dashboard/generator" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)]">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 bg-white p-4 flex flex-col gap-4 text-sm font-medium text-gray-700 shadow-lg absolute w-full left-0">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="bg-brand-500 text-center py-3 rounded-xl text-white font-semibold" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            ) : (
                <Link to="/dashboard/generator" className="bg-brand-500 text-center py-3 rounded-xl text-white font-semibold" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
            )}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2">
             <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded bg-brand-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs leading-none">W</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">Webrion AI</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-sm">
              Build websites faster with AI. A premium AI tool for modern businesses. Generate files, code snippets, and fully functioning pages.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/login" className="hover:text-brand-600">Login</Link></li>
              <li><Link to="/signup" className="hover:text-brand-600">Signup</Link></li>
              <li><a href="https://webrion.online" target="_blank" rel="noreferrer" className="hover:text-brand-600">API Access</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Webrion Official</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="https://webrion.online" target="_blank" rel="noreferrer" className="hover:text-brand-600">Main Website</a></li>
              <li><a href="https://webrion.online/published-works" target="_blank" rel="noreferrer" className="hover:text-brand-600">Portfolio</a></li>
              <li><a href="https://webrion.online/pricing" target="_blank" rel="noreferrer" className="hover:text-brand-600">Pricing</a></li>
              <li><a href="https://webrion.online/contact" target="_blank" rel="noreferrer" className="hover:text-brand-600">Contact Webrion</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          Made with ❤️ by Webrion © {new Date().getFullYear()} All rights reserved.
        </div>
      </footer>
    </div>
  );
}
