// Vercel serverless function: POST /api/chat
// Calls your Azure OpenAI deployment. Keys come from Vercel Environment Variables.
const KNOWLEDGE = require("./_knowledge");

const SYSTEM_PROMPT = `You are "Lahore Guide", the friendly AI guide on a website about Lahore's heritage places.

Your job:
- Answer questions about Lahore's heritage places: history, what to see, how to get there, nearby food, best time to visit.
- Help visitors plan trips (half-day, 1-day, 2-day plans), grouping nearby places to save travel time.
- Use the WEBSITE INFORMATION below first. You may add well-known general facts about Lahore's heritage.

Rules:
- Stay on topic: Lahore, its heritage, culture, food and trip planning. Politely decline anything unrelated.
- Never invent exact ticket prices, phone numbers or opening hours. If not in the information below, give a rough idea and tell the user to confirm locally or on official sources, because they change.
- Keep answers short and easy to scan (short paragraphs or bullet points). Busy young visitors are your main audience.
- Reply in the user's language: English, Urdu, or Roman Urdu. A few Urdu words for flavour are fine in English replies.

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
        max_tokens: 500,
        temperature: 0.4,
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
