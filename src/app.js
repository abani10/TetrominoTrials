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


// GLOBAL VARIABLES
let score;
let prevScore;
let gameStart;
let camera;
let renderer;
let scene;
let audio;
let canvas;
let animationFrameId;
let restartCounter;

// Variables to store the current yaw (horizontal) and pitch (vertical) values
let pitch; // Vertical angle (rotation around X-axis)
let yaw; // Horizontal angle (rotation around Y-axis)

// CAMERA MOVEMENT VARIABLES
const MOVEMENT_SPEED = 0.125;
const v0 = 0.7;
const camGrav = 0.09;
const MAX_FALL = -0.15;
const restartDelay = 8000;
const restartFadeDelay = 1000;

let activeMoveControls;

// POINTER LOCK ENABLING CONSTANTS
let isPointerLocked = false;


function init() {
    score = 0;
    prevScore = 0;
    gameStart = true;
    pitch = 0;
    yaw = Math.PI; 
    restartCounter = restartDelay;
    activeMoveControls = {
        up: false,
        left: false,
        right: false,
        down: false,
        jump: false,
        jumpTime: -1,
        fallVelocity: 0,
    };

    // CREATE THE SCENE ONCE
    scene = new GameScene();
    // Initialize core ThreeJS components
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
    // Initialize Renderer
    renderer = new WebGLRenderer({ antialias: true });
    canvas = renderer.domElement;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';
    document.body.appendChild(renderer.domElement);
    //const camera = new PerspectiveCamera();
    camera = new PerspectiveCamera(
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

    canvas.addEventListener('click', () => {
        if (gameStart) {
            audio = scene.startMusic(camera);
            canvas.requestPointerLock();
        } else {
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
    
            scene.destroy();
            if (renderer && renderer.domElement) {
                renderer.dispose();
                document.body.removeChild(renderer.domElement);
            }
            audio.pause();
            audio.currentTime = 0;
            const endText = document.getElementById('scoreRestart');
            if (endText) {
                endText.style.display = 'none';
            }
            init();  
        }
    });
    // Mouse look
    document.addEventListener('mousemove', (event) => {
        if (isPointerLocked && gameStart) {
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
        }
    });
    
    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === canvas;
    });
    
    document.addEventListener('keydown', (event) => {
        if (gameStart){
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
        }
    });
    
    document.addEventListener('keyup', (event) => {
        if (gameStart){
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
        }
    });
    
    // Resize Handler
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // start the render loop
    startRenderLoop();
}

function startRenderLoop() {
    // Render Loop
    const onAnimationFrameHandler = () => {
        if (scene.update(camera.position)) {
            gameStart = false;
        }
        
        if(gameStart) {
            // text that reminds you of how to restart if you
            // remain stagnant for too long
            console.log(restartCounter);
            if (score == prevScore) {
                restartCounter++;
            }
            if (restartCounter >= restartDelay) {
                const restart = document.getElementById('restartCounter');
                if (restart) {
                    restart.style.display = 'block';
                } 
            }
            if (restartCounter >= restartFadeDelay + restartDelay) {
                const restart2 = document.getElementById('restartCounter');
                if (restart2) {
                    restart2.style.display = 'none';
                } 
                restartCounter = 0;
            }
            prevScore = score;

            // textshowing the score counter 
            const scoreCounter = document.getElementById('scoreCounter');
            if (scoreCounter) {
                scoreCounter.innerHTML = `Your Score: ${Math.round(score)}`;
                scoreCounter.style.display = 'block';
            } 

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
            // set the camera to look at the end game screen
            camera.position.set(0, -15, 0);
            camera.lookAt(new Vector3(0, -30, 0));

            // adding text for score and restart option
            const scoreCounter = document.getElementById('scoreCounter');
            if (scoreCounter) {
                scoreCounter.style.display = 'none';
            } 
            const restart = document.getElementById('restartCounter');
            if (restart) {
                restart.style.display = 'none';
            } 
            const restartScore = document.getElementById('scoreRestart');
            if (restartScore) {
                restartScore.innerHTML = `Your Score: ${Math.round(score)}<br>Click Anywhere to Restart`;
                restartScore.style.display = 'block';
            } 
        }
        renderer.render(scene, camera);
        animationFrameId = window.requestAnimationFrame(onAnimationFrameHandler);
    };

    animationFrameId = window.requestAnimationFrame(onAnimationFrameHandler);
}

