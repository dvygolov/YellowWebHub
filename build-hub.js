const fs = require("fs");
const path = require("path");

const root = __dirname;
const workRoot = path.resolve(root, "..");

const tools = [
  {
    title: "AdReplica",
    shortName: "AdReplica",
    landing: "https://adreplica.pages.dev/",
    sourceDir: "AdReplica",
    description: "Campaign export, import, clone, media, identities, pixels, and catalogs for Ads Manager.",
  },
  {
    title: "AutoRulesManager",
    shortName: "AutoRules",
    landing: "https://autorulesmanager.pages.dev/",
    sourceDir: "AutoRulesManager",
    description: "Automated rules export, import, deletion, status switching, and currency-safe threshold migration.",
  },
  {
    title: "ColumnsManager",
    shortName: "Columns",
    landing: "https://columnsmanager.pages.dev/",
    sourceDir: "ColumnsManager",
    description: "Export and import Ads Manager column presets between ad accounts.",
  },
  {
    title: "FPBlockedManager",
    shortName: "FPBlocked",
    landing: "https://fpblockedmanager.pages.dev/",
    sourceDir: "FPBlockedManager",
    description: "Export, import, block, and unblock Facebook Page blocked users by user ID.",
  },
  {
    title: "FPContentManager",
    shortName: "FPContent",
    landing: "https://fpcontentmanager.pages.dev/",
    sourceDir: "FPContentManager",
    description: "Export Page posts/photos/videos, import text posts, and clean Page content with explicit confirmation.",
  },
];

const htmlEscape = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#121212"/>
  <path d="M12 14h40v6H12zM12 44h40v6H12z" fill="#ffd000"/>
  <path d="M15 22h8l6 11 6-11h8L32 40h-6l-4-7-4 7h-6l10-18zm31 0h7L43 40h-7l3-5-8-13h7l4 7 4-7z" fill="#ffd000"/>
</svg>
`;

function readToolMeta(tool) {
  const indexPath = path.join(workRoot, tool.sourceDir, "dist", "index.html");
  const html = fs.readFileSync(indexPath, "utf8");
  const bookmarklet = html.match(/<a class="bookmarklet" id="bookmarkletLink" href="([^"]+)"/);
  const build = html.match(/<div class="eyebrow">[^<]* build ([^<]+)<\/div>/);

  if (!bookmarklet) {
    throw new Error(`Could not find bookmarklet link in ${indexPath}`);
  }
  if (!build) {
    throw new Error(`Could not find build label in ${indexPath}`);
  }

  return {
    ...tool,
    bookmarklet: bookmarklet[1],
    build: build[1],
  };
}

const cards = tools.map(readToolMeta).map((tool) => `      <article>
        <div class="tool-head">
          <h2>${htmlEscape(tool.title)}</h2>
          <span class="build">build ${htmlEscape(tool.build)}</span>
        </div>
        <p>${htmlEscape(tool.description)}</p>
        <div class="links">
          <a class="link" href="${htmlEscape(tool.landing)}" target="_blank" rel="noopener">Landing</a>
          <a class="bookmarklet" href="${tool.bookmarklet}" title="Drag this link to the bookmarks bar">${htmlEscape(tool.shortName)}</a>
        </div>
      </article>`).join("\n");

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Yellow Web Tools</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="theme-color" content="#121212" />
  <style>
    :root {
      --bg: #121212;
      --panel: #1f1f1f;
      --ink: #f8f0c8;
      --muted: #b7ad89;
      --gold: #ffd000;
      --line: rgba(255, 208, 0, 0.32);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font: 15px/1.55 Verdana, sans-serif;
    }
    main {
      width: min(1180px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 34px 0 56px;
    }
    header {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 28px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 22px;
    }
    h1 {
      margin: 0;
      color: var(--gold);
      font: 900 42px/1 Trebuchet MS, Verdana, sans-serif;
    }
    .meta { color: var(--muted); margin: 8px 0 0; }
    .top a, .links a { color: var(--gold); text-decoration: none; }
    .top a:hover, .links a:hover { text-decoration: underline; }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    article {
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 8px;
      padding: 18px;
      display: grid;
      gap: 14px;
    }
    .tool-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }
    h2 {
      margin: 0;
      color: var(--gold);
      font: 900 24px/1.1 Trebuchet MS, Verdana, sans-serif;
    }
    .build {
      color: var(--muted);
      white-space: nowrap;
      font: 700 12px/1.2 Verdana, sans-serif;
    }
    p { margin: 0; color: #d8cfaa; }
    .links {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
      align-items: center;
    }
    .links a {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 8px 10px;
      background: rgba(255, 208, 0, 0.07);
      font-weight: 700;
    }
    .links .bookmarklet {
      background: var(--gold);
      border-color: var(--gold);
      color: #111;
      cursor: grab;
    }
    footer { margin-top: 28px; color: var(--muted); }
    @media (max-width: 760px) {
      header { display: block; }
      h1 { font-size: 34px; }
      .grid { grid-template-columns: 1fr; }
      .tool-head { display: block; }
      .build { display: block; margin-top: 6px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>Yellow Web Tools</h1>
        <p class="meta">Draggable bookmarklets for Facebook ads.</p>
      </div>
      <div class="top"><a href="https://yellowweb.top" target="_blank" rel="noopener">yellowweb.top</a> · <a href="https://t.me/yellow_web" target="_blank" rel="noopener">Telegram</a></div>
    </header>
    <section class="grid">
${cards}
    </section>
    <footer>Hub build 200526b4. Drag a yellow bookmarklet button to the bookmarks bar, or open the landing page for details.</footer>
  </main>
</body>
</html>
`;

fs.writeFileSync(path.join(root, "dist", "index.html"), page);
fs.writeFileSync(path.join(root, "dist", "favicon.svg"), faviconSvg);
