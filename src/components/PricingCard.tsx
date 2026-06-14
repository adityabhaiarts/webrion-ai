import { CheckCircle2 } from "lucide-react";

type Props = {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  onClick: () => void;
};

export default function PricingCard({ name, price, period, features, cta, highlighted, badge, onClick }: Props) {
  return (
    <article className={`relative rounded-3xl border p-6 ${highlighted ? "border-emerald-300 bg-emerald-300 text-slate-950" : "border-white/10 bg-white/[0.04] text-white"}`}>
      {badge && (
        <div className="absolute right-5 top-5 rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-emerald-200">
          {badge}
        </div>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-4xl font-black">{price}</span>
        <span className={highlighted ? "text-slate-700" : "text-slate-400"}>{period}</span>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${highlighted ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-white text-slate-950 hover:bg-emerald-100"}`}
      >
        {cta}
      </button>
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <CheckCircle2 className={`mt-0.5 h-4 w-4 ${highlighted ? "text-slate-950" : "text-emerald-300"}`} />
            <span className={highlighted ? "text-slate-800" : "text-slate-300"}>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
