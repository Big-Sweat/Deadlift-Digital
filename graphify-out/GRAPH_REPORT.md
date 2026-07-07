# Graph Report - .  (2026-07-07)

## Corpus Check
- 3 files · ~87,451 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 234 nodes · 349 edges · 21 communities (14 shown, 7 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.8)
- Token cost: 47,160 input · 3,615 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Design-Tool Runtime Core|Design-Tool Runtime Core]]
- [[_COMMUNITY_Image Slot Component|Image Slot Component]]
- [[_COMMUNITY_Site WebGL & Motion Hub|Site WebGL & Motion Hub]]
- [[_COMMUNITY_Brand & Design Corpus|Brand & Design Corpus]]
- [[_COMMUNITY_Doc Page Component|Doc Page Component]]
- [[_COMMUNITY_Three.js Materials & Loaders|Three.js Materials & Loaders]]
- [[_COMMUNITY_PBR Plate Builder|PBR Plate Builder]]
- [[_COMMUNITY_Rebuilt Site Interactions|Rebuilt Site Interactions]]
- [[_COMMUNITY_Three.js Shaders|Three.js Shaders]]
- [[_COMMUNITY_Plate & Motion System|Plate & Motion System]]
- [[_COMMUNITY_Offers & Teardown Funnel|Offers & Teardown Funnel]]
- [[_COMMUNITY_Lenis Smooth Scroll|Lenis Smooth Scroll]]
- [[_COMMUNITY_Three.js Core Scene|Three.js Core Scene]]
- [[_COMMUNITY_Three.js Geometry|Three.js Geometry]]
- [[_COMMUNITY_Procedural Animation|Procedural Animation]]
- [[_COMMUNITY_Raycasting & Hover|Raycasting & Hover]]
- [[_COMMUNITY_Lighting & Shadows|Lighting & Shadows]]
- [[_COMMUNITY_Post-processing  Bloom|Post-processing / Bloom]]
- [[_COMMUNITY_Orbit Controls|Orbit Controls]]

## God Nodes (most connected - your core abstractions)
1. `ImageSlot` - 25 edges
2. `DocPage` - 16 edges
3. `Deadlift Digital landing page` - 13 edges
4. `Design Session Log (CHAT-LOG)` - 10 edges
5. `Claude Code Handoff Guide` - 9 edges
6. `PBR Three.js hero plate` - 9 edges
7. `walkChildren()` - 7 edges
8. `walk()` - 7 edges
9. `createRuntime()` - 7 edges
10. `Website v2 (fixed-sidebar flagship)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Deadlift Digital landing page` --implements--> `Standalone Site Bundle (main deliverable)`  [INFERRED]
  index.html → claude-code-handoff/Deadlift Digital Site (standalone).html
- `Repo README (static site rebuild guide)` --references--> `Claude Code Handoff Guide`  [INFERRED]
  README.md → claude-code-handoff/README.md
- `Repo README (static site rebuild guide)` --references--> `Pre-Launch Placeholders`  [EXTRACTED]
  README.md → claude-code-handoff/README.md
- `Repo README (static site rebuild guide)` --references--> `Deadlift Digital landing page`  [EXTRACTED]
  README.md → index.html
- `Repo README (static site rebuild guide)` --references--> `Brand Tokens (Plate Orange / Iron Black / Chalk)`  [EXTRACTED]
  README.md → claude-code-handoff/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Three.js keyframe animation pipeline** — _agents_skills_threejs_animation_skill_animationmixer, _agents_skills_threejs_animation_skill_animationclip, _agents_skills_threejs_loaders_skill_gltfloader [EXTRACTED 0.90]
- **PBR rendering: material + IBL + texture maps** — _agents_skills_threejs_materials_skill_meshstandardmaterial, _agents_skills_threejs_lighting_skill_ibl_environment, _agents_skills_threejs_textures_skill_cube_environment_maps [INFERRED 0.85]
- **Brand token system applied across every brand surface** — claude_code_handoff_readme_brand_tokens, claude_code_handoff_deadlift_digital_logos_dc_logo_explorations, claude_code_handoff_deadlift_digital_website_dc_website_v1, claude_code_handoff_deadlift_digital_website_v2_dc_website_v2, claude_code_handoff_deadlift_digital_mobile_dc_mobile_mockup, index_landing_page, claude_code_handoff_marketing_playbook_dc_marketing_playbook, claude_code_handoff_deadlift_digital_site__standalone__bundle [EXTRACTED 1.00]
- **Plate drop + chalk smoke animation pipeline** — claude_code_handoff_chat_log_plate_drop_animation, claude_code_handoff_deadlift_digital_website_v2_dc_componentdidmount, claude_code_handoff_deadlift_digital_website_v2_dc_chalkimpact, claude_code_handoff_deadlift_digital_website_v2_dc_dd_smokefx, index_plate_stage, claude_code_handoff_deadlift_digital_site__standalone__bundle [EXTRACTED 1.00]
- **Free-teardown funnel across marketing copy and site CTAs** — claude_code_handoff_marketing_playbook_dc_free_teardown, claude_code_handoff_marketing_playbook_dc_teardown_funnel, claude_code_handoff_marketing_playbook_dc_offer_ladder, claude_code_handoff_deadlift_digital_website_v2_dc_sendteardown, index_teardown_form [EXTRACTED 1.00]

