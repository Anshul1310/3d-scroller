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
camera.position.z = 12;
camera.position.y = 0;

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
        const texture=textureLoader.load(`/assets/image${imageNumber}.png`, 
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
const totalBlockHeight=numVerticalSections * verticalSpacing;
const heightBuffer =0;
const startY=-height/2+heightBuffer+verticalSpacing-10;
const sectionAngle=(Math.PI*2)/blockPerSection;
const maxRandomAngle=sectionAngle*0.3;
let finalAngle=0;
async function createBlocks(BaseY,yOffset,sectionIndex,blockIndex){
    const blockGeometry=createCurvedPlane(5,3,radius,10);
    const imageNumber = getRandomImage();
    const texture = await loadImageTexture(imageNumber);
    const blockMaterial = new THREE.MeshStandardMaterial({ map: texture
        , side: THREE.DoubleSide
        


     });
    const block = new THREE.Mesh(blockGeometry, blockMaterial);

    block.position.y += BaseY ;
    const blockContainer = new THREE.Group();
    const baseAngle = sectionAngle * blockIndex;
    const randomAngleOffset = maxRandomAngle;
    // const randomAngleOffset = (Math.random() * 2 - 1) * maxRandomAngle;
    finalAngle = finalAngle + 2 * Math.PI / 5;
    blockContainer.rotation.y = finalAngle;
    blockContainer.add(block);
    
    // Store geometry and original vertices for bending effect
    blockGeometries.push(blockGeometry);
    blockBendAmounts.push(0);
    blockTargetBends.push(0); // Initialize target bend
    const positions = blockGeometry.attributes.position.array.slice(); // Copy original positions
    originalVertices.push(positions);
    
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
gltfLoader.load('/assets/tower.glb', (gltf) => {
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
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
    const targetY = scrollFraction * height - height / 2;
    camera.position.y += (-targetY - camera.position.y) * 0.1;

    galleryGroup.rotation.y += baseRotationSpeed + rotationSpeed;
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
                
                // Smooth Z-axis rotation
                const cosVal = Math.cos(bendFactor);
                const sinVal = Math.sin(bendFactor);
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
    
    if (tower) {
        towerRotation += (baseRotationSpeed + rotationSpeed)*0.3;
        tower.rotation.y = towerRotation;
    }
    renderer.render(scene, camera);
}

async function start() {
    await initializeBlocks();
    requestAnimationFrame(raf);
}
start();
