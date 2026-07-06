# Session log — Deadlift Digital design project

A chronological record of the design conversation, written for Claude Code (or any developer/agent) to pick up where the design tool left off. Early phases are summarized; recent animation work is captured in detail. Verbatim transcript is not available — this is a faithful reconstruction of requests, decisions, and outcomes.

---

## Phase 1 — Brand & logo

**Request:** A brand for "Deadlift Digital," a two-founder (Jake & Jose) web studio building fixed-price small-business websites in 14 days.

**Outcome (`Deadlift Digital Logos.dc.html`):**
- Explored several marks; **chosen: the "45-plate" badge** — concentric circles reading as a barbell plate, orange core (`#E85D26`), chalk-white rings on iron black.
- Locked brand tokens: Plate Orange `#E85D26`, Iron Black `#141518`/`#17181A`, Chalk `#F6F4F0`; Archivo Black / Space Grotesk / IBM Plex Mono.
- Voice: gym-floor direct, zero jargon. Tagline: "Websites that pull weight."

## Phase 2 — Website v1

**Outcome (`Deadlift Digital Website.dc.html`):** First full landing page. Centered layout, top-level hero, contact section with orange button CTAs (`mailto:` + `tel:`). Superseded by v2 but kept as reference.

## Phase 3 — Website v2 (current flagship)

**Request:** A stronger, more distinctive layout.

**Outcome (`Deadlift Digital Website v2.dc.html`):**
- **Fixed 224px left sidebar:** logo lockup, numbered mono nav (ABOUT / SERVICES / PROCESS / WORK / WHY / CONTACT), orange "free teardown" CTA, live local-time ticker.
- **Hero:** giant Archivo Black "DEADLIFT" (solid) / "DIGITAL" (outline stroke), mono orange eyebrow, two CTAs, three proof points (fixed price / 14 days / two founders). Behind it, a **3D 45lb plate** fixed at viewport center: front+back SVG faces with circumferential "DEADLIFT DIGITAL · WEBSITES THAT PULL WEIGHT · EST 2026" text, 13 stacked rim layers (preserve-3d), idle rotateY spin via rAF plus scroll-linked rotation (`scrollY * 0.22°`).
- **Sections:** rotated orange marquee ("WE DO THE HEAVY LIFTING…" with barbell glyphs) → About + 4-stat grid → Services (light `#F6F4F0` background, 5 numbered offer rows) → Process (4 steps: Teardown → Build → Launch → Spotter) → Work (placeholder project cards) → Why-us (6 reasons) → Contact footer (teardown form posting via `mailto:`, contact links, clock, mini footer nav).
- **Interaction layer:** IntersectionObserver scroll reveals (`[data-reveal]`, 90ms stagger), word-by-word masked headline splits (`[data-split]`), click ring-burst + heading jolt, grain overlay, custom selection color.
- Tweakable flags exposed: `plateSpin`, `showMarquee`, `showTicker` (later + `plateDrop`).

## Phase 4 — Mobile mockup

**Outcome (`Deadlift Digital Mobile.dc.html`):** Mobile layout in an iPhone frame (`ios-frame.jsx`) — use as the responsive breakpoint reference when porting.

## Phase 5 — Marketing playbook

**Outcome (`Marketing Playbook.dc.html`):** Positioning, offer ladder (free teardown → Starter build → Heavy build → Get found on Google → Spotter plan), channels, and funnel copy. Content source for any marketing pages.

## Phase 6 — First handoff + standalone bundle

**Outcome:** Site bundled into `Deadlift Digital Site (standalone).html` (single self-contained file) with `README-CLAUDE-CODE.md` notes. (That bundle has since been regenerated — see Phase 8.)

## Phase 7 — Small Q&A

- Confirmed the brand orange hex: **`#E85D26`**.
- A suspected accidental edit to the footer contact links turned out to be a no-op — file verified identical to intended state; nothing changed.

## Phase 8 — Hero load animation (three iterations, current state)

**Request 1:** "When the page loads, the plate should drop in, hit the ground, and land on a pile of grip chalk that bursts into a cloud and disappears."

**Built:**
- Plate wrapped in a drop wrapper starting at `translateY(-120vh)`; on mount a WAAPI keyframe track (1250ms + 250ms delay) drops it with gravity easing `cubic-bezier(.6,0,.95,.45)`, impact at 56% offset, then rebounds of −32px and −9px before settling.
- A static **chalk pile** (layered blurred ellipses + speckles) sits at the plate's landing point; on impact it squashes/fades and a particle burst fires from a container at the ground point.
- **Camera thud:** `dd-shake` keyframes applied to `[data-shake]` elements (sidebar + hero copy) at each impact; secondary impact runs at 0.3 power on the first rebound.
- Respects `prefers-reduced-motion` (plate rendered in place, pile hidden). New tweak flag: **`plateDrop`** (boolean, default true).

**Request 2:** "Make the chalk last longer and look more realistic."

**Changed:** Layered system — core flash, 22 billowing puffs with violent-burst-then-slow-drift keyframes (2.4–4.8s), 8 ground-hugging surge clouds, 4 lingering haze clouds (4–6s), 26 grit specks on gravity arcs.

**Request 3:** "More like a cloud of smoke, less cartoony." *(final, current state)*

**Changed:**
- Replaced discrete bright circles with **~9 clusters of 3–4 overlapping dim lobes** (irregular 8-corner border-radius blobs, blur 9–15px, alpha ~0.18–0.33 each) so density comes from overlap, not bright edges; lobes tumble (rotate), expand continuously, and thin out over 3–5.6s.
- Added an **SVG turbulence filter** (`feTurbulence baseFrequency 0.011/0.017, 3 octaves` + `feDisplacementMap scale 34`, filter id `dd-smokefx`) applied to a 1600×780px particle container, warping the whole cloud into wisps.
- Replaced the comic shockwave ring with a **flat ground wash** ellipse; core is now a dense rising mound; haze dimmed (alpha ~0.10–0.19, blur 18px) and lengthened to 5.2–8.2s; grit reduced to 16 finer, dimmer specks; pile scatter softened.

**Where the animation code lives:** in `Deadlift Digital Website v2.dc.html` — template: drop wrapper, chalk pile markup, `dd-smokefx` SVG filter, burst container (search `chalkPileRef` / `plateDropRef` / `chalkBurstRef`); logic: `componentDidMount` (drop track + impact timers) and `_chalkImpact(power)` (all particle spawning). Keyframes `dd-shake` etc. are in the `<helmet>` style block. The standalone bundle includes all of it.

---

## Current state & open threads

- **Done:** brand, logo, v2 desktop site with full interaction/animation layer, mobile mockup, marketing playbook, fresh standalone bundle.
- **Placeholders to replace:** phone `(555) 045-0450`, "Project name" work cards, founder photos (image slots).
- **Not built yet:** real form backend (currently `mailto:`), responsive/production build, deployment, real project imagery.
- **Natural next steps in Claude Code:** port to a clean static or framework build, merge desktop + mobile into one responsive implementation, port the load/scroll animations (all WAAPI + IntersectionObserver — no libraries needed), wire the form.
