// Site content: brand name, contact details and links. Applied by scripts/build.mjs to every page,
// JS module and JSON file, so the pre-rendered HTML and the client code always agree.
// Edit ME below, then rebuild (npm run build).

export const ME = {
  brand: "Ambre by El Mehdi",
  shortBrand: "Ambre",
  wordmark: "ambre by el mehdi",
  email: "elmehdisekrare@gmail.com",
  phone: "07 00 21 42 82",
  tel: "tel:+212700214282",
  linkedin: "https://www.linkedin.com/in/el-mehdi-sekrare-77000629b",
  city: "Mohammedia, Morocco",
};

// "Built by El Mehdi" badge: fixed bottom-left on every page (same size as the template's badge:
// 36px pill, 13px label, 14px logo; logo-only 38px square on phones). Spec: D:\elmehdi-30-days\BRAND.md
const M_LOGO = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 21V6.4L5.4 3h1.4L12 9.9 17.2 3H22v18h-4.6v-9.8L12 18.3l-5.4-7.1V21z"/></svg>`;
const BADGE = `<a class="ebm-badge" href="${ME.linkedin}" target="_blank" rel="noopener" aria-label="Built by El Mehdi (opens in a new tab)">${M_LOGO}<span>Built by El Mehdi</span></a>`;
const BADGE_CSS = `<style data-ebm-badge>
.ebm-badge{position:fixed;left:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:20;display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 12px 0 10px;box-sizing:border-box;border-radius:12px;background:#fff;color:#0b0b0c;text-decoration:none;font:500 13px/1 "Instrument Sans","Inter","Inter Placeholder",system-ui,sans-serif;letter-spacing:.01em;white-space:nowrap;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 1px 1px rgba(0,0,0,.18),0 2px 8px rgba(0,0,0,.08);transition:transform .2s ease,box-shadow .2s ease;-webkit-font-smoothing:antialiased}
.ebm-badge svg{width:14px;height:14px;flex:none;display:block}
.ebm-badge:hover{transform:translateY(-1px);box-shadow:0 0 0 1px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.16),0 6px 16px rgba(0,0,0,.10)}
.ebm-badge:focus-visible{outline:2px solid #0b0b0c;outline-offset:2px}
@media (max-width:809.98px){.ebm-badge{width:38px;height:38px;padding:8px;justify-content:center}.ebm-badge span{display:none}.ebm-badge svg{width:18px;height:18px}}
@media print{.ebm-badge{display:none}}
</style>`;

const OLD_LINK = "https://visuvate.com/";

// Links: [label in the source files, href, open in new tab]
const LINKS = [
  ["(503) 555-0148", ME.tel, false],
  ["hello@amblefootwear.com", `mailto:${ME.email}`, false],
  ["Contact", ME.linkedin, true],
  ["1220 SE Water Ave, Portland, OR 97214", "https://maps.google.com/?q=Mohammedia,+Morocco", true],
];

// Text replacements (order matters: longest first)
const TEXT = [
  ["© 2026 Amble Footwear Co. Designed in Portland. Made in Elche, Spain.", `© 2026 ${ME.brand}. All rights reserved.`],
  ["Amble Footwear Co.", ME.brand],
  ["hello@amblefootwear.com", ME.email],
  ["(503) 555-0148", ME.phone],
  ["1220 SE Water Ave, Portland, OR 97214", ME.city],
  ["Instagram @amblefootwear", "LinkedIn: El Mehdi Sekrare"],
  ["Mon to Fri, 8 to 6 PT", "Mon to Fri, 8 to 6"],
];

// Hide the floating badges and the YouTube / TikTok / Pinterest icons; the first social slot becomes LinkedIn.
const LINKEDIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92h-4z'/></svg>`;
const CSS = `<style data-site>
[data-framer-name="Visuvate Badge"],#__framer-badge-container,[data-framercommerce-widget]{display:none!important}
[data-framer-name="Socials"] [data-framer-name="YouTube"],[data-framer-name="Socials"] [data-framer-name="TikTok"],[data-framer-name="Socials"] [data-framer-name="Pinterest"]{display:none!important}
[data-framer-name="Socials"] [data-framer-name="Instagram"]{position:relative}
[data-framer-name="Socials"] [data-framer-name="Instagram"] svg{opacity:0!important}
[data-framer-name="Socials"] [data-framer-name="Instagram"]::after{content:"";position:absolute;inset:0;margin:auto;width:16px;height:16px;background:var(--token-24fc9862-5ff4-4ec0-950b-69f621b26a0b,currentColor);-webkit-mask:url("data:image/svg+xml,${encodeURIComponent(LINKEDIN_SVG)}") center/contain no-repeat;mask:url("data:image/svg+xml,${encodeURIComponent(LINKEDIN_SVG)}") center/contain no-repeat}
</style>`;

