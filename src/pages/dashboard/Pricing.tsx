import { useAuth } from "../../lib/auth";
import { auth, db } from "../../lib/firebase";
import { IndianRupee, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";

export default function DashboardPricing() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (planName: string, amount: number) => {
    if (!user) return alert("Please login first");
    setIsLoading(true);
    try {
      // 1. Create order
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, plan: planName })
      });
      const data = await res.json();
      
      // 2. Open Razorpay Checkout properly
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T1XRPeeIt3WA4c",
        amount: data.amount,
        currency: "INR",
        name: "Webrion AI",
        description: "Pro Plan Subscription",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            // Log to Firebase
            await addDoc(collection(db, "payments"), {
              user_id: user.uid,
              plan: planName,
              amount: amount,
              currency: "INR",
              status: "success",
              payment_provider: "razorpay",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              created_at: Date.now()
            });
            alert("Payment successful!");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          email: user.email || ""
        },
        theme: {
          color: "#10b981"
        }
      };
      
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay SDK not loaded");
      }
    } catch(err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Plans</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
         Manage your subscription to unlock premium features and unlimited generations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 flex-1">
        <div className="p-8 rounded-3xl border border-gray-200 bg-white relative flex flex-col shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly Pro</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <IndianRupee className="w-5 h-5 text-gray-400" />
            <span className="text-4xl font-bold text-gray-900">1,599</span>
            <span className="text-gray-500 text-sm">/mo</span>
          </div>
          <button 
            onClick={() => handleSubscribe("monthly", 1599)}
            disabled={isLoading}
            className="block text-center w-full py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors mb-8 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Subscribe Monthly"}
          </button>
          <ul className="flex flex-col gap-4 text-sm text-gray-600">
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> Unlimited generations</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> HTML CSS JS + PHP</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-brand-500" /> Premium Templates</li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl border-2 border-brand-500 bg-brand-50/50 relative flex flex-col shadow-lg shadow-brand-500/10">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
            BEST VALUE
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Yearly Pro</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <IndianRupee className="w-5 h-5 text-gray-400" />
            <span className="text-4xl font-bold text-gray-900">15,999</span>
            <span className="text-gray-500 text-sm">/year</span>
          </div>
          <button 
            onClick={() => handleSubscribe("yearly", 15999)}
            disabled={isLoading}
            className="block text-center w-full py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/20 mb-8 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Subscribe Yearly"}
          </button>
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
