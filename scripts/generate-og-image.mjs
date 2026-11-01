// Regenerates public/og-image.png (the link-preview card for WhatsApp, LinkedIn, etc.).
// Usage: node scripts/generate-og-image.mjs
// Colors and the network graph mirror the site's dark theme (src/styles/global.css) and
// the hero graph (src/scripts/hero-graph-background.ts).
import sharp from 'sharp';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, forceCollide } from 'd3-force';

const PHOTO_BG = process.env.PHOTO_BG || 'B'; // A: brand gradient, B: spotlight, C: dark glass
const OUT = process.env.OUT || 'public/og-image.png';
const W = 1200;
const H = 630;
const CX = 210;
const CY = 315;
const PHOTO = 296;

const card = {
  name: ['KAVIRAJ KUZHIKKATTU', 'HARIDASAN'],
  title: 'Senior Software Engineer',
  pills: ['Java', 'Spring Boot', 'Apache Kafka'],
  points: [
    '10+ years building Apple platform applications',
    'Currently: Architecture Consultant @ Infosys Limited',
    'Staff-Level Technical Leadership & Mentorship',
  ],
};

const esc = (t) => t.replace(/&/g, '&amp;');
const font = 'font-family="Helvetica Neue, Helvetica, Arial, sans-serif"';

// Seeded RNG so the graph is identical on every run.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Same structure as the hero graph: a ring of hubs, each with leaves, plus cross-links.
function buildGraph(random) {
  const HUBS = 9;
  const LEAVES = 4;
  const nodes = [];
  const links = [];
  for (let i = 0; i < HUBS; i++) nodes.push({ id: i, radius: 6 });
  for (let i = 0; i < HUBS; i++) links.push({ source: i, target: (i + 1) % HUBS });
  let next = HUBS;
  for (let hub = 0; hub < HUBS; hub++) {
    for (let leaf = 0; leaf < LEAVES; leaf++) {
      nodes.push({ id: next, radius: 3 });
      links.push({ source: hub, target: next });
      next++;
    }
  }
  const extra = Math.floor((nodes.length - HUBS) * 0.4);
  for (let i = 0; i < extra; i++) {
    const a = HUBS + Math.floor(random() * (nodes.length - HUBS));
    const b = HUBS + Math.floor(random() * (nodes.length - HUBS));
    if (a !== b) links.push({ source: a, target: b });
  }
  return { nodes, links };
}

function graphSvg() {
  const random = mulberry32(7);
  const { nodes, links } = buildGraph(random);
  const sim = forceSimulation(nodes)
    .randomSource(random)
    .force(
      'link',
      forceLink(links)
        .id((n) => n.id)
        .distance(70)
        .strength(0.6),
    )
    .force('charge', forceManyBody().strength(-90))
    .force('x', forceX(W / 2).strength(0.045))
    .force('y', forceY(H / 2).strength(0.07))
    .force(
      'collide',
      forceCollide((n) => n.radius + 10),
    )
    .stop();
  for (let i = 0; i < 400; i++) sim.tick();

  // The simulation settles into a compact cluster; stretch it across the whole card.
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
  const place = (n) => ({
    x: 30 + ((n.x - minX) / (maxX - minX)) * (W - 60),
    y: 30 + ((n.y - minY) / (maxY - minY)) * (H - 60),
  });

  const lines = links
    .map((l) => {
      const s = place(l.source);
      const t = place(l.target);
      return `<line x1="${s.x.toFixed(1)}" y1="${s.y.toFixed(1)}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}"/>`;
    })
    .join('');
  const dots = nodes
    .map((n) => {
      const p = place(n);
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${n.radius}"/>`;
    })
    .join('');
  return `<g stroke="#ffffff" stroke-opacity="0.13" stroke-width="1">${lines}</g>
    <g fill="#6a9bff" fill-opacity="0.5">${dots}</g>`;
}

const pillWidths = [76, 138, 160];
let pillX = 400;
const pills = card.pills
  .map((label, i) => {
    const w = pillWidths[i];
    const x = pillX;
    pillX += w + 14;
    return `<rect x="${x}" y="309" width="${w}" height="38" rx="19" fill="#3d7bff" fill-opacity="0.16" stroke="#6a9bff" stroke-opacity="0.8" stroke-width="1.5"/>
      <text x="${x + w / 2}" y="334" ${font} font-size="20" font-weight="600" fill="#d6e1ff" text-anchor="middle">${esc(label)}</text>`;
  })
  .join('');

const points = card.points
  .map((text, i) => {
    const y = 380 + i * 44;
    return `<circle cx="412" cy="${y - 7}" r="12" fill="url(#btn)"/>
      <path d="M406 ${y - 7} l4 4 l8 -8" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="438" y="${y}" ${font} font-size="23" fill="#e6ecfa">${esc(text)}</text>`;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="btn" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2f6bf0"/><stop offset="1" stop-color="#6a4de0"/>
    </linearGradient>
    <linearGradient id="headline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#aebcff"/>
    </linearGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6a9bff"/><stop offset="1" stop-color="#a48bff"/>
    </linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3d7bff"/><stop offset="1" stop-color="#7b5cff"/>
    </linearGradient>
    <linearGradient id="photoBgA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1f3a8a"/><stop offset="1" stop-color="#4b2fb8"/>
    </linearGradient>
    <radialGradient id="photoBgB" cx="0.5" cy="0.4" r="0.65">
      <stop offset="0" stop-color="#2a4a9a"/><stop offset="1" stop-color="#0b1020"/>
    </radialGradient>
    <linearGradient id="photoBgC" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#151f3d"/><stop offset="1" stop-color="#0b1122"/>
    </linearGradient>
    <linearGradient id="photoBg" xlink:href="#photoBg${PHOTO_BG}" xmlns:xlink="http://www.w3.org/1999/xlink"/>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#06070d"/>
  <g filter="url(#blur)">
    <circle cx="150" cy="80" r="230" fill="#5b3df0" fill-opacity="0.55"/>
    <circle cx="1080" cy="140" r="250" fill="#1f5cff" fill-opacity="0.5"/>
    <circle cx="760" cy="620" r="220" fill="#16a39a" fill-opacity="0.28"/>
  </g>
  ${graphSvg()}
  <rect x="368" y="118" width="790" height="394" rx="26" fill="#ffffff" fill-opacity="0.035" stroke="#ffffff" stroke-opacity="0.1"/>
  <circle cx="${CX}" cy="${CY}" r="160" fill="url(#photoBg)" stroke="url(#ring)" stroke-width="6"/>
  <text x="400" y="176" ${font} font-size="56" font-weight="800" fill="url(#headline)">${esc(card.name[0])}</text>
  <text x="400" y="234" ${font} font-size="56" font-weight="800" fill="url(#headline)">${esc(card.name[1])}</text>
  <text x="400" y="280" ${font} font-size="32" font-weight="600" fill="url(#title)">${esc(card.title)}</text>
  ${pills}
  ${points}
</svg>`;

const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO}" height="${PHOTO}"><circle cx="${PHOTO / 2}" cy="${PHOTO / 2}" r="${PHOTO / 2}" fill="#fff"/></svg>`,
);
const photo = await sharp('public/images/kaviraj-profile@2x.png')
  .resize(PHOTO, PHOTO, { fit: 'cover', position: 'top' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: photo, left: CX - PHOTO / 2, top: CY - PHOTO / 2 }])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`wrote ${OUT}`);
