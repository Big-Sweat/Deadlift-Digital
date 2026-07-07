# Graph Report - .  (2026-07-07)

## Corpus Check
- 14 files · ~85,286 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 205 nodes · 312 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.78)
- Token cost: 132,194 input · 8,501 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Image Slot Component|Image Slot Component]]
- [[_COMMUNITY_Design-Tool Runtime Core|Design-Tool Runtime Core]]
- [[_COMMUNITY_Brand & Design Corpus|Brand & Design Corpus]]
- [[_COMMUNITY_Doc Page Component|Doc Page Component]]
- [[_COMMUNITY_Three.js Rendering & Shaders|Three.js Rendering & Shaders]]
- [[_COMMUNITY_Rebuilt Site Interactions|Rebuilt Site Interactions]]
- [[_COMMUNITY_Three.js Materials & Loaders|Three.js Materials & Loaders]]
- [[_COMMUNITY_Template Walker Compiler|Template Walker Compiler]]
- [[_COMMUNITY_Runtime Factories|Runtime Factories]]
- [[_COMMUNITY_Plate & Motion System|Plate & Motion System]]
- [[_COMMUNITY_DC Document Bootstrap|DC Document Bootstrap]]
- [[_COMMUNITY_Offers & Teardown Funnel|Offers & Teardown Funnel]]
- [[_COMMUNITY_Lenis Smooth Scroll|Lenis Smooth Scroll]]
- [[_COMMUNITY_Three.js Geometry|Three.js Geometry]]
- [[_COMMUNITY_CSS Style Utilities|CSS Style Utilities]]
- [[_COMMUNITY_Lighting & Shadows|Lighting & Shadows]]
- [[_COMMUNITY_Post-processing  Bloom|Post-processing / Bloom]]
- [[_COMMUNITY_Orbit Controls|Orbit Controls]]

## God Nodes (most connected - your core abstractions)
1. `ImageSlot` - 25 edges
2. `DocPage` - 16 edges
3. `Design Session Log (CHAT-LOG)` - 10 edges
4. `Claude Code Handoff Guide` - 9 edges
5. `Chalk smoke / raymarched WebGL volume` - 8 edges
6. `walkChildren()` - 7 edges
7. `walk()` - 7 edges
8. `createRuntime()` - 7 edges
9. `Website v2 (fixed-sidebar flagship)` - 7 edges
10. `compileAttr()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Chalk smoke / raymarched WebGL volume` --conceptually_related_to--> `Clock and animation loop`  [INFERRED]
  index.html → .agents/skills/threejs-fundamentals/SKILL.md
- `Chalk smoke / raymarched WebGL volume` --implements--> `ShaderMaterial`  [INFERRED]
  index.html → .agents/skills/threejs-materials/SKILL.md
- `Chalk smoke / raymarched WebGL volume` --conceptually_related_to--> `GLSL noise-based effects`  [INFERRED]
  index.html → .agents/skills/threejs-shaders/SKILL.md
- `Repo README (static site rebuild guide)` --references--> `Claude Code Handoff Guide`  [INFERRED]
  README.md → claude-code-handoff/README.md
- `Repo README (static site rebuild guide)` --references--> `Pre-Launch Placeholders`  [EXTRACTED]
  README.md → claude-code-handoff/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Chalk WebGL volume rendered via Three.js shader stack** — index_chalk_smoke_volume, _agents_skills_threejs_shaders_skill_shadermaterial, _agents_skills_threejs_shaders_skill_fragment_shader, _agents_skills_threejs_fundamentals_skill_webglrenderer [INFERRED 0.85]
- **Three.js keyframe animation pipeline** — _agents_skills_threejs_animation_skill_animationmixer, _agents_skills_threejs_animation_skill_animationclip, _agents_skills_threejs_loaders_skill_gltfloader [EXTRACTED 0.90]
- **PBR rendering: material + IBL + texture maps** — _agents_skills_threejs_materials_skill_meshstandardmaterial, _agents_skills_threejs_lighting_skill_ibl_environment, _agents_skills_threejs_textures_skill_cube_environment_maps [INFERRED 0.85]
- **Brand token system applied across every brand surface** — claude_code_handoff_readme_brand_tokens, claude_code_handoff_deadlift_digital_logos_dc_logo_explorations, claude_code_handoff_deadlift_digital_website_dc_website_v1, claude_code_handoff_deadlift_digital_website_v2_dc_website_v2, claude_code_handoff_deadlift_digital_mobile_dc_mobile_mockup, index_landing_page, claude_code_handoff_marketing_playbook_dc_marketing_playbook, claude_code_handoff_deadlift_digital_site__standalone__bundle [EXTRACTED 1.00]
- **Plate drop + chalk smoke animation pipeline** — claude_code_handoff_chat_log_plate_drop_animation, claude_code_handoff_deadlift_digital_website_v2_dc_componentdidmount, claude_code_handoff_deadlift_digital_website_v2_dc_chalkimpact, claude_code_handoff_deadlift_digital_website_v2_dc_dd_smokefx, index_plate_stage, claude_code_handoff_deadlift_digital_site__standalone__bundle [EXTRACTED 1.00]
- **Free-teardown funnel across marketing copy and site CTAs** — claude_code_handoff_marketing_playbook_dc_free_teardown, claude_code_handoff_marketing_playbook_dc_teardown_funnel, claude_code_handoff_marketing_playbook_dc_offer_ladder, claude_code_handoff_deadlift_digital_website_v2_dc_sendteardown, index_teardown_form [EXTRACTED 1.00]

