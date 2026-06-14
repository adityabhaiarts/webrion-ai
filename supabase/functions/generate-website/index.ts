import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// You would typically use the official Google Gen AI SDK for Deno/Node, 
// or access the REST API directly. Here we show the generic REST approach or 
// if @google/genai is supported in your Deno environment.

serve(async (req) => {
  // 1. Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Extract authorization header to verify the user
    // In Edge Functions, you can use the Supabase client to verify JWTs
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // 3. Parse request payload
    const { prompt } = await req.json()
    if (!prompt) {
      return new Response('Missing prompt', { status: 400, headers: corsHeaders })
    }

    // 4. Securely fetch API key from environment variables
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API Key")
    }

    // 5. Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        systemInstruction: {
          parts: [
            { text: "You are Webrion AI, a professional AI website generator..." }
          ]
        },
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    })

    const data = await response.json()
    
    // 6. Return response to client
    return new Response(JSON.stringify(data), {
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