// HTML: <a … href="https://visuvate.com/" target="_blank" rel>…LABEL…</a>
function relinkHtml(t, label, href, newTab) {
  let out = "", pos = 0, i;
  while ((i = t.indexOf(">" + label + "<", pos)) !== -1) {
    const h = t.lastIndexOf(`href="${OLD_LINK}"`, i);
    const between = h === -1 ? "" : t.slice(h, i);
    if (h !== -1 && h >= pos && i - h < 4000 && !between.includes("</a>")) {
      const tagEnd = t.indexOf(">", h);
      let attrs = t.slice(h, tagEnd).replace(`href="${OLD_LINK}"`, `href="${href}"`);
      if (!newTab) attrs = attrs.replace(/ target="_blank"/, "").replace(/ rel(?=$|\s)/, "");
      out += t.slice(pos, h) + attrs + t.slice(tagEnd, i + 1);
    } else out += t.slice(pos, i + 1);
    pos = i + 1;
  }
  return out + t.slice(pos);
}

// JS: v(ke,{href:`https://visuvate.com/`,…,openInNewTab:!0,…children:…children:`LABEL`
function relinkJs(t, label, href, newTab) {
  let out = "", pos = 0, i;
  const needle = "children:`" + label + "`";
  while ((i = t.indexOf(needle, pos)) !== -1) {
    const h = t.lastIndexOf("href:`" + OLD_LINK + "`", i);
    // guard: no other link (`{href:`) may start between the old href and the label
    if (h !== -1 && h >= pos && i - h < 4000 && t.slice(h + 6, i).indexOf("{href:") === -1) {
      let seg = t.slice(h, i).replace("href:`" + OLD_LINK + "`", "href:`" + href + "`");
      if (!newTab) seg = seg.replace("openInNewTab:!0", "openInNewTab:!1");
      out += t.slice(pos, h) + seg;
      pos = i;
    }
    out += t.slice(pos, i + needle.length);
    pos = i + needle.length;
  }
  return out + t.slice(pos);
}

export function personalize(text, kind) {
  for (const [label, href, tab] of LINKS) text = kind === "html" ? relinkHtml(text, label, href, tab) : relinkJs(text, label, href, tab);
  // Instagram icon → LinkedIn profile
  if (kind === "html") text = text.replace(/(aria-label="Instagram @amblefootwear \(opens in a new tab\)"[^>]*?href=")https:\/\/visuvate\.com\//g, `$1${ME.linkedin}`);
  else text = text.replace(/href:`https:\/\/visuvate\.com\/`((?:(?!href:`).){0,400}?"aria-label":`Instagram @amblefootwear)/g, `href:\`${ME.linkedin}\`$1`);
  for (const [a, b] of TEXT) text = text.split(a).join(b);
  // Wordmark (header + footer logo text)
  text = text.split(">amble</p>").join(`>${ME.wordmark}</p>`).split("children:`amble`").join("children:`" + ME.wordmark + "`");
  // Titles get the full name, other mentions the short one
  text = text.split(" | Amble").join(" | " + ME.brand);
  text = text.replace(/(<title>[^<]*?)\bAmble\b/g, `$1${ME.brand}`)
    .replace(/((?:og:title|twitter:title)" content="[^"]*?)\bAmble\b/g, `$1${ME.brand}`)
    .replace(/(title:`[^`]*?)\bAmble\b/g, `$1${ME.brand}`)
    .replace(/\bAmble\b(?![-.\/])/g, ME.shortBrand);
  if (kind === "html") text = text.replace("</head>", CSS + BADGE_CSS + "</head>").replace(/<\/body>(?![\s\S]*<\/body>)/, BADGE + "</body>");
  return text;
}
