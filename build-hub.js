const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const root = __dirname;
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

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

async function loadTools() {
  const moduleUrl = pathToFileURL(path.join(root, "tool-registry.mjs")).href;
  const registry = await import(moduleUrl);
  return registry.tools;
}

function buildPage(tools) {
  return `<!doctype html>
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
      --danger: #ff8989;
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
      min-height: 220px;
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
    .status {
      font: 700 12px/1.2 Verdana, sans-serif;
      color: var(--muted);
      text-transform: uppercase;
    }
    .status.error { color: var(--danger); }
    p { margin: 0; color: #d8cfaa; }
    .links {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
      align-items: center;
    }
    .links a, .links span {
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
    .links .bookmarklet.disabled {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.12);
      color: var(--muted);
      cursor: default;
    }
    .hint {
      color: var(--muted);
      font-size: 13px;
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
    <section class="grid" id="toolGrid"></section>
    <footer>Hub build ${htmlEscape(pkg.version)}. Click a yellow bookmarklet to copy it, or drag it to the bookmarks bar.</footer>
  </main>
  <script>
    (() => {
      const registry = ${JSON.stringify(tools)};
      const grid = document.getElementById("toolGrid");

      const escapeHtml = (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

      const initialTools = registry.map((tool) => ({
        ...tool,
        build: tool.type === "static" ? "static" : "loading",
        bookmarkletHref: tool.bookmarkletHref || "",
        status: tool.type === "static" ? "static" : "loading",
      }));

      function render(tools) {
        grid.innerHTML = tools.map((tool) => {
          const statusClass = tool.status === "error" ? "status error" : "status";
          const bookmarklet = tool.bookmarkletHref
            ? '<a class="bookmarklet" href="' + escapeHtml(tool.bookmarkletHref) + '" data-label="' + escapeHtml(tool.shortName) + '">' + escapeHtml(tool.shortName) + "</a>"
            : '<span class="bookmarklet disabled">Unavailable</span>';
          return '<article>' +
            '<div class="tool-head">' +
              '<h2>' + escapeHtml(tool.title) + '</h2>' +
              '<span class="build">build ' + escapeHtml(tool.build || "n/a") + '</span>' +
            '</div>' +
            '<div class="' + statusClass + '">' + escapeHtml(tool.status || "unknown") + '</div>' +
            '<p>' + escapeHtml(tool.description) + '</p>' +
            '<div class="links">' +
              '<a class="link" href="' + escapeHtml(tool.landingUrl) + '" target="_blank" rel="noopener">Landing</a>' +
              '<a class="link source" href="' + escapeHtml(tool.sourceUrl) + '" target="_blank" rel="noopener">GitHub source</a>' +
              bookmarklet +
            '</div>' +
            '<div class="hint">' + escapeHtml(tool.status === "error" ? (tool.error || "Live metadata unavailable.") : "Live build and bookmarklet come from the deployed tool.") + '</div>' +
          '</article>';
        }).join("");

        grid.querySelectorAll(".bookmarklet").forEach((link) => {
          link.addEventListener("click", async (event) => {
            event.preventDefault();
            const label = link.dataset.label || link.textContent;
            try {
              if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(link.href);
              } else {
                const area = document.createElement("textarea");
                area.value = link.href;
                area.setAttribute("readonly", "");
                area.style.cssText = "position:fixed;left:-9999px;top:0";
                document.body.appendChild(area);
                area.select();
                if (!document.execCommand("copy")) {
                  throw new Error("Copy command was rejected.");
                }
                area.remove();
              }
              link.textContent = "Copied";
              window.setTimeout(() => { link.textContent = label; }, 1400);
            } catch (error) {
              link.textContent = "Copy failed";
              window.setTimeout(() => { link.textContent = label; }, 1800);
              console.error("Bookmarklet copy failed.", error);
            }
          });
        });
      }

      render(initialTools);

      fetch("/api/tools", { cache: "no-store" })
        .then((response) => response.json())
        .then((payload) => {
          const liveById = new Map((payload.tools || []).map((tool) => [tool.id, tool]));
          const merged = registry.map((tool) => {
            const live = liveById.get(tool.id);
            return live ? { ...tool, ...live } : { ...tool, status: "error", error: "Tool did not return metadata." };
          });
          render(merged);
        })
        .catch((error) => {
          render(registry.map((tool) => ({
            ...tool,
            build: tool.type === "static" ? "static" : "unavailable",
            bookmarkletHref: tool.bookmarkletHref || "",
            status: tool.type === "static" ? "static" : "error",
            error: tool.type === "static" ? "" : (error?.message || String(error)),
          })));
        });
    })();
  </script>
</body>
</html>
`;
}

async function main() {
  const tools = await loadTools();
  const distRoot = path.join(root, "dist");
  fs.mkdirSync(distRoot, { recursive: true });
  fs.writeFileSync(path.join(distRoot, "index.html"), buildPage(tools));
  fs.writeFileSync(path.join(distRoot, "favicon.svg"), faviconSvg);
  fs.writeFileSync(path.join(distRoot, "_headers"), [
    "/",
    "  Cache-Control: no-store",
    "",
    "/api/*",
    "  Cache-Control: no-store",
    "",
    "/*",
    "  Cache-Control: no-store",
    "",
  ].join("\n"));
  fs.writeFileSync(path.join(distRoot, "_redirects"), [
    "/ /index.html 200",
    "/* /index.html 200",
    "",
  ].join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
