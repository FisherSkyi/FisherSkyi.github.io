# fisherskyi.github.io

Personal website of Yu Letian

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Structure

- `src/data.js` — all content.
- `src/App.jsx` — shell: page/theme state, keyboard shortcuts (`j`/`k`, `/`, `t`), hash routing.
- `src/sections.jsx` — the seven sections.
- `src/components/` — `Sidebar`, `Topbar`.
- `src/index.css` — design tokens (dark/light) + component styles.
- `public/` — static assets served at the site root (`.nojekyll`, `favicon_io/`, `assets/`).

Designed by Letian. Implemented by Claude Opus 4.8. Thanks Claude.
