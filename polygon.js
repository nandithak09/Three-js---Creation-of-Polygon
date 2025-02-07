export class Polygon {
    constructor(scene) {
        this.scene = scene;
        this.vertices = [];
        this.points = [];
        this.edges = [];
        this.polygonMesh = null;
    }

    addVertex(event, camera, renderer) {
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        
        // Convert mouse position to normalized device coordinates (-1 to +1)
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
        // Raycast from camera to 3D world
        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // XY Plane
        const intersection = new THREE.Vector3();
    
        if (raycaster.ray.intersectPlane(plane, intersection)) {
            // Define grid boundaries (adjust based on your scene)
            const GRID_MIN = -5, GRID_MAX = 5;
            
            if (intersection.x >= GRID_MIN && intersection.x <= GRID_MAX &&
                intersection.y >= GRID_MIN && intersection.y <= GRID_MAX) {
                
                this.vertices.push(intersection.clone());
    
                // Create vertex point
                const pointGeometry = new THREE.SphereGeometry(0.05, 16, 16);
                const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
                pointMesh.position.copy(intersection);
                this.scene.add(pointMesh);
                this.points.push(pointMesh);
    
                // Create edge if there are at least 2 points
                if (this.vertices.length > 1) {
                    this.createEdge(this.vertices[this.vertices.length - 2], this.vertices[this.vertices.length - 1]);
                }
            }
        }
    }
    createEdge(start, end) {
        const material = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black border
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.edges.push(line);
    }

    completePolygon() {
        if (this.vertices.length < 3) {
            alert("You need at least 3 points to create a polygon!");
            return;
        }

        // Close the polygon by adding the last edge
        this.createEdge(this.vertices[this.vertices.length - 1], this.vertices[0]);

        // Create polygon shape
        const shape = new THREE.Shape();
        shape.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            shape.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        shape.lineTo(this.vertices[0].x, this.vertices[0].y); // Close the shape

        const geometry = new THREE.ShapeGeometry(shape);

        // Set polygon color to orange
        const material = new THREE.MeshBasicMaterial({ color: 0xffa500, side: THREE.DoubleSide });
        this.polygonMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.polygonMesh);
    }

    clone() {
        if (!this.polygonMesh) return;

        const clonedGeometry = this.polygonMesh.geometry.clone();
        const clonedMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500, side: THREE.DoubleSide });
        const clonedMesh = new THREE.Mesh(clonedGeometry, clonedMaterial);

        // Slightly shift the copied polygon to the right
        clonedMesh.position.x += 1;
        clonedMesh.position.y += 1;
        this.scene.add(clonedMesh);
    }

    reset() {
        // Remove all objects from the scene
        while (this.scene.children.length > 0) {
            let obj = this.scene.children[0];
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        }
    
        // Clear stored arrays
        this.points = [];
        this.edges = [];
        this.faces = [];
        this.vertices = [];
    
        // Reinitialize grid (if needed)
        this.initializeGrid();
    
        // Force scene update
        this.renderer.render(this.scene, this.camera);
    }
}