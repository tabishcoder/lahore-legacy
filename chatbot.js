/* Lahore Guide chatbot widget.
   On mobile: floating button navigates to /chat (full dedicated page).
   On desktop: popup opens inline.
   Add before </body>: <script src="/chatbot.js" defer></script>
*/
(function () {
  /* Skip entirely on the dedicated chat page */
  if (window.location.pathname === '/chat' || window.location.pathname === '/chat.html') return;

  var BOT_NAME  = "Lahore Guide";
  var GREETING  = "Assalam o Alaikum! 👋 I'm your Lahore heritage guide. Ask me about any place, or let me plan your trip.";
  var SUGGS     = ["Plan a 1-day trip", "Tell me about Lahore Fort", "What to eat near Badshahi Mosque?"];
  var API_URL   = "/api/chat";
  var COLOR     = "#9A3A1F";
  var CHAT_PAGE = "/chat";

  /* Detect mobile (<= 680px) — button navigates to /chat instead of opening popup */
  function onMobile() { return window.innerWidth <= 680; }

  var css = `
  #lg-btn {
    position: fixed; bottom: max(20px, env(safe-area-inset-bottom, 20px));
    right: max(20px, env(safe-area-inset-right, 20px));
    width: 58px; height: 58px; border-radius: 50%; border: none;
    background: ${COLOR}; color: #fff; font-size: 26px; cursor: pointer;
    box-shadow: 0 6px 20px rgba(0,0,0,.28); z-index: 9999;
    transition: transform .2s, box-shadow .2s;
    display: flex; align-items: center; justify-content: center;
    animation: lgBounce 1s ease 2s 3;
  }
  #lg-btn:hover { transform: scale(1.08); box-shadow: 0 8px 24px rgba(0,0,0,.34); }
  #lg-btn:active { transform: scale(.94); }
  @keyframes lgBounce {
    0%,100% { transform: translateY(0); }
    30% { transform: translateY(-10px) scale(1.08); }
    60% { transform: translateY(-4px) scale(1.04); }
  }

  /* pulse ring */
  #lg-btn::before {
    content: ""; position: absolute; inset: -6px; border-radius: 50%;
    border: 3px solid ${COLOR}; opacity: 0;
    animation: lgPulse 2s ease 1s 4;
  }
  @keyframes lgPulse {
    0% { transform: scale(.85); opacity: .7; }
    100% { transform: scale(1.4); opacity: 0; }
  }

  /* tooltip bubble */
  #lg-bubble {
    position: fixed;
    bottom: calc(max(20px, env(safe-area-inset-bottom, 20px)) + 68px);
    right: max(20px, env(safe-area-inset-right, 20px));
    background: #fff; color: #1c1917;
    border-radius: 14px 14px 4px 14px;
    padding: 10px 14px; font-size: 13.5px; line-height: 1.45;
    box-shadow: 0 6px 24px rgba(0,0,0,.18);
    z-index: 9998; max-width: 220px;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    animation: lgBubbleIn .3s ease;
    cursor: pointer;
  }
  #lg-bubble strong { display: block; color: ${COLOR}; font-size: 13px; margin-bottom: 2px; }
  @keyframes lgBubbleIn {
    from { opacity: 0; transform: translateY(8px) scale(.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  #lg-bubble-close {
    position: absolute; top: 6px; right: 8px;
    background: none; border: none; color: #9a8070;
    font-size: 15px; cursor: pointer; line-height: 1; padding: 0;
  }

  #lg-box {
    position: fixed; bottom: 90px; right: 20px;
    width: 370px; max-width: calc(100vw - 32px);
    height: 530px; max-height: calc(100vh - 110px);
    background: #fff; border-radius: 18px;
    box-shadow: 0 16px 48px rgba(0,0,0,.22);
    display: none; flex-direction: column; overflow: hidden;
    z-index: 9999;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    transform-origin: bottom right;
    animation: lgSlideIn .2s ease;
  }
  @keyframes lgSlideIn {
    from { opacity: 0; transform: scale(.92) translateY(10px); }
    to   { opacity: 1; transform: scale(1)   translateY(0); }
  }
  #lg-box.open { display: flex; }

  #lg-head {
    background: ${COLOR}; color: #fff;
    padding: 13px 16px; display: flex; align-items: center;
    gap: 10px; flex-shrink: 0;
  }
  #lg-head-info { flex: 1; min-width: 0; }
  #lg-head-name { font-weight: 600; font-size: 15px; }
  #lg-head-sub  { font-size: 11.5px; opacity: .78; font-style: italic; }
  #lg-head-btns { display: flex; align-items: center; gap: 4px; }

  #lg-open-full {
    background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.35);
    color: #fff; border-radius: 6px; padding: 4px 9px;
    font-size: 11px; cursor: pointer; white-space: nowrap;
    text-decoration: none; display: inline-block;
    transition: background .15s;
  }
  #lg-open-full:hover { background: rgba(255,255,255,.3); }

  #lg-close {
    background: none; border: none; color: rgba(255,255,255,.85);
    font-size: 22px; cursor: pointer; line-height: 1; padding: 2px 4px;
    transition: color .15s;
  }
  #lg-close:hover { color: #fff; }

  #lg-msgs {
    flex: 1; overflow-y: auto; padding: 14px;
    display: flex; flex-direction: column; gap: 10px;
    background: #faf7f2;
  }
  .lg-m {
    max-width: 86%; padding: 9px 13px; border-radius: 15px;
    font-size: 14px; line-height: 1.5; word-wrap: break-word;
  }
  .lg-user {
    align-self: flex-end; background: ${COLOR}; color: #fff;
    border-bottom-right-radius: 4px;
  }
  .lg-bot {
    align-self: flex-start; background: #fff; color: #1c1917;
    border: 1px solid #e7e0d8; border-bottom-left-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,.07);
  }
  .lg-bot ul { margin: 4px 0; padding-left: 18px; }
  .lg-bot li { margin-bottom: 3px; }
  .lg-typing { display: inline-flex; gap: 4px; padding: 3px 0; align-items: center; }
  .lg-typing span {
    width: 6px; height: 6px; border-radius: 50%;
    background: #9a7b6b; animation: lgDot .9s infinite;
  }
  .lg-typing span:nth-child(2) { animation-delay: .15s; }
  .lg-typing span:nth-child(3) { animation-delay: .3s; }
  @keyframes lgDot {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-4px); }
  }

  #lg-sugs {
    display: flex; flex-wrap: wrap; gap: 6px;
    padding: 6px 12px 10px; background: #faf7f2;
  }
  .lg-sug {
    border: 1.5px solid ${COLOR}; color: ${COLOR}; background: #fff;
    border-radius: 999px; padding: 5px 12px; font-size: 12.5px;
    cursor: pointer; transition: background .12s, color .12s;
    font-family: inherit;
  }
  .lg-sug:hover { background: ${COLOR}; color: #fff; }

  #lg-form {
    display: flex; align-items: center; gap: 0;
    border-top: 1px solid #e7e0d8; background: #fff; flex-shrink: 0;
  }
  #lg-in {
    flex: 1; border: none; padding: 13px 14px; font-size: 14px;
    outline: none; background: transparent; color: #1c1917; min-width: 0;
  }
  #lg-in::placeholder { color: #9a8070; }
  #lg-send {
    border: none; background: ${COLOR}; color: #fff;
    padding: 0 18px; cursor: pointer; font-weight: 600;
    font-size: 14px; align-self: stretch; transition: background .15s;
    flex-shrink: 0;
  }
  #lg-send:hover { background: #7B2D16; }
  #lg-send:disabled { opacity: .45; cursor: default; }
  `;

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function showBubble(onClickFn) {
    var bbl = document.createElement("div");
    bbl.id = "lg-bubble";
    bbl.innerHTML =
      '<button id="lg-bubble-close" aria-label="Dismiss">×</button>' +
      '<strong>🏛️ Lahore Guide</strong>' +
      'Ask me about any heritage place, ticket prices, or let me plan your trip!';
    bbl.addEventListener("click", function () { bbl.remove(); onClickFn(); });
    document.getElementById("lg-bubble-close").addEventListener("click", function (e) { e.stopPropagation(); bbl.remove(); });
    document.body.appendChild(bbl);
    setTimeout(function () { if (bbl.parentNode) bbl.remove(); }, 8000);
  }

  /* On mobile: just the floating button that links to /chat */
  if (onMobile()) {
    var btn = document.createElement("button");
    btn.id = "lg-btn";
    btn.setAttribute("aria-label", "Open Lahore Guide chat");
    btn.innerHTML = "💬";
    btn.onclick = function () { window.location.href = CHAT_PAGE; };
    document.body.appendChild(btn);
    setTimeout(function () { showBubble(function () { window.location.href = CHAT_PAGE; }); }, 4000);
    return; /* no popup on mobile */
  }

  /* Desktop: full popup */
  var wrap = document.createElement("div");
  wrap.innerHTML =
    '<button id="lg-btn" aria-label="Open Lahore guide chat">💬</button>' +
    '<div id="lg-box" role="dialog" aria-modal="true" aria-label="' + BOT_NAME + '">' +
      '<div id="lg-head">' +
        '<div id="lg-head-info"><div id="lg-head-name">' + BOT_NAME + '</div><div id="lg-head-sub">Lahore heritage guide</div></div>' +
        '<div id="lg-head-btns">' +
          '<a id="lg-open-full" href="' + CHAT_PAGE + '" title="Open full chat page">Full page ↗</a>' +
          '<button id="lg-close" aria-label="Close">×</button>' +
        '</div>' +
      '</div>' +
      '<div id="lg-msgs"></div>' +
      '<div id="lg-sugs"></div>' +
      '<form id="lg-form">' +
        '<input id="lg-in" placeholder="Ask about Lahore…" autocomplete="off" maxlength="1000"/>' +
        '<button id="lg-send" type="submit">Send</button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(wrap);

  var box   = document.getElementById("lg-box");
  var msgs  = document.getElementById("lg-msgs");
  var sugs  = document.getElementById("lg-sugs");
  var form  = document.getElementById("lg-form");
  var input = document.getElementById("lg-in");
  var send  = document.getElementById("lg-send");
  var history = [], busy = false;

  function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function format(text) {
    var lines = esc(text).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").split("\n"), out="", inList=false;
    lines.forEach(function(l){
      var m=l.match(/^\s*[-*•]\s+(.*)/);
      if(m){if(!inList){out+="<ul>";inList=true;}out+="<li>"+m[1]+"</li>";}
      else{if(inList){out+="</ul>";inList=false;}out+=l.trim()?l+"<br>":"<br>";}
    });
    if(inList)out+="</ul>";
    return out.replace(/(<br>)+$/,"");
  }
  function add(text, who) {
    var d=document.createElement("div");
    d.className="lg-m "+(who==="user"?"lg-user":"lg-bot");
    if(who==="user")d.textContent=text; else d.innerHTML=format(text);
    msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight; return d;
  }

  add(GREETING,"bot");
  SUGGS.forEach(function(s){
    var b=document.createElement("button");
    b.className="lg-sug"; b.type="button"; b.textContent=s;
    b.onclick=function(){ask(s);};
    sugs.appendChild(b);
  });

  document.getElementById("lg-btn").onclick=function(){
    var bbl=document.getElementById("lg-bubble"); if(bbl)bbl.remove();
    box.classList.toggle("open");
    if(box.classList.contains("open"))input.focus();
  };

  /* show bubble after 4 s if popup hasn't been opened yet */
  setTimeout(function(){
    if(!box.classList.contains("open")){
      showBubble(function(){
        box.classList.add("open"); input.focus();
      });
    }
  }, 4000);
  document.getElementById("lg-close").onclick=function(){box.classList.remove("open");};

  async function ask(text){
    text=(text||"").trim(); if(!text||busy)return;
    busy=true; send.disabled=true; sugs.style.display="none";
    add(text,"user"); history.push({role:"user",content:text});
    var typing=document.createElement("div");
    typing.className="lg-m lg-bot";
    typing.innerHTML='<div class="lg-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(typing); msgs.scrollTop=msgs.scrollHeight;
    try{
      var res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history.slice(-8)})});
      var data=await res.json();
      var reply=data.reply||"Sorry, something went wrong.";
      typing.innerHTML=format(reply);
      if(res.ok)history.push({role:"assistant",content:reply}); else history.pop();
    }catch(e){
      typing.textContent="Network error. Please check your connection.";
      history.pop();
    }
    msgs.scrollTop=msgs.scrollHeight;
    busy=false; send.disabled=false; input.focus();
  }
  form.onsubmit=function(e){e.preventDefault();var t=input.value;input.value="";ask(t);};
})();
