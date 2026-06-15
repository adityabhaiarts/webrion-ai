import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { generateWebsiteCode, generateChatReply } from "./src/lib/ai.ts";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ======== API ROUTES ========

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      message: "Webrion AI Backend Running",
      env: {
        hasOpenRouter: Boolean(process.env.OPENROUTER_API_KEY),
        model: process.env.OPENROUTER_MODEL || "not set",
      },
    });
  });

  app.get("/api/generate", (req, res) => {
    res.json({
      ok: true,
      message: "Webrion generate API is live",
      env: {
        hasOpenRouter: Boolean(process.env.OPENROUTER_API_KEY),
        model: process.env.OPENROUTER_MODEL || "not set",
      },
    });
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const prompt =
        typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
      if (!prompt) {
        return res.status(400).json({ ok: false, error: "Prompt is required" });
      }

      if (prompt.length > 20000) {
        return res
          .status(413)
          .json({ ok: false, error: "Prompt is too large. Keep it under 20,000 characters." });
      }

      if (!process.env.OPENROUTER_API_KEY) {
        return res.status(500).json({
          ok: false,
          error: "No AI key found. Add OPENROUTER_API_KEY.",
        });
      }

      const result = await generateWebsiteCode({ prompt });
      res.json({ ok: true, result });
    } catch (error: any) {
      console.error("Generate API Error:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  app.get("/api/chat", (req, res) => {
    res.json({
      ok: true,
      message: "Webrion chat API is live",
      env: {
        hasOpenRouter: Boolean(process.env.OPENROUTER_API_KEY),
        model: process.env.OPENROUTER_MODEL || "not set",
      },
    });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt) {
        return res.status(400).json({ ok: false, error: "Prompt is required" });
      }

      if (!process.env.OPENROUTER_API_KEY) {
        return res.status(500).json({
          ok: false,
          error: "No AI key found. Add OPENROUTER_API_KEY.",
        });
      }

      const result = await generateChatReply({ prompt, history });
      res.json({ ok: true, result });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Real Razorpay endpoints
  app.post("/api/razorpay/order", async (req, res) => {
    try {
      const { amount, plan } = req.body;
      const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit
        currency: "INR",
        receipt: `receipt_${Math.random().toString(36).substr(2, 9)}`,
      };

      const order = await razorpay.orders.create(options);
      res.json({
        orderId: order.id,
        amount: order.amount,
        plan,
        currency: order.currency,
      });
    } catch (error: any) {
      console.error("Razorpay Order Error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.post("/api/razorpay/verify", (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const secret = process.env.RAZORPAY_KEY_SECRET || "";

      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature === razorpay_signature) {
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
  });

  // ======== VITE MIDDLEWARE ========
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

