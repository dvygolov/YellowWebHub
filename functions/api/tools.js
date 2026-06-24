import { tools } from "../../tool-registry.mjs";

function normalizeTool(tool, live) {
  return {
    id: tool.id,
    type: tool.type,
    title: live?.title || tool.title,
    shortName: live?.shortName || tool.shortName,
    description: live?.description || tool.description,
    landingUrl: live?.landingUrl || tool.landingUrl,
    sourceUrl: live?.sourceUrl || tool.sourceUrl,
    bookmarkletHref: live?.bookmarkletHref || tool.bookmarkletHref || "",
    build: live?.build || live?.version || "",
    version: live?.version || live?.build || "",
    latestManifestUrl: live?.latestManifestUrl || "",
    generatedAt: live?.generatedAt || "",
  };
}

async function fetchLiveTool(tool) {
  try {
    const response = await fetch(tool.toolMetaUrl, {
      headers: { accept: "application/json" },
      cf: { cacheTtl: 0, cacheEverything: false },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const live = await response.json();
    return {
      ...normalizeTool(tool, live),
      status: "ok",
    };
  } catch (error) {
    return {
      ...normalizeTool(tool),
      build: "",
      version: "",
      bookmarkletHref: "",
      status: "error",
      error: error?.message || String(error),
    };
  }
}

export async function onRequestGet() {
  const payload = await Promise.all(tools.map((tool) => {
    if (tool.type === "static" || !tool.toolMetaUrl) {
      return Promise.resolve({
        ...normalizeTool(tool),
        build: "static",
        version: "",
        status: "static",
      });
    }
    return fetchLiveTool(tool);
  }));

  return new Response(JSON.stringify({
    generatedAt: new Date().toISOString(),
    tools: payload,
  }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
