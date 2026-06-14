import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { AlertCircle, CheckCircle2, IndianRupee, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const plans = [
  {
    name: "monthly",
    label: "Monthly Pro",
    amount: 1599,
    suffix: "/mo",
    highlight: false,
    features: ["Unlimited generations", "HTML CSS JS + PHP", "Premium templates", "ZIP download", "Saved chat history"],
  },
  {
    name: "yearly",
    label: "Yearly Pro",
    amount: 15999,
    suffix: "/year",
    highlight: true,
    features: ["Everything in Monthly", "2 months free", "Priority support", "Fast client-ready output", "Best value"],
  },
];

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DashboardPricing() {
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const markPlanActive = async (planName: string, paymentInfo: Record<string, any>) => {
    if (!user || !db) return;
    try {
      await addDoc(collection(db, "payments"), {
        userId: user.uid,
        plan: planName,
        amount: paymentInfo.amount,
        currency: "INR",
        status: "success",
        paymentProvider: "razorpay",
        ...paymentInfo,
        createdAt: Date.now(),
      });
      await setDoc(doc(db, "users", user.uid), { plan: planName, updatedAt: Date.now() }, { merge: true });
      await refreshProfile();
    } catch (error) {
      console.warn("[Webrion] Payment saved locally but Firestore update failed:", error);
    }
  };

  const handleSubscribe = async (planName: string, amount: number) => {
    if (!user) {
      setMessage("Please login before starting payment.");
      return;
    }

    setIsLoading(planName);
    setMessage(null);

    try {
      const sdkReady = await loadRazorpayScript();
      if (!sdkReady || !window.Razorpay) throw new Error("Razorpay checkout script could not load. Check network or ad-blocker.");

      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, plan: planName }),
      });
      const order = await orderRes.json().catch(() => null);
      if (!orderRes.ok) throw new Error(order?.error || "Could not create Razorpay order. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel.");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Webrion AI",
        description: `${planName} subscription`,
        order_id: order.orderId,
        prefill: { email: user.email || "" },
        theme: { color: "#10a37f" },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json().catch(() => null);
            if (!verifyRes.ok || !verifyData?.success) throw new Error(verifyData?.message || "Payment verification failed.");

            await markPlanActive(planName, {
              amount,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            setMessage("Payment successful. Your Pro plan is active.");
          } catch (error: any) {
            setMessage(error?.message || "Payment completed but verification failed. Contact support with payment ID.");
          }
        },
        modal: {
          ondismiss: () => setMessage("Payment popup closed. No money was charged if you did not complete payment."),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage(err.message || "Payment could not start.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 text-slate-950 md:p-8">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700"><ShieldCheck className="h-4 w-4" /> Billing & Plans</div>
        <h1 className="text-3xl font-black tracking-tight">Upgrade Webrion AI</h1>
        <p className="mt-2 max-w-2xl text-slate-500">Use Razorpay checkout for subscriptions. Keep Razorpay secret keys only in Vercel server env, never in frontend code.</p>
      </div>

      {message && <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertCircle className="h-5 w-5 shrink-0" /> {message}</div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-sm ${plan.highlight ? "border-emerald-300 ring-4 ring-emerald-50" : "border-slate-200"}`}>
            {plan.highlight && <div className="absolute right-8 top-0 -translate-y-1/2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-black text-white shadow-sm">BEST VALUE</div>}
            <h3 className="text-xl font-black text-slate-950">{plan.label}</h3>
            <div className="mt-5 flex items-baseline gap-1">
              <IndianRupee className="h-5 w-5 text-slate-400" />
              <span className="text-5xl font-black text-slate-950">{plan.amount.toLocaleString("en-IN")}</span>
              <span className="text-sm font-semibold text-slate-500">{plan.suffix}</span>
            </div>
            <button onClick={() => handleSubscribe(plan.name, plan.amount)} disabled={!!isLoading} className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold transition disabled:opacity-50 ${plan.highlight ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-950 text-white hover:bg-slate-800"}`}>
              {isLoading === plan.name ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLoading === plan.name ? "Opening checkout..." : `Subscribe ${plan.label}`}
            </button>
            <ul className="mt-7 grid gap-4 text-sm text-slate-600">
              {plan.features.map((feature) => <li key={feature} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> {feature}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
