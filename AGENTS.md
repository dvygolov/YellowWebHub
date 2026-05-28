# YellowWebHub Agent Notes

## Release Rules

- Build versions use `DDMMYYbN`, based on the local build date.
- `npm run build` runs `scripts/bump-build-version.cjs` before packaging. If the current version date is today, it increments only `bN`; otherwise it resets to today's date with `b1`.
- Do not manually keep old build dates in `package.json` or `build-hub.js`; release builds update them together.
- Rebuild the hub after rebuilding any bookmarklet tool, because it reads each tool's local `dist/index.html` and embeds the current bookmarklet/build labels.

## Hygiene

- Run `npm run check` before `npm run build`.
- Deploy with `npm run deploy` after a successful build.
