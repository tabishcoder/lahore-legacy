/*
  WhatsApp Cloud API webhook handler.
  Receives messages from WhatsApp, calls the existing /api/chat,
  and sends the reply back via WhatsApp.

  Vercel env vars required:
    WHATSAPP_TOKEN          — permanent system user token from Meta
    WHATSAPP_PHONE_NUMBER_ID — phone number ID from Meta API Setup page
    WHATSAPP_VERIFY_TOKEN   — any secret string you set in Meta webhook config
*/

const GRAPH_URL = "https://graph.facebook.com/v19.0";

/* Thin in-memory history per user (resets on cold start — fine for demo) */
const history = {};

export default async function handler(req, res) {
  /* ── GET: webhook verification ─────────────────────────── */
  if (req.method === "GET") {
    const mode      = req.query["hub.mode"];
    const token     = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Forbidden");
  }

  /* ── POST: incoming message ─────────────────────────────── */
  if (req.method === "POST") {
    const body = req.body;

    const entry   = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value   = changes?.value;
    const msg     = value?.messages?.[0];

    /* Ignore status updates (delivered, read, etc.) */
    if (!msg) return res.sendStatus(200);
    if (msg.type !== "text") {
      await sendWhatsApp(msg.from, "Sorry, I can only understand text messages right now. Please type your question.");
      return res.sendStatus(200);
    }

    const userPhone = msg.from;
    const userText  = msg.text.body.trim();

    /* Build conversation history (last 8 turns) */
    if (!history[userPhone]) history[userPhone] = [];
    history[userPhone].push({ role: "user", content: userText });
    if (history[userPhone].length > 16) history[userPhone].splice(0, 2);

    /* Call existing Lahore Legacy chat API */
    let reply = "Sorry, I could not get a response. Please try again.";
    try {
      const chatRes = await fetch(`${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: history[userPhone].slice(-8) }),
      });
      const data = await chatRes.json();
      if (data.reply) reply = data.reply;
      history[userPhone].push({ role: "assistant", content: reply });
    } catch (e) {
      console.error("Chat API error:", e);
    }

    /* Send reply to WhatsApp */
    await sendWhatsApp(userPhone, reply);
    return res.sendStatus(200);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).send("Method Not Allowed");
}

async function sendWhatsApp(to, text) {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token   = process.env.WHATSAPP_TOKEN;

  /* WhatsApp has a 4096 char limit per message — split if needed */
  const chunks = splitMessage(text, 4000);
  for (const chunk of chunks) {
    await fetch(`${GRAPH_URL}/${phoneId}/messages`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: chunk },
      }),
    });
  }
}

function splitMessage(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxLen;
    if (end < text.length) {
      /* Break at a newline or space */
      const breakAt = text.lastIndexOf("\n", end);
      if (breakAt > start) end = breakAt;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks;
}
