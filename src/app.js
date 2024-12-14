/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import { TextGeometry } from 'three';
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { GameScene } from 'scenes';
import * as THREE from 'three';

let score = 0;
let gameStart = true;
// Initialize core ThreeJS components

// Initialize Renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';
document.body.appendChild(renderer.domElement);
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
const light = new THREE.PointLight(0xffffff, 1, 10);
camera.add(light);
scene.add(camera);

// Enable Pointer Lock
let isPointerLocked = false;
const canvas = renderer.domElement;

canvas.addEventListener('click', () => {
    if (gameStart) {
        canvas.requestPointerLock();
        const listener = new THREE.AudioListener();
        camera.add(listener);
        const bgMusic = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/src/sounds/Myuu-Tetris-Dark-Version.mp3', function (buffer) {
            bgMusic.setBuffer(buffer);
            bgMusic.setLoop(true);
            bgMusic.setVolume(1);
            bgMusic.play();
        });

        const audio = new Audio('/src/sounds/Myuu-Tetris-Dark-Version.mp3');
        audio.preload = 'auto';

        /*
        if(audio.paused){
            audio.play()
        }
        */
    }

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

const MOVEMENT_SPEED = 0.125;
const v0 = 0.7;
const camGrav = 0.09;
const MAX_FALL = -0.15;

let activeMoveControls = {
    up: false,
    left: false,
    right: false,
    down: false,
    jump: false,
    jumpTime: -1,
    fallVelocity: 0,
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
        if (activeMoveControls.jumpTime < 0) {
            activeMoveControls.jumpTime = 0;
        }
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
    if (scene.update(camera.position)) {
        gameStart = false;
    }
    
    if(gameStart) {
    let previousCamera = camera.position.clone();
    

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
    let correction = scene.handleSideCollisions(
        camera.position,
        previousCamera
    );
    if (correction != null) {
        camera.position.add(correction);
    }

    // handle jump
    if (activeMoveControls.jumpTime >= 0) {
        activeMoveControls.fallVelocity -= camGrav;
        activeMoveControls.fallVelocity = Math.max(
            activeMoveControls.fallVelocity,
            MAX_FALL
        );
        camera.position.y += activeMoveControls.fallVelocity;
        activeMoveControls.jumpTime++;
        if (camera.position.y <= -1) {
            camera.position.y = -0.8;
            if (activeMoveControls.fallVelocity > 0) {
                activeMoveControls.fallVelocity += camGrav / 2;
            }
            activeMoveControls.jumpTime = -1;
            activeMoveControls.fallVelocity = 0;
            if (activeMoveControls.jump) {
                activeMoveControls.jumpTime = 0;
                activeMoveControls.fallVelocity = v0;
            }
        }
    }

    if (activeMoveControls.fallVelocity <= 0) {
        let correction = scene.handleFallCollision(camera.position);
        if (correction > MAX_FALL) {
            // camera is inside a cube - correct position and stop fall
            camera.position.add(new THREE.Vector3(0, correction + 0.2, 0));
            activeMoveControls.jumpTime = -1;
            activeMoveControls.fallVelocity = 0;
            if (activeMoveControls.jump) {
                activeMoveControls.jumpTime = 0;
                activeMoveControls.fallVelocity = v0;
            }

            // } else if (correction > - MAX_FALL) { // on top of cube, correct position and stop fall
        } else if (camera.position.y > 0.2) {
            // start or continue fall
            if (activeMoveControls.jumpTime == -1) {
                activeMoveControls.jumpTime = 0;
            }
        }
    } else {
        correction = scene.bumpHeadCollisions(camera.position);
        if (correction != 0) {
            camera.position.add(new THREE.Vector3(0, correction + 0.01, 0));
            activeMoveControls.fallVelocity = 0;
        }
    }
    score = Math.max(score, camera.position.y);
    } else {
        // create text
        /*
        const loader = new THREE.FontLoader();

        const scoreString = score.toString();
        const textString = "Score: " + scoreString;
        loader.load( '//fonts/ArcadeClassic_Regular.json', function ( font ) {

            const geometry = new TextGeometry( textString, {
                font: font,
                size: 6,
                height: 2,
            });

            const textMesh = new THREE.Mesh(geometry, [new THREE.MeshPhongMaterial({color: 0xad4000 }), new THREE.MeshPhongMaterial({color: 0x5c2301})]);
            
            textMesh.castShadow = true;
            textMesh.position.y += 15;
            textMesh.position.z -= 40;
            textMesh.position.x = -8;
        } );
        */
        // set the camera to look at the end game screen
        camera.position.set(0, -15, 0);
        camera.lookAt(new Vector3(0, -30, 0));
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
