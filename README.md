# keyboard-shortcutx

Tiny, dependency-free universal hotkey manager (ESM-first). Includes a small React hook exported at `keyboard-shortcutx/react`.

## Features
- ESM & CJS builds
- No runtime dependencies
- Lazy global `keydown` listener
- Combos (`ctrl+s`, `ctrl+shift+k`), multiple bindings
- Accepts string or array of strings for keys
- Normalizes `cmd`/`mod` / `control` / `option`, cross-browser
- Ignore inputs by default; `allowInInputs` option available
- Options: `preventDefault`, `stopPropagation`, `allowRepeat`
- SSR-safe (no `window` access during module import)
- Tree-shakeable; small runtime

## Install
```bash
npm install keyboard-shortcutx
