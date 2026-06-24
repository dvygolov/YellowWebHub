# YellowWebHub Agent Notes

## Release Rules

- Build versions use `DDMMYYbN`, based on the local build date.
- `npm run build` runs `scripts/bump-build-version.cjs` before packaging. If the current version date is today, it increments only `bN`; otherwise it resets to today's date with `b1`.
- Do not manually keep old build dates in `package.json`; release builds update them automatically.
- The hub must not depend on sibling repos' local `dist/` folders at build time. It reads live tool metadata through its own `/api/tools` endpoint.

## Hygiene

- Run `npm run check` before `npm run build`.
- Deploy with `npm run deploy` after a successful build.
