import { Calculator, MessageSquareShare, FileText, CheckSquare } from "lucide-react";

export default function Tools() {
  const tools = [
    { title: "Website Cost Calculator", icon: Calculator, desc: "Get an exact estimate for business website." },
    { title: "WhatsApp Link Generator", icon: MessageSquareShare, desc: "Create a wa.me link instantly." },
    { title: "Website Prompt Generator", icon: FileText, desc: "Craft the perfect AI prompt." },
    { title: "Business Website Checklist", icon: CheckSquare, desc: "Ensure your site is production-ready." },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-white mb-4">Free Business Tools</h1>
      <p className="text-gray-400 mb-12">Growing your digital presence just got easier.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(t => (
          <div key={t.title} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <t.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{t.title}</h3>
              <p className="text-sm text-gray-400">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
