A web-based polygon editor using Three.js that allows users to draw, complete, copy, and reset polygons on a grid.

**Features**

✅ Click to add vertices on a grid.
✅ Connect vertices to form edges.
✅ Complete a polygon when at least three vertices are added.
✅ Copy and move a completed polygon.
✅ Reset the scene while keeping the grid.

**Technologies Used**

1. Vanilla JavaScript
2. Three.js (for 3D rendering)


**Installation & Setup**

1. Clone the Repository
git clone https://github.com/https://github.com/nandithak09/Three-js---Creation-of-Polygon.gi
2. Run Locally
Simply open the index.html file in your browser. No additional setup is required.

**File Structure**

/project-folder
│── index.html      # Main HTML file with UI buttons
│── main.js         # Initializes Three.js scene and event handling
│── polygon.js      # Polygon class (handles vertex placement, edge drawing, and polygon completion)

**Usage**
1. Adding Vertices: Click anywhere on the grid to add vertices.
2. Completing the Polygon: Click the "Complete" button after adding at least 3 vertices to form a closed polygon.
3. Copying the Polygon : Click the "Copy" button to duplicate a completed polygon.
                         Move the copied polygon with the mouse.
                         Click again to place it.
4. Resetting the Scene : Click the "Reset" button to remove all polygons while keeping the grid intact.

**Future Improvements**

🔹 Allow undoing the last vertex placement.
🔹 Support exporting polygons as JSON for saving and loading.
🔹 Enhance UI with better controls and real-time feedback.
