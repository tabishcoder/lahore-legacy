/* =========================================================================
   LAHORE LEGACY — SHARE CARDS (quiz score + certificate)
   Drawn on <canvas>, shared with the Web Share API where supported,
   otherwise downloaded as a PNG.
   ========================================================================= */

window.LL = window.LL || {};

LL.Share = (function () {
  const W = 1080, H = 1350;
  const C = { ink: "#F1E6D0", navy: "#E8D9BC", gold: "#9A3A1F", gold2: "#1F5A78", ivory: "#2B1D14", sand: "#6E4A30", burg: "#8B2A1E" };

  function skylineImage() {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.crossOrigin = "anonymous";
      LL.Photos.resolve("badshahi-mosque", 960).then((p) => (p ? (img.src = p.url) : res(null)));
    });
  }

  async function base(ctx) {
    await (document.fonts ? document.fonts.ready : Promise.resolve());
    ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W / 2, 380, 50, W / 2, 380, 900);
    g.addColorStop(0, "rgba(248,240,224,1)"); g.addColorStop(1, "rgba(228,212,182,1)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.strokeStyle = "rgba(154,58,31,.35)"; ctx.strokeRect(54, 54, W - 108, H - 108);
    const sky = await skylineImage();
    if (sky) {
      try {
        const h = 330, r = Math.max((W - 112) / sky.naturalWidth, h / sky.naturalHeight);
        const sw = (W - 112) / r, sh = h / r;
        ctx.globalAlpha = 0.45; ctx.filter = "sepia(0.7)";
        ctx.drawImage(sky, (sky.naturalWidth - sw) / 2, (sky.naturalHeight - sh) / 2, sw, sh, 56, H - 56 - h, W - 112, h);
        ctx.globalAlpha = 1; ctx.filter = "none";
        const fade = ctx.createLinearGradient(0, H - 56 - h, 0, H - 56 - h + 160);
        fade.addColorStop(0, "rgba(236,224,200,1)"); fade.addColorStop(1, "rgba(236,224,200,0)");
        ctx.fillStyle = fade; ctx.fillRect(56, H - 56 - h, W - 112, 160);
      } catch (e) { ctx.globalAlpha = 1; }
    }
    ctx.textAlign = "center";
    ctx.fillStyle = C.gold2;
    ctx.font = 'italic 34px "IM Fell English", Georgia, serif';
    ctx.fillText("Lahore Legacy", W / 2, 150);
    ctx.fillStyle = C.gold; ctx.fillRect(W / 2 - 40, 180, 80, 2);
  }

  const urdu = () => false; // share images are always in English
  const serif = (size, w = 600) => (urdu() ? `${w >= 600 ? 700 : 500} ${Math.round(size * 0.78)}px "Noto Naskh Arabic", serif` : `${w} ${size}px "IM Fell English", Georgia, serif`);

  function wrap(ctx, text, x, y, maxW, lh) {
    const words = text.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; }
      else line = test;
    }
    ctx.fillText(line, x, y);
    return y;
  }

  async function scoreCard(right, total) {
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    await base(ctx);
    ctx.fillStyle = C.sand; ctx.font = serif(54, 500);
    ctx.direction = urdu() ? "rtl" : "ltr";
    ctx.fillText(LL.I18N.t("quizTitle"), W / 2, 300);
    ctx.fillStyle = C.ivory; ctx.font = `500 260px "EB Garamond", Georgia, serif`;
    ctx.fillText(`${right}/${total}`, W / 2, 600);
    ctx.fillStyle = C.gold2; ctx.font = serif(48, 500);
    ctx.fillText(LL.I18N.t("resultLine", right, total), W / 2, 760);
    ctx.fillStyle = "rgba(43,29,20,.72)"; ctx.font = serif(40, 500);
    wrap(ctx, urdu() ? "بادشاہی مسجد · شاہی قلعہ · مسجد وزیر خان · شالامار باغ · مینارِ پاکستان" : "Badshahi Mosque · Lahore Fort · Wazir Khan · Shalimar · Minar-e-Pakistan", W / 2, 840, W - 200, 54);
    return cv;
  }

  async function certificate(name) {
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    await base(ctx);
    ctx.fillStyle = C.sand; ctx.font = serif(46, 500);
    ctx.direction = urdu() ? "rtl" : "ltr";
    ctx.fillText(urdu() ? "یہ سرٹیفکیٹ دیا جاتا ہے" : "This certifies that", W / 2, 290);
    ctx.fillStyle = C.ivory; ctx.font = serif(110, 600);
    ctx.fillText(name || (urdu() ? "ایک مسافر" : "A Traveller"), W / 2, 420);
    ctx.fillStyle = C.gold; ctx.fillRect(W / 2 - 220, 455, 440, 1);
    ctx.fillStyle = C.sand; ctx.font = serif(44, 500);
    wrap(ctx, urdu() ? "جنہوں نے لاہور کی چھ تاریخی جگہیں دیکھیں اور ساری مہریں حاصل کیں۔" : `has explored the heritage of Lahore and collected ${LL.Progress.stampCount()} of ${LL.SITES.length} stamps.`, W / 2, 530, W - 240, 58);
    // six stamps
    const got = LL.SITES.filter((x) => LL.Progress.state.stamps[x.id]);
    (got.length >= 6 ? got : LL.SITES).slice(0, 6).forEach((s, i) => {
      const cx = 250 + (i % 3) * 290, cy = 720 + Math.floor(i / 3) * 210, r = 82;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(((i % 2 ? 1 : -1) * 7 * Math.PI) / 180);
      ctx.strokeStyle = C.burg; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.arc(0, 0, r - 12, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.ivory; ctx.font = urdu() ? `700 22px "Noto Naskh Arabic", serif` : `600 25px "IM Fell English", Georgia, serif`;
      const nm = s.name.en.split(" ");
      const lines = nm.length > 2 ? [nm.slice(0, 2).join(" "), nm.slice(2).join(" ")] : nm.length === 2 && !urdu() ? nm : [nm.join(" ")];
      lines.forEach((ln, k) => ctx.fillText(ln, 0, (k - (lines.length - 1) / 2) * 28 + 8));
      ctx.restore();
    });
    ctx.fillStyle = "rgba(43,29,20,.6)"; ctx.font = `italic 30px "EB Garamond", Georgia, serif`;
    ctx.fillText(new Date().toLocaleDateString(urdu() ? "ur-PK" : "en-GB", { day: "numeric", month: "long", year: "numeric" }), W / 2, 1150);
    return cv;
  }

  async function deliver(cv, filename, text) {
    const blob = await new Promise((r) => cv.toBlob(r, "image/png"));
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text }); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  return { scoreCard, certificate, deliver };
})();
