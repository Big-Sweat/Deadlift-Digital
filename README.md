# Deadlift Digital

Marketing site for Deadlift Digital — a two-person web studio building fixed-price
sites for small businesses in 14 days. **Websites that pull weight.**

Rebuilt from the design-tool reference in `claude-code-handoff/` into a clean,
dependency-free static site.

## Run it

No build step, no server framework. Any static server works:

```bash
python -m http.server 5178
# then open http://localhost:5178
```

Or just open `index.html` directly in a browser.

## Structure

```
index.html      All markup + inline SVGs (plate, logo, dumbbell sprite)
styles.css      Design system, keyframes, grain overlay, responsive + reduced-motion
main.js         Clock, click feedback, headline split, scroll reveals, 3D plate
                (drop + spin + chalk smoke), mobile nav drawer, contact form
fonts/          Self-hosted woff2 (Archivo Black, Raleway, IBM Plex Mono)
```

## Brand tokens

- **Plate Orange** `#e85d26` (hover `#ff6d33`, pressed `#d14e1c`)
- **Iron Black** `#141518` · panels `#17181a` / `#1c1d21`
- **Chalk** `#f6f4f0` (text + light sections)
- Type: Archivo Black (display), Raleway (body), IBM Plex Mono (labels)

## Wiring the contact form

By default the teardown form opens the visitor's email app (`mailto:`) — nothing is
stored, no backend needed. To collect submissions instead, set one constant at the
top of `main.js`:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx'; // Formspree, Web3Forms, Getform, Netlify Forms…
```

When set, the form POSTs `{ name, website, email }` as JSON and shows inline
loading / success / error states. Leave it empty to keep the `mailto:` behaviour.
Update `CONTACT_EMAIL` in the same file if the address changes.

## Before launch (placeholders to replace)

- **Work screenshots** — the three "ADD SCREENSHOT" tiles in `#work` (swap for real `<img>`).
- **Founder photos** — the `JK` / `JM` monograms in the mission section.
- **Phone number** — `(555) 045-0450` (search `5550450450` and the display string).
- **Booking month** — the rail ticker reads `NOW BOOKING · AUG 2026`.

## Notes

- Fully responsive; collapses to the mobile layout under 1024px (top bar + drawer,
  inline spinning plate, stacked sections).
- Respects `prefers-reduced-motion` (drop, spin, marquee, and reveals degrade to static).
- Accessible: keyboard focus states, ARIA on the mobile menu, live-region form status.