## Communities (19 total, 5 thin omitted)

### Community 0 - "Image Slot Component"
Cohesion: 0.12
Nodes (7): flushNow(), getSlot(), ImageSlot, load(), save(), setSlot(), toDataUrl()

### Community 1 - "Design-Tool Runtime Core"
Cohesion: 0.11
Nodes (10): compileTemplate(), encodeCase(), findTopLevelEquality(), isElementClass(), isRenderableType(), loadReactUmd(), loadScript(), parensWrapWhole() (+2 more)

### Community 2 - "Brand & Design Corpus"
Cohesion: 0.18
Nodes (22): Pointer hover effects, Raycaster, Design Session Log (CHAT-LOG), 45-Plate Badge Mark (1f, chosen), Jake Kanning (Co-founder / Lead Builder), Jose Moreno (Co-founder), Logo Explorations Canvas, Mobile Layout Mockup (iPhone frame) (+14 more)

### Community 4 - "Three.js Rendering & Shaders"
Cohesion: 0.16
Nodes (16): Procedural animation (spring, smoothDamp, oscillation), Clock and animation loop, Object3D hierarchy, PerspectiveCamera, Scene, WebGLRenderer, ShaderMaterial, Custom ShaderPass (screen-space effects) (+8 more)

### Community 6 - "Three.js Materials & Loaders"
Cohesion: 0.18
Nodes (12): Animation blending / crossfade, AnimationClip / KeyframeTrack, AnimationMixer, Image-Based Lighting (IBL) / environment maps, GLTFLoader, LoadingManager, RGBELoader (HDR), TextureLoader (+4 more)

### Community 7 - "Template Walker Compiler"
Cohesion: 0.36
Nodes (11): collectProps(), compileAttr(), contentKey(), walk(), walkChildren(), walkComponent(), walkElement(), walkFor() (+3 more)

### Community 8 - "Runtime Factories"
Cohesion: 0.20
Nodes (10): createComponentFactory(), createExternalModules(), createHelmetManager(), createPseudoSheet(), createRegistry(), createRuntime(), createStreamTracker(), evalDcLogic() (+2 more)

### Community 9 - "Plate & Motion System"
Cohesion: 0.32
Nodes (8): Plate Drop + Chalk Smoke Load Animation, _chalkImpact(power) chalk-smoke particle system, v2 componentDidMount (clock, click FX, split, reveals, plate loop, drop track), dd-smokefx Turbulence Filter (v2), 3D Spinning 45lb Plate Hero, Click Ring-Burst + Heading Jolt, Headline Word-Split Reveal ([data-split]), Staggered Scroll Reveals ([data-reveal])

### Community 11 - "DC Document Bootstrap"
Cohesion: 0.25
Nodes (8): boot(), dcNameFromPath(), getReactDOM(), parseDataProps(), parseDcDocument(), parseDcText(), rootNameForDocument(), safeDecode()

### Community 12 - "Offers & Teardown Funnel"
Cohesion: 0.33
Nodes (7): v1 Component.renderVals (services/reasons data), v2 renderVals (services/steps/reasons content data), sendTeardown mailto form handler, Free Website Teardown, Offer Ladder (Warm-up / Starter / Heavy / Spotter), Spotter Plan (monthly care), Funnel: SEE, GET, BOOK, BUY, STAY, REFER

### Community 13 - "Lenis Smooth Scroll"
Cohesion: 0.40
Nodes (5): Lenis-GSAP requestAnimationFrame sync, Lenis Smooth Scroll, prefers-reduced-motion accessibility, ReactLenis root provider, Lenis momentum smooth scrolling

### Community 14 - "Three.js Geometry"
Cohesion: 0.67
Nodes (3): BufferGeometry, Built-in geometries, InstancedMesh

### Community 15 - "CSS Style Utilities"
Cohesion: 0.67
Nodes (3): cssToObj(), hostPositionStyle(), kebabToCamel()

## Knowledge Gaps
- **23 isolated node(s):** `Jake Kanning (Co-founder / Lead Builder)`, `Jose Moreno (Co-founder)`, `v1 Component.renderVals (services/reasons data)`, `sendTeardown mailto form handler`, `Bundler Unpack Loader` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Deadlift Digital Landing Page` connect `Brand & Design Corpus` to `Three.js Rendering & Shaders`, `Lenis Smooth Scroll`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Standalone Site Bundle (main deliverable)` connect `Brand & Design Corpus` to `Plate & Motion System`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Chalk smoke / raymarched WebGL volume` connect `Three.js Rendering & Shaders` to `Brand & Design Corpus`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Chalk smoke / raymarched WebGL volume` (e.g. with `Clock and animation loop` and `WebGLRenderer`) actually correct?**
  _`Chalk smoke / raymarched WebGL volume` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `3D Spinning 45lb Plate Hero`, `Staggered Scroll Reveals ([data-reveal])`, `Headline Word-Split Reveal ([data-split])` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Image Slot Component` be split into smaller, more focused modules?**
  _Cohesion score 0.12298387096774194 - nodes in this community are weakly interconnected._
- **Should `Design-Tool Runtime Core` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._