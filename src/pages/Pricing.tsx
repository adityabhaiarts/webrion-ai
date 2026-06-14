import { Link } from "react-router-dom";
import { CheckCircle2, IndianRupee } from "lucide-react";

export default function Pricing() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
      <p className="text-gray-600 mb-16 text-center max-w-2xl">
        Start free with one website generation every 7 days. Upgrade to Pro for unlimited access and advanced features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl border border-gray-200 bg-white shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <IndianRupee className="w-5 h-5 text-gray-400" />
            <span className="text-4xl font-bold text-gray-900">0</span>
            <span className="text-gray-500 text-sm">/forever</span>
          </div>
          <Link to="/app" className="block text-center w-full py-3 rounded-xl bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors mb-8">
            Start Free
          </Link>
          <ul className="flex flex-col gap-4 text-sm text-gray-600">
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> 1 website generation / 7 days</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> HTML CSS JS code</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> Basic deployment guides</li>
          </ul>
        </div>

        {/* Monthly Pro Plan */}
        <div className="p-8 rounded-3xl border-2 border-brand-500 relative bg-brand-50 shadow-lg shadow-brand-500/10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
            MOST POPULAR
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly Pro</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <IndianRupee className="w-5 h-5 text-gray-400" />
            <span className="text-4xl font-bold text-gray-900">1,599</span>
            <span className="text-gray-500 text-sm">/mo</span>
          </div>
          <Link to="/login" className="block text-center w-full py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/20 mb-8">
            Upgrade Monthly
          </Link>
          <ul className="flex flex-col gap-4 text-sm text-gray-700">
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> Unlimited generations</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> HTML CSS JS + PHP</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> Download full ZIP</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> Premium Templates</li>
          </ul>
        </div>

        {/* Yearly Pro Plan */}
        <div className="p-8 rounded-3xl border border-gray-200 bg-white shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Yearly Pro</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <IndianRupee className="w-5 h-5 text-gray-400" />
            <span className="text-4xl font-bold text-gray-900">15,999</span>
            <span className="text-gray-500 text-sm">/year</span>
          </div>
          <Link to="/login" className="block text-center w-full py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors mb-8">
            Upgrade Yearly
          </Link>
          <ul className="flex flex-col gap-4 text-sm text-gray-600">
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> All Monthly Pro Features</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> 2 Months Free</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> Priority Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
