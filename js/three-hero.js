/**
 * Kani Vision Studio - Three.js Interactive Hero 3D Sculpture
 * Renders a futuristic metallic & glass geometric structure with dynamic lighting,
 * smooth auto-rotation, mouse parallax, and mode switching.
 */

export class Hero3DExperience {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mainGroup = null;
    this.sculpture = null;
    this.torusKnot = null;
    this.particles = null;
    this.rings = [];
    this.lights = {};
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    
    this.currentMode = "sculpture"; // "sculpture", "torus", "wireframe", "hologram"
    this.isRotating = true;
    this.clock = null;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    // Check WebGL availability
    if (!this.isWebGLAvailable()) {
      console.warn("WebGL not supported, falling back to static visual.");
      this.showFallback();
      return;
    }

    try {
      this.setupScene();
      this.createSculptures();
      this.createParticles();
      this.createRings();
      this.setupLighting();
      this.setupEvents();
      this.animate();
    } catch (err) {
      console.error("Three.js hero initialization failed:", err);
      this.showFallback();
    }
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  showFallback() {
    if (this.container) {
      const fallback = this.container.querySelector(".hero-3d-fallback");
      if (fallback) fallback.style.display = "block";
      const canvas = this.container.querySelector("canvas");
      if (canvas) canvas.style.display = "none";
    }
  }

  setupScene() {
    const width = this.container.clientWidth || window.innerWidth * 0.5;
    const height = this.container.clientHeight || 600;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 7.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);
    this.clock = new THREE.Clock();

