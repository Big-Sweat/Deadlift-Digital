# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this is

Marketing landing site for **Deadlift Digital** — a two-person web studio
(founders Jake Kanning & Jose Moreno) building fixed-price small-business sites
in 14 days. Tagline: *"Websites that pull weight."* Heavy-industrial / gym-floor
aesthetic.

It is a **dependency-free static site**: plain HTML/CSS/JS with pinned vendored
libraries. **There is no build step, no bundler, no `package.json`, no test
suite.** Editing a file and reloading the browser is the entire dev loop.

- **Repo:** github.com/Big-Sweat/Deadlift-Digital
- **Live:** https://big-sweat.github.io/Deadlift-Digital/ — GitHub Pages serves
  the repo root of `main` (`.nojekyll` present). Every push to `main`
  auto-redeploys in ~30s.

## Run it

Any static server works — no framework:

```bash
python -m http.server 5178   # then open http://localhost:5178
```

Or open `index.html` directly. The preconfigured preview server lives in
`.claude/launch.json` (name `deadlift-digital`, port 5178, `autoPort` on).

## Layout

```
index.html          Single page: all markup + inline SVG (plate, logo, dumbbell
                    sprite, smoke filters). Inline JSON-LD in <head>. Importmap
                    maps "three" -> vendor bundle. Loads lenis + main.js (deferred).
styles.css          All CSS. Brand tokens in :root. Knurl texture + grain live in
                    the body background / ::after. Responsive + reduced-motion.
main.js             One IIFE. Interactions, wired via init functions (see below).
                    Config constants at the very top.
js/plate-gl.js      PBR three.js hero plate. Mounts #plate-gl (desktop) /
                    #plate-inline (mobile). Exposes window.__ddPlateGL.
js/chalk-gl.js      Raymarched volumetric chalk-smoke burst on plate impact, with
                    DOM-particle fallback + frame-time watchdog. window.__ddChalkGL.
vendor/             Pinned: three.module.min.js + three.core.min.js (r185),
                    lenis.min.js. Do not edit; loaded via importmap / <script>.
fonts/              Self-hosted woff2: Archivo Black (display), Space Grotesk
                    (body), IBM Plex Mono (labels), Black Ops One (baked into
                    plate textures).
favicon.svg, og-image.jpg (1200x630), robots.txt, sitemap.xml   SEO assets.
claude-code-handoff/  Original design-tool references. Read-only source of truth;
                    do not treat as buildable code.
graphify-out/       Generated knowledge graph. Regenerated, not hand-edited.
.agents/skills/     Vendored agent skills (threejs-*, lenis-smooth-scroll),
                    pinned in skills-lock.json.
```

### `main.js` structure

Single IIFE. `ready()` calls the init functions in order:
`initLenis`, `startClock`, `initMobileNav`, `initMarqueePause`,
`initClickFeedback`, `initHeadlineSplit`, `initScrollReveals`, `initPlate`,
`initWorkPan`, `initForm`. Two config constants at the top:

- `FORM_ENDPOINT` — empty string = `mailto:` fallback (nothing stored, no
  backend). Set to a Formspree/Web3Forms/Getform/Netlify URL to POST
  `{ name, website, email }` as JSON with inline loading/success/error states.
- `CONTACT_EMAIL` — address used by the `mailto:` fallback and JSON-LD.

## Brand tokens (keep consistent)

- **Plate Orange** `--orange: #e85d26` (hover `#ff6d33`, pressed `#d14e1c`)
- **Iron Black** `--iron: #141518` · panels `#17181a` / `#1c1d21`
- **Chalk** `--chalk: #f6f4f0` (text + light sections)
- Rail width `224px`
- Type: Archivo Black (display), Space Grotesk (body), IBM Plex Mono (labels)

## Interactions / motion

Lenis momentum scroll · CSS scroll-driven progress bar · Work section
horizontal-pan-on-scroll (sticky pin, one card per screen on desktop) · click
ring-burst · headline word-split reveal · staggered scroll reveals · marquee ·
mobile nav drawer. Two WebGL contexts (plate + chalk) coexist fine.

**All motion must respect `prefers-reduced-motion`** — the drop, spin, marquee,
and reveals degrade to static. Preserve this when touching animation.

Console dev hooks: `__ddChalk(power)` fires a chalk burst;
`__ddChalkGL.debugFrame(t, power)` renders one frame; `__ddPlateGL` (has `.ok`,
`.setRotation`).

## Conventions & gotchas (learn from these)

- **Fully responsive**; collapses to mobile layout under **1024px** (top bar +
  drawer, inline spinning plate, stacked sections).
- **Accessibility is a requirement, not a nice-to-have.** Keyboard focus states,
  ARIA on the mobile menu, live-region form status, WCAG 2.1 AA conformance are
  already in place — do not regress them.
- **Never put full-viewport background textures in a negative-z-index fixed
  pseudo-element** — it hides the WebGL plate (compositing quirk). Put them in
  the `body` background (deepest layer) instead.
- **CSS specificity trap:** `.rail-nav>a` / `.mnav-inner>a` (0,1,1) clobber
  `.rail-cta` (0,1,0); overrides must use `.rail-nav>a.rail-cta`.
- **Screenshots frequently wedge under the WebGL render loops** (Intel
  iGPU/ANGLE). Verify GL/visual work via pixel readback, `debugFrame`, or
  `getComputedStyle` rather than relying on screenshots.
- Vendor bundles in `vendor/` are minified and pinned — edit source, not these.

## Before-launch placeholders (do not ship as real)

1. Phone `(555) 045-0450` — also in JSON-LD `telephone` (search `5550450450`).
2. Work section: three "ADD SCREENSHOT" cards; founder photos are `JK`/`JM`
   monograms.
3. Contact form defaults to `mailto:` — set `FORM_ENDPOINT` for real submissions.
4. Rail ticker booking month reads `NOW BOOKING · AUG 2026`.
5. On moving to `deadliftdigital.com`: find/replace
   `big-sweat.github.io/Deadlift-Digital/` in the canonical link, OG URLs,
   `sitemap.xml`, and JSON-LD `@id`s.

## Git workflow

- **Commit and push only when explicitly asked.**
- Machine-specific files are gitignored: `.claude/settings.local.json`,
  `.claude/skills/` (symlinks), `graphify-out/.graphify_python` &
  `.graphify_root`.
- Windows LF→CRLF warnings on commit are harmless.
- After nontrivial code changes, the project convention is to refresh the
  knowledge graph with `/graphify --update` (minified vendor bundles are
  recorded but not extracted).
