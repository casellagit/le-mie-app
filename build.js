const fs = require('fs');
const path = require('path');

const SRC = 'apps', OUT = 'dist';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);

const apps = [];
for (const name of fs.readdirSync(SRC).sort()) {
  const dir = path.join(SRC, name);
  if (!fs.statSync(dir).isDirectory()) continue;
  fs.cpSync(dir, path.join(OUT, name), { recursive: true });

  let title = name;
  const idx = path.join(dir, 'index.html');
  if (fs.existsSync(idx)) {
    const m = fs.readFileSync(idx, 'utf8').match(/<title>(.*?)<\/title>/is);
    if (m && m[1].trim()) title = m[1].trim();
  }
  apps.push({ name, title });
}

const cards = apps
  .map(a => `<a class="card" href="/${a.name}/">${a.title}</a>`)
  .join('\n');

fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="it"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Le mie app</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 3rem auto; padding: 0 1rem; }
  h1 { margin-bottom: 1.5rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  .card { padding: 1.25rem; border: 1px solid #8884; border-radius: 12px;
          text-decoration: none; color: inherit; font-weight: 600; }
  .card:hover { background: #8882; }
</style></head>
<body>
<h1>Le mie app</h1>
<div class="grid">
${cards}
</div>
</body></html>`);
