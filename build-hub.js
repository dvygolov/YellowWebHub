const fs = require("fs");
const path = require("path");

const root = __dirname;
const workRoot = path.resolve(root, "..");

const tools = [
  {
    title: "Ad Replica",
    shortName: "Ad Replica",
    landing: "https://adreplica.pages.dev/",
    source: "https://github.com/dvygolov/AdReplica",
    sourceDir: "AdReplica",
    description: "Campaign export, import, clone, media, identities, pixels, and catalogs for Ads Manager.",
  },
  {
    title: "Auto Rules Manager",
    shortName: "Auto Rules",
    landing: "https://autorulesmanager.pages.dev/",
    source: "https://github.com/dvygolov/AutoRulesManager",
    sourceDir: "AutoRulesManager",
    description: "Automated rules export, import, deletion, status switching, and currency-safe threshold migration.",
  },
  {
    title: "Columns Manager",
    shortName: "Columns",
    landing: "https://columnsmanager.pages.dev/",
    source: "https://github.com/dvygolov/ColumnsManager",
    sourceDir: "ColumnsManager",
    description: "Export Ads Manager column presets into one JSON or separate files, and import presets into one or many ad accounts.",
  },
  {
    title: "FP Blocked Manager",
    shortName: "FP Blocked",
    landing: "https://fpblockedmanager.pages.dev/",
    source: "https://github.com/dvygolov/FPBlockedManager",
    sourceDir: "FPBlockedManager",
    description: "Export and import Facebook Page blocked users as TXT, one user ID per line.",
  },
  {
    title: "FP Content Manager",
    shortName: "FP Content",
    landing: "https://fpcontentmanager.pages.dev/",
    source: "https://github.com/dvygolov/FPContentManager",
    sourceDir: "FPContentManager",
    description: "Copy content live from one Facebook Page to another, create chronology dates, and clean Page content.",
  },
  {
    title: "FB Auto Scroll",
    shortName: "FB Scroll",
    landing: "https://fbautoscroll.pages.dev/",
    source: "https://github.com/dvygolov/FBIvan",
    sourceDir: "FBIvan",
    description: "Facebook Reels and Feed auto-scroll panel with modes, breaks, night pause, and session limits. Original script by fb_ivan: https://t.me/fb_ivan.",
  },
];

const htmlEscape = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#121212"/>
  <text x="32" y="35" text-anchor="middle" dominant-baseline="middle" fill="#ffd000" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="28" font-weight="900" letter-spacing="-2">YW</text>
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
          <a class="link source" href="${htmlEscape(tool.source)}" target="_blank" rel="noopener">GitHub source</a>
          <a class="bookmarklet" href="${tool.bookmarklet}" data-label="${htmlEscape(tool.shortName)}" title="Click to copy or drag this link to the bookmarks bar">${htmlEscape(tool.shortName)}</a>
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
      display: flex;
      align-items: center;
      gap: 12px;
      font: 900 42px/1 Trebuchet MS, Verdana, sans-serif;
    }
    .logo {
      width: 42px;
      height: 42px;
      flex: 0 0 auto;
      border-radius: 8px;
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
      .logo { width: 34px; height: 34px; }
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
        <h1><img class="logo" src="/favicon.svg" alt="" />Yellow Web Tools</h1>
        <p class="meta">Draggable bookmarklets for Facebook ads.</p>
      </div>
      <div class="top"><a href="https://yellowweb.top" target="_blank" rel="noopener">yellowweb.top</a> · <a href="https://github.com/dvygolov/YellowWebHub" target="_blank" rel="noopener">Hub source</a> · <a href="https://t.me/yellow_web" target="_blank" rel="noopener">Telegram</a></div>
    </header>
    <section class="grid">
${cards}
    </section>
    <footer>Hub build 280526b3. Click a yellow bookmarklet to copy it, or drag it to the bookmarks bar.</footer>
  </main>
  <script>
    (() => {
      const copyText = async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(text);
            return;
          } catch (error) {
            console.warn("Clipboard API failed, trying textarea fallback.", error);
          }
        }
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(area);
        area.select();
        if (!document.execCommand("copy")) {
          throw new Error("Copy command was rejected.");
        }
        area.remove();
      };

      document.querySelectorAll(".bookmarklet").forEach((link) => {
        link.addEventListener("click", async (event) => {
          event.preventDefault();
          const label = link.dataset.label || link.textContent;
          try {
            await copyText(link.href);
            link.textContent = "Copied";
            window.setTimeout(() => { link.textContent = label; }, 1400);
          } catch (error) {
            link.textContent = "Copy failed";
            window.setTimeout(() => { link.textContent = label; }, 1800);
            console.error("Bookmarklet copy failed.", error);
          }
        });
      });
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, "dist", "index.html"), page);
fs.writeFileSync(path.join(root, "dist", "favicon.svg"), faviconSvg);
