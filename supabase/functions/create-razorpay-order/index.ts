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

    const { amount, plan } = await req.json()
    if (!amount || !plan) {
      return new Response('Missing amount or plan', { status: 400, headers: corsHeaders })
    }

    // Securely load keys from Supabase Secrets
    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      // In Demo Mode, issue a dummy order
      return new Response(JSON.stringify({ 
        orderId: 'order_demo_' + Math.floor(Math.random() * 1000000), 
        amount, 
        plan 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Real Razorpay API Call
    const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        amount: amount * 100, // amount in smallest currency unit
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      })
    })

    const orderData = await rzpResponse.json();

    return new Response(JSON.stringify({ orderId: orderData.id, amount, plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
