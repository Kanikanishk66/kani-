/**
 * Kani Vision Studio - Interactive 3D Model Viewer Sandbox (Section 7)
 * Allows visitors to inspect, rotate, zoom, and toggle wireframe/lighting on an interactive 3D asset.
 */

export class ModelViewer3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.modelGroup = null;
    this.wireframeMesh = null;
    this.solidMesh = null;
    this.lights = {};
    
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.autoRotate = true;
    this.isWireframe = false;
    this.currentLightPreset = "cyber"; // "cyber", "cyan", "studio"
    
    this.init();
  }

  init() {
    if (!this.isWebGLAvailable()) {
      this.showFallback();
      return;
    }

    try {
      this.setupScene();
      this.buildModel();
      this.setupLighting();
      this.setupControls();
      this.animate();
    } catch (e) {
      console.warn("ModelViewer3D failed to init:", e);
      this.showFallback();
    }
  }

  isWebGLAvailable() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  showFallback() {
    if (this.container) {
      const fb = this.container.querySelector(".viewer-fallback");
      if (fb) fb.style.display = "block";
      const c = this.container.querySelector("canvas");
      if (c) c.style.display = "none";
    }
  }

  setupScene() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 6);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    this.container.appendChild(this.renderer.domElement);
    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);
  }

  buildModel() {
    // Intricate Futuristic Drone / Probe Assembly
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1e2b,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15
    });

    const accentMat = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x241142,
      metalness: 0.9,
      roughness: 0.15
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0.9
    });

    // 1. Central Core Sphere
    const coreGeom = new THREE.SphereGeometry(1.2, 32, 24);
    this.solidMesh = new THREE.Mesh(coreGeom, baseMat);
    this.modelGroup.add(this.solidMesh);

    // 2. Center Equatorial Ring
    const ringGeom = new THREE.TorusGeometry(1.5, 0.08, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeom, accentMat);
    ringMesh.rotation.x = Math.PI / 2;
    this.modelGroup.add(ringMesh);

    // 3. Sensor Arrays & Solar Wing Booms
    const wingGeom = new THREE.BoxGeometry(0.8, 0.06, 0.4);
    const wingLeft = new THREE.Mesh(wingGeom, baseMat);
    wingLeft.position.set(-1.8, 0, 0);
    const wingRight = new THREE.Mesh(wingGeom, baseMat);
    wingRight.position.set(1.8, 0, 0);
    this.modelGroup.add(wingLeft);
    this.modelGroup.add(wingRight);

    // 4. Optical Eye Lens
    const lensGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32);
    const lensMesh = new THREE.Mesh(lensGeom, glassMat);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, 0, 1.15);
    this.modelGroup.add(lensMesh);

    // 5. Thruster Nozzles
    const coneGeom = new THREE.ConeGeometry(0.35, 0.6, 24, 1, true);
    const coneMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.3 });
    const coneTop = new THREE.Mesh(coneGeom, coneMat);
    coneTop.position.set(0, 1.4, 0);
    coneTop.rotation.z = Math.PI;
    const coneBottom = new THREE.Mesh(coneGeom, coneMat);
    coneBottom.position.set(0, -1.4, 0);
    this.modelGroup.add(coneTop);
    this.modelGroup.add(coneBottom);

    // 6. Wireframe Overlay (for toggling)
    const wireGeom = new THREE.WireframeGeometry(coreGeom);
    this.wireframeMesh = new THREE.LineSegments(wireGeom);
    this.wireframeMesh.material.color.setHex(0x38bdf8);
    this.wireframeMesh.material.transparent = true;
    this.wireframeMesh.material.opacity = 0.8;
    this.wireframeMesh.visible = false;
    this.modelGroup.add(this.wireframeMesh);
  }

  setupLighting() {
    this.lights.ambient = new THREE.AmbientLight(0x11131f, 2.0);
    this.scene.add(this.lights.ambient);

    this.lights.dir1 = new THREE.DirectionalLight(0x8b5cf6, 3.5);
    this.lights.dir1.position.set(4, 5, 3);
    this.scene.add(this.lights.dir1);

    this.lights.dir2 = new THREE.DirectionalLight(0x06b6d4, 3.0);
    this.lights.dir2.position.set(-4, -3, -2);
    this.scene.add(this.lights.dir2);

    this.lights.rim = new THREE.DirectionalLight(0xffffff, 1.5);
    this.lights.rim.position.set(0, 6, 2);
    this.scene.add(this.lights.rim);
  }

  setupControls() {
    const dom = this.renderer.domElement;

    // Mouse drag rotation
    dom.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    dom.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.modelGroup.rotation.y += deltaX * 0.01;
      this.modelGroup.rotation.x += deltaY * 0.01;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch support
    dom.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    dom.addEventListener("touchmove", (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.modelGroup.rotation.y += deltaX * 0.01;
      this.modelGroup.rotation.x += deltaY * 0.01;

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    // Zoom via wheel
    dom.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.camera.position.z = Math.min(Math.max(this.camera.position.z + e.deltaY * 0.005, 3.5), 9.0);
    }, { passive: false });

    window.addEventListener("resize", () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    if (this.wireframeMesh) {
      this.wireframeMesh.visible = this.isWireframe;
    }
    if (this.solidMesh) {
      this.solidMesh.material.wireframe = this.isWireframe;
    }
    return this.isWireframe;
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    return this.autoRotate;
  }

  setLightPreset(preset) {
    this.currentLightPreset = preset;
    if (preset === "cyber") {
      this.lights.dir1.color.setHex(0x8b5cf6);
      this.lights.dir2.color.setHex(0x06b6d4);
      this.lights.dir1.intensity = 3.5;
    } else if (preset === "cyan") {
      this.lights.dir1.color.setHex(0x06b6d4);
      this.lights.dir2.color.setHex(0x38bdf8);
      this.lights.dir1.intensity = 4.0;
    } else if (preset === "studio") {
      this.lights.dir1.color.setHex(0xffffff);
      this.lights.dir2.color.setHex(0x94a3b8);
      this.lights.dir1.intensity = 2.8;
    }
  }

  resetView() {
    this.camera.position.set(0, 0, 6);
    this.modelGroup.rotation.set(0, 0, 0);
    this.autoRotate = true;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.autoRotate && this.modelGroup) {
      this.modelGroup.rotation.y += 0.008;
      this.modelGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.12;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