function createScoreText() {
    const scoreRestart = document.createElement('div');
    scoreRestart.id = 'scoreRestart';
    scoreRestart.innerHTML = 'Your Score: 0<br>Press Anywhere to Restart'; 
    scoreRestart.style.position = 'absolute';
    scoreRestart.style.top = '50%';
    scoreRestart.style.left = '50%';
    scoreRestart.style.transform = 'translate(-50%, -50%)';
    scoreRestart.style.fontSize = '48px';
    scoreRestart.style.color = 'white';
    scoreRestart.style.textAlign = 'center';
    scoreRestart.style.fontFamily = 'Courier New, sans-serif';
    scoreRestart.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; 
    scoreRestart.style.padding = '20px';
    scoreRestart.style.borderRadius = '10px';
    scoreRestart.style.zIndex = '10';
    scoreRestart.style.display = 'none'; 

    // Append to the document body
    document.body.appendChild(scoreRestart);
}

function createStartText() {
    const startText = document.createElement('div');
    startText.id = 'startText';
    startText.innerHTML = 'Welcome to Tetromino Trials!'; 
    startText.style.position = 'absolute';
    startText.style.top = '50%';
    startText.style.left = '50%';
    startText.style.transform = 'translate(-50%, -50%)';
    startText.style.fontSize = '100px';
    startText.style.color = 'white';
    startText.style.textAlign = 'center';
    startText.style.fontFamily = 'Courier New, sans-serif';
    startText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    startText.style.padding = '20px';
    startText.style.borderRadius = '10px';
    startText.style.zIndex = '10';
    startText.style.display = 'block'; 

    // Append to the document body
    document.body.appendChild(startText);
}

function createScoreCounter() {
    const startText = document.createElement('div');
    startText.id = 'scoreCounter';
    startText.innerHTML = 'Score:'; 
    startText.style.position = 'absolute';
    startText.style.top = '8%';
    startText.style.left = '10%';
    startText.style.transform = 'translate(-50%, -50%)';
    startText.style.fontSize = '48px';
    startText.style.color = 'white';
    startText.style.textAlign = 'center';
    startText.style.fontFamily = 'Courier New, sans-serif';
    startText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    startText.style.padding = '20px';
    startText.style.borderRadius = '10px';
    startText.style.zIndex = '10';
    startText.style.display = 'block'; 

    // Append to the document body
    document.body.appendChild(startText);
}

function createRestartCounter() {
    const startText = document.createElement('div');
    startText.id = 'restartCounter';
    startText.innerHTML = 'Press R to Restart'; 
    startText.style.position = 'absolute';
    startText.style.top = '10%';
    startText.style.left = '90%';
    startText.style.transform = 'translate(-50%, -50%)';
    startText.style.fontSize = '48px';
    startText.style.color = 'white';
    startText.style.textAlign = 'center';
    startText.style.fontFamily = 'Courier New, sans-serif';
    startText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    startText.style.padding = '20px';
    startText.style.borderRadius = '10px';
    startText.style.zIndex = '10';
    startText.style.display = 'block'; 

    // Append to the document body
    document.body.appendChild(startText);
}

createStartText();
 // wait for 3 seconds before fading out the text
 const startText = document.getElementById('startText');
 if (startText) {
     if (startText.style.display == 'block') {
         setTimeout(() => {
             startText.style.display = 'none'; 
         }, 3000);
     }  
 }
createScoreText();
createScoreCounter();
createRestartCounter();
init();















