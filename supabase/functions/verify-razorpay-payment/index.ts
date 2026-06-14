import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { orderId, paymentId, signature } = await req.json()

    // Load Razorpay Secrets
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!RAZORPAY_KEY_SECRET) {
      // Demo Mode verification
      if (paymentId && orderId) {
        return new Response(JSON.stringify({ success: true, verified: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
      return new Response(JSON.stringify({ success: false, error: 'Invalid mock data' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Real Razorpay signature verification would hash the (orderId + "|" + paymentId) 
    // with RAZORPAY_KEY_SECRET using HMAC-SHA256 and compare it with signature.
    // In Deno Edge Functions, you can use subtle crypto API for this.
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(RAZORPAY_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const data = encoder.encode(orderId + "|" + paymentId);
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const generatedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (generatedSignature === signature) {
        return new Response(JSON.stringify({ success: true, verified: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
    } else {
        return new Response(JSON.stringify({ success: false, error: 'Signature mismatch' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
