/* Lahore Guide chatbot widget.
   Add ONE line before </body> on every page where you want the bot:
   <script src="/chatbot.js" defer></script>
*/
(function () {
  var BOT_NAME = "Lahore Guide";               // change the title here
  var GREETING = "Assalam o Alaikum! 👋 I'm your Lahore heritage guide. Ask me about any place, or let me plan your trip.";
  var SUGGESTIONS = ["Plan a 1-day trip", "Tell me about Lahore Fort", "What to eat near Badshahi Mosque?"];
  var API_URL = "/api/chat";
  var COLOR = "#9a3412";                        // brand colour (terracotta)

  var css = `
  #lg-btn{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;border:none;background:${COLOR};color:#fff;font-size:28px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.25);z-index:99999;transition:transform .2s}
  #lg-btn:hover{transform:scale(1.07)}
  #lg-box{position:fixed;bottom:92px;right:20px;width:360px;max-width:calc(100vw - 24px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.25);display:none;flex-direction:column;overflow:hidden;z-index:99999;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  #lg-box.open{display:flex}
  #lg-head{background:${COLOR};color:#fff;padding:14px 16px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
  #lg-close{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1}
  #lg-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#faf7f2}
  .lg-m{max-width:85%;padding:9px 13px;border-radius:14px;font-size:14px;line-height:1.45;word-wrap:break-word}
  .lg-user{align-self:flex-end;background:${COLOR};color:#fff;border-bottom-right-radius:4px}
  .lg-bot{align-self:flex-start;background:#fff;color:#1c1917;border:1px solid #e7e5e4;border-bottom-left-radius:4px}
  .lg-bot ul{margin:4px 0;padding-left:18px}
  #lg-sugs{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px;background:#faf7f2}
  .lg-sug{border:1px solid ${COLOR};color:${COLOR};background:#fff;border-radius:999px;padding:6px 11px;font-size:12.5px;cursor:pointer}
  #lg-form{display:flex;border-top:1px solid #e7e5e4;background:#fff}
  #lg-in{flex:1;border:none;padding:13px;font-size:14px;outline:none;background:transparent;color:#1c1917}
  #lg-send{border:none;background:${COLOR};color:#fff;padding:0 18px;cursor:pointer;font-weight:600}
  #lg-send:disabled{opacity:.5;cursor:default}
  @media (max-width:480px){#lg-box{right:12px;bottom:86px;height:calc(100vh - 110px)}}
  `;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement("div");
  wrap.innerHTML =
    '<button id="lg-btn" aria-label="Open Lahore guide chat">💬</button>' +
    '<div id="lg-box" role="dialog" aria-label="' + BOT_NAME + '">' +
    '<div id="lg-head"><span>' + BOT_NAME + '</span><button id="lg-close" aria-label="Close">×</button></div>' +
    '<div id="lg-msgs"></div><div id="lg-sugs"></div>' +
    '<form id="lg-form"><input id="lg-in" placeholder="Ask about Lahore…" autocomplete="off" maxlength="1000"/>' +
    '<button id="lg-send" type="submit">Send</button></form></div>';
  document.body.appendChild(wrap);

  var box = document.getElementById("lg-box"), msgs = document.getElementById("lg-msgs");
  var sugs = document.getElementById("lg-sugs"), form = document.getElementById("lg-form");
  var input = document.getElementById("lg-in"), send = document.getElementById("lg-send");
  var history = [], busy = false;

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  // Light formatting: **bold**, bullet lists, line breaks
  function format(text) {
    var lines = esc(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").split("\n"), out = "", inList = false;
    lines.forEach(function (l) {
      var m = l.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)/);
      if (m) { if (!inList) { out += "<ul>"; inList = true; } out += "<li>" + m[1] + "</li>"; }
      else { if (inList) { out += "</ul>"; inList = false; } out += l.trim() ? l + "<br>" : "<br>"; }
    });
    if (inList) out += "</ul>";
    return out.replace(/(<br>)+$/, "");
  }
  function add(text, who) {
    var d = document.createElement("div");
    d.className = "lg-m " + (who === "user" ? "lg-user" : "lg-bot");
    if (who === "user") d.textContent = text; else d.innerHTML = format(text);
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  add(GREETING, "bot");
  SUGGESTIONS.forEach(function (s) {
    var b = document.createElement("button");
    b.className = "lg-sug"; b.type = "button"; b.textContent = s;
    b.onclick = function () { ask(s); };
    sugs.appendChild(b);
  });

  document.getElementById("lg-btn").onclick = function () { box.classList.toggle("open"); if (box.classList.contains("open")) input.focus(); };
  document.getElementById("lg-close").onclick = function () { box.classList.remove("open"); };

  async function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    busy = true; send.disabled = true; sugs.style.display = "none";
    add(text, "user");
    history.push({ role: "user", content: text });
    var typing = add("Typing…", "bot");
    try {
      var res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });
      var data = await res.json();
      var reply = data.reply || "Sorry, something went wrong.";
      typing.innerHTML = format(reply);
      if (res.ok) history.push({ role: "assistant", content: reply });
      else history.pop();
    } catch (e) {
      typing.textContent = "Network error. Please check your connection and try again.";
      history.pop();
    }
    msgs.scrollTop = msgs.scrollHeight;
    busy = false; send.disabled = false; input.focus();
  }

  form.onsubmit = function (e) { e.preventDefault(); var t = input.value; input.value = ""; ask(t); };
})();
