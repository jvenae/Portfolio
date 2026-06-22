# CLAUDE.md

Context and conventions for working on this repo. Read before editing.

## Project
Personal portfolio for **Jose Lara**. Static site, **zero build step**. Deployed via
GitHub Pages (repo `jvenae/Portfolio`, branch `main`) to the custom domain
**www.jose-lara.com** (the `CNAME` file at root holds the domain). Pushing to `main`
auto-deploys; Pages takes ~1-2 min to rebuild.

## Layout (everything at repo root)
- **Pages:** `index.html` (home), `about.html`, `gallery.html`, and six project
  articles: `thrust-stand.html`, `rc-plane.html`, `prop-balancer.html`,
  `battery-tester.html`, `thermal-panel.html`, `lightsaber.html`.
- **Shared:** `style.css` (single stylesheet), `article.js` (Contents-nav scroll-spy
  + gallery lightbox for article pages; builds its own lightbox DOM).
- **Assets:** `img/<project>/` optimized images; `img/me/headshot.jpg`;
  `fonts/` self-hosted woff2; `assets/rc-plane/documents/` PDFs (the only thing left
  in `assets/`); favicons; `CNAME`.
- No framework. JS is optional (progressive enhancement) — pages read fine without it.

## Design system
- CSS variables in `:root`: `--bg #F9F8F4` (bone), `--ink #22201C`,
  `--accent #2F9663` (sage), `--accent-2 #2E84C4` (blue). **Sage = ambient/at-rest,
  blue = interaction/hover.**
- Fonts (self-hosted, `@font-face` at top of `style.css`): **Instrument Serif**
  (display/headings), **Satoshi** (body), **JetBrains Mono** (mono labels/accents).
  `--mono` is ready to swap to Berkeley Mono in one line.
- Aesthetic: centered-minimal, bone background, generous whitespace, hairline rules,
  a CSS-only vertical "ruler" motif in the left margin, restrained sage/blue accents,
  gentle fade-up (`prefers-reduced-motion` respected).

## Writing voice (important)
- Easy-going but serious/professional. **Share the process, not a formal report.**
  Numbers are welcome but not expected; never apologize for not having data.
- **No em dashes or other AI tells.** Keep paragraphs ~2 sentences. For technical
  writeups, reason from **first principles**: problem -> requirements/constraints ->
  derivation -> design -> build -> test/validate -> ship.
- Tone references: solderneer.me, denizen.sh, evis.dev, calum-douglas.com,
  catb.org/~esr (lean, content-first, fast, ages well).

## Article format — the `.story` system
Project articles and About use `<main class="wrap article story">`. The `story` class
gives: centered serif section titles, content blocks centered on one axis, header as
**left-aligned text inside a centered 36rem block**, and the ruler offset removed.
- Each `<section>` that has a `<p class="label">` needs a matching `id`. A
  `<nav class="contents">` (fixed, right side; hidden under ~1300px) lists those
  sections; `article.js` scroll-spies it.
- Include `<script src="article.js"></script>` before `</body>`.
- About also keeps the `about-page` class (headshot header + experience timeline).

## Equations
**Native MathML, no library.** Pattern: `<p class="eq"><math displaystyle="true"> ...
</math></p>`. Use subscripts (`<msub>`), not primes. Inline `<math>` is fine in prose.
`.eq` centers the equation; `math { font-family: math; }` gives the LaTeX-like look.

## Images workflow
1. Drop raw images in **`_incoming/`** (gitignored).
2. Optimize with `sips` (originals are multi-MB — always downscale):
   `sips -Z 1400 -s format jpeg -s formatOptions 80 _incoming/x.png --out img/<project>/<name>.jpg`
3. **EXIF gotcha:** `sips -g pixelWidth/pixelHeight` reports the *unrotated* buffer; the
   browser applies EXIF orientation. Use `mdls -name kMDItemPixelWidth/kMDItemPixelHeight`
   for the true displayed dimensions (the `gallery.html` masonry bakes these as
   `data-ar` so it lays out instantly without flicker).
- **Inline story figure:** `<figure class="sfig"><img ...><figcaption>...</figcaption></figure>`
  — 36rem wide (matches text), centered caption, not clickable.
- **Gallery:** `<div class="gallery">` of
  `<figure><a class="g-link" href="img/<proj>/N.jpg" data-caption="..."><img loading="lazy" decoding="async" ...></a></figure>`.
  `article.js` wires the lightbox (click to enlarge, arrows/keys/swipe, caption + index).

## Content state
- Projects are ordered **latest -> earliest**; part-numbers `001` = earliest. Current
  (dates approximate/placeholder): RC Aircraft (2025, No.006), Thrust Stand (Jun 2024,
  005), Battery Tester (May 2024, 004), Prop Balancer (Feb 2024, 003), Thermal Panel
  (Nov 2023, 002), Lightsaber (Jun 2023, 001).
- `prop-balancer.html` has the **full first-principles rewrite** + a real inline image;
  it is the template. The other five still have short-form content (Summary / The Build /
  Results) and **placeholder gallery captions** — pending the same rewrite.
- Contact email: `jelv268@gmail.com`. Employer names in About link out.

## Conventions / gotchas
- `?v=2` on the `style.css` link (article pages) is a **cache-buster** for local
  `file://` dev. Bump it when CSS changes locally, or strip it for a clean final.
- **Never publish:** `_incoming/`, `IMG_1924.JPG`, `Jose Lara - Resume.pdf`, `.claude/`,
  `*.gdoc` (all gitignored).
- `gallery.html` is **generated by a bash loop** (masonry with baked aspect ratios from
  `mdls`). Regenerate it if project order or images change.
- Deploy check: `curl -s -o /dev/null -w '%{http_code}\n' https://www.jose-lara.com/`.
- End commit messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- Only push to `main` when asked (it deploys live).
