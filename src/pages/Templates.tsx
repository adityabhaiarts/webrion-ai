import { Link } from "react-router-dom";

export default function Templates() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-white mb-4">AI Website Templates</h1>
      <p className="text-gray-400 mb-12">Start your next project structurally perfect.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { name: "Hospital Pro", cat: "Medical" },
          { name: "Coaching Launch", cat: "Education" },
          { name: "Hotel Booking Style", cat: "Hospitality" },
          { name: "Restaurant Menu Pro", cat: "Food" },
          { name: "Clinic Care", cat: "Medical" },
          { name: "Gym Fitness Pro", cat: "Fitness" },
          { name: "Salon Beauty Pro", cat: "Beauty" },
          { name: "Business Landing Page", cat: "Corporate" }
        ].map(t => (
          <div key={t.name} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden group">
            <div className="h-40 bg-[#18181b] flex items-center justify-center p-4">
              <span className="text-xs text-gray-500 font-mono">[{t.cat.toUpperCase()}_PREVIEW]</span>
            </div>
            <div className="p-4">
              <div className="text-xs font-semibold text-brand-400 mb-1">{t.cat}</div>
              <h3 className="text-base font-medium text-white mb-4">{t.name}</h3>
              <Link to="/app" className="block text-center w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">
                Use Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
