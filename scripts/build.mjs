// Static build:  node scripts/build.mjs  →  dist/  (used by Netlify, see netlify.toml)
//
// Static hosts ignore "?query", so every stored request gets its own file name:
//   https://<host>/<path>?<query>  (+ POST body)  →  /_x/<host>/<path>__<sha1(query + sha1(body))>.<ext>
// Literal URLs in HTML/JS are mapped at build time; URLs built at runtime (CMS ranges, Shopify GraphQL
// POSTs, generated srcsets) are mapped in the browser by the same function, in a fetch() shim and a
// Service Worker. Anything not stored falls back to the real URL (e.g. the cart).
// Site content (name, contact details, links) comes from scripts/content.mjs.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { personalize } from "./content.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "site");
const OUT = path.join(ROOT, "dist");
const SITE = "https://amble.framer.media";
const HOSTS = ["framerusercontent.com", "fonts.gstatic.com", "fonts.googleapis.com", "amble-theme-dev.myshopify.com", "www.dropbox.com"];
const BINARY = /\.(framercms|woff2?|ttf|otf|png|jpe?g|webp|avif|gif|ico|mp4|webm|mov|mp3|wasm|riv|lottie)$/i;
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 12);

// Stored file for a request URL (+ optional body hash), as a site-relative path
function staticRel(u, bodyHash = "") {
  const url = new URL(u);
  let p = decodeURIComponent(url.pathname).replace(/[<>:"|?*\\]/g, "_");
  if (p.endsWith("/")) p += "_index";
  const m = p.match(/(\.[^./]*)$/);
  const ext = m ? m[1] : "";
  const base = ext ? p.slice(0, -ext.length) : p;
  const tag = url.search || bodyHash ? "__" + sha(url.search + bodyHash) : "";
  return `_x/${url.host}${base}${tag}${ext}`;
}
const toUrl = (rel) => "/" + rel.split("/").map(encodeURIComponent).join("/");

// ---------- browser side (shim in every page + Service Worker): same mapping, with fallback ----------
const BROWSER_MAP = `const H=${JSON.stringify(HOSTS)};
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-1",new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,"0")).join("").slice(0,12);
async function mapUrl(u,body){let x;try{x=new URL(u,location.href)}catch(e){return null}let host,p;
 if(H.includes(x.host)){host=x.host;p=x.pathname}
 else if(x.origin===location.origin&&x.pathname.startsWith("/_x/")){const r=x.pathname.slice(4),i=r.indexOf("/");host=r.slice(0,i);p=r.slice(i)}
 else return null;
 const orig="https://"+host+p+x.search;
 if(!x.search&&!body)return{to:"/_x/"+host+p,orig};
 const bh=body?await sha(body):"";const tag="__"+await sha(x.search+bh);
 let d=decodeURIComponent(p).replace(/[<>:"|?*\\\\]/g,"_");if(d.endsWith("/"))d+="_index";
 const m=d.match(/(\\.[^./]*)$/),ext=m?m[1]:"",base=ext?d.slice(0,-ext.length):d;
 return{to:("/_x/"+host+base+tag+ext).split("/").map((s,i)=>i?encodeURIComponent(s):s).join("/"),orig};}`;

const SHIM = `<script>(()=>{${BROWSER_MAP}
const f=window.fetch.bind(window);
window.fetch=async function(i,o){let req;try{req=new Request(i,o)}catch(e){return f(i,o)}let body=null;
 if(req.method!=="GET"&&req.method!=="HEAD")body=await req.clone().text();
 const m=await mapUrl(req.url,body);if(!m)return f(i,o);
 if(!(body&&/"query"\\s*:\\s*"(?:\\\\n|\\s)*mutation/.test(body))){const r=await f(m.to).catch(()=>null);if(r&&r.ok)return r}
 return f(new Request(m.orig,req));};
if("serviceWorker" in navigator)navigator.serviceWorker.register("/_sw.js").catch(()=>{});})();</script>`;

const SW = `${BROWSER_MAP}
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
 if(u.host==="events.framer.com"||(u.host==="framer.com"&&u.pathname.startsWith("/edit"))){e.respondWith(new Response(null,{status:204}));return}
 if(e.request.method!=="GET")return;
 if(!(H.includes(u.host)||(u.origin===location.origin&&u.pathname.startsWith("/_x/")&&u.search)))return;
 e.respondWith((async()=>{const m=await mapUrl(e.request.url,null);const r=await fetch(m.to).catch(()=>null);if(r&&r.ok)return r;return fetch(e.request)})());});`;

// ---------- build-time text rewrite ----------
const hostAlt = HOSTS.map((h) => h.replace(/\./g, "\\.")).join("|");
const LIT = new RegExp(`https://(?:${hostAlt})(?:/[^"'\`\\s)<>,\\\\]*)?`, "g");
const LIT_ESC = new RegExp(`https:\\\\/\\\\/(?:${hostAlt})(?:\\\\/[^"'\`\\s)<>,]*)?`, "g");
let mapped = 0;
const have = new Set();

function mapLiteral(raw, ampEscaped) {
  if (raw.includes("${")) return raw.replace(/^https:\/\//, "/_x/");
  const u = ampEscaped ? raw.replace(/&amp;/g, "&") : raw;
  let url;
  try { url = new URL(u); } catch { return raw; }
  if (!url.search) return "/_x/" + url.host + url.pathname;
  const rel = staticRel(u);
  if (!have.has(rel)) return raw.replace(/^https:\/\//, "/_x/"); // not cached: SW/shim maps it or falls back to the real URL
  mapped++;
  return toUrl(rel);
}

function rewrite(text, isHtml) {
  // Inside JS template literals keep URLs absolute on whatever domain serves the site: Framer does
  // new URL(`./x.framercms`, `https://framerusercontent.com/modules/…`) and a relative base throws.
  text = text.replace(LIT, (m, off, all) => {
    const out = mapLiteral(m, isHtml);
    // only the base argument of new URL(`./…`, `https://…/modules/…`) (else SSR HTML and JS disagree → hydration mismatch)
    const isBase = all.slice(Math.max(0, off - 2), off) === ",`" && /new URL\(`[^`]*`$/.test(all.slice(Math.max(0, off - 200), off - 2));
    return !isHtml && isBase && out.startsWith("/") ? "${location.origin}" + out : out;
  });
  text = text.replace(LIT_ESC, (m) => mapLiteral(m.replace(/\\\//g, "/"), false).replace(/\//g, "\\/"));
  text = text.split(SITE + "/").join("/").split(SITE).join("/");
  text = text.split("import(`https://framer.com/edit/init.mjs`)").join("import(`/_local/editorbar-stub.mjs`)");
  text = personalize(text, isHtml ? "html" : "js");
  if (isHtml) {
    text = text.replace(/<script async src="https:\/\/events\.framer\.com\/script\?v=2"[^>]*><\/script>/, "<!-- analytics off -->");
    text = text.replace("<head>", `<head><meta name="robots" content="noindex, nofollow">${SHIM}`);
  }
  return text;
}

// ---------- build ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const index = JSON.parse(fs.readFileSync(path.join(SRC, "index.json"), "utf8"));
const jobs = [];
for (const [key, v] of Object.entries(index)) {
  if (!v.file || v.status >= 400) continue;
  const m = /^(GET|POST) (\S+)(?: #(\w+))?$/.exec(key);
  if (!m) continue;
  const rel = staticRel(m[2], m[3] || "");
  have.add(rel);
  jobs.push({ rel, src: path.join(SRC, ...v.file.split(/[\\/]/)), ct: v.ct, bin: BINARY.test(new URL(m[2]).pathname) });
}
let n = 0;
for (const j of jobs) {
  const dest = path.join(OUT, j.rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (j.bin || !/html|javascript|css|json|svg|xml|text\/plain/.test(j.ct || "")) fs.copyFileSync(j.src, dest);
  else fs.writeFileSync(dest, rewrite(fs.readFileSync(j.src, "utf8"), false));
  n++;
}
// pages: site/pages/<route>.html → dist/<route>/index.html (Netlify pretty URLs), /404 → dist/404.html
const pages = [];
const walk = (d, pre) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { if (f.isDirectory()) walk(path.join(d, f.name), pre + "/" + f.name); else if (f.name.endsWith(".html")) pages.push([path.join(d, f.name), pre + "/" + f.name.slice(0, -5)]); } };
walk(path.join(SRC, "pages"), "");
for (const [src, route] of pages) {
  const html = rewrite(fs.readFileSync(src, "utf8"), true);
  const dest = route === "/index" ? path.join(OUT, "index.html") : route === "/404" ? path.join(OUT, "404.html") : path.join(OUT, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}
fs.writeFileSync(path.join(OUT, "_sw.js"), SW);
fs.mkdirSync(path.join(OUT, "_local"), { recursive: true });
fs.writeFileSync(path.join(OUT, "_local", "editorbar-stub.mjs"), "export const createEditorBar = () => () => null;\n");
fs.writeFileSync(path.join(OUT, "robots.txt"), "User-agent: *\nDisallow: /\n");
fs.writeFileSync(path.join(OUT, "_headers"), [
  "/*", "  X-Robots-Tag: noindex, nofollow", "",
  "/_sw.js", "  Cache-Control: no-cache", "  Content-Type: text/javascript; charset=utf-8", "",
  "/_x/framerusercontent.com/sites/*", "  Access-Control-Allow-Origin: *", "",
].join("\n"));
console.log(`dist/: ${pages.length} pages, ${n} assets, ${mapped} literal URLs mapped to static files`);
