# Kani Vision Studio — Portfolio Website

> **Tagline:** Design. Model. Visualize.  
> **Industry:** 3D Design, UI/UX, Graphic Design, Interior Visualization, Animation & VFX

A premium, modern, responsive creative-studio portfolio website for **Kani Vision Studio**. Built with a sophisticated dark creative-studio aesthetic, interactive Three.js 3D WebGL sculptures, real-time portfolio filtering, before/after interactive sliders, detailed project case studies, and a direct inquiry workflow.

---

## 🌟 Key Features

1. **Brand & Visual Aesthetic:**
   - Dark creative-studio color palette (`#08090d` charcoal background, white headings, soft gray text, electric violet `#8b5cf6` and cyan `#06b6d4` accents).
   - Premium typography using **Space Grotesk** for bold titles and **Inter** for clean readable body copy.
   - Glassmorphic navigation bar with scroll detection, backdrop blur, and live availability badge (`● Available for selected projects`).

2. **Interactive 3D Hero Sculpture (Three.js):**
   - Real-time 3D polyhedral kinetic sculpture with procedural PBR metallic & glass shaders, orbiting rings, and particle swarm.
   - Parallax mouse and touch reaction with smooth interpolation.
   - Interactive mesh mode switcher (**Sculpture**, **Torus Knot**, **Wireframe**, **Hologram**) and auto-rotation toggle.
   - Graceful vector SVG fallback if WebGL is disabled or unavailable.

3. **Curated Portfolio (Selected Work):**
   - Real-time category filtering (**All**, **3D**, **UI/UX**, **Posters**, **Interior**, **Motion**).
   - High-fidelity visual cards with hover zoom, category tags, and honest **Concept Project** badges.
   - Interactive **Case Study Modal** showing **The Idea**, 5-step **Process**, **Tools Used**, **Deliverables**, and **Final Result Gallery** with **Next Project →** navigation.

4. **Dedicated 3D Modeling Section:**
   - **WIREFRAME → MATERIAL → FINAL RENDER** 3-stage visual switcher.
   - **Interactive 3D Model Viewer Sandbox**: Visitors can rotate 360°, zoom, toggle wireframe mesh, and test 3 studio lighting schemes (*Cyber Violet*, *Electric Cyan*, *Daylight White*).

5. **UI/UX Digital Experiences Section:**
   - Interactive device mockup tab switcher (**Mobile App**, **SaaS Dashboard**, **Landing Page**, **Design System**).
   - 5-stage human-centered design workflow pipeline.

6. **Poster & Graphic Design Gallery:**
   - Multi-aspect ratio poster gallery (3:4, 4:5, 1:1, 9:16).
   - Filter by **Events**, **Education**, **Advertising**, **Social Media**, **Branding**.
   - Fullscreen **Poster Lightbox** displaying design objective, tools used, typography, and dimensions.

7. **Interior Visualization Section:**
   - **Before/After Split-Screen Slider**: Smoothly drag between raw CAD 3D wireframe and photorealistic Cycles render.
   - Architectural workflow pipeline (`FLOOR PLAN ↓ 3D MODEL ↓ MATERIALS ↓ LIGHTING ↓ FINAL RENDER`).

8. **Design Process & Services:**
   - 6 detailed service cards with icons and deliverable specs.
   - 5-step chronological timeline (**Discover**, **Plan**, **Create**, **Refine**, **Deliver**).

9. **Tools Section:**
   - Honest representation of tools used and in active workflow (**Blender**, **Figma**, **Adobe Photoshop**, **Adobe After Effects**, **Adobe Premiere Pro**, **Maya**, **Unreal Engine**, **Canva**).

10. **Direct Inquiry & WhatsApp Flow:**
    - Project request form with service selector and budget range chips (Under ₹5,000 to ₹25,000+).
    - Instant submission confirmation modal with direct **Send via WhatsApp** link and **Copy Inquiry Details** button.

11. **Custom 404 Page:**
    - Creative 404 page: *"LOST IN THE VIRTUAL SPACE."* with 3D coordinate grid and *"Back to Studio →"* navigation.

---

## 📁 Project Structure

```
d:/
├── index.html              # Main high-fidelity portfolio website
├── 404.html                # Custom 404 error page
├── css/
│   ├── style.css           # Master stylesheet: theme, layout, components
│   ├── components.css      # Case study drawer, poster lightbox, modals
│   └── responsive.css      # Fine-tuned mobile, tablet, and desktop breakpoints
├── js/
│   ├── app.js              # Application orchestrator and event binding
│   ├── three-hero.js       # Three.js interactive 3D hero sculpture
│   ├── three-viewer.js     # Three.js interactive 3D model viewer sandbox
│   ├── slider.js           # Before/After comparison sliders & stage switcher
│   ├── projects-data.js    # Portfolio projects, case studies, and specs
│   ├── posters-data.js     # Poster gallery metadata and objectives
│   └── tools.js            # Software tools data and experience levels
├── assets/
│   └── images/             # Vector artworks and 3D renders for all projects
├── server.ps1              # Lightweight zero-dependency PowerShell HTTP server
└── README.md               # Documentation and customization guide
```

---

## 🚀 How to Run Locally

### Option 1: Direct File Opening
Double-click `index.html` to open directly in any modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Option 2: Built-in PowerShell Local Server
Run the included PowerShell script to start a local development server at `http://localhost:8080/`:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

---

## 🌐 Deploying to Production

The project is static and zero-dependency, meaning it can be hosted instantly on:
- **GitHub Pages**: Push repository and enable Pages in repository settings.
- **Vercel / Netlify**: Drag and drop the folder or connect via Git.
- **Firebase Hosting**: Run `firebase init hosting` followed by `firebase deploy`.

---

© 2026 Kani Vision Studio. All rights reserved.
