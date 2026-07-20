# Deadlift Digital — Project Handoff

Snapshot of project state for continuing work in a fresh session/chat.

## What it is
Marketing landing site for **Deadlift Digital**, a two-person web studio (founders Jake Kanning & Jose Moreno). Tagline: "Websites that pull weight." Heavy-industrial / gym-floor aesthetic. Rebuilt from a design-tool handoff into a clean static site.

## Live & repo
- **Repo:** github.com/Big-Sweat/Deadlift-Digital (branch `main`, git user `Big-Sweat`)
- **Live:** https://big-sweat.github.io/Deadlift-Digital/ (GitHub Pages, serves `main` root; `.nojekyll` present). Every push to `main` auto-redeploys in ~30s.
- **No build step.** Plain static files. Python 3.14 + Node 24 available if needed.

## File structure (key)
- `index.html` — single page. Sections: hero, marquee, about, services, process, work, why, mission, contact/footer. Sidebar rail nav (desktop) + sticky topbar & drawer (mobile). JSON-LD is inline in `<head>`.
- `styles.css` — all CSS. Brand tokens in `:root`. Knurl texture + grain in `body` background / `::after`.
- `main.js` — IIFE with init functions: `initLenis, startClock, initMobileNav, initClickFeedback, initHeadlineSplit, initScrollReveals, initPlate, initWorkPan, initForm`. **Config at top:** `FORM_ENDPOINT` (empty => mailto: fallback) and `CONTACT_EMAIL`.
- `js/plate-gl.js` — **PBR three.js hero plate** (built by a collaborator via merged PR #1). Mounts to `#plate-gl` (desktop) / `#plate-inline` (mobile).
- `js/chalk-gl.js` — **raymarched volumetric chalk-smoke** GL burst on plate impact, with DOM-particle fallback + frame-time watchdog.
- `vendor/` — pinned `three.module.min.js` + `three.core.min.js` (r185), `lenis.min.js`. Loaded via importmap (`"three"`).
- `fonts/` — self-hosted woff2: Archivo Black (display), Raleway (body), IBM Plex Mono (labels), Black Ops One (baked into plate textures).
- SEO files: `favicon.svg`, `og-image.jpg` (1200x630), `robots.txt`, `sitemap.xml`.
- `claude-code-handoff/` — original design references (read-only source of truth).
- `graphify-out/` — knowledge graph (234 nodes, 21 communities).

## Brand tokens
`--orange:#e85d26` (hover `#ff6d33`, pressed `#d14e1c`) · `--iron:#141518` · `--chalk:#f6f4f0`. Rail width 224px.

## Interactions / motion
Lenis momentum scroll · CSS scroll-driven progress bar · Work section horizontal-pan-on-scroll (sticky pin, one card per screen on desktop) · click ring-burst (turns Iron Black on orange surfaces, orange on dark) · headline word-split reveal · staggered scroll reveals · marquee · mobile nav drawer. Subtle orange barbell-knurl texture (SVG X-tile) in the body background + grain overlay. All motion respects `prefers-reduced-motion`.

**Two WebGL contexts (plate + chalk) coexist fine.** Dev hooks in console: `__ddChalk(power)` fires a chalk burst, `__ddChalkGL.debugFrame(t,power)` renders one frame, `__ddPlateGL` (has `.ok`, `.setRotation`).

## Skills in use
Jake requested these 5 for the project: `emil-design-eng`, `design-taste-frontend`, `frontend-design`, `graphify`, `claude-obsidian`. Also installed into the repo as agent skills: `lenis-smooth-scroll`, `threejs-*` (10). A Windows `after-effects` skill exists at `~/.claude/skills/after-effects` (runner.ps1 + `AfterFX.exe -r`) but **AE is not installed on this machine**, so it cannot run.

## Environment gotchas (important)
- **Preview screenshots frequently wedge under the WebGL render loops** (Intel iGPU/ANGLE). Verify GL/visual work via `preview_eval` pixel readback, `debugFrame`, `getComputedStyle` — not screenshots (they sometimes work, often time out). Preview server: `.claude/launch.json` name `deadlift-digital`, port 5178.
- **Never put full-viewport background textures in a negative-z-index fixed pseudo-element** — it hid the WebGL plate (compositing quirk). Put them in the `body` background (deepest layer) instead.
- **CSS specificity trap:** `.rail-nav>a` / `.mnav-inner>a` (0,1,1) clobber `.rail-cta` (0,1,0); overrides use `.rail-nav>a.rail-cta`.
- Windows LF->CRLF warnings on commit are harmless.
- ANGLE shader precision warnings (`X4122`) in console are normal for three.js on Windows.

## Open TODOs / placeholders
1. **Phone `(555) 045-0450` is a placeholder** (also in JSON-LD `telephone`). Real NAP/address would strengthen local SEO — add a `PostalAddress`.
2. **Work section: 3 "ADD SCREENSHOT" placeholder cards** need real client screenshots. Founder photos are `JK`/`JM` monograms.
3. **Contact form is in `mailto:` mode** — set `FORM_ENDPOINT` in `main.js` to a Formspree/Web3Forms URL for real submissions.
4. **On moving to `deadliftdigital.com`:** find/replace `big-sweat.github.io/Deadlift-Digital/` in canonical, OG URLs, `sitemap.xml`, and JSON-LD `@id`s.
5. Optional: submit sitemap in Google Search Console; add `FAQPage` schema.
6. Minor: hero plate doesn't re-mount if you resize across the 1024px breakpoint mid-session (loads correctly at native width).
7. After code changes, refresh the knowledge graph with `/graphify --update` (exclude minified vendor bundles — they're recorded but not extracted).

## Git workflow
Commit + push only when asked. Machine-specific files are gitignored: `.claude/settings.local.json`, `.claude/skills/` (symlinks), `graphify-out/.graphify_python` & `.graphify_root`. Commits end with a `Co-Authored-By: Claude ...` trailer.
