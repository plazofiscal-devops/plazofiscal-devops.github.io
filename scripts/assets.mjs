// Converts the diagrams and screenshots of the platform repository to WebP for the site.
// Usage: npm run assets [-- <path to a plazofiscal-platform clone>]
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve(process.argv[2] || '../plazofiscal-platform');
const out = path.resolve('public/img');
const jobs = [
  ['docs/diagrams/platform-overview.drawio.png', 'diagrams/platform-overview.webp'],
  ['docs/diagrams/observability-signals.drawio.png', 'diagrams/observability-signals.webp'],
  ['docs/diagrams/sign-in-flow.drawio.png', 'diagrams/sign-in-flow.webp'],
  ['docs/evidence/frontend-obligations.png', 'shots/frontend-obligations.webp'],
  ['docs/evidence/jaeger-obligation-trace.png', 'shots/jaeger-obligation-trace.webp'],
  ['docs/evidence/kibana-trace-logs.png', 'shots/kibana-trace-logs.webp'],
  ['docs/evidence/dashboard-business.png', 'shots/dashboard-business.webp'],
  ['docs/evidence/sign-in-code.png', 'shots/sign-in-code.webp']
];

for (const [from, to] of jobs) {
  const file = path.join(src, from);
  if (!fs.existsSync(file)) { console.error(`missing ${file}`); process.exitCode = 1; continue; }
  fs.mkdirSync(path.dirname(path.join(out, to)), { recursive: true });
  // Diagrams keep their text sharp with a lossless encoding
  const lossless = to.startsWith('diagrams/');
  await sharp(file).webp(lossless ? { lossless: true } : { quality: 86 }).toFile(path.join(out, to));
  console.log(to);
}
