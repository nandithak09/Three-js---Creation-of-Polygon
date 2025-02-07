import { Polygon } from './polygon.js';

// Initialize Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Setup Camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30);
camera.lookAt(0, 0, 0);

// Setup Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Create Grid Helper
function createGrid() {
    const size = 30;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x0000ff, 0xaaaaaa);
    scene.add(gridHelper);
}
createGrid();

// Main Logic
let polygon = new Polygon(scene);
let copiedPolygon = null;
let isCopying = false;

// Mouse Click Event for Adding Vertices
window.addEventListener("click", (event) => {
    if (isCopying) {
        placeCopiedPolygon();
        return;
    }

    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene.children[0]); // Intersects with Grid

    if (intersects.length > 0) {
        const point = intersects[0].point;
        polygon.addVertex(point);
    }
});

// Complete Polygon Button
document.getElementById("complete-btn").addEventListener("click", () => {
    polygon.completePolygon();
});

// Copy Polygon Button
document.getElementById("copy-btn").addEventListener("click", () => {
    if (!polygon.polygonMesh) return;
    copiedPolygon = polygon.clone();
    isCopying = true;
    document.addEventListener("mousemove", moveCopiedPolygon);
});

// Move Copied Polygon with Cursor
function moveCopiedPolygon(event) {
    if (!copiedPolygon) return;

    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene.children[0]); // Move only on the grid

    if (intersects.length > 0) {
        copiedPolygon.polygonMesh.position.set(intersects[0].point.x, intersects[0].point.y, 0);
    }
}

function resetScene() {
    console.log("Reset button clicked");  // Debugging check

    // Clear all objects except the grid
    scene.children.forEach(obj => {
        if (obj.type !== "GridHelper") {
            scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        }
    });

    // Reset camera position
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    // Clear stored data arrays
    points = [];
    edges = [];
    faces = [];
    vertices = [];

    // Ensure UI updates
    renderer.render(scene, camera);
}

// Place Copied Polygon
function placeCopiedPolygon() {
    isCopying = false;
    document.removeEventListener("mousemove", moveCopiedPolygon);
    copiedPolygon = null;
}
window.addEventListener("click", (event) => {
    polygon.addVertex(event, camera, renderer);
});

// Reset Button
document.getElementById("reset-btn").addEventListener("click", () =>{
    resetScene();
});
    
// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();