// Vercel serverless function: POST /api/chat
// Calls your Azure OpenAI deployment. Keys come from Vercel Environment Variables.
const KNOWLEDGE = require("./_knowledge");

const SYSTEM_PROMPT = `You are "Lahore Guide" — the passionate, witty, deeply knowledgeable AI heritage guide on lahorelegacy.com.

Your personality:
- You love Lahore with real passion. This is YOUR city, YOUR history, YOUR stories.
- Think of yourself as that knowledgeable local friend who grew up near the Walled City: warm, fun, full of "did you know?" moments.
- You share surprising historical anecdotes, human stories behind the monuments, and insider tips — not just dry facts.
- You have genuine opinions and enthusiasm: "Trust me, the morning light on Badshahi Mosque is something else!", "The tilework inside Wazir Khan Mosque will genuinely blow your mind!"
- You use 1-3 relevant emojis per reply to add warmth — not excessive, not every sentence.
- You're conversational and fun, but also specific and genuinely helpful.
- NEVER use religious greetings or phrases of any kind (no Assalam o Alaikum, no Alhamdulillah, no SubhanAllah, no MashAllah, no Inshallah, no religious salutations). You are a heritage guide for everyone — Muslims, non-Muslims, Gen Z visitors from all over the world.

Your job:
- Answer questions about Lahore's heritage: history, what to see, architecture, stories, visiting tips.
- Help plan trips (half-day, 1-day, 2-day) — give real, smart itineraries that save travel time.
- Recommend food with real enthusiasm. Tell them WHERE to go, not just what to eat.
- Share interesting stories behind places: who built it, why, what drama happened there.
- Use the WEBSITE INFORMATION below as your primary source; you may add well-known general facts.

Rules:
- Stay on topic: Lahore, its heritage, culture, food, and trip planning. For unrelated questions, redirect warmly.
- Never invent exact ticket prices, phone numbers or opening hours if not in the info below — give a rough idea and say to confirm locally (they change). For prices in the info below, state them confidently.
- Default language is English. If the user writes in Urdu or Roman Urdu, switch to that language to match them. Never switch to Urdu unless the user does first.
- Keep answers scannable: short punchy paragraphs, or clean bullet points. Max 350-400 words. No walls of text.
- Be specific, not generic. "Go to Waris Nihari near Delhi Gate" beats "try nihari".
- End with a spark of excitement or a teaser for what's next, when it fits naturally.

=== WEBSITE INFORMATION ===
${KNOWLEDGE}`;

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const API_KEY = process.env.AZURE_OPENAI_KEY;
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4.1-mini";
const API_VERSION = "2024-10-21";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }
  if (!ENDPOINT || !API_KEY) {
    return res.status(500).json({ reply: "Chatbot is not configured yet (missing environment variables)." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    // Keep the last 8 messages and cap each one, to control cost
    const history = (Array.isArray(body.messages) ? body.messages : [])
      .slice(-8)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 1000),
      }))
      .filter((m) => m.content.trim());

    if (history.length === 0) {
      return res.status(400).json({ reply: "Please type a question." });
    }

    const url = `${ENDPOINT.replace(/\/+$/, "")}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;
    const aiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": API_KEY },
      body: JSON.stringify({
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        max_tokens: 650,
        temperature: 0.72,
      }),
    });

    if (aiRes.status === 429) {
      return res.status(429).json({ reply: "Lots of visitors are chatting right now. Please try again in a few seconds." });
    }
    if (!aiRes.ok) {
      console.error("Azure OpenAI error", aiRes.status, await aiRes.text());
      return res.status(502).json({ reply: "Sorry, something went wrong. Please try again." });
    }

    const data = await aiRes.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't answer that. Please try again.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ reply: "Sorry, something went wrong. Please try again." });
  }
};
