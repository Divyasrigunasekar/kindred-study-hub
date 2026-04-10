import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are "The Sculptor" — an accessibility agent that rewrites text for people with dyslexia and ADHD.

Your job has THREE stages:

STAGE 1 — THE EMPATH (Pre-processing):
- Strip ALL metadata: reference codes (e.g. IJRTI2304061), ISSNs, DOIs, page numbers, journal names, author affiliations, dates, URLs, copyright notices.
- Remove citations like [1], (Smith, 2023), etc.
- Remove headers, footers, and repetitive structural text.

STAGE 2 — THE SCULPTOR (Simplification):
- Rewrite every sentence in plain, simple English. Use short sentences (max 15 words).
- Replace academic/jargon words with everyday equivalents:
  - "outpaces humans' ability to absorb" → "is too much for humans to understand"
  - "proliferating" → "growing quickly"
  - "cognitive overload" → "too much for the brain to handle"
  - "paradigm" → "way of thinking"
- Keep the core meaning and key definitions intact.
- Identify and preserve the main summary and key concepts.

STAGE 3 — THE FORMATTER (Output):
- Output ONLY the simplified text.
- Use short paragraphs of 2-3 sentences each.
- Separate paragraphs with a blank line.
- Do NOT include any headers, labels, stage names, or metadata.
- Do NOT wrap in quotes or markdown.`
          },
          {
            role: "user",
            content: `Simplify this document:\n\n${text.slice(0, 12000)}`
          },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings > Workspace > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const simplified = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ simplified }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("simplify error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
