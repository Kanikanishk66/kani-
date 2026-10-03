# Kani Vision Studio — Private Business Platform

> **Tagline:** Design. Model. Visualize.
> **Industry:** 3D Design, UI/UX, Graphic Design, Interior Visualization, Animation & VFX

A responsive full-stack creative-studio platform for **Kani Vision Studio**, with customer and employee portals, a private sign-in gateway, and a warm editorial palette with forest-green and copper accents. The legacy portfolio and interactive 3D experiences are available only after signing in.

### Authentication-first access

Opening `/` displays only the sign-in experience. Customer pages require a verified customer session; staff pages require an employee session and permission checks. Business APIs, catalog data, portfolio assets, and uploaded media are not served to anonymous visitors. Customer email verification and employee invitation verification are required; employee access also requires authenticator-based two-factor verification. The initial Super Admin is provisioned with the protected `node setup-admin.js` command—passwords are never stored in source.

---

## 🌟 Key Features

1. **Brand & Visual Aesthetic:**
   - Warm ivory-and-forest palette with copper accents, high-contrast charcoal typography, and consistent styling across the portfolio, service pages, and interactive viewers.
   - Premium typography using **Manrope** for headings and **DM Sans** for clean, readable body copy.
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
   - **Interactive 3D Model Viewer Sandbox**: Visitors can rotate 360°, zoom, toggle wireframe mesh, and test 3 studio lighting schemes (*Forest Green*, *Copper Glow*, *Natural Studio*).

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

12. **Signature Motion System:**
    - Cinematic staggered hero entrance, endlessly drifting studio typography, and responsive 3D motion.
    - Portfolio cards react to pointer position with a soft spotlight and image drift; section content arrives in staggered reveals.
    - Motion respects the device's reduced-motion preference and avoids pointer effects on touch screens.

---

## 📁 Project Structure

```
Website/
├── index.html              # Login-only entry point
├── customer.html           # Authenticated customer portal
├── staff.html              # Authenticated employee workspace
├── 404.html                # Custom 404 error page
├── css/
│   ├── login.css           # Private, responsive sign-in experience
│   ├── portal.css          # Customer and employee portal styling
│   ├── depth-effects.css   # Lightweight 3D sign-in and portal interactions
│   ├── style.css           # Master stylesheet: theme, layout, components
│   ├── components.css      # Case study drawer, poster lightbox, modals
│   └── responsive.css      # Fine-tuned mobile, tablet, and desktop breakpoints
│   └── experience.css      # Unified studio refresh, responsive layout & motion effects
├── js/
│   ├── login.js            # Customer/employee authentication and verification
│   ├── depth-effects.js    # Pointer-aware, reduced-motion-friendly depth effects
│   ├── app.js              # Application orchestrator and event binding
│   ├── experience-motion.js # Accessible hero, reveal, and pointer motion system
│   ├── three-hero.js       # Three.js interactive 3D hero sculpture
│   ├── three-viewer.js     # Three.js interactive 3D model viewer sandbox
│   ├── slider.js           # Before/After comparison sliders & stage switcher
│   ├── projects-data.js    # Portfolio projects, case studies, and specs
│   ├── posters-data.js     # Poster gallery metadata and objectives
│   └── tools.js            # Software tools data and experience levels
├── assets/
│   └── images/             # Vector artworks and 3D renders for all projects
├── server.js               # Authenticated Node.js + SQLite application server
├── server.ps1              # PowerShell launcher for the authenticated server
└── README.md               # Documentation and customization guide
```

---

## 🚀 How to Run Locally

Install Node.js 24 or newer, then start the authenticated application from PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Open `http://127.0.0.1:8787/`. Do not open `index.html` directly or use a static-only server: authentication and protected pages require the Node.js backend.

---

## Website Platform

This repository also includes a Node.js 24+ platform backend using the built-in SQLite driver. Do not use the static-only PowerShell server for the customer or staff portals.

### Local setup

