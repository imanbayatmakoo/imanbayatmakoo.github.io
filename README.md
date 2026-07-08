# Portfolio — data-driven, zero build step

Everything you see on the site is rendered at page load from **`cv.json`**.
That file is your single source of truth.

## Update your CV
1. Edit `cv.json` (locally, or directly in the GitHub web editor).
2. Commit / push. GitHub Pages redeploys automatically in ~1 minute.

Search for `TODO` in `cv.json` — those are placeholders to replace.
Empty strings and empty arrays are safe: sections/fields simply don't render.

## Change the appearance
All colors, fonts, spacing, and both themes live in the token block at the
top of `css/style.css` (`:root` for light, `[data-theme="dark"]` for dark).
You should almost never need to edit `js/app.js` unless you add a new
section type.

## Preview locally
`fetch()` doesn't work from `file://`, so serve the folder:

```bash
cd portfolio
python3 -m http.server
# open http://localhost:8000
```

## Deploy
1. Create a public repo named exactly `YOURUSERNAME.github.io`.
2. Push these files to the `main` branch (root).
3. Settings → Pages → confirm source = `main` / root.
4. Live at `https://YOURUSERNAME.github.io`.

## PDF resume
Two options, both from the same data:
- The **PDF** button in the nav triggers the print stylesheet — use the
  browser's "Save as PDF". Clean, no nav, no color noise.
- Or drop a hand-made `assets/resume.pdf` and the "Download PDF" hero
  button links to it (set `basics.resumePdf` in `cv.json`; leave it empty
  to hide the button).

## Structure
```
index.html      — static shell, no content
cv.json         — ALL content (single source of truth)
js/app.js       — renderer (fetch cv.json → build DOM)
css/style.css   — design tokens + components + print styles
assets/         — photo.jpg, resume.pdf, logos (create as needed)
```
