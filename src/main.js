import * as THREE from 'three';
import Lenis from '@studio-freight/lenis'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer( { antialias: true 
    , alpha: true } );
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); 
document.body.appendChild(renderer.domElement);

// Camera animation variables
const cameraStates = {
    initial: { 
        x: -70, y: 300, z: 75,
        rotationX: -0.3, rotationY: 0.4, rotationZ: -0.1  // Initial tilt
    },
    final: { 
        x: 0, y: 15, z: 12,
        rotationX: 0, rotationY: 0, rotationZ: 0  // Final straight orientation
    }       // Final: slightly above center to avoid tower
};

let animationProgress = 0;
let isIntroComplete = false;

// Set initial camera position and orientation
camera.position.set(cameraStates.initial.x, cameraStates.initial.y, cameraStates.initial.z);
// Don't use lookAt - let camera maintain forward direction

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const galleryGroup = new THREE.Group();
scene.add(galleryGroup);

const radius = 8;
const height =30;
const segments=30;
const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, segments,1,true);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide,opacity: 0, transparent: true });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
galleryGroup.add(cylinder);

const textureLoader = new THREE.TextureLoader();

function getRandomImage(){
    return Math.floor(Math.random() * 3) + 1;
}


function loadImageTexture(imageNumber) {
    return new Promise((resolve) => {
        const texture=textureLoader.load(`/image${imageNumber}.png`, 
            (loadedTexture) => {
               loadedTexture.generateMipmaps = true;
               loadedTexture.minFilter =THREE.LinearMipMapLinearFilter;
               loadedTexture.magFilter = THREE.LinearFilter;
               loadedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
               resolve(loadedTexture);
            },
         
          
        );
    });
}

