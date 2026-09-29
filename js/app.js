/**
 * Kani Vision Studio - Main Application Orchestrator
 * Connects 3D viewers, sliders, portfolio filtering, case study modals,
 * poster lightboxes, contact inquiries, and micro-interactions.
 */

import { projectsData } from "./projects-data.js";
import { postersData } from "./posters-data.js";
import { toolsData } from "./tools.js";
import { Hero3DExperience } from "./three-hero.js";
import { ModelViewer3D } from "./three-viewer.js";
import { BeforeAfterSlider, StagesSwitcher } from "./slider.js";

class App {
  constructor() {
    this.hero3D = null;
    this.modelViewer = null;
    this.currentCaseStudyIndex = 0;
    this.activePortfolioFilter = "All";
    this.activePosterFilter = "All";
    this.init();
  }

  init() {
    // Wait for DOM
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.bootstrap());
    } else {
      this.bootstrap();
    }
  }

  bootstrap() {
    this.initNavigation();
    this.initHero3D();
    this.renderPortfolioGrid();
    this.initPortfolioFilters();
    this.init3DSection();
    this.initUIUXSection();
    this.renderPosterGallery();
    this.initPosterFilters();
    this.initInteriorSection();
    this.renderToolsSection();
    this.initContactForm();
    this.initMicroInteractions();
    this.initModals();
    this.initScrollReveal();

    console.log("Kani Vision Studio initialized successfully.");
  }

  /* ================= 1. NAVIGATION ================= */
  initNavigation() {
    const navbar = document.getElementById("navbar");
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Scroll effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
      this.updateActiveNav();
    }, { passive: true });

    // Mobile Hamburger
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        mobileToggle.classList.toggle("is-active", isOpen);
        mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.style.overflow = isOpen ? "hidden" : "";
      });

      // Close mobile menu on link click
      mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          mobileMenu.classList.remove("open");
          mobileToggle.classList.remove("is-active");
          mobileToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId && targetId !== "#" && targetId.startsWith("#")) {
          const targetElem = document.querySelector(targetId);
          if (targetElem) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetElem.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }
      });
    });
  }

  updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }

  /* ================= 2. HERO 3D EXPERIENCE ================= */
  initHero3D() {
    this.hero3D = new Hero3DExperience("hero-3d-canvas");

    // Mode Toggle Buttons
    const modeButtons = document.querySelectorAll("[data-hero-mode]");
    modeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        modeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.getAttribute("data-hero-mode");
        if (this.hero3D) {
          this.hero3D.setMode(mode);
        }
      });
    });

    // Rotation Pause/Resume Toggle
    const rotateBtn = document.getElementById("hero-rotate-toggle");
    if (rotateBtn && this.hero3D) {
      rotateBtn.addEventListener("click", () => {
        const rotating = this.hero3D.toggleRotation();
        rotateBtn.classList.toggle("active", rotating);
        rotateBtn.innerHTML = rotating ? `<span class="icon">⟳</span> <span>Auto-Rotate: On</span>` : `<span class="icon">⏸</span> <span>Paused</span>`;
      });
    }
  }

  /* ================= 3. PORTFOLIO (SELECTED WORK) ================= */
  renderPortfolioGrid() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const filtered = this.activePortfolioFilter === "All" 
      ? projectsData 
      : projectsData.filter(p => p.category === this.activePortfolioFilter || (p.categoryLabel && p.categoryLabel.includes(this.activePortfolioFilter)));

    filtered.forEach((project, index) => {
      const card = document.createElement("div");
      card.className = "portfolio-card group";
      card.setAttribute("data-category", project.category);
      card.setAttribute("data-project-id", project.id);

      // Signature Category Color
      const catColor = project.category === "3D" ? "#a855f7" 
        : project.category === "UI/UX" ? "#06b6d4" 
        : project.category === "Posters" ? "#ec4899" 
        : project.category === "Interior" ? "#f59e0b" 
        : "#10b981";

      card.innerHTML = `
        <div class="card-inner" style="--card-accent: ${catColor};">
          <div class="card-image-wrap">
            <img src="${project.heroImage}" alt="${project.title}" loading="lazy" class="card-img" />
            <div class="card-overlay">
              <div class="card-overlay-actions">
                <button class="view-btn btn-modal-trigger" aria-label="Open modal for ${project.title}">
                  Quick View ⤢
                </button>
                <a href="project.html?id=${project.id}" target="_blank" rel="noopener noreferrer" class="view-btn btn-newtab" aria-label="Open case study in new tab">
                  Open New Tab ↗
                </a>
              </div>
            </div>
            <div class="card-badges">
              <span class="badge" style="background: rgba(0,0,0,0.7); color: ${catColor}; border: 1px solid ${catColor}; box-shadow: 0 0 10px ${catColor}44;">
                ${project.categoryLabel || project.category}
              </span>
              <span class="badge badge-outline">${project.projectType}</span>
            </div>
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span class="project-year">${project.year}</span>
              <span class="project-dot">•</span>
              <span class="project-cat" style="color: ${catColor}; font-weight: 700;">${project.category}</span>
            </div>
            <h3 class="card-title">${project.title}</h3>
            <p class="card-desc">${project.shortDesc}</p>
            <div class="card-action-bar">
              <button class="card-link btn-modal-trigger" aria-label="View case study modal for ${project.title}">
                <span>Explore Case Study</span>
                <span class="arrow">→</span>
              </button>
              <a href="project.html?id=${project.id}" target="_blank" rel="noopener noreferrer" class="card-link-newtab" title="Open case study in a new browser tab">
                <span>New Tab</span> ↗
              </a>
            </div>
          </div>
        </div>
      `;

      // Modal trigger clicks
      card.querySelectorAll(".btn-modal-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openCaseStudy(project.id);
        });
      });

      // Default card click opens modal if clicked outside buttons
      card.addEventListener("click", (e) => {
        if (!e.target.closest("a")) {
          this.openCaseStudy(project.id);
        }
      });

      grid.appendChild(card);
    });
  }

  initPortfolioFilters() {
    const filterButtons = document.querySelectorAll(".portfolio-filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activePortfolioFilter = btn.getAttribute("data-filter");
        this.renderPortfolioGrid();
      });
    });
  }

  /* ================= 4. 3D MODELING SECTION ================= */
  init3DSection() {
    // 1. Initialize Stage Switcher (Wireframe -> Material -> Final Render)
    new StagesSwitcher("stages-switcher-container");

    // 2. Initialize Interactive 3D Model Viewer Sandbox
    this.modelViewer = new ModelViewer3D("model-viewer-canvas");

    // Wireframe button
    const wireframeBtn = document.getElementById("viewer-wireframe-toggle");
    if (wireframeBtn) {
      wireframeBtn.addEventListener("click", () => {
        if (this.modelViewer) {
          const isWire = this.modelViewer.toggleWireframe();
          wireframeBtn.classList.toggle("active", isWire);
        }
      });
    }

    // Auto rotate toggle
    const rotateBtn = document.getElementById("viewer-rotate-toggle");
    if (rotateBtn) {
      rotateBtn.addEventListener("click", () => {
        if (this.modelViewer) {
          const isRot = this.modelViewer.toggleAutoRotate();
          rotateBtn.classList.toggle("active", isRot);
        }
      });
    }

    // Light presets
    const lightButtons = document.querySelectorAll("[data-viewer-light]");
    lightButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        lightButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const preset = btn.getAttribute("data-viewer-light");
        if (this.modelViewer) {
          this.modelViewer.setLightPreset(preset);
        }
      });
    });

    // Reset view
    const resetBtn = document.getElementById("viewer-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (this.modelViewer) this.modelViewer.resetView();
      });
    }
  }

  /* ================= 5. UI/UX SECTION ================= */
  initUIUXSection() {
    const tabs = document.querySelectorAll("[data-ui-tab]");
    const screens = document.querySelectorAll("[data-ui-screen]");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const targetScreen = tab.getAttribute("data-ui-tab");
        screens.forEach(screen => {
          screen.classList.toggle("active", screen.getAttribute("data-ui-screen") === targetScreen);
        });
      });
    });
  }

  /* ================= 6. POSTER & GRAPHIC DESIGN ================= */
  renderPosterGallery() {
    const gallery = document.getElementById("posters-gallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    const filtered = this.activePosterFilter === "All"
      ? postersData
      : postersData.filter(p => p.category === this.activePosterFilter);

    filtered.forEach(poster => {
      const card = document.createElement("div");
      card.className = `poster-card ${poster.aspectClass || ""}`;
      card.setAttribute("data-poster-id", poster.id);

      card.innerHTML = `
        <div class="poster-inner">
          <div class="poster-img-wrap">
            <img src="${poster.image}" alt="${poster.title}" loading="lazy" class="poster-img" />
            <div class="poster-overlay">
              <div class="poster-overlay-actions">
                <button class="poster-action-btn btn-poster-modal" aria-label="Inspect artwork">
                  Inspect ⤢
                </button>
                <a href="${poster.image}" target="_blank" rel="noopener noreferrer" class="poster-action-btn btn-poster-newtab" title="Open full high-res artwork in new tab">
                  New Tab ↗
                </a>
              </div>
            </div>
            <div class="poster-aspect-badge">${poster.aspectRatio}</div>
          </div>
          <div class="poster-caption">
            <div class="poster-meta">
              <span class="poster-cat" style="color: var(--accent-magenta); font-weight: 700;">${poster.category}</span>
              <span class="poster-dot">•</span>
              <span class="poster-client">${poster.client}</span>
            </div>
            <h4 class="poster-title">${poster.title}</h4>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${poster.dimensions}</span>
              <a href="${poster.image}" target="_blank" rel="noopener noreferrer" class="poster-open-link" title="Open in new tab" style="font-family: var(--font-heading); font-size: 11px; color: var(--accent-cyan); font-weight: 700;">
                Full Artwork ↗
              </a>
            </div>
          </div>
        </div>
      `;

      card.querySelectorAll(".btn-poster-modal").forEach(b => {
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openPosterLightbox(poster);
        });
      });

      card.addEventListener("click", (e) => {
        if (!e.target.closest("a")) {
          this.openPosterLightbox(poster);
        }
      });

      gallery.appendChild(card);
    });
  }

  initPosterFilters() {
    const buttons = document.querySelectorAll(".poster-filter-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activePosterFilter = btn.getAttribute("data-filter");
        this.renderPosterGallery();
      });
    });
  }

  /* ================= 7. INTERIOR VISUALIZATION ================= */
  initInteriorSection() {
    const sliderContainer = document.getElementById("interior-ba-slider");
    if (sliderContainer) {
      new BeforeAfterSlider(sliderContainer);
    }

    // Space Showcase Tabs
    const spaceTabs = document.querySelectorAll("[data-space-tab]");
    const spaceItems = document.querySelectorAll("[data-space-item]");

    spaceTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        spaceTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const targetSpace = tab.getAttribute("data-space-tab");
        spaceItems.forEach(item => {
          item.classList.toggle("active", item.getAttribute("data-space-item") === targetSpace);
        });
      });
    });
  }

  /* ================= 8. TOOLS SECTION ================= */
  renderToolsSection() {
    const container = document.getElementById("tools-grid");
    if (!container) return;

    container.innerHTML = "";

    toolsData.forEach(tool => {
      const card = document.createElement("div");
      card.className = "tool-card";
      card.innerHTML = `
        <div class="tool-icon-wrap" style="--tool-accent: ${tool.color}">
          ${tool.icon}
        </div>
        <div class="tool-info">
          <div class="tool-head">
            <h4 class="tool-name">${tool.name}</h4>
            <span class="tool-exp">${tool.experience}</span>
          </div>
          <span class="tool-cat">${tool.category}</span>
          <p class="tool-desc">${tool.description}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* ================= 9. CONTACT FORM ================= */
  initContactForm() {
    const form = document.getElementById("project-inquiry-form");
    const budgetChips = document.querySelectorAll(".budget-chip");
    const budgetInput = document.getElementById("selected-budget-input");
    const whatsappBtn = document.getElementById("quick-whatsapp-btn");

    // Budget chip selection
    budgetChips.forEach(chip => {
      chip.addEventListener("click", () => {
        budgetChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        if (budgetInput) {
          budgetInput.value = chip.getAttribute("data-budget");
        }
      });
    });

    // Form submission
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("form-name").value.trim();
        const email = document.getElementById("form-email").value.trim();
        const phone = document.getElementById("form-phone").value.trim();
        const service = document.getElementById("form-service").value;
        const budget = budgetInput ? budgetInput.value : "Not decided";
        const details = document.getElementById("form-details").value.trim();

        if (!name || !email || !service || !details) {
          alert("Please fill in all required fields (Name, Email, Service, Project Details).");
          return;
        }

        // Show confirmation modal
        this.openContactSuccessModal({ name, email, phone, service, budget, details });
        form.reset();
        budgetChips.forEach(c => c.classList.remove("active"));
        if (budgetChips[0]) budgetChips[0].classList.add("active");
        if (budgetInput) budgetInput.value = "Not decided";
      });
    }

    // Quick WhatsApp CTA direct button
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", () => {
        const text = encodeURIComponent("Hello Kani Vision Studio, I am interested in starting a creative 3D / Design project with you.");
        window.open(`https://wa.me/?text=${text}`, "_blank");
      });
    }
  }

  /* ================= 10. MODALS & CASE STUDIES ================= */
  initModals() {
    // Case study modal close
    const csModal = document.getElementById("case-study-modal");
    const csClose = document.getElementById("case-study-close");
    if (csClose && csModal) {
      csClose.addEventListener("click", () => this.closeCaseStudy());
    }

    // Poster lightbox close
    const posterModal = document.getElementById("poster-lightbox-modal");
    const posterClose = document.getElementById("poster-lightbox-close");
    if (posterClose && posterModal) {
      posterClose.addEventListener("click", () => this.closePosterLightbox());
    }

    // Success modal close
    const successModal = document.getElementById("contact-success-modal");
    const successClose = document.getElementById("contact-success-close");
    if (successClose && successModal) {
      successClose.addEventListener("click", () => {
        successModal.classList.remove("open");
        document.body.style.overflow = "";
      });
    }

    // Global Esc Key to close active modals
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCaseStudy();
        this.closePosterLightbox();
        if (successModal) successModal.classList.remove("open");
        document.body.style.overflow = "";
      }
    });

    // Close on backdrop click
    [csModal, posterModal, successModal].forEach(modal => {
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            modal.classList.remove("open");
            document.body.style.overflow = "";
          }
        });
      }
    });
  }

  openCaseStudy(projectId) {
    const projectIndex = projectsData.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    this.currentCaseStudyIndex = projectIndex;
    const project = projectsData[projectIndex];
    const modal = document.getElementById("case-study-modal");
    if (!modal) return;

    // Populate data
    document.getElementById("cs-title").textContent = project.title;
    document.getElementById("cs-category-badge").textContent = project.categoryLabel || project.category;
    document.getElementById("cs-type-badge").textContent = project.projectType;
    document.getElementById("cs-year").textContent = project.year;
    document.getElementById("cs-hero-img").src = project.heroImage;
    document.getElementById("cs-hero-img").alt = project.title;
    document.getElementById("cs-short-desc").textContent = project.shortDesc;
    document.getElementById("cs-idea-text").textContent = project.concept.theIdea;

    // Process steps
    const stepsContainer = document.getElementById("cs-process-steps");
    stepsContainer.innerHTML = "";
    project.concept.processSteps.forEach(step => {
      const stepElem = document.createElement("div");
      stepElem.className = "cs-step-card";
      stepElem.innerHTML = `
        <span class="cs-step-phase">${step.phase}</span>
        <p class="cs-step-desc">${step.desc}</p>
      `;
      stepsContainer.appendChild(stepElem);
    });

    // Tools
    const toolsContainer = document.getElementById("cs-tools-list");
    toolsContainer.innerHTML = "";
    project.concept.tools.forEach(tool => {
      const toolChip = document.createElement("span");
      toolChip.className = "cs-tool-chip";
      toolChip.textContent = tool;
      toolsContainer.appendChild(toolChip);
    });

    // Deliverables
    const delivContainer = document.getElementById("cs-deliverables-list");
    delivContainer.innerHTML = "";
    project.concept.deliverables.forEach(deliv => {
      const delivItem = document.createElement("li");
      delivItem.className = "cs-deliv-item";
      delivItem.innerHTML = `<span class="check">✓</span> <span>${deliv}</span>`;
      delivContainer.appendChild(delivItem);
    });

    // Gallery
    const galleryContainer = document.getElementById("cs-gallery-grid");
    galleryContainer.innerHTML = "";
    project.concept.gallery.forEach(item => {
      const galCard = document.createElement("div");
      galCard.className = "cs-gallery-card";
      galCard.innerHTML = `
        <div class="cs-gal-img-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="cs-gal-caption">
          <strong>${item.title}</strong>
          <span>${item.caption}</span>
        </div>
      `;
      galleryContainer.appendChild(galCard);
    });

    // Next Project navigation
    const nextIndex = (projectIndex + 1) % projectsData.length;
    const nextProject = projectsData[nextIndex];
    const nextBtn = document.getElementById("cs-next-btn");
    if (nextBtn) {
      nextBtn.innerHTML = `
        <div class="next-label">Next Project</div>
        <div class="next-title">${nextProject.title} →</div>
      `;
      nextBtn.onclick = () => {
        this.openCaseStudy(nextProject.id);
        modal.scrollTo({ top: 0, behavior: "smooth" });
      };
    }

    // Set standalone new tab link
    const newTabLink = document.getElementById("cs-newtab-link");
    if (newTabLink) {
      newTabLink.href = `project.html?id=${project.id}`;
    }

    modal.classList.add("open");
    modal.scrollTop = 0;
    document.body.style.overflow = "hidden";
  }

  closeCaseStudy() {
    const modal = document.getElementById("case-study-modal");
    if (modal) modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  openPosterLightbox(poster) {
    const modal = document.getElementById("poster-lightbox-modal");
    if (!modal) return;

    document.getElementById("pl-title").textContent = poster.title;
    document.getElementById("pl-category").textContent = poster.category;
    document.getElementById("pl-client").textContent = poster.client;
    document.getElementById("pl-year").textContent = poster.year;
    document.getElementById("pl-objective").textContent = poster.objective;
    document.getElementById("pl-desc").textContent = poster.description;
    document.getElementById("pl-dimensions").textContent = poster.dimensions;
    document.getElementById("pl-typography").textContent = poster.typography;
    document.getElementById("pl-img").src = poster.image;
    document.getElementById("pl-img").alt = poster.title;

    // Set standalone artwork link
    const posterNewTabLink = document.getElementById("pl-newtab-link");
    if (posterNewTabLink) {
      posterNewTabLink.href = poster.image;
    }

    // Tools
    const toolsWrap = document.getElementById("pl-tools");
    toolsWrap.innerHTML = "";
    poster.tools.forEach(t => {
      const sp = document.createElement("span");
      sp.className = "cs-tool-chip";
      sp.textContent = t;
      toolsWrap.appendChild(sp);
    });

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  closePosterLightbox() {
    const modal = document.getElementById("poster-lightbox-modal");
    if (modal) modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  openContactSuccessModal(data) {
    const modal = document.getElementById("contact-success-modal");
    if (!modal) return;

    document.getElementById("sm-name").textContent = data.name;
    document.getElementById("sm-service").textContent = data.service;
    document.getElementById("sm-budget").textContent = data.budget;

    // Direct WhatsApp send button
    const waSend = document.getElementById("sm-wa-send-btn");
    if (waSend) {
      const message = `*Project Request: Kani Vision Studio*\n\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Phone:* ${data.phone || 'N/A'}\n*Service:* ${data.service}\n*Budget:* ${data.budget}\n*Project Details:*\n${data.details}`;
      waSend.onclick = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
      };
    }

    // Copy to clipboard button
    const copyBtn = document.getElementById("sm-copy-btn");
    if (copyBtn) {
      copyBtn.onclick = () => {
        const text = `Kani Vision Studio Project Request:\nName: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\nBudget: ${data.budget}\nDetails: ${data.details}`;
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = "✓ Copied to Clipboard!";
          setTimeout(() => { copyBtn.textContent = "Copy Inquiry Details"; }, 3000);
        });
      };
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* ================= 11. MICRO-INTERACTIONS ================= */
  initMicroInteractions() {
    // Custom glowing cursor on mouse devices
    const cursor = document.getElementById("custom-cursor");
    const cursorDot = document.getElementById("custom-cursor-dot");

    if (cursor && cursorDot && window.matchMedia("(pointer: fine)").matches) {
      document.addEventListener("mousemove", (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      });

      // Hover scale on interactive elements
      const interactives = "a, button, input, select, textarea, .portfolio-card, .poster-card, .tool-card";
      document.querySelectorAll(interactives).forEach(el => {
        el.addEventListener("mouseenter", () => {
          cursor.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("cursor-hover");
        });
      });
    }

    // Scroll-to-top button
    const topBtn = document.getElementById("scroll-to-top-btn");
    if (topBtn) {
      window.addEventListener("scroll", () => {
        topBtn.classList.toggle("visible", window.scrollY > 600);
      }, { passive: true });

      topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ================= 12. SCROLL REVEAL ================= */
  initScrollReveal() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      });

      document.querySelectorAll(".reveal-on-scroll").forEach(el => {
        observer.observe(el);
      });
    }
  }
}

// Instantiate
new App();
