/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { GameScene } from 'scenes';
import * as THREE from 'three';

// Initialize core ThreeJS components
const scene = new GameScene();
//const camera = new PerspectiveCamera();
const camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Set up camera
camera.position.set(0, 1, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Initialize Renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';
document.body.appendChild(renderer.domElement);

// Enable Pointer Lock
let isPointerLocked = false;
const canvas = renderer.domElement;

canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === canvas;
});

// Variables to store the current yaw (horizontal) and pitch (vertical) values
let pitch = 0; // Vertical angle (rotation around X-axis)
let yaw = Math.PI; // Horizontal angle (rotation around Y-axis)

// Mouse look
document.addEventListener('mousemove', (event) => {
    // Limits for the pitch (to prevent extreme up/down rotations)
    const MIN_PITCH = THREE.MathUtils.degToRad(-80); // Minimum tilt (downwards)
    const MAX_PITCH = THREE.MathUtils.degToRad(80); // Maximum tilt (upwards)

    // Create quaternions for pitch and yaw rotations
    const yawQuaternion = new THREE.Quaternion();
    const pitchQuaternion = new THREE.Quaternion();
    if (isPointerLocked) {
        // Get mouse movement values from the event
        let movementX = event.movementX;
        let movementY = event.movementY;
        // Update yaw (horizontal movement) based on movementX
        yaw -= movementX * 0.002; // Adjust the factor for sensitivity
        // Update pitch (vertical movement) based on movementY
        pitch -= movementY * 0.002; // Adjust the factor for sensitivity
        // Clamp the pitch to prevent extreme angles (looking too far up or down)
        pitch = THREE.MathUtils.clamp(pitch, MIN_PITCH, MAX_PITCH);
        // Create a quaternion for the yaw (rotate around the Y-axis)
        yawQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        // Create a quaternion for the pitch (rotate around the X-axis)
        pitchQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
        // Combine the yaw and pitch quaternions
        const combinedQuaternion = yawQuaternion.multiply(pitchQuaternion);
        // Apply the resulting quaternion to the camera
        camera.rotation.setFromQuaternion(combinedQuaternion);
        // Update the camera's world matrix
        camera.updateMatrixWorld();
    }
});

const MOVEMENT_SPEED = 0.5;
let jumpTime = -1;
let v0 = 1;
let camGrav = 0.1;
let activeMoveControls = {
    up: false,
    left: false,
    right: false,
    down: false,
    jump: false,
};

document.addEventListener('keydown', (event) => {
    if (event.key == 'w' || event.key == 'ArrowUp') {
        activeMoveControls.up = true;
    }
    if (event.key == 's' || event.key == 'ArrowDown') {
        activeMoveControls.down = true;
    }
    if (event.key == 'a' || event.key == 'ArrowLeft') {
        activeMoveControls.left = true;
    }
    if (event.key == 'd' || event.key == 'ArrowRight') {
        activeMoveControls.right = true;
    }
    if (event.key == ' ') {
        jumpTime = 0;
        activeMoveControls.jump = true;
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key == 'w' || event.key == 'ArrowUp') {
        activeMoveControls.up = false;
    }
    if (event.key == 's' || event.key == 'ArrowDown') {
        activeMoveControls.down = false;
    }
    if (event.key == 'a' || event.key == 'ArrowLeft') {
        activeMoveControls.left = false;
    }
    if (event.key == 'd' || event.key == 'ArrowRight') {
        activeMoveControls.right = false;
    }
    if (event.key == ' ') {
        activeMoveControls.jump = false;
    }
});

// Render Loop
const onAnimationFrameHandler = () => {
    scene.update();

    // handle jump
    if (jumpTime >= 0) {
        let vertSpeed = v0 - camGrav * jumpTime;
        camera.position.y += vertSpeed;
        jumpTime++;
        if (camera.position.y <= 0) {
            camera.position.y = 0;
            jumpTime = -1;
            if (activeMoveControls.jump) {
                jumpTime++;
            }
        }
    }
    if (activeMoveControls.up) {
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.setY(0);
        direction.normalize().multiplyScalar(MOVEMENT_SPEED);
        camera.position.add(direction);
    }
    if (activeMoveControls.down) {
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.setY(0);
        direction.normalize().multiplyScalar(-MOVEMENT_SPEED);
        camera.position.add(direction);
    }
    if (activeMoveControls.left) {
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.setY(0);
        direction.cross(new THREE.Vector3(0, 1, 0));
        direction.normalize().multiplyScalar(-MOVEMENT_SPEED);
        camera.position.add(direction);
    }
    if (activeMoveControls.right) {
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.setY(0);
        direction.cross(new THREE.Vector3(0, 1, 0));
        direction.normalize().multiplyScalar(MOVEMENT_SPEED);
        camera.position.add(direction);
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Version 2 Below

// // import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
// import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
// import { GameScene } from 'scenes';
// import * as THREE from 'three';

// // Initialize core ThreeJS components
// const scene = new GameScene();
// //const camera = new PerspectiveCamera();
// const camera = new PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// );

// // Set up camera
// camera.position.set(6, 3, -10);
// camera.lookAt(new Vector3(0, 0, 0));

// // Initialize Renderer
// const renderer = new WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.style.margin = 0;
// document.body.style.overflow = 'hidden';
// document.body.appendChild(renderer.domElement);

// // Initialize FirstPersonControls
// // const controls = new FirstPersonControls(camera, renderer.domElement);
// // controls.movementSpeed = 5;
// // controls.lookSpeed = 0.1;
// // controls.mouseDragOn = true;

// // initializae PointerLockControls
// const controls = new PointerLockControls(camera, renderer.domElement);
// controls.pointerSpeed = 0.1;
// controls.lock();

// // Render Loop
// const clock = new THREE.Clock();
// const onAnimationFrameHandler = () => {
//     const delta = clock.getDelta();
//     // controls.update(delta); // Update first-person controls
//     renderer.render(scene, camera); // Render the scene
//     window.requestAnimationFrame(onAnimationFrameHandler); // Continue the loop
// };
// window.requestAnimationFrame(onAnimationFrameHandler);

// // Resize Handler
// window.addEventListener('resize', () => {
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
// });

/// Version 1 Below

// // Initialize core ThreeJS components
// const scene = new GameScene();
// const camera = new PerspectiveCamera();
// const renderer = new WebGLRenderer({ antialias: true });

// // Set up camera
// camera.position.set(6, 3, -10);
// camera.lookAt(new Vector3(0, 0, 0));

// // Set up renderer, canvas, and minor CSS adjustments
// renderer.setPixelRatio(window.devicePixelRatio);
// const canvas = renderer.domElement;
// canvas.style.display = 'block'; // Removes padding below canvas
// document.body.style.margin = 0; // Removes margin around page
// document.body.style.overflow = 'hidden'; // Fix scrolling
// document.body.appendChild(canvas);

// // Set up controls
// // const controls = new OrbitControls(camera, canvas);
// // controls.enableDamping = true;
// // controls.enablePan = false;
// // controls.minDistance = 4;
// // controls.maxDistance = 16;
// // controls.update();

// // // set up FP controls
// const controls = new FirstPersonControls(camera, canvas);
// controls.lookSpeed = 0.1;
// controls.movementSpeed = 0.1;
// controls.update();
// // debugger;
// // Render loop

// const clock = new THREE.Clock(); // Import Clock from Three.js
// const onAnimationFrameHandler = () => {
//     const delta = clock.getDelta(); // Get elapsed time since last frame
//     controls.update(delta); // Update controls with delta
//     renderer.render(scene, camera); // Render the scene
//     scene.update && scene.update(delta); // Update scene if `update` method exists
//     window.requestAnimationFrame(onAnimationFrameHandler); // Continue loop
// };

// // const onAnimationFrameHandler = (timeStamp) => {
// //     controls.update();
// //     renderer.render(scene, camera);
// //     scene.update && scene.update(timeStamp);
// //     window.requestAnimationFrame(onAnimationFrameHandler);
// // };
// window.requestAnimationFrame(onAnimationFrameHandler);

// // Resize Handler
// const windowResizeHandler = () => {
//     const { innerHeight, innerWidth } = window;
//     renderer.setSize(innerWidth, innerHeight);
//     camera.aspect = innerWidth / innerHeight;
//     camera.updateProjectionMatrix();
// };
// windowResizeHandler();
// window.addEventListener('resize', windowResizeHandler, false);
