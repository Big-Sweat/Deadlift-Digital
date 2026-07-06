# Deadlift Digital — Claude Code handoff

Start here. This folder is a complete snapshot of a design project built in an HTML design tool. Read `CHAT-LOG.md` for the full session history (what was asked for, what was decided, and why).

## What this is

Deadlift Digital is a two-person web studio (founders Jake & Jose) that builds fixed-price websites for small businesses in 14 days. Tagline: **"Websites that pull weight."** The designs here are **high-fidelity references** — final colors, type, spacing, copy, and animation specs. Recreate them in your target stack; don't ship the design-tool files as-is.

## Files

| File | What it is |
|---|---|
| `Deadlift Digital Site (standalone).html` | **The main deliverable.** Full desktop site bundled into one self-contained file — open directly in any browser, no server needed. Includes the latest load animation (plate drop + chalk smoke). Best file to iterate on or extract from. |
| `Deadlift Digital Website v2.dc.html` | Source of the standalone file, in design-tool format (template + logic class). Needs `support.js` beside it to open. Easiest place to READ the markup/JS cleanly. |
| `Deadlift Digital Website.dc.html` | Earlier v1 layout (top-nav, centered). Reference only. |
| `Deadlift Digital Mobile.dc.html` | Mobile layout mockup — use as the responsive/breakpoint reference. |
| `Deadlift Digital Logos.dc.html` | Logo explorations. Chosen mark: the "45-plate" badge — concentric rings with an orange core. |
| `Marketing Playbook.dc.html` | Positioning, offers, channels, and funnel copy. |
| `support.js`, `image-slot.js`, `doc-page.js`, `ios-frame.jsx` | Design-tool runtime helpers so the `.dc.html` files open in a browser. Not production code. |

## Brand tokens

- **Plate Orange** `#E85D26` (hover `#FF6D33`, pressed `#D14E1C`)
- **Iron Black** `#141518` (page bg), panels `#17181A`
- **Chalk** `#F6F4F0` (text + light sections); muted text = chalk at 40–75% alpha
- Fonts (Google): **Archivo Black** (headlines, tight letter-spacing −1.5px to −4px), **Space Grotesk** (body/UI), **IBM Plex Mono** (labels/eyebrows, letter-spacing 2–3px)
- Grain: fixed full-viewport SVG fractal-noise overlay at 5% opacity, `mix-blend-mode: overlay`
- Voice: plainspoken, gym-floor direct. No jargon.

## Site structure (v2 desktop)

Fixed left sidebar (224px: logo, numbered mono nav, orange CTA button, live clock ticker) + main column: Hero (3D spinning 45lb plate, fixed at viewport center behind content) → orange marquee strip (rotated −1°) → About (+ stat grid) → Services (light `#F6F4F0` section, 5 numbered rows) → Process (4 steps) → Work (placeholder cards) → Why-us (6 reasons) → Contact/footer (teardown form → `mailto:`, contact links, clock).

## Signature interactions (recreate these)

- **Load: plate drop + chalk smoke.** The 3D plate free-falls from −120vh (gravity easing), slams at viewport center, bounces twice (−32px, −9px rebounds over a 1.25s WAAPI keyframe track), and a chalk pile at its base bursts into a smoke cloud. Cloud = layered DOM particles animated with WAAPI: dense core mound, ~9 clusters of 3–4 overlapping blurred blob lobes (irregular border-radius, 3–5.6s lifetimes), flat ground-hugging surge clouds, 5–8s lingering haze, fine grit specks on gravity arcs — all warped by an SVG `feTurbulence` + `feDisplacementMap` filter on the particle container for wispy edges. Impact also fires a camera-shake keyframe (`dd-shake`) on the sidebar + hero copy; a smaller burst (0.3 power) fires on the first rebound. Skipped under `prefers-reduced-motion`. Toggleable via `plateDrop` flag.
- **3D plate idle:** continuous rotateY spin (rAF, ~0.008°/ms) + scroll-linked rotation (`scrollY * 0.22°`); plate is a preserve-3d stack (front/back SVG faces + 13 rim layers).
- **Scroll reveals:** `[data-reveal]` elements rise 26px + fade, staggered 90ms by index (IntersectionObserver).
- **Headline word-split:** `[data-split]` headlines animate word-by-word from a masked translateY(115%).
- **Click feedback:** orange ring burst at cursor + subtle "jolt" scale on nearby headings.
- **Marquee:** infinite 30s linear loop, duplicated content.
- Hover states throughout: orange (`#E85D26`/`#FF6D33`) on links, buttons, borders.

## Known placeholders

- Phone `(555) 045-0450`; "Project name" work cards; founder photos (drag-drop image slots).
- Teardown form only opens `mailto:jake@deadliftdigital.com` — no backend.

## Suggested first prompt

> Rebuild `Deadlift Digital Site (standalone).html` as a clean static site (index.html + css + js). Keep the design pixel-identical, port the load animation (plate drop + chalk smoke) and scroll interactions, make it responsive using `Deadlift Digital Mobile.dc.html` as the breakpoint reference, and wire the teardown form to a real endpoint. See CHAT-LOG.md for design intent and decisions.