## Communities (21 total, 7 thin omitted)

### Community 0 - "Design-Tool Runtime Core"
Cohesion: 0.07
Nodes (42): boot(), collectProps(), compileAttr(), compileTemplate(), contentKey(), createComponentFactory(), createExternalModules(), createHelmetManager() (+34 more)

### Community 1 - "Image Slot Component"
Cohesion: 0.12
Nodes (7): flushNow(), getSlot(), ImageSlot, load(), save(), setSlot(), toDataUrl()

### Community 2 - "Site WebGL & Motion Hub"
Cohesion: 0.12
Nodes (22): PBR (physically based rendering) material, Three.js PerspectiveCamera, ShaderMaterial / raymarching fragment shader, Three.js WebGLRenderer, Black Ops One stencil font, js/chalk-gl.js chalk volume renderer, Chalk smoke / raymarched WebGL volume, Deadlift Digital landing page (+14 more)

### Community 3 - "Brand & Design Corpus"
Cohesion: 0.24
Nodes (18): Design Session Log (CHAT-LOG), 45-Plate Badge Mark (1f, chosen), Jake Kanning (Co-founder / Lead Builder), Jose Moreno (Co-founder), Logo Explorations Canvas, Mobile Layout Mockup (iPhone frame), Standalone Site Bundle (main deliverable), Bundler Unpack Loader (+10 more)

### Community 5 - "Three.js Materials & Loaders"
Cohesion: 0.18
Nodes (12): Animation blending / crossfade, AnimationClip / KeyframeTrack, AnimationMixer, Image-Based Lighting (IBL) / environment maps, GLTFLoader, LoadingManager, RGBELoader (HDR), TextureLoader (+4 more)

### Community 6 - "PBR Plate Builder"
Cohesion: 0.35
Nodes (11): build(), drawArcText(), drawPlateMap(), fontFor(), g(), heightToNormal(), initPlateGL(), makeBeanHole() (+3 more)

### Community 8 - "Three.js Shaders"
Cohesion: 0.25
Nodes (8): ShaderMaterial, Custom ShaderPass (screen-space effects), Fragment shader, GLSL noise-based effects, ShaderMaterial (GLSL), Uniforms, Vertex displacement, Render targets

### Community 9 - "Plate & Motion System"
Cohesion: 0.32
Nodes (8): Plate Drop + Chalk Smoke Load Animation, _chalkImpact(power) chalk-smoke particle system, v2 componentDidMount (clock, click FX, split, reveals, plate loop, drop track), dd-smokefx Turbulence Filter (v2), 3D Spinning 45lb Plate Hero, Click Ring-Burst + Heading Jolt, Headline Word-Split Reveal ([data-split]), Staggered Scroll Reveals ([data-reveal])

### Community 11 - "Offers & Teardown Funnel"
Cohesion: 0.33
Nodes (7): v1 Component.renderVals (services/reasons data), v2 renderVals (services/steps/reasons content data), sendTeardown mailto form handler, Free Website Teardown, Offer Ladder (Warm-up / Starter / Heavy / Spotter), Spotter Plan (monthly care), Funnel: SEE, GET, BOOK, BUY, STAY, REFER

### Community 12 - "Lenis Smooth Scroll"
Cohesion: 0.50
Nodes (4): Lenis-GSAP requestAnimationFrame sync, Lenis Smooth Scroll, prefers-reduced-motion accessibility, ReactLenis root provider

### Community 13 - "Three.js Core Scene"
Cohesion: 0.50
Nodes (4): Object3D hierarchy, PerspectiveCamera, Scene, WebGLRenderer

### Community 14 - "Three.js Geometry"
Cohesion: 0.67
Nodes (3): BufferGeometry, Built-in geometries, InstancedMesh

## Knowledge Gaps
- **37 isolated node(s):** `Jake Kanning (Co-founder / Lead Builder)`, `Jose Moreno (Co-founder)`, `v1 Component.renderVals (services/reasons data)`, `sendTeardown mailto form handler`, `Bundler Unpack Loader` (+32 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Deadlift Digital landing page` connect `Site WebGL & Motion Hub` to `Brand & Design Corpus`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `Standalone Site Bundle (main deliverable)` connect `Brand & Design Corpus` to `Plate & Motion System`, `Site WebGL & Motion Hub`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Claude Code Handoff Guide` connect `Brand & Design Corpus` to `Plate & Motion System`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `3D Spinning 45lb Plate Hero`, `Staggered Scroll Reveals ([data-reveal])`, `Headline Word-Split Reveal ([data-split])` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Design-Tool Runtime Core` be split into smaller, more focused modules?**
  _Cohesion score 0.06623376623376623 - nodes in this community are weakly interconnected._
- **Should `Image Slot Component` be split into smaller, more focused modules?**
  _Cohesion score 0.12298387096774194 - nodes in this community are weakly interconnected._
- **Should `Site WebGL & Motion Hub` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._