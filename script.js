// Create the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-100, -100, 1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x000000); // soft white light
scene.add(ambientLight);

let mesh;

// Set up OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth controls
controls.dampingFactor = 0.05;

// Function to load STL from file input
function loadSTL(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const contents = event.target.result;
        const loader = new THREE.STLLoader();
        const geometry = loader.parse(contents);

        if (mesh) scene.remove(mesh);

        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        mesh = new THREE.Mesh(geometry, material);
        mesh.geometry.center();
        scene.add(mesh);
    };
    reader.readAsArrayBuffer(file);
}

// Handle file input change
document.getElementById('upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
        loadSTL(file);
    } else {
        alert('Please upload a valid STL file.');
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls to handle user interaction
    renderer.render(scene, camera);
}
animate();

// Adjust canvas size on window resize
window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
