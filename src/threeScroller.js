import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ThreeScroller {
  constructor(container) {
    this.container = container || document.body;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lenis = null;
    this.rafId = null;
    this.isDestroyed = false;

    // Animation & State
    this.cameraStates = {
      initial: { 
        x: -70, y: 300, z: 75,
        rotationX: -0.3, rotationY: 0.4, rotationZ: -0.1
      },
      final: { 
        x: 0, y: 15, z: 12,
        rotationX: 0, rotationY: 0, rotationZ: 0
      }
    };
    this.animationProgress = 0;
    this.isIntroComplete = false;
    this.galleryGroup = null;
    this.tower = null;
    this.towerRotation = 0;
    this.textureLoader = new THREE.TextureLoader();
    this.gltfLoader = new GLTFLoader();

    this.radius = 8;
    this.height = 30;
    this.segments = 30;
    this.numVerticalSections = 10;
    this.blockPerSection = 1;
    this.verticalSpacing = 4;
    this.blocks = [];
    this.blockGeometries = [];
    this.blockBendAmounts = [];
    this.blockTargetBends = [];
    this.originalVertices = [];
    this.blockMeshes = [];
    this.blockHoverStates = [];
    this.blockHoverProgress = [];
    this.finalAngle = 0;

    this.currentScroll = 0;
    this.rotationSpeed = 0;
    this.baseRotationSpeed = 0;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isInitialized = false;

    this.onMouseMove = (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    this.onResize = () => {
      if (!this.renderer || !this.camera) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
  }

  mount() {
    this.renderDOM();
    this.initThree();
    this.initLenis();
    this.start();
  }

  renderDOM() {
    const existing = document.getElementById('three-d-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'three-d-root';
    root.className = 'three-d-page';
    root.innerHTML = `
      <main class="content">
        <section class="section">
          <h2>4 domains</h2>
        </section>
        <section class="section">
          <h2>42 hours</h2>
        </section>
        <section class="section">
          <h2>100+ team</h2>
        </section>
        <section class="section">
          <h2>infinite possibilities</h2>
        </section>
        <section class="section">
          <h2>TRANSFINITTE</h2>
        </section>
      </main>
    `;
        <section class="section">
          <h2>4 domains</h2>
        </section>
        <section class="section">
          <h2>42 hours</h2>
        </section>
        <section class="section">
          <h2>100+ team</h2>
        </section>
        <section class="section">
          <h2>infinite possibilities</h2>
        </section>
        <section class="section">
          <h2>TRANSFINITTE</h2>
        </section>
      </main>
    `;
    this.container.appendChild(root);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    const root = document.getElementById('three-d-root') || this.container;
    root.appendChild(this.renderer.domElement);

    this.camera.position.set(this.cameraStates.initial.x, this.cameraStates.initial.y, this.cameraStates.initial.z);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.galleryGroup = new THREE.Group();
    this.scene.add(this.galleryGroup);

    const cylinderGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, this.segments, 1, true);
    const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0, transparent: true });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    this.galleryGroup.add(cylinder);

    // Load tower model
    this.gltfLoader.load('/tower.glb', (gltf) => {
      if (this.isDestroyed) return;
      this.tower = gltf.scene;
      this.tower.position.set(0, -27, 0);
      this.tower.scale.set(1, 2, 1);
      this.scene.add(this.tower);
    });

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);
  }

  getRandomImage() {
    return Math.floor(Math.random() * 3) + 1;
  }

  loadImageTexture(imageNumber) {
    return new Promise((resolve) => {
      this.textureLoader.load(`/image${imageNumber}.png`, (loadedTexture) => {
        if (this.isDestroyed) return;
        loadedTexture.generateMipmaps = true;
        loadedTexture.minFilter = THREE.LinearMipMapLinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        if (this.renderer) {
          loadedTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        }
        resolve(loadedTexture);
      });
    });
  }

  createCurvedPlane(width, height, radius, segments) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
    const indices = [];
    const segmentsX = segments * 4;
    const segmentsY = Math.floor(height * 12);
    const theta = width / radius;

    for (let y = 0; y <= segmentsY; y++) {
      const yPos = (y / segmentsY - 0.5) * height;
      for (let x = 0; x <= segmentsX; x++) {
        const xAngle = (x / segmentsX - 0.5) * theta;
        const xPos = radius * Math.sin(xAngle);
        const zPos = radius * Math.cos(xAngle);
        vertices.push(xPos, yPos, zPos);
        uvs.push((x / segmentsX) * 0.8 + 0.1, y / segmentsY);
      }
    }

    for (let y = 0; y < segmentsY; y++) {
      for (let x = 0; x < segmentsX; x++) {
        const a = x + (segmentsX + 1) * y;
        const b = x + (segmentsX + 1) * (y + 1);
        const c = x + 1 + (segmentsX + 1) * (y + 1);
        const d = x + 1 + (segmentsX + 1) * y;
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  async createBlocks(BaseY, yOffset, sectionIndex, blockIndex) {
    const blockGeometry = this.createCurvedPlane(6, 3.5, this.radius, 10);
    const imageNumber = this.getRandomImage();
    const texture = await this.loadImageTexture(imageNumber);

    const blockMaterial = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        colorProgress: { value: 0.0 },
        transitionProgress: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float colorProgress;
        uniform float transitionProgress;
        varying vec2 vUv;
        
        void main() {
          vec4 textureColor = texture2D(map, vUv);
          float gray = dot(textureColor.rgb, vec3(0.299, 0.587, 0.114));
          vec3 grayColor = vec3(gray * 0.6);
          vec3 enhancedColor = textureColor.rgb;
          float revealThreshold = transitionProgress * 1.1;
          float softness = 0.25;
          float reveal = smoothstep(revealThreshold - softness, revealThreshold + softness, vUv.x);
          reveal = 1.0 - reveal;
          vec3 finalColor = mix(grayColor, enhancedColor, reveal * colorProgress);
          gl_FragColor = vec4(finalColor, textureColor.a);
        }
      `,
      side: THREE.DoubleSide
    });

    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    block.position.y += BaseY;
    const blockContainer = new THREE.Group();
    this.finalAngle = this.finalAngle - 2 * Math.PI / 5;
    blockContainer.rotation.y = this.finalAngle;
    blockContainer.add(block);

    this.blockGeometries.push(blockGeometry);
    this.blockBendAmounts.push(0);
    this.blockTargetBends.push(0);
    const positions = blockGeometry.attributes.position.array.slice();
    this.originalVertices.push(positions);

    this.blockMeshes.push(block);
    this.blockHoverStates.push(0);
    this.blockHoverProgress.push(0);

    return blockContainer;
  }

  async initializeBlocks() {
    const startY = -this.height / 2 + this.verticalSpacing - 10;
    for (let section = 0; section < this.numVerticalSections; section++) {
      if (this.isDestroyed) return;
      const baseY = startY + section * this.verticalSpacing;
      for (let i = 0; i < this.blockPerSection; i++) {
        const blockContainer = await this.createBlocks(baseY, 1, section, i);
        if (this.isDestroyed) return;
        this.blocks.push(blockContainer);
        this.galleryGroup.add(blockContainer);
      }
    }
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    this.lenis.on('scroll', (e) => {
      this.currentScroll = e.scroll;
      this.rotationSpeed = e.velocity * 0.0033;
      for (let i = 0; i < this.blockTargetBends.length; i++) {
        this.blockTargetBends[i] = e.velocity * 0.01;
      }
    });
  }

  animate() {
    if (this.isDestroyed) return;

    if (!this.isIntroComplete) {
      this.animationProgress += 0.003;
      const t = Math.min(this.animationProgress, 1.0);
      const easeT = 1 - Math.pow(1 - t, 3);
      this.camera.position.x = THREE.MathUtils.lerp(this.cameraStates.initial.x, this.cameraStates.final.x, easeT);
      this.camera.position.y = THREE.MathUtils.lerp(this.cameraStates.initial.y, this.cameraStates.final.y, easeT);
      this.camera.position.z = THREE.MathUtils.lerp(this.cameraStates.initial.z, this.cameraStates.final.z, easeT);
      if (t >= 1.0) {
        this.isIntroComplete = true;
      }
    } else {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollHeight > 0 ? this.currentScroll / scrollHeight : 0;
      const targetY = scrollFraction * this.height - this.height / 2;
      this.camera.position.y += (-targetY - this.camera.position.y) * 0.1;
    }

    if (this.galleryGroup) {
      this.galleryGroup.rotation.y -= this.baseRotationSpeed + this.rotationSpeed;
    }
    this.rotationSpeed *= 0.95;

    // Bending effect
    for (let g = 0; g < this.blockGeometries.length; g++) {
      const geometry = this.blockGeometries[g];
      const positions = geometry.attributes.position;
      const originalPos = this.originalVertices[g];
      const targetBend = this.blockTargetBends[g];
      this.blockBendAmounts[g] += (targetBend - this.blockBendAmounts[g]) * 0.12;
      this.blockTargetBends[g] *= 0.88;
      const bendAmount = this.blockBendAmounts[g];

      let maxY = -Infinity;
      for (let i = 1; i < positions.count * 3; i += 3) {
        if (originalPos[i] > maxY) maxY = originalPos[i];
      }

      for (let i = 0; i < positions.count; i++) {
        const vertexY = originalPos[i * 3 + 1];
        const normalizedHeight = Math.max(0, (vertexY - (maxY - 1.5)) / 1.5);
        if (normalizedHeight > 0) {
          const x = originalPos[i * 3];
          const z = originalPos[i * 3 + 2];
          const easedHeight = normalizedHeight * normalizedHeight * (3 - 2 * normalizedHeight);
          const bendFactor = bendAmount * easedHeight;
          const cosVal = Math.cos(-bendFactor);
          const sinVal = Math.sin(-bendFactor);
          positions.setX(i, x * cosVal - z * sinVal);
          positions.setZ(i, x * sinVal + z * cosVal);
          positions.setY(i, vertexY);
        } else {
          positions.setXYZ(i, originalPos[i * 3], originalPos[i * 3 + 1], originalPos[i * 3 + 2]);
        }
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
    }

    // Hover effect
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.blockMeshes);
    let hoveredIndex = -1;

    if (this.isInitialized && this.isIntroComplete && intersects.length > 0) {
      hoveredIndex = this.blockMeshes.indexOf(intersects[0].object);
    }

    for (let i = 0; i < this.blockHoverStates.length; i++) {
      if (!this.isInitialized) {
        this.blockHoverStates[i] = 0.0;
        this.blockHoverProgress[i] = 0.0;
      } else if (i === hoveredIndex) {
        this.blockHoverStates[i] += 0.07;
        if (this.blockHoverStates[i] > 1.0) this.blockHoverStates[i] = 1.0;
        this.blockHoverProgress[i] += 0.015;
        if (this.blockHoverProgress[i] > 1.0) this.blockHoverProgress[i] = 1.0;
      } else {
        this.blockHoverStates[i] -= 0.025;
        if (this.blockHoverStates[i] < 0.0) this.blockHoverStates[i] = 0.0;
        this.blockHoverProgress[i] -= 0.035;
        if (this.blockHoverProgress[i] < 0.0) this.blockHoverProgress[i] = 0.0;
      }

      const material = this.blockMeshes[i].material;
      if (material && material.uniforms) {
        material.uniforms.colorProgress.value = this.blockHoverStates[i];
        material.uniforms.transitionProgress.value = this.blockHoverProgress[i];
      }
    }

    if (this.tower) {
      this.towerRotation -= (this.baseRotationSpeed + this.rotationSpeed) * 0.3;
      this.tower.rotation.y = this.towerRotation;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  async start() {
    await this.initializeBlocks();
    for (let i = 0; i < this.blockMeshes.length; i++) {
      const material = this.blockMeshes[i].material;
      if (material && material.uniforms) {
        material.uniforms.colorProgress.value = 0.0;
        material.uniforms.transitionProgress.value = 0.0;
      }
    }

    setTimeout(() => {
      if (!this.isDestroyed) this.isInitialized = true;
    }, 500);

    const raf = (time) => {
      if (this.isDestroyed) return;
      if (this.lenis) this.lenis.raf(time);
      this.animate();
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }

  destroy() {
    this.isDestroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.lenis) this.lenis.destroy();
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }

    const root = document.getElementById('three-d-root');
    if (root) root.remove();
  }
}
