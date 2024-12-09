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
camera.position.set(0, 1, -5);
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

// Mouse look
document.addEventListener('mousemove', (event) => {
    if (isPointerLocked) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        camera.rotation.y += movementX * 0.002;
        camera.rotation.x += movementY * 0.002;

        // debugger;
        // Clamp vertical rotation to prevent flipping
        if (camera.rotation.x >= 0) {
            camera.rotation.x = Math.max(Math.PI / 2, camera.rotation.x);
        } else {
            camera.rotation.x = Math.min(-Math.PI / 2, camera.rotation.x);
        }
        // camera.rotation.x = 0;
        // Math.max(-Math.PI, Math.min(0, camera.rotation.x));
    }
});

document.addEventListener('keypress', (event) => {
    if (event.key == 'w') {
        // debugger;
        let direction = new THREE.Vector3(
            -Math.sin(camera.rotation.y),
            0,
            Math.cos(camera.rotation.y)
        );
        direction.setY(0);
        direction.normalize().multiplyScalar(0.1);
        camera.position.add(direction);
    }
    if (event.key == 's') {
        // hardy har har
        let direction = new THREE.Vector3(
            -Math.sin(camera.rotation.y),
            0,
            Math.cos(camera.rotation.y)
        );
        direction.setY(0);
        direction.normalize().multiplyScalar(-0.1);
        camera.position.add(direction);
    }
});

// Render Loop
const onAnimationFrameHandler = () => {
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