function createCurvedPlane(width, height, radius, segments) {
 const geometry = new THREE.BufferGeometry();
 const vertices = [];
 const uvs = [];
 const indices = [];
 const segmentsX = segments*4;
 const segmentsY = Math.floor(height*12);
 const theta=width/radius;
    for (let y = 0; y <= segmentsY; y++) {
        const yPos = (y / segmentsY-0.5) * height;
        for (let x = 0; x <= segmentsX; x++) {
            const xAngle = (x / segmentsX-0.5) * theta;
            const xPos = radius * Math.sin(xAngle);
            const zPos = radius * Math.cos(xAngle);
            vertices.push(xPos, yPos, zPos);
            uvs.push((x / segmentsX)*0.8+0.1, y / segmentsY);


        }
       
    }
    for (let y = 0; y < segmentsY; y++) {
        for (let x = 0; x < segmentsX; x++) {
            const a = x + (segmentsX + 1) * y;
            const b = x + (segmentsX + 1) * (y + 1);
            const c = x + 1 + (segmentsX + 1) * (y+1);
            const d = x + 1 + (segmentsX + 1) * (y);

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
const numVerticalSections = 10; 
const blockPerSection = 1;
const verticalSpacing = 4;
const blocks=[];
// Store geometries and bend amounts for each block
const blockGeometries = [];
const blockBendAmounts = [];
const blockTargetBends = []; // Add missing array
const originalVertices = [];
// Store block meshes for hover effect
const blockMeshes = [];
const blockHoverStates = []; // Transition progress 0-1
const blockHoverProgress = []; // Left-to-right progress 0-1
const totalBlockHeight=numVerticalSections * verticalSpacing;
const heightBuffer =0;
const startY=-height/2+heightBuffer+verticalSpacing-10;
const sectionAngle=(Math.PI*2)/blockPerSection;
const maxRandomAngle=sectionAngle*0.3;
let finalAngle=0;
async function createBlocks(BaseY,yOffset,sectionIndex,blockIndex){
    const blockGeometry=createCurvedPlane(6,3.5,radius,10);
    const imageNumber = getRandomImage();
    const texture = await loadImageTexture(imageNumber);
    // Custom shader material for left-to-right color transition
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
                
                // Create grayscale version
                float gray = dot(textureColor.rgb, vec3(0.299, 0.587, 0.114));
                vec3 grayColor = vec3(gray * 0.6);
                
                // Enhanced color version
                vec3 enhancedColor = textureColor.rgb;
                
                // Left-to-right reveal: show color where x position is less than transition progress
                float revealThreshold = transitionProgress * 1.1; // Slightly extend for complete reveal
                float softness = 0.25; // Much larger softness for smoother gradient
                
                // Use smoothstep to create smooth transition from left to right
                float reveal = smoothstep(revealThreshold - softness, revealThreshold + softness, vUv.x);
                
                // Invert reveal so left side (low x) shows color first
                reveal = 1.0 - reveal;
                
                // Mix colors: start grayscale, reveal color from left to right
                vec3 finalColor = mix(grayColor, enhancedColor, reveal * colorProgress);
                
                gl_FragColor = vec4(finalColor, textureColor.a);
            }
        `,
        side: THREE.DoubleSide
    });
    const block = new THREE.Mesh(blockGeometry, blockMaterial);

    block.position.y += BaseY ;
    const blockContainer = new THREE.Group();
    const baseAngle = sectionAngle * blockIndex;
    const randomAngleOffset = maxRandomAngle;
    // const randomAngleOffset = (Math.random() * 2 - 1) * maxRandomAngle;
    finalAngle = finalAngle - 2 * Math.PI / 5; // Reverse spiral direction
    blockContainer.rotation.y = finalAngle;
    blockContainer.add(block);
    
    // Store geometry and original vertices for bending effect
    blockGeometries.push(blockGeometry);
    blockBendAmounts.push(0);
    blockTargetBends.push(0); // Initialize target bend
    const positions = blockGeometry.attributes.position.array.slice(); // Copy original positions
    originalVertices.push(positions);
    
    // Store mesh for hover effect
    blockMeshes.push(block);
    blockHoverStates.push(0); // 0 = grayscale, 1 = color
    blockHoverProgress.push(0); // 0 = no progress, 1 = complete
    
   return blockContainer
}
async function initializeBlocks() {
    for(let section = 0; section < numVerticalSections; section++) {
        const baseY = startY + section * verticalSpacing;
        for(let i = 0; i< blockPerSection; i++) {
            const yOffset = 1;
            const blockContainer = await createBlocks(baseY, yOffset, section, i);
            blocks.push(blockContainer);
            galleryGroup.add(blockContainer);
        }
    }
}
// Load and add tower.glb to the center of the gallery
const gltfLoader = new GLTFLoader();
let tower = null;
let towerRotation = 0;
gltfLoader.load('/tower.glb', (gltf) => {
    tower = gltf.scene;
    tower.position.set(0, -27, 0); // Center of the cylinder
    tower.scale.set(1, 2, 1); // Increase height (Y axis)
    scene.add(tower); // Add tower directly to scene, not galleryGroup
});

const lenis = new Lenis({
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

let currentScroll = 0;
let rotationSpeed = 0;
const baseRotationSpeed = 0;

// Raycaster and mouse for hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isInitialized = false; // Prevent initial hover detection

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

lenis.on('scroll', (e) => {
    currentScroll = e.scroll;
    rotationSpeed = e.velocity * 0.0033;
    // Set target bend amount based on scroll velocity for smooth effect
    for (let i = 0; i < blockTargetBends.length; i++) {
        blockTargetBends[i] = e.velocity * 0.01; // Increased from 0.008 to 0.02 for much more Z rotation
    }
});

function raf(time) {
    lenis.raf(time);
    animate();
    requestAnimationFrame(raf);
}
function animate() {
    // Camera intro animation - single smooth movement
    if (!isIntroComplete) {
        animationProgress += 0.003; // Much slower, more cinematic animation
        const t = Math.min(animationProgress, 1.0);
        const easeT = 1 - Math.pow(1 - t, 3); // Ease out cubic for smooth landing
        
        // Smoothly interpolate from initial position to final position
        camera.position.x = THREE.MathUtils.lerp(cameraStates.initial.x, cameraStates.final.x, easeT);
        camera.position.y = THREE.MathUtils.lerp(cameraStates.initial.y, cameraStates.final.y, easeT);
        camera.position.z = THREE.MathUtils.lerp(cameraStates.initial.z, cameraStates.final.z, easeT);
        
        // Don't change camera rotation - let it maintain its natural forward orientation
        
        if (t >= 1.0) {
            isIntroComplete = true;
        }
    } else {
        // Normal scrolling behavior after intro
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
        const targetY = scrollFraction * height - height / 2;
        camera.position.y += (-targetY - camera.position.y) * 0.1;
    }

    galleryGroup.rotation.y -= baseRotationSpeed + rotationSpeed;
    rotationSpeed *= 0.95;
    
    // Smooth bending effect for upper half of each image
    for (let g = 0; g < blockGeometries.length; g++) {
        const geometry = blockGeometries[g];
        const positions = geometry.attributes.position;
        const originalPos = originalVertices[g];
        
        // Smooth interpolation to target bend
        const targetBend = blockTargetBends[g];
        blockBendAmounts[g] += (targetBend - blockBendAmounts[g]) * 0.12; // Smooth approach to target
        
        // Decay target bend towards zero smoothly
        blockTargetBends[g] *= 0.88;
        
        const bendAmount = blockBendAmounts[g];
        
        // Find the maximum Y coordinate (top of the image)
        let maxY = -Infinity;
        for (let i = 1; i < positions.count * 3; i += 3) {
            if (originalPos[i] > maxY) maxY = originalPos[i];
        }
        
        // Apply bend to upper half only
        for (let i = 0; i < positions.count; i++) {
            const vertexY = originalPos[i * 3 + 1];
            const normalizedHeight = Math.max(0, (vertexY - (maxY - 1.5)) / 1.5); // Upper half only
            
            if (normalizedHeight > 0) {
                const x = originalPos[i * 3];
                const z = originalPos[i * 3 + 2];
                // Smooth easing for natural bend
                const easedHeight = normalizedHeight * normalizedHeight * (3 - 2 * normalizedHeight);
                const bendFactor = bendAmount * easedHeight;
                
                // Smooth Z-axis rotation (reversed direction)
                const cosVal = Math.cos(-bendFactor); // Negative to reverse direction
                const sinVal = Math.sin(-bendFactor); // Negative to reverse direction
                positions.setX(i, x * cosVal - z * sinVal);
                positions.setZ(i, x * sinVal + z * cosVal);
                positions.setY(i, vertexY);
            } else {
                // Keep bottom half in original position
                positions.setXYZ(i, originalPos[i * 3], originalPos[i * 3 + 1], originalPos[i * 3 + 2]);
            }
        }
        
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
    }
    
    // Enhanced hover effect with left-to-right transition
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(blockMeshes);
    let hoveredIndex = -1;
    
    // Only detect hover after initialization AND intro animation is complete
    if (isInitialized && isIntroComplete && intersects.length > 0) {
        hoveredIndex = blockMeshes.indexOf(intersects[0].object);
    }
    
    // Smooth color transitions with left-to-right reveal
    for (let i = 0; i < blockHoverStates.length; i++) {
        // Force all to start at 0 if not initialized
        if (!isInitialized) {
            blockHoverStates[i] = 0.0;
            blockHoverProgress[i] = 0.0;
        } else if (i === hoveredIndex) {
            // While hovering: fade in color quickly
            blockHoverStates[i] += 0.07; // Faster color fade-in when hovering
            if (blockHoverStates[i] > 1.0) blockHoverStates[i] = 1.0;
            
            // Left-to-right sweep - faster when hovering
            blockHoverProgress[i] += 0.015; // Faster sweep when hovering
            if (blockHoverProgress[i] > 1.0) blockHoverProgress[i] = 1.0;
        } else {
            // Not hovering: fade out smoothly and slower
            blockHoverStates[i] -= 0.025; // Slower fade-out when not hovering
            if (blockHoverStates[i] < 0.0) blockHoverStates[i] = 0.0;
            
            // Reset transition when not hovering - slower
            blockHoverProgress[i] -= 0.035; // Slower reset when not hovering
            if (blockHoverProgress[i] < 0.0) blockHoverProgress[i] = 0.0;
        }
        
        // Update shader uniforms
        const material = blockMeshes[i].material;
        if (material.uniforms) {
            material.uniforms.colorProgress.value = blockHoverStates[i];
            material.uniforms.transitionProgress.value = blockHoverProgress[i];
        }
    }
    
    if (tower) {
        towerRotation -= (baseRotationSpeed + rotationSpeed)*0.3; // Reverse tower rotation
        tower.rotation.y = towerRotation;
    }
    renderer.render(scene, camera);
}

async function start() {
    await initializeBlocks();
    
    // Force all images to start in grayscale by resetting all uniforms
    for (let i = 0; i < blockMeshes.length; i++) {
        const material = blockMeshes[i].material;
        if (material.uniforms) {
            material.uniforms.colorProgress.value = 0.0;
            material.uniforms.transitionProgress.value = 0.0;
        }
    }
    
    // Set initialization flag after a short delay to ensure all starts in B&W
    setTimeout(() => {
        isInitialized = true;
    }, 500);
    
    requestAnimationFrame(raf);
}
start();
