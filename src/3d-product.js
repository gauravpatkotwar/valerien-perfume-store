import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Product3DScene {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Scene Setup
    this.scene = new THREE.Scene();
    
    // Camera Setup - offset slightly to keep model on the right
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 3, 10);
    
    // Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true // Allow transparent background
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setClearColor(0x0a0a0c, 1); // Dark background

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false;
    this.controls.enableZoom = false; // Disable zoom to keep it as background
    this.controls.minPolarAngle = Math.PI / 4;
    this.controls.maxPolarAngle = Math.PI / 1.5;
    
    // Group for the product to offset it
    this.productGroup = new THREE.Group();
    // Offset product to the right side of the screen
    this.productGroup.position.set(2, 0, 0); 
    this.scene.add(this.productGroup);

    this.initLighting();
    this.buildPerfumeMockup();
    this.initParticles();

    window.addEventListener('resize', () => this.onResize());
    
    // Handle mouse movement for subtle parallax
    this.mouseX = 0;
    this.mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Key Light (Warm)
    const keyLight = new THREE.DirectionalLight(0xffdfb3, 1.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // Fill Light (Cool)
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fillLight.position.set(-5, 4, -3);
    this.scene.add(fillLight);

    // Rim Light (Gold/Accent)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(-4, 6, -6);
    this.scene.add(rimLight);
    
    // Shadow receiver plane
    const planeGeo = new THREE.PlaneGeometry(50, 50);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.5 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2.3;
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  buildPerfumeMockup() {
    // We will build a high-quality glass bottle and an outer box.
    const textureLoader = new THREE.TextureLoader();
    
    // Config
    const primaryColor = 0x0f0f11; // Very dark grey/black
    const accentColor = 0xd4af37; // Gold
    
    // 1. Outer Box
    const boxGeo = new THREE.BoxGeometry(2.4, 4.6, 2.4);
    
    // Box material with slight noise/bump for paper texture
    const boxMat = new THREE.MeshStandardMaterial({ 
      color: primaryColor, 
      roughness: 0.8,
      metalness: 0.1
    });
    
    this.boxMesh = new THREE.Mesh(boxGeo, boxMat);
    this.boxMesh.position.set(1.4, 0, -1.0);
    this.boxMesh.rotation.y = -Math.PI * 0.15;
    this.boxMesh.castShadow = true;
    this.boxMesh.receiveShadow = true;
    this.productGroup.add(this.boxMesh);

    // Gold Foil Trim on Box
    const trimGeo = new THREE.BoxGeometry(2.42, 0.05, 2.42);
    const trimMat = new THREE.MeshStandardMaterial({ 
      color: accentColor, 
      metalness: 1.0, 
      roughness: 0.2 
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = -1.5;
    this.boxMesh.add(trimMesh);
    const trimMesh2 = new THREE.Mesh(trimGeo, trimMat);
    trimMesh2.position.y = 1.5;
    this.boxMesh.add(trimMesh2);

    // 2. Glass Perfume Bottle
    const glassGeo = new THREE.CylinderGeometry(1.0, 1.1, 3.2, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95, // Glass effect
      opacity: 1.0,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    this.glassMesh = new THREE.Mesh(glassGeo, glassMat);
    this.glassMesh.position.set(-1.2, -0.7, 0.5);
    this.glassMesh.castShadow = true;
    this.productGroup.add(this.glassMesh);

    // 3. Liquid inside bottle
    const fluidGeo = new THREE.CylinderGeometry(0.85, 0.95, 2.2, 48);
    const fluidMat = new THREE.MeshPhysicalMaterial({
      color: 0xeab308, // Golden liquid
      transmission: 0.8,
      opacity: 1.0,
      transparent: true,
      roughness: 0.1,
      ior: 1.33
    });
    this.fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
    this.fluidMesh.position.set(-1.2, -0.9, 0.5);
    this.productGroup.add(this.fluidMesh);

    // 4. Gold Cap & Atomizer
    const nozzleMat = new THREE.MeshStandardMaterial({ 
      color: accentColor, 
      metalness: 1.0, 
      roughness: 0.15 
    });
    const capGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.0, 32);
    this.capMesh = new THREE.Mesh(capGeo, nozzleMat);
    this.capMesh.position.set(-1.2, 1.4, 0.5);
    this.capMesh.castShadow = true;
    this.productGroup.add(this.capMesh);
    
    // Base platform for product
    const baseGeo = new THREE.CylinderGeometry(4, 4, 0.2, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111113,
      roughness: 0.2,
      metalness: 0.8
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -2.4;
    baseMesh.receiveShadow = true;
    this.productGroup.add(baseMesh);
  }

  initParticles() {
    const count = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xd4af37, // Gold dust
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Adjust layout for mobile
    if (window.innerWidth < 768) {
      this.productGroup.position.set(0, -1, 0);
      this.controls.enableZoom = true;
    } else {
      this.productGroup.position.set(2, 0, 0);
      this.controls.enableZoom = false;
    }
  }

  render(time) {
    this.controls.update();
    
    // Slow auto-rotation
    this.productGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
    
    // Subtle parallax effect with mouse
    this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x) * 0.05;
    this.camera.position.y += (3 + this.mouseY * 0.5 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.productGroup.position);

    // Rotate particles
    if (this.particles) {
      this.particles.rotation.y = time * 0.05;
      this.particles.rotation.x = time * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
