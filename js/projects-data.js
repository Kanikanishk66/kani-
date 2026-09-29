/**
 * Kani Vision Studio - Portfolio Projects & Case Studies Data
 * All projects are honestly labeled as Concept / Personal / Studio R&D projects.
 */

export const projectsData = [
  {
    id: "project-01",
    slug: "futuristic-product-visualization",
    title: "Futuristic Product Visualization",
    category: "3D",
    categoryLabel: "3D Modeling / Rendering",
    projectType: "Concept Project",
    year: "2025",
    shortDesc: "High-precision hard-surface CAD modeling and cinematic raytraced rendering of an experimental cybernetic audio interface.",
    heroImage: "assets/images/project-01-product.svg",
    aspectRatio: "16:9",
    featured: true,
    tags: ["Blender", "Cycles", "Hard Surface", "Substance 3D", "Lighting"],
    concept: {
      theIdea: "The goal of this project was to design a futuristic next-generation spatial audio processor. The challenge was combining organic ergonomic contours with precision industrial aerospace materials, creating an object that feels both tactile and technologically advanced.",
      processSteps: [
        {
          phase: "01 — Reference & Research",
          desc: "Studied high-end audio DACs, carbon fiber textures, aerospace ergonomics, and tactile knurled dials."
        },
        {
          phase: "02 — 3D CAD & Topology",
          desc: "Subdivision surface modeling with clean quad topology in Blender, ensuring smooth curvature and bevel highlights."
        },
        {
          phase: "03 — Materials & Shading",
          desc: "Custom procedural shaders: anodized matte titanium, optical crystal glass with light dispersion, and brushed brass details."
        },
        {
          phase: "04 — Studio Lighting & Camera",
          desc: "Three-point studio lighting with high-contrast rim lights and soft top softboxes for dramatic specular highlights."
        },
        {
          phase: "05 — Final Post & Color",
          desc: "Multi-pass EXR compositing, chromatic aberration tuning, bloom, and micro-surface dust imperfections for hyper-realism."
        }
      ],
      tools: ["Blender 4.2", "Cycles Engine", "Adobe Photoshop", "PureRef"],
      deliverables: ["4K Hero Still Renders", "360 Turntable Sequence", "Wireframe Breakdown Renders", "Material Breakdown Sheet"],
      gallery: [
        { title: "Hero Isometric View", image: "assets/images/project-01-product.svg", caption: "Titanium chassis with optical glass volume core." },
        { title: "Wireframe Topology", image: "assets/images/3d-stages-wireframe.svg", caption: "Clean quad-dominant topology optimized for curvature." },
        { title: "Clay Material Pass", image: "assets/images/3d-stages-material.svg", caption: "Ambient occlusion and surface form validation." }
      ]
    }
  },
  {
    id: "project-02",
    slug: "mobile-app-interface",
    title: "Mobile App Interface",
    category: "UI/UX",
    categoryLabel: "UI/UX Design",
    projectType: "Concept Project",
    year: "2025",
    shortDesc: "End-to-end interface and interaction design for Lumina Spatial OS, a spatial computing companion application.",
    heroImage: "assets/images/project-02-mobile.svg",
    aspectRatio: "16:9",
    featured: true,
    tags: ["Figma", "UI Design", "Design System", "Prototyping", "UX Architecture"],
    concept: {
      theIdea: "Designed an intuitive mobile controller for mixed-reality spatial headsets. Users need quick access to environment audio, visual presets, spatial window anchors, and telemetry without visual cognitive overload.",
      processSteps: [
        {
          phase: "01 — User Research & Persona",
          desc: "Mapped user flow hierarchies and ergonomic thumb zones for one-handed operation during headset sessions."
        },
        {
          phase: "02 — Low-Fidelity Wireframes",
          desc: "Tested rapid layout variations prioritizing floating gesture widgets and quick-toggle contextual sliders."
        },
        {
          phase: "03 — Design System Architecture",
          desc: "Crafted dark-mode optimized color tokens, 8pt spatial grid, fluid typography scale, and micro-component library."
        },
        {
          phase: "04 — High-Fidelity UI Screens",
          desc: "Deep charcoal surfaces, neon cyan status accents, translucent glass cards with backdrop blur, and accessible contrast ratios."
        },
        {
          phase: "05 — Interactive Prototyping",
          desc: "Smart-animate transitions, haptic response mockups, and micro-interactions for tactile slider feedback."
        }
      ],
      tools: ["Figma", "FigJam", "Adobe Illustrator", "Protopie"],
      deliverables: ["24 Screen UI Kit", "Component Design System", "Interactive Clickable Prototype", "Developer Handoff Specs"],
      gallery: [
        { title: "Main Dashboard Screen", image: "assets/images/project-02-mobile.svg", caption: "Spatial controller dashboard with quick telemetry and audio presets." },
        { title: "Environment Mixer", image: "assets/images/project-02-mobile.svg", caption: "Haptic feedback slider interface for ambient sound control." }
      ]
    }
  },
  {
    id: "project-03",
    slug: "modern-event-campaign",
    title: "Modern Event Campaign",
    category: "Posters",
    categoryLabel: "Poster / Graphic Design",
    projectType: "Concept Project",
    year: "2025",
    shortDesc: "Typographic identity and visual poster campaign for RESONANCE, an international audio-visual and electronic music festival.",
    heroImage: "assets/images/project-03-poster.svg",
    aspectRatio: "4:5",
    featured: true,
    tags: ["Adobe Photoshop", "Typography", "Graphic Design", "Blender", "Print"],
    concept: {
      theIdea: "Capturing the physics of acoustic resonance and light frequencies through stark modern typography, distorted optical soundwaves, and monochromatic industrial styling.",
      processSteps: [
        {
          phase: "01 — Concept & Moodboard",
          desc: "Synthesized references from Swiss modernist posters, brutalist club flyers, and wave interference physics."
        },
        {
          phase: "02 — Typography & Grid",
          desc: "Constructed a strict asymmetric grid using heavy grotesque type contrasted with fine monospace telemetry data."
        },
        {
          phase: "03 — 3D Vector Waveforms",
          desc: "Simulated 3D acoustic waveforms in Blender and imported displacement maps for typographic distortion."
        },
        {
          phase: "04 — Color & Composition",
          desc: "Stark contrast pairing deep void black with electric hyper-violet accents and tactile analog film grain."
        },
        {
          phase: "05 — Print & Screen Output",
          desc: "Multi-format adaptations: A1 silk-screen posters, digital billboards, and dynamic animated social stories."
        }
      ],
      tools: ["Adobe Photoshop", "Adobe Illustrator", "Blender", "InDesign"],
      deliverables: ["Series of 3 Screenprint Posters", "Digital Billboard Variants", "Social Media Campaign Kit"],
      gallery: [
        { title: "A1 Main Festival Poster", image: "assets/images/project-03-poster.svg", caption: "High-contrast typographic poster with procedural wave displacement." }
      ]
    }
  },
  {
    id: "project-04",
    slug: "contemporary-bedroom",
    title: "Contemporary Bedroom",
    category: "Interior",
    categoryLabel: "Interior Visualization",
    projectType: "Concept Project",
    year: "2025",
    shortDesc: "Photorealistic architectural interior rendering of a minimalist modern penthouse suite with organic oak and concrete finishes.",
    heroImage: "assets/images/project-04-bedroom.svg",
    aspectRatio: "16:9",
    featured: true,
    tags: ["Blender", "Cycles", "ArchViz", "Lighting", "Interior Design"],
    concept: {
      theIdea: "Designing a tranquil sanctuary balancing industrial brutalist cast concrete with warm Japanese-Nordic oak paneling, low-profile bespoke platform bed, and natural diffuse daylight.",
      processSteps: [
        {
          phase: "01 — Architectural Floorplan & Layout",
          desc: "Scaled 2D blueprint drafting to maximize daylight entry and optimize interior spatial flow."
        },
        {
          phase: "02 — 3D Structural Modeling",
          desc: "Accurate architectural modeling of structural columns, ceiling recesses, recessed LED troughs, and panoramic glazing."
        },
        {
          phase: "03 — PBR Texture Creation",
          desc: "High-resolution seamless 4K displacement maps: micro-cement floor, slatted white oak wood, washed linen bedding, and honed slate."
        },
        {
          phase: "04 — Sun & Ambient Lighting Simulation",
          desc: "Nishita sky model paired with portal lights to replicate a crisp 8:30 AM morning sun casting warm diagonal shadows."
        },
        {
          phase: "05 — Post-Production & Color Grading",
          desc: "Camera raw tone curve mapping, natural glow on highlight blooms, and subtle vignette to anchor the gaze."
        }
      ],
      tools: ["Blender 4.2 (Cycles)", "Substance Designer", "Photoshop", "Archicad"],
      deliverables: ["4K High-Res Day Renders", "Dusk / Night Lighting Scenario", "Before/After Wireframe-to-Final Breakdown"],
      gallery: [
        { title: "Morning Sun Master Angle", image: "assets/images/project-04-bedroom.svg", caption: "Diffuse morning sunlight over warm slatted oak headboard wall." },
        { title: "Raw Geometry View", image: "assets/images/interior-wireframe.svg", caption: "CAD structural mesh and camera perspective setup." }
      ]
    }
  },
  {
    id: "project-05",
    slug: "3d-character-concept",
    title: "3D Character Concept",
    category: "3D",
    categoryLabel: "3D / Animation",
    projectType: "Concept Project",
    year: "2025",
    shortDesc: "Hard-surface mechanical android bust study: AEGIS Sentinel unit engineered for deep-space surveillance.",
    heroImage: "assets/images/project-05-character.svg",
    aspectRatio: "16:9",
    featured: true,
    tags: ["Blender", "ZBrush", "Substance 3D", "Character Art", "Sci-Fi"],
    concept: {
      theIdea: "Exploring non-humanoid expressive robotic anatomy. Focusing on precision neck hydraulics, layered ballistic carbon fiber plating, and an active optical sensory cluster.",
      processSteps: [
        {
          phase: "01 — Silhouette & Proportions",
          desc: "Explored 20+ silhouette iterations in digital sketch before committing to a streamlined predator-inspired profile."
        },
        {
          phase: "02 — Digital Sculpting & Hard-Surface",
          desc: "Blocking primary forms in ZBrush, retopologizing in Blender with Crease weights and bevel modifiers."
        },
        {
          phase: "03 — Mechanical Articulation",
          desc: "Functional mechanical joints, piston sleeves, rubber cable dampeners, and ventilation heat sinks."
        },
        {
          phase: "04 — Shading & Micro-Detailing",
          desc: "Multilayer paint shader: worn matte dark gray powder-coat revealing raw machined aluminium at edge contacts."
        },
        {
          phase: "05 — Cinematic Lighting",
          desc: "Dramatic studio rim lighting with cyan fill light reflecting in the spherical optical lens array."
        }
      ],
      tools: ["Blender", "ZBrush", "Substance 3D Painter", "Photoshop"],
      deliverables: ["Character Bust Turntable", "High-Resolution Closeups", "Topology Wireframe Sheets"],
      gallery: [
        { title: "Bust 3/4 Perspective", image: "assets/images/project-05-character.svg", caption: "AEGIS unit featuring titanium alloy plating and optical sensor core." }
      ]
    }
  },
  {
    id: "project-06",
    slug: "digital-brand-system",
    title: "Digital Brand System",
    category: "UI/UX",
    categoryLabel: "Graphic / UI Design",
    projectType: "Concept Project",
    year: "2024",
    shortDesc: "Complete brand visual identity, digital design language, and design token system for Quantum Labs.",
    heroImage: "assets/images/project-06-brand.svg",
    aspectRatio: "16:9",
    featured: true,
    tags: ["Branding", "UI Systems", "Figma", "Typography", "Design Tokens"],
    concept: {
      theIdea: "Developing a visual identity for an advanced quantum computing research group. The identity needed to reflect mathematical precision, wave-particle duality, and bleeding-edge computing power.",
      processSteps: [
        {
          phase: "01 — Brand Strategy & Discovery",
          desc: "Defined brand values: mathematical rigor, clarity, frontier innovation, and quiet confidence."
        },
        {
          phase: "02 — Geometric Logomark Design",
          desc: "Constructed a dynamic modular glyph based on interlocking probability waves and orthogonal projection."
        },
        {
          phase: "03 — Color Architecture & Tokens",
          desc: "Synthesized a monochromatic baseline palette punctuated by Electric Ultraviolet and Quantum Cyan."
        },
        {
          phase: "04 — Digital Product System",
          desc: "Designed UI templates, data charts, code editor themes, and responsive design tokens."
        },
        {
          phase: "05 — Guidelines & Asset Kit",
          desc: "Compiled 60-page digital brand guidelines, typography hierarchy rules, and icon library."
        }
      ],
      tools: ["Figma", "Adobe Illustrator", "Photoshop", "After Effects"],
      deliverables: ["Modular Logomark Suite", "Comprehensive Brand Guidelines PDF", "UI Component Library", "Stationery Mockups"],
      gallery: [
        { title: "Brand Identity Overview", image: "assets/images/project-06-brand.svg", caption: "Logomark construction, palette tokens, and stationery system." }
      ]
    }
  },
  {
    id: "project-07",
    slug: "architectural-pavilion",
    title: "Parametric Glass Pavilion",
    category: "Interior",
    categoryLabel: "3D / Architectural",
    projectType: "Concept Project",
    year: "2025",
    shortDesc: "Parametric wooden rib pavilion with curved insulated glass and reflective terrazzo pool.",
    heroImage: "assets/images/project-07-pavilion.svg",
    aspectRatio: "16:9",
    featured: false,
    tags: ["Blender", "Architecture", "Lighting", "Parametric"],
    concept: {
      theIdea: "A public botanical exhibition pavilion utilizing algorithmic timber ribs that twist to modulate natural sunlight throughout the day.",
      processSteps: [
        { phase: "01 — Parametric Geometry", desc: "Generated procedural timber rib lattice in Blender Geometry Nodes." },
        { phase: "02 — Environmental Lighting", desc: "HDRI physical sun simulation with high-caustics glass reflections." },
        { phase: "03 — Landscape Integration", desc: "Surrounding mirror pond with submerged LED illumination." }
      ],
      tools: ["Blender 4.2", "Geometry Nodes", "Cycles", "Photoshop"],
      deliverables: ["Exterior Daytime Render", "Interior Sunlight Study", "Night Illumination Render"],
      gallery: [
        { title: "Pavilion Sunset Render", image: "assets/images/project-07-pavilion.svg", caption: "Curved glulam timber ribs reflecting in still terrazzo pool." }
      ]
    }
  },
  {
    id: "project-08",
    slug: "kinetic-typography-reel",
    title: "Kinetic Typography Reel",
    category: "Motion",
    categoryLabel: "Motion & VFX",
    projectType: "Concept Project",
    year: "2025",
    shortDesc: "Explorations in 3D typography deformation, optical distortion, and audio-reactive kinetic motion graphics.",
    heroImage: "assets/images/project-08-motion.svg",
    aspectRatio: "16:9",
    featured: false,
    tags: ["After Effects", "Blender", "Motion Design", "Sound Design"],
    concept: {
      theIdea: "Bridging the gap between graphic design and 3D kinetic animation through dynamic type choreography synced to industrial techno soundscapes.",
      processSteps: [
        { phase: "01 — Type Choreography", desc: "Constructing kinetic typographic rhythm and easing curves." },
        { phase: "02 — 3D Displacement & Shading", desc: "Baking audio amplitude into 3D mesh displacement in Blender." },
        { phase: "03 — Compositing & Chromatic Passes", desc: "After Effects optical flares, scanlines, and camera shakes." }
      ],
      tools: ["Adobe After Effects", "Blender", "Adobe Premiere Pro"],
      deliverables: ["30-Second Motion Reel", "Looping Social Visualizers", "Stills Collection"],
      gallery: [
        { title: "Kinetic Frame Capture", image: "assets/images/project-08-motion.svg", caption: "Dynamic type deformation in 3D coordinate space." }
      ]
    }
  }
];