1. Install Node.js 24 or newer and install the application dependencies with `npm.cmd install` in PowerShell.
2. Optionally load sample catalog content with `node seed-dev.js`. This command refuses production mode and creates no users.
3. Create the first employee administrator from an interactive terminal with `node setup-admin.js`, or generate a one-time strong password with `node setup-admin.js --generate-credentials`. Both methods use `kanikanishk66@gmail.com` as the administrator email and employee ID. The generated-credential option leaves TOTP unenrolled; the first employee sign-in must finish authenticator setup before a session is issued. Save the generated password immediately.
4. Start the application with `powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080` or `node server.js`.
5. Open `http://localhost:8080/` (or port 8787 when using the default server port). Sign in before the server redirects a customer to `/customer.html` or an employee to `/staff.html`.

The application creates `data/studio.sqlite`, a local development 2FA encryption key under `data/`, and uploaded product media under `uploads/`. These are ignored by Git. The backup center writes SQLite snapshots outside the public web root; `STUDIO_BACKUP_PATH` can set a private directory and `STUDIO_BACKUP_RETENTION_DAYS` configures retention (default 14 days). Set `STUDIO_BACKUP_INTERVAL_HOURS` to `1`-`720` to enable scheduled local snapshots; the default `0` disables scheduling.

Restore while the server is stopped with `node restore-backup.js <backup filename>`. The command verifies SQLite integrity, requires typing `RESTORE`, and creates a pre-restore database copy. Restore the matching media directory and the TOTP encryption key separately before restarting.

To run the isolated integration checks, use `node --test tests/platform.test.js`. The tests use temporary database and upload directories and remove them when they finish.

### Production configuration

Run the Node server behind a TLS-terminating reverse proxy. Set `NODE_ENV=production`, `PUBLIC_ORIGIN` to the canonical HTTPS origin, and configure `EMAIL_WEBHOOK_URL` plus `EMAIL_WEBHOOK_SECRET` (at least 32 characters) through a secret manager. Set `TOTP_ENCRYPTION_KEY` to a base64-encoded 32-byte secret and keep a protected backup of it. The email gateway must accept an HTTPS `POST` with a bearer token and JSON fields `to`, `subject`, and `text`, and return a 2xx response. Set `HOST=127.0.0.1` behind a local proxy, or bind to the required private interface. `PORT`, `STUDIO_DB_PATH`, `STUDIO_UPLOADS_PATH`, `STUDIO_BACKUP_PATH`, and `STUDIO_BACKUP_RETENTION_DAYS` can be set for deployment-specific locations.

Production startup intentionally fails if HTTPS origins, email delivery, or the TOTP encryption key are missing. The local development server returns one-time verification/reset/invitation tokens only when `NODE_ENV` is not `production`; never expose the development server publicly.

### Current integration boundary

The implemented platform provides separate customer and employee authentication, customer email verification, invitation-based employee email verification, mandatory employee TOTP, server-side custom roles/permissions, employee invitations, product/category/brand and media management, stock and price history, approvals including dual approval, customer enquiries/orders, homepage drafts with revision/restore flow, analytics, reports, private SQLite snapshots, notifications, and an append-only application audit log.

The customer portal includes a responsive studio header for Work, Services, Process, About, Contact, account tools, and the authenticated 3D Studio, plus a studio About view with a direct email link and slots for verified social and WhatsApp contact URLs. Login and portal controls use lightweight 3D pointer effects that respect reduced-motion preferences.

This is a secure application foundation, not a complete hosted commerce operation. Before serving real customers, deploy with a managed database and tested off-host backups, private object storage/CDN, a production email provider, operational monitoring, and a security review. Phone/SMS verification, payment processing, refunds, shipping, bulk operations, full drag-and-drop page composition, off-host backup replication, and distributed rate limiting are not implemented. CMS editing currently manages the homepage hero fields rather than arbitrary page layout. Orders are order enquiries that reserve inventory; no payment is taken. SQLite is appropriate for local/single-instance use, not a horizontally scaled production deployment.

Customer and employee HTML, scripts, business APIs, static media, and uploaded files require an authenticated session. Anonymous users can reach the login gateway and authentication endpoints only (plus the non-sensitive health check).

---

© 2026 Kani Vision Studio. All rights reserved.
