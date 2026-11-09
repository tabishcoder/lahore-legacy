/* Tiny MD5 (public-domain algorithm). Used only to build direct Wikimedia
   thumbnail URLs, which skips a redirect for every photo. */
window.LL = window.LL || {};
LL.md5 = (function () {
  function add(x, y) { const l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
  const rol = (n, c) => (n << c) | (n >>> (32 - c));
  const cmn = (q, a, b, x, s, t) => add(rol(add(add(a, q), add(x, t)), s), b);
  const ff = (a, b, c, d, x, s, t) => cmn((b & c) | (~b & d), a, b, x, s, t);
  const gg = (a, b, c, d, x, s, t) => cmn((b & d) | (c & ~d), a, b, x, s, t);
  const hh = (a, b, c, d, x, s, t) => cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a, b, c, d, x, s, t) => cmn(c ^ (b | ~d), a, b, x, s, t);
  function words(bytes) {
    const n = ((bytes.length + 8) >> 6) + 1, w = new Array(n * 16).fill(0);
    for (let i = 0; i < bytes.length; i++) w[i >> 2] |= bytes[i] << ((i % 4) * 8);
    w[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
    w[n * 16 - 2] = bytes.length * 8;
    return w;
  }
  return function (str) {
    const x = words(new TextEncoder().encode(str));
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    const S = [[7, 12, 17, 22], [5, 9, 14, 20], [4, 11, 16, 23], [6, 10, 15, 21]];
    const T = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0);
    for (let i = 0; i < x.length; i += 16) {
      const [oa, ob, oc, od] = [a, b, c, d];
      for (let j = 0; j < 64; j++) {
        const r = j >> 4;
        let k, f;
        if (r === 0) { k = j; f = ff; } else if (r === 1) { k = (5 * j + 1) % 16; f = gg; } else if (r === 2) { k = (3 * j + 5) % 16; f = hh; } else { k = (7 * j) % 16; f = ii; }
        const nb = f(a, b, c, d, x[i + k], S[r][j % 4], T[j]);
        a = d; d = c; c = b; b = nb;
      }
      a = add(a, oa); b = add(b, ob); c = add(c, oc); d = add(d, od);
    }
    return [a, b, c, d].map((v) => Array.from({ length: 4 }, (_, i) => ((v >>> (i * 8)) & 255).toString(16).padStart(2, "0")).join("")).join("");
  };
})();