    // Main Group to rotate
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);
  }

  createSculptures() {
    // 1. Primary Polyhedral Sculpture (Icosahedron with sub-geometries)
    const geom1 = new THREE.IcosahedronGeometry(2.1, 1);
    
    // Glossy metallic shader with iridescent tint
    this.metalMat = new THREE.MeshPhysicalMaterial({
      color: 0x1f2438,
      emissive: 0x090d1a,
      roughness: 0.18,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      wireframe: false
    });

    this.sculpture = new THREE.Mesh(geom1, this.metalMat);
    this.mainGroup.add(this.sculpture);

    // Inner glowing crystal core
    const coreGeom = new THREE.OctahedronGeometry(0.9, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true
    });
    this.coreMesh = new THREE.Mesh(coreGeom, coreMat);
    this.mainGroup.add(this.coreMesh);

    // 2. Alternative Torus Knot Sculpture (Initially hidden)
    const knotGeom = new THREE.TorusKnotGeometry(1.6, 0.45, 128, 32, 2, 3);
    this.torusKnot = new THREE.Mesh(knotGeom, this.metalMat.clone());
    this.torusKnot.visible = false;
    this.mainGroup.add(this.torusKnot);
  }

  createRings() {
    // Outer floating orbital gimbal rings
    const ringData = [
      { radius: 3.2, tube: 0.02, color: 0x8b5cf6, rotX: 0.5, rotY: 0.2 },
      { radius: 3.5, tube: 0.015, color: 0x06b6d4, rotX: -0.4, rotY: 0.7 }
    ];

    ringData.forEach(item => {
      const ringGeom = new THREE.TorusGeometry(item.radius, item.tube, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.65
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = item.rotX;
      ring.rotation.y = item.rotY;
      this.rings.push(ring);
      this.mainGroup.add(ring);
    });
  }

  createParticles() {
    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(0x8b5cf6);
    const c2 = new THREE.Color(0x06b6d4);

    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mixed = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setupLighting() {
    // Ambient Light
    this.lights.ambient = new THREE.AmbientLight(0x0e111a, 2.5);
    this.scene.add(this.lights.ambient);

    // Directional Key Light (Electric Cyan)
    this.lights.key = new THREE.DirectionalLight(0x06b6d4, 3.5);
    this.lights.key.position.set(5, 6, 4);
    this.scene.add(this.lights.key);

    // Directional Rim Light (Electric Violet)
    this.lights.rim = new THREE.DirectionalLight(0x8b5cf6, 4.0);
    this.lights.rim.position.set(-6, -4, -3);
    this.scene.add(this.lights.rim);

    // Top Highlight (White specularity)
    this.lights.top = new THREE.DirectionalLight(0xffffff, 1.8);
    this.lights.top.position.set(0, 8, 2);
    this.scene.add(this.lights.top);

    // Internal Pulsing Core Light
    this.lights.core = new THREE.PointLight(0x38bdf8, 2.0, 6);
    this.lights.core.position.set(0, 0, 0);
    this.scene.add(this.lights.core);
  }

  setupEvents() {
    // Mouse move parallax
    window.addEventListener("mousemove", (e) => {
      const rect = this.container.getBoundingClientRect();
      const inHero = e.clientY <= window.innerHeight * 1.1;
      if (inHero) {
        this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    });

    // Touch move support
    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        this.mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });

    // Window resize
    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setMode(mode) {
    this.currentMode = mode;
    const activeMesh = this.torusKnot.visible ? this.torusKnot : this.sculpture;

    if (mode === "sculpture") {
      this.sculpture.visible = true;
      this.torusKnot.visible = false;
      this.metalMat.wireframe = false;
      this.metalMat.color.setHex(0x1f2438);
      this.metalMat.roughness = 0.18;
      this.metalMat.metalness = 0.85;
      this.coreMesh.visible = true;
    } else if (mode === "torus") {
      this.sculpture.visible = false;
      this.torusKnot.visible = true;
      this.torusKnot.material.wireframe = false;
      this.torusKnot.material.color.setHex(0x241d3d);
      this.torusKnot.material.metalness = 0.9;
      this.coreMesh.visible = false;
    } else if (mode === "wireframe") {
      this.sculpture.visible = true;
      this.torusKnot.visible = false;
      this.metalMat.wireframe = true;
      this.metalMat.color.setHex(0x38bdf8);
      this.coreMesh.visible = true;
    } else if (mode === "hologram") {
      this.sculpture.visible = true;
      this.torusKnot.visible = false;
      this.metalMat.wireframe = false;
      this.metalMat.color.setHex(0x8b5cf6);
      this.metalMat.roughness = 0.4;
      this.metalMat.metalness = 0.3;
      this.coreMesh.visible = true;
    }
  }

  toggleRotation() {
    this.isRotating = !this.isRotating;
    return this.isRotating;
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    if (this.mainGroup) {
      // Gentle auto-rotation
      if (this.isRotating) {
        this.mainGroup.rotation.y += delta * 0.35;
        this.mainGroup.rotation.x += delta * 0.15;
      }

      // Parallax mouse follow with smooth interpolation
      this.targetRotationX = this.mouseY * 0.5;
      this.targetRotationY = this.mouseX * 0.6;

      this.mainGroup.rotation.x += (this.targetRotationX - this.mainGroup.rotation.x) * 0.05;
      this.mainGroup.rotation.y += (this.targetRotationY - this.mainGroup.rotation.y) * 0.05;

      // Subtle breathing float on Y
      this.mainGroup.position.y = Math.sin(elapsed * 1.2) * 0.15;

      // Inner Core Counter-Rotation & Pulse
      if (this.coreMesh) {
        this.coreMesh.rotation.y -= delta * 0.8;
        this.coreMesh.rotation.z += delta * 0.5;
        const scale = 1 + Math.sin(elapsed * 2.5) * 0.12;
        this.coreMesh.scale.set(scale, scale, scale);
      }

      // Orbital Rings Rotation
      if (this.rings.length > 0) {
        this.rings[0].rotation.z += delta * 0.25;
        this.rings[1].rotation.z -= delta * 0.35;
      }
    }

    // Particle Swarm slow orbit
    if (this.particles) {
      this.particles.rotation.y += delta * 0.08;
    }

    // Core point light pulse
    if (this.lights.core) {
      this.lights.core.intensity = 1.8 + Math.sin(elapsed * 3) * 0.8;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
