#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PACKAGE_JSON = path.join(ROOT, "package.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function getTodayPrefix(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}${mm}${yy}`;
}

function nextBuildVersion(currentVersion, todayPrefix = getTodayPrefix()) {
  const match = String(currentVersion || "").match(/^(\d{6})b(\d+)$/);
  if (!match || match[1] !== todayPrefix) {
    return `${todayPrefix}b1`;
  }
  return `${todayPrefix}b${Number(match[2]) + 1}`;
}

function updateHubSource(nextVersion) {
  const sourcePath = path.join(ROOT, "build-hub.js");
  const source = fs.readFileSync(sourcePath, "utf8");
  const updated = source.replace(/Hub build \d{6}b\d+/g, `Hub build ${nextVersion}`);
  if (updated !== source) {
    fs.writeFileSync(sourcePath, updated);
    return 1;
  }
  return 0;
}

function main() {
  const pkg = readJson(PACKAGE_JSON);
  const previousVersion = pkg.version;
  const nextVersion = nextBuildVersion(previousVersion);
  pkg.version = nextVersion;
  writeJson(PACKAGE_JSON, pkg);
  const changedSources = updateHubSource(nextVersion);
  console.log(`${pkg.name || "app"} build version: ${previousVersion} -> ${nextVersion} (${changedSources} source file(s))`);
}

main();
