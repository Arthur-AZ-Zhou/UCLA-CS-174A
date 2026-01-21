import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();

//THREE.PerspectiveCamera( fov angle, aspect ratio, near depth, far depth );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

// Rendering 3D axis
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);


// ***** Assignment 2 *****
// Setting up the lights
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5); // Position the light
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

const phong_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   // Shininess of the material
});


const l = 0.5
const positions = new Float32Array([
    // Every three elements in this array are the x, y, z coordinates of a new vertex.
    // We use line breaks and comments for readability, but note that this is a 1D array.

    // Front face
    -l, -l,  l, // 0
     l, -l,  l, // 1
     l,  l,  l, // 2
    -l,  l,  l, // 3

    // Left face
    -l, -l, -l, // 4
    -l, -l,  l, // 5
    -l,  l,  l, // 6 
    -l,  l, -l, // 7
  
    // Top face (8 to 11)
    -l, l, l,
    l, l, l,
    l, l, -l,
    -l, l, -l,
  
    // Bottom face (12 to 15)
    -l, -l, -l,
    l, -l, -l,
    l, -l, l,
    -l, -l, l,

    // Right face (16 to 19)
    l, -l, l,
    l, -l, -l,
    l, l, -l,
    l, l, l,

    // Back face
    l, -l, -l,
    -l, -l, -l,
    -l, l, -l,
    l, l, -l
  ]);
  
  const indices = [
    // Every three numbers in this array are the indices of the vertices that form a triangle.  
    // This is also a 1D array and we use line breaks and comments for readability.
    
    // Front face.
    0, 1, 2,
    0, 2, 3,
  
    // Left face
    4, 5, 6,
    4, 6, 7,
  
    // Top face
    8, 9, 10,
    8, 10, 11,
  
    // Bottom face
    12, 13, 14,
    12, 14, 15,
  
    // Right face
    16, 17, 18,
    16, 18, 19,

    // Back face
    20, 21, 22,
    20, 22, 23,
  ];
  
  // Compute normals
  const normals = new Float32Array([
    // Front face
    // Every three elements in this array are the x, y, z components of the normal vector for the front face.
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  
    // Left face
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
  
    // Top face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
  
    // Bottom face
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
  
    // Right face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // Back face
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
  ]);

const custom_cube_geometry = new THREE.BufferGeometry();
custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

let cube = new THREE.Mesh( custom_cube_geometry, phong_material );
scene.add(cube);

// TODO: Implement wireframe geometry


function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}

function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
    Math.cos(theta), -Math.sin(theta), 0, 0,
    Math.sin(theta), Math.cos(theta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  );
}

function scalingMatrix(sx, sy, sz) {
  return new THREE.Matrix4().set(
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1,
  );
}

let cubes = [];

for (let i = 0; i < 7; i++) {
	let cube = new THREE.Mesh(custom_cube_geometry, phong_material);

	cube.matrixAutoUpdate = false;
	cubes.push(cube);
	scene.add(cube);
}

// Translate the cubes, OLD CODE ---
// const translation = translationMatrix(0, 2*l, 0); // Translate 2l units in the y direction
// let model_transformation = new THREE.Matrix4(); // model transformation matrix we will update

// for (let i = 0; i < cubes.length; i++) {
// 	cubes[i].matrix.copy(model_transformation);

//   model_transformation.multiplyMatrices(translation, model_transformation);
// }

const scaleVec = new THREE.Vector3(1.0, 1.5, 1.0);
const scaling = scalingMatrix(scaleVec.x, scaleVec.y, scaleVec.z);
const halfWidth = l * scaleVec.x; 
const halfHeight = l * scaleVec.y;

const angle = 10 * (Math.PI / 180);
const toTopLeft = translationMatrix(-l, l, 0);
const rotateTilt = rotationMatrixZ(angle);
const fromBottomLeft = translationMatrix(l, l, 0);
const stepTransform = new THREE.Matrix4();

stepTransform.multiplyMatrices(fromBottomLeft, rotateTilt);
stepTransform.multiply(toTopLeft);

let newMatrix = new THREE.Matrix4();

for (let i = 0; i < cubes.length; i++) {
  cubes[i].matrix.copy(newMatrix);
  newMatrix.multiply(stepTransform)
}

function animate() {
    
	renderer.render( scene, camera );
    controls.update();

    // TODO
    // Animate the cube

}
renderer.setAnimationLoop( animate );

// TODO: Add event listener