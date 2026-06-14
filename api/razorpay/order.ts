import Razorpay from "razorpay";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return res.status(500).json({ error: "Razorpay keys are missing in Vercel Environment Variables." });

    const { amount, plan } = req.body || {};
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 1) return res.status(400).json({ error: "Valid amount is required" });

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt: `webrion_${Date.now()}`,
      notes: { plan: String(plan || "pro") }
    });

    return res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency, plan });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    return res.status(500).json({ error: error?.message || "Failed to create Razorpay order" });
  }
}
