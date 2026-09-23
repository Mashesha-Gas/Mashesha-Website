// vite build produces a single dist/index.html with no per-route <meta>
// tags — every route's title/description/OG tags are injected client-side
// by <SEO> (src/components/SEO.jsx) after React mounts. Link-preview bots
// (WhatsApp, Facebook, Slack, ...) and most search crawlers fetch the raw
// HTML and don't run that JS, so they only ever see an empty shell.
//
// This runs after `vite build` and writes a static copy of index.html per
// route with the real <head> tags baked in — dist/products/index.html,
// dist/about/index.html, etc. Both the nginx config (`try_files $uri $uri/
// /index.html`) and Vercel's SPA rewrite serve a matching static file over
// the fallback when one exists, so crawlers hitting /products get the
// baked-in tags while real users still get the normal client-rendered SPA
// (React re-renders the identical tags via <SEO> once the bundle loads, so
// there's no mismatch — see main.jsx, which uses createRoot, not
// hydrateRoot).
//
// Keep this list in sync with each page's <SEO title=... description=...>
// call — it's the same copy, just also needed here so it can be baked into
// static HTML before any JS has run.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE_URL = "https://mashesha.co.za";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const ROUTES = [
  {
    path: "/",
    title: "Mashesha | Gas Delivery Near You | LPG Gas in Johannesburg",
    description:
      "Mashesha delivers LPG gas cylinders straight to your door in Johannesburg. Fast, safe gas delivery for cooking, stoves and gas heaters. Order gas near you today.",
  },
  {
    path: "/products",
    title: "Gas Cylinders for Sale | LPG for Cooking & Gas Heaters | Mashesha",
    description:
      "Browse LPG gas cylinders for cooking, stoves and gas heaters. All sizes in stock, refilled to SANS safety standards, delivered across Johannesburg by Mashesha.",
  },
  {
    path: "/about",
    title: "About Mashesha | Johannesburg's Gas Delivery Service",
    description:
      "Mashesha is a Johannesburg-based LPG gas delivery service. Learn how we keep homes and businesses stocked with safe, reliable gas for cooking and heating.",
  },
  {
    path: "/contact",
    title: "Contact Mashesha | Join Our WhatsApp List",
    description:
      "Join Mashesha's WhatsApp list for specials and updates, or send us a general enquiry. Order gas from the home page or on WhatsApp.",
  },
  {
    path: "/terms",
    title: "Terms & Conditions | Mashesha",
    description: "Read the terms and conditions for ordering LPG gas delivery from Mashesha in Johannesburg.",
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHead(route) {
  const url = `${SITE_URL}${route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);

  return [
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Mashesha" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ].join("\n    ");
}

const template = readFileSync(join(DIST, "index.html"), "utf8");

for (const route of ROUTES) {
  const html = template.replace(
    /<title>.*<\/title>/,
    `<title>${escapeHtml(route.title)}</title>\n    ${renderHead(route)}`
  );

  const outDir = route.path === "/" ? DIST : join(DIST, route.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`prerendered SEO tags -> ${route.path === "/" ? "/index.html" : `${route.path}/index.html`}`);
}
