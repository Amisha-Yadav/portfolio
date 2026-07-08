# Amisha Yadav — Portfolio

A faithful recreation of `portfolioamisha.framer.website` as a self-contained static
site (HTML / CSS / vanilla JS) — no framework, no build step, no Framer runtime.

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
Or just open `index.html` in a browser (some animations that rely on same-origin
image loads look best over a local server).

## Pages
| Page | File |
|------|------|
| Home | `index.html` |
| About | `about.html` |
| Contact | `contact.html` |
| Portfolio (listing) | `work/portfolio/index.html` |
| Project detail ×7 | `work/portfolio/<slug>.html` |

Projects: `ai-smartphone`, `svp`, `illumin8`, `shikshagraha`, `polymath-ai`,
`proposal-craft`, `pidge`.

## Structure
```
assets/
  css/style.css   — full design system (dark theme, Inter, layout, responsive)
  js/main.js      — all interactions
  img/            — images pulled from the original site
```

## Animations / interactions (`main.js`)
- Counting preloader (00 → 100) with progress bar
- Custom trailing cursor with hover states (mix-blend difference)
- Scroll-reveal + line-mask heading stagger (IntersectionObserver)
- Count-up statistics
- Seamless marquee ("Faster. Sharper. Smarter.")
- Project-row hover image preview that follows the cursor
- Magnetic buttons, hero parallax, hide-on-scroll header
- Full-screen mobile menu
- Front-end contact form handling

Append `#shot` to any URL to render a static (animation-free) version — used for
screenshotting/verification.

## Notes
- Fonts: **Inter** via Google Fonts.
- Palette: black background, off-white text, pale blue-grey `#d1e1e8` accent — matched
  to the original's design tokens.
- Content (copy, stats, project names, awards) is transcribed verbatim from the
  original's server-rendered HTML. Project detail copy for pages that were
  client-rendered on the original (and thus not retrievable) is written to match the
  established tone.
- `cursor: none` is set globally for the custom cursor; it falls back to the system
  cursor on touch devices.
