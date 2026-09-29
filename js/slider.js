/**
 * Kani Vision Studio - Interactive Before / After Sliders & Stage Switchers
 * Handles mouse and touch drag interactions, keyboard arrows, and smooth transitions.
 */

export class BeforeAfterSlider {
  constructor(containerElement) {
    this.container = containerElement;
    if (!this.container) return;

    this.sliderHandle = this.container.querySelector(".ba-handle");
    this.topImageWrapper = this.container.querySelector(".ba-top-image");
    this.isDragging = false;

    this.init();
  }

  init() {
    if (!this.sliderHandle || !this.topImageWrapper) return;

    // Set initial 50% split
    this.setSplit(50);

    // Mouse events
    this.sliderHandle.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      e.preventDefault();
    });

    this.container.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.updateFromEvent(e);
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.updateFromEvent(e);
    });

    // Touch events for mobile & tablet
    this.container.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        this.isDragging = true;
        this.updateFromTouch(e.touches[0]);
      }
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!this.isDragging || e.touches.length === 0) return;
      this.updateFromTouch(e.touches[0]);
    }, { passive: true });

    window.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    // Keyboard support for accessibility
    this.sliderHandle.setAttribute("tabindex", "0");
    this.sliderHandle.setAttribute("role", "slider");
    this.sliderHandle.setAttribute("aria-valuenow", "50");
    this.sliderHandle.setAttribute("aria-valuemin", "0");
    this.sliderHandle.setAttribute("aria-valuemax", "100");
    this.sliderHandle.setAttribute("aria-label", "Comparison slider");

    this.sliderHandle.addEventListener("keydown", (e) => {
      let currentVal = parseFloat(this.sliderHandle.getAttribute("aria-valuenow") || "50");
      if (e.key === "ArrowLeft") {
        this.setSplit(Math.max(0, currentVal - 5));
      } else if (e.key === "ArrowRight") {
        this.setSplit(Math.min(100, currentVal + 5));
      }
    });
  }

  updateFromEvent(e) {
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    this.setSplit(percentage);
  }

  updateFromTouch(touch) {
    const rect = this.container.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    this.setSplit(percentage);
  }

  setSplit(percentage) {
    if (this.sliderHandle) {
      this.sliderHandle.style.left = `${percentage}%`;
      this.sliderHandle.setAttribute("aria-valuenow", Math.round(percentage));
    }
    if (this.topImageWrapper) {
      this.topImageWrapper.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    }
  }
}

/**
 * 3D Stages Switcher (Wireframe -> Material -> Final Render)
 */
export class StagesSwitcher {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.stageButtons = this.container.querySelectorAll("[data-stage-btn]");
    this.stageImages = this.container.querySelectorAll("[data-stage-img]");
    this.stageInfo = this.container.querySelectorAll("[data-stage-info]");
    this.currentStage = "wireframe";

    this.init();
  }

  init() {
    this.stageButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const stage = btn.getAttribute("data-stage-btn");
        this.switchStage(stage);
      });
    });
  }

  switchStage(stageName) {
    this.currentStage = stageName;

    // Update active button state
    this.stageButtons.forEach(btn => {
      const isTarget = btn.getAttribute("data-stage-btn") === stageName;
      btn.classList.toggle("active", isTarget);
      btn.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    // Update stage images with cross-fade
    this.stageImages.forEach(img => {
      const isTarget = img.getAttribute("data-stage-img") === stageName;
      img.classList.toggle("active", isTarget);
      img.style.opacity = isTarget ? "1" : "0";
      img.style.pointerEvents = isTarget ? "auto" : "none";
    });

    // Update descriptive text
    this.stageInfo.forEach(info => {
      const isTarget = info.getAttribute("data-stage-info") === stageName;
      info.classList.toggle("active", isTarget);
      info.style.display = isTarget ? "block" : "none";
    });
  }
}
