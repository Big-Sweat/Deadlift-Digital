# Graph Report - .  (2026-07-06)

## Corpus Check
- Corpus is ~40,022 words - fits in a single context window. You may not need a graph.

## Summary
- 160 nodes · 279 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.83)
- Token cost: 184,327 input · 14,686 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Image Slot Component|Image Slot Component]]
- [[_COMMUNITY_Design-Tool Runtime Core|Design-Tool Runtime Core]]
- [[_COMMUNITY_Brand & Design Corpus|Brand & Design Corpus]]
- [[_COMMUNITY_Doc Page Component|Doc Page Component]]
- [[_COMMUNITY_Template Walker Compiler|Template Walker Compiler]]
- [[_COMMUNITY_Plate & Motion System|Plate & Motion System]]
- [[_COMMUNITY_Runtime Factories|Runtime Factories]]
- [[_COMMUNITY_Rebuilt Site Interactions|Rebuilt Site Interactions]]
- [[_COMMUNITY_Offers & Teardown Funnel|Offers & Teardown Funnel]]
- [[_COMMUNITY_DC Document Bootstrap|DC Document Bootstrap]]
- [[_COMMUNITY_CSS Style Utilities|CSS Style Utilities]]

## God Nodes (most connected - your core abstractions)
1. `ImageSlot` - 25 edges
2. `DocPage` - 16 edges
3. `index.html — Production Landing Page` - 11 edges
4. `Design Session Log (CHAT-LOG)` - 10 edges
5. `Claude Code Handoff Guide` - 9 edges
6. `walkChildren()` - 7 edges
7. `walk()` - 7 edges
8. `createRuntime()` - 7 edges
9. `Plate Drop + Chalk Smoke Load Animation` - 7 edges
10. `45-Plate Badge Mark (1f, chosen)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `index.html — Production Landing Page` --implements--> `Headline Word-Split Reveal ([data-split])`  [INFERRED]
  index.html → claude-code-handoff/README.md
- `index.html — Production Landing Page` --implements--> `Staggered Scroll Reveals ([data-reveal])`  [INFERRED]
  index.html → claude-code-handoff/README.md
- `dd-smokefx Smoke Displacement Filter (index sprite)` --semantically_similar_to--> `dd-smokefx Turbulence Filter (v2)`  [INFERRED] [semantically similar]
  index.html → claude-code-handoff/Deadlift Digital Website v2.dc.html
- `Teardown Contact Form (#teardown-form)` --semantically_similar_to--> `sendTeardown mailto form handler`  [INFERRED] [semantically similar]
  index.html → claude-code-handoff/Deadlift Digital Website v2.dc.html
- `index.html — Production Landing Page` --implements--> `Offer Ladder (Warm-up / Starter / Heavy / Spotter)`  [INFERRED]
  index.html → claude-code-handoff/Marketing Playbook.dc.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand token system applied across every brand surface** — claude_code_handoff_readme_brand_tokens, claude_code_handoff_deadlift_digital_logos_dc_logo_explorations, claude_code_handoff_deadlift_digital_website_dc_website_v1, claude_code_handoff_deadlift_digital_website_v2_dc_website_v2, claude_code_handoff_deadlift_digital_mobile_dc_mobile_mockup, index_landing_page, claude_code_handoff_marketing_playbook_dc_marketing_playbook, claude_code_handoff_deadlift_digital_site__standalone__bundle [EXTRACTED 1.00]
- **Plate drop + chalk smoke animation pipeline** — claude_code_handoff_chat_log_plate_drop_animation, claude_code_handoff_deadlift_digital_website_v2_dc_componentdidmount, claude_code_handoff_deadlift_digital_website_v2_dc_chalkimpact, claude_code_handoff_deadlift_digital_website_v2_dc_dd_smokefx, index_plate_stage, claude_code_handoff_deadlift_digital_site__standalone__bundle [EXTRACTED 1.00]
- **Free-teardown funnel across marketing copy and site CTAs** — claude_code_handoff_marketing_playbook_dc_free_teardown, claude_code_handoff_marketing_playbook_dc_teardown_funnel, claude_code_handoff_marketing_playbook_dc_offer_ladder, claude_code_handoff_deadlift_digital_website_v2_dc_sendteardown, index_teardown_form [EXTRACTED 1.00]

## Communities (12 total, 2 thin omitted)

### Community 0 - "Image Slot Component"
Cohesion: 0.12
Nodes (7): flushNow(), getSlot(), ImageSlot, load(), save(), setSlot(), toDataUrl()

### Community 1 - "Design-Tool Runtime Core"
Cohesion: 0.11
Nodes (10): compileTemplate(), encodeCase(), findTopLevelEquality(), isElementClass(), isRenderableType(), loadReactUmd(), loadScript(), parensWrapWhole() (+2 more)

### Community 2 - "Brand & Design Corpus"
Cohesion: 0.26
Nodes (19): Design Session Log (CHAT-LOG), 45-Plate Badge Mark (1f, chosen), Jake Kanning (Co-founder / Lead Builder), Jose Moreno (Co-founder), Logo Explorations Canvas, Mobile Layout Mockup (iPhone frame), Standalone Site Bundle (main deliverable), Bundler Unpack Loader (+11 more)

### Community 4 - "Template Walker Compiler"
Cohesion: 0.36
Nodes (11): collectProps(), compileAttr(), contentKey(), walk(), walkChildren(), walkComponent(), walkElement(), walkFor() (+3 more)

### Community 5 - "Plate & Motion System"
Cohesion: 0.29
Nodes (10): Plate Drop + Chalk Smoke Load Animation, _chalkImpact(power) chalk-smoke particle system, v2 componentDidMount (clock, click FX, split, reveals, plate loop, drop track), dd-smokefx Turbulence Filter (v2), 3D Spinning 45lb Plate Hero, Click Ring-Burst + Heading Jolt, Headline Word-Split Reveal ([data-split]), Staggered Scroll Reveals ([data-reveal]) (+2 more)

### Community 6 - "Runtime Factories"
Cohesion: 0.20
Nodes (10): createComponentFactory(), createExternalModules(), createHelmetManager(), createPseudoSheet(), createRegistry(), createRuntime(), createStreamTracker(), evalDcLogic() (+2 more)

### Community 8 - "Offers & Teardown Funnel"
Cohesion: 0.32
Nodes (8): v1 Component.renderVals (services/reasons data), v2 renderVals (services/steps/reasons content data), sendTeardown mailto form handler, Free Website Teardown, Offer Ladder (Warm-up / Starter / Heavy / Spotter), Spotter Plan (monthly care), Funnel: SEE, GET, BOOK, BUY, STAY, REFER, Teardown Contact Form (#teardown-form)

### Community 10 - "DC Document Bootstrap"
Cohesion: 0.25
Nodes (8): boot(), dcNameFromPath(), getReactDOM(), parseDataProps(), parseDcDocument(), parseDcText(), rootNameForDocument(), safeDecode()

### Community 11 - "CSS Style Utilities"
Cohesion: 0.67
Nodes (3): cssToObj(), hostPositionStyle(), kebabToCamel()

## Knowledge Gaps
- **3 isolated node(s):** `v1 Component.renderVals (services/reasons data)`, `Bundler Unpack Loader`, `Funnel: SEE, GET, BOOK, BUY, STAY, REFER`
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html — Production Landing Page` connect `Brand & Design Corpus` to `Offers & Teardown Funnel`, `Plate & Motion System`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Offer Ladder (Warm-up / Starter / Heavy / Spotter)` connect `Offers & Teardown Funnel` to `Brand & Design Corpus`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `index.html — Production Landing Page` (e.g. with `45-Plate Badge Mark (1f, chosen)` and `Mobile Layout Mockup (iPhone frame)`) actually correct?**
  _`index.html — Production Landing Page` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Click Ring-Burst + Heading Jolt`, `v1 Component.renderVals (services/reasons data)`, `Bundler Unpack Loader` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Image Slot Component` be split into smaller, more focused modules?**
  _Cohesion score 0.12298387096774194 - nodes in this community are weakly interconnected._
- **Should `Design-Tool Runtime Core` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._