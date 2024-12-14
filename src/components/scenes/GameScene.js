import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Cube, Floor, Front, youDied } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from 'three';
import {
    HemisphereLight, AmbientLight
} from 'three';

let dropCounter = 0;
let cubeLength = 1;
let falling = [];
let resting = [];
let xMax = 12;
let zMax = 12;
let heightMap = [];
let maxHeight = 0;
let confinedToArena = false;
for (let i = 0; i < xMax + 8; i++) {
    heightMap[i] = Array(zMax + 8).fill(-1.25);
}
let ceiling = 10;
let dropTime = 10;


class GameScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x000000);

        // Add meshes to scene
        // const land = new Land();
        // const flower = new Flower(this);
        const lights = new BasicLights();
        // const cube = new Cube(this);

        const front = new Front(this);

        const floor = new Floor(this);
        this.add(lights, floor, front);

        // this.add(cube);
        // let list = [cube];
        // resting.push(list);
        // Populate GUI
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    startMusic(camera) {
        const listener = new THREE.AudioListener();
        camera.add(listener);
        const bgMusic = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('https://raw.githubusercontent.com/abani10/TetrominoTrials/blob/main/src/sounds/Myuu-Tetris-Dark-Version.mp3', function (buffer) {
            bgMusic.setBuffer(buffer);
            bgMusic.setLoop(true);
            bgMusic.setVolume(1);
            bgMusic.play();
        });

        const audio = new Audio('https://raw.githubusercontent.com/abani10/TetrominoTrials/blob/main/src/sounds/Myuu-Tetris-Dark-Version.mp3');
        audio.preload = 'auto';
    }
    generatePiece() {
        // generate a random number to decide what piece type
        // we can change how we want to do this
        let pieceType = Math.floor(Math.random() * 7);

        // randomly generate a color, but make sure it is matching for all the cubes
        const colors = [
            0xff0000, // Red
            0x00ff00, // Green
            0x0000ff, // Blue
            0xffff00, // Yellow
            0xff00ff, // Magenta
            0x00ffff, // Cyan
            0xff7f00, // Orange
        ];
        const randcolor = colors[Math.floor(Math.random() * colors.length)];

        // create the four cubes for the shape
        let cube1 = new Cube(this, randcolor);
        let cube2 = new Cube(this, randcolor);
        let cube3 = new Cube(this, randcolor);
        let cube4 = new Cube(this, randcolor);

        let two;
        let three;
        let four;

        let xC = 0;
        let yC = 0;
        let zC = 0;

        // assemble the cubes based on what shape pice we're making
        let col = Math.floor(Math.random() * xMax - xMax / 2);
        let row = Math.floor(Math.random() * zMax - zMax / 2);
        cube1.position.add(new THREE.Vector3(col, maxHeight + ceiling, row));
        this.add(cube1);

        if (pieceType == 0) {
            // T PIECE
            let rotate = Math.floor(Math.random() * 4);
            let lateral = 0;
            let vertical = 0;
            xC = 1;
            zC = 1;
            yC = 1;
            if (rotate == 0) {
                xC = -1;
                zC = -1;
                vertical = -1;
            } else if (rotate == 1) {
                lateral = -1;
            } else if (rotate == 2) {
                vertical = -1;
            } else {
                yC = -1;
                lateral = -1;
            }

            let depth = Math.floor(Math.random() * 2);
            if (depth == 0) {
                xC = 0;
            } else {
                zC = 0;
            }

            two = [xC * 1, 0, 1 * zC];
            three = [0, 1 * yC, 0];
            four = [lateral * xC, vertical, lateral * zC];
        } else if (pieceType == 1) {
            // L PIECE 1
            let rotate = Math.floor(Math.random() * 4);
            let yC2 = 0;
            let lateral = 0;
            if (rotate == 0) {
                xC = -1;
                zC = -1;
                yC = 1;
                yC2 = 2;
            } else if (rotate == 1) {
                xC = 1;
                zC = 1;
                yC = 1;
                lateral = 2;
            } else if (rotate == 2) {
                xC = -1;
                zC = -1;
                yC = -1;
                lateral = 2;
            } else {
                xC = 1;
                zC = 1;
                yC = -1;
                yC2 = -2;
            }

            let depth = Math.floor(Math.random() * 2);
            if (depth == 0) {
                xC = 0;
            } else {
                zC = 0;
            }

            two = [xC * 1, 0, 1 * zC];
            three = [0, 1 * yC, 0];
            four = [lateral * xC, yC2, lateral * zC];
        } else if (pieceType == 2) {
            // L PIECE 2
            let rotate = Math.floor(Math.random() * 4);
            let yC2 = 0;
            let lateral = 0;
            if (rotate == 0) {
                xC = 1;
                zC = 1;
                yC = 1;
                yC2 = 2;
            } else if (rotate == 1) {
                xC = 1;
                zC = 1;
                yC = -1;
                lateral = 2;
            } else if (rotate == 2) {
                xC = -1;
                zC = -1;
                yC = 1;
                lateral = 2;
            } else {
                xC = -1;
                zC = -1;
                yC = -1;
                yC2 = -2;
            }

            let depth = Math.floor(Math.random() * 2);
            if (depth == 0) {
                xC = 0;
            } else {
                zC = 0;
            }

            two = [xC * 1, 0, 1 * zC];
            three = [0, 1 * yC, 0];
            four = [lateral * xC, yC2, lateral * zC];
        } else if (pieceType == 3) {
            // ZIG ZAG 1
            let rotate = Math.floor(Math.random() * 4);
            if (rotate == 0) {
                xC = 1;
                yC = -1;
            } else if (rotate == 1) {
                zC = 1;
                yC = -1;
            } else if (rotate == 2) {
                yC = 1;
                zC = -1;
            } else {
                yC = 1;
                zC = -1;
            }
            two = [Math.abs(1 * xC), 0, Math.abs(1 * zC)];
            three = [0, 1 * yC, 0];
            four = [-1 * xC, -1, -1 * zC];
        } else if (pieceType == 4) {
            // ZIG ZAG 2
            let rotate = Math.floor(Math.random() * 4);
            if (rotate == 0) {
                xC = 1;
                yC = -1;
            } else if (rotate == 1) {
                zC = 1;
                yC = -1;
            } else if (rotate == 2) {
                yC = 1;
                zC = -1;
            } else {
                yC = 1;
                zC = -1;
            }
            two = [Math.abs(1 * xC) * -1, 0, Math.abs(1 * zC) * -1];
            three = [0, 1 * yC, 0];
            four = [1 * xC, -1, 1 * zC];
        } else if (pieceType == 5) {
            // SQUARE PIECE
            let rotate = Math.floor(Math.random() * 2);
            if (rotate == 0) {
                xC = 1;
            } else {
                zC = 1;
            }
            two = [0, -1, 0];
            three = [-1 * xC, -1, -1 * zC];
            four = [-1 * xC, 0, -1 * zC];
        } else {
            // STRAIGHT PIECE
            let rotate = Math.floor(Math.random() * 3);
            if (rotate == 0) {
                yC = 1;
            } else if (rotate == 1) {
                zC = 1;
            } else {
                xC = 1;
            }

            two = [1 * xC, 1 * yC, 1 * zC];
            three = [2 * xC, 2 * yC, 2 * zC];
            four = [3 * xC, 3 * yC, 3 * zC];
        }

        cube2.position
            .copy(cube1.position)
            .add(
                new THREE.Vector3(
                    cubeLength * two[0],
                    cubeLength * two[1],
                    cubeLength * two[2]
                )
            );
        cube3.position
            .copy(cube1.position)
            .add(
                new THREE.Vector3(
                    cubeLength * three[0],
                    cubeLength * three[1],
                    cubeLength * three[2]
                )
            );
        cube4.position
            .copy(cube1.position)
            .add(
                new THREE.Vector3(
                    cubeLength * four[0],
                    cubeLength * four[1],
                    cubeLength * four[2]
                )
            );

        // add the cube pieces to the scene and the falling list
        this.add(cube1);
        this.add(cube2);
        this.add(cube3);
        this.add(cube4);

        let pieceList = [];
        pieceList.push(cube1);
        pieceList.push(cube2);
        pieceList.push(cube3);
        pieceList.push(cube4);

        falling.push(pieceList);
    }

    dropPieces(cameraPosition) {
        let tempSize = falling.length;
        // for each falling piece
        for (let i = 0; i < tempSize; i++) {
            // shift off the array with all the cubes in that piece
            let pieceList = falling.shift();

            // create a newPieceList to keep the shifted down cubes
            let newPieceList = [];

            // create an oldPieceList to keep the original cubes just in case
            let oldPieceList = [];

            // default switch for adding the newPiece
            let added = true;

            // for each of the four cubes
            for (let j = 0; j < 4; j++) {
                // take the old cube of the  piece list
                let oldCube = pieceList.shift();

                // create a new cube
                let newCube = new Cube(this, oldCube.state.color);

                // put that old cube onto the old piece list
                oldPieceList.push(oldCube);

                // shift the new cube downwards
                newCube.position.x = oldCube.position.x;
                newCube.position.y = oldCube.position.y - cubeLength;
                newCube.position.z = oldCube.position.z;

                // height map collisions
                if (
                    newCube.position.y <=
                    heightMap[newCube.position.x + xMax / 2 + 4][
                        newCube.position.z + zMax / 2 + 4
                    ]
                ) {
                    // we don't want to use the new adjusted cubes anymore
                    // so turn the switch off
                    added = false;
                }

                // checking for if a block dropped on your head
                let center = newCube.position;
                let halfLength = cubeLength / 2;
                let inCube =
                    cameraPosition.x >= center.x - halfLength &&
                    cameraPosition.x <= center.x + halfLength &&
                    cameraPosition.y >= center.y - halfLength &&
                    cameraPosition.y <= center.y + halfLength &&
                    cameraPosition.z >= center.z - halfLength &&
                    cameraPosition.z <= center.z + halfLength;
                if (inCube) {
                    // you die!
                    return true;
                }

                // add the new cube onto the new piece list
                newPieceList.push(newCube);
            }
            if (added) {
                for (const older of oldPieceList) {
                    this.remove(older);
                }
                for (const newer of newPieceList) {
                    this.add(newer);
                }
                falling.push(newPieceList);
            } else {
                for (const cube of oldPieceList) {
                    heightMap[Math.floor(cube.position.x) + xMax / 2 + 4][
                        Math.floor(cube.position.z) + zMax / 2 + 4
                    ] = Math.max(
                        heightMap[Math.floor(cube.position.x) + xMax / 2 + 4][
                            Math.floor(cube.position.z) + zMax / 2 + 4
                        ],
                        cube.position.y
                    );
                    if (heightMap[Math.floor(cube.position.x) + xMax / 2 + 4][
                        Math.floor(cube.position.z) + zMax / 2 + 4
                    ] > maxHeight) {
                        maxHeight = heightMap[Math.floor(cube.position.x) + xMax / 2 + 4][
                            Math.floor(cube.position.z) + zMax / 2 + 4
                        ];
                    }
                }
                resting.push(oldPieceList);
            }
        }

        return false;
    }

    update(cameraPosition) {
        // increment the counter for dropping
        dropCounter++;

        // generate a piece every so often
        if (dropCounter % (dropTime * 4) == 0) {
            this.generatePiece();
        }
        // every so often, move all pieces downwards
        if (dropCounter % dropTime == 0) {
            if(this.dropPieces(cameraPosition)) {
                // const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);
                const ambi = new AmbientLight(0x00ff00, 0.2);
                const death = new youDied(this);
                this.add(death);
                this.add(ambi);
                return true;
            }
        } 
        return false;
    }

    handleFallCollision(cameraPosition) {
        let correction = Number.NEGATIVE_INFINITY;
        let allPieces = [...resting, ...falling];
        for (let piece of allPieces) {
            for (let cube of piece) {
                let center = cube.position;
                let halfLength = cubeLength / 2;
                let inOrAboveCube =
                    cameraPosition.x >= center.x - halfLength &&
                    cameraPosition.x <= center.x + halfLength &&
                    cameraPosition.y >= center.y - halfLength &&
                    cameraPosition.z >= center.z - halfLength &&
                    cameraPosition.z <= center.z + halfLength;

                if (!inOrAboveCube) {
                    continue;
                }
                let displacement =
                    cube.position.y + halfLength - cameraPosition.y;
                if (displacement > 0) {
                    return displacement; // if inside the cube that's all we need
                }
                correction = Math.max(
                    /// if above the cube, find closest cube to determine if we need to stop falling
                    displacement,
                    correction
                );
            }
        }
        return correction;
    }
    bumpHeadCollisions(cameraPosition) {
        let allPieces = [...resting, ...falling];
        for (let piece of allPieces) {
            for (let cube of piece) {
                let center = cube.position;
                let halfLength = cubeLength / 2;
                let inCube =
                    cameraPosition.x >= center.x - halfLength &&
                    cameraPosition.x <= center.x + halfLength &&
                    cameraPosition.y >= center.y - halfLength &&
                    cameraPosition.y <= center.y + halfLength &&
                    cameraPosition.z >= center.z - halfLength &&
                    cameraPosition.z <= center.z + halfLength;

                if (!inCube) {
                    continue;
                }
                return cube.position.y - halfLength - cameraPosition.y;
                // if inside the cube that's all we need
            }
        }
        return 0;
    }

    handleSideCollisions(cameraPosition, previousCamera) {
        let allPieces = [...resting, ...falling];
        for (let piece of allPieces) {
            for (let cube of piece) {
                let center = cube.position;
                let halfLength = cubeLength / 2 + 0.05;
                let inCube =
                    cameraPosition.x >= center.x - halfLength &&
                    cameraPosition.x <= center.x + halfLength &&
                    cameraPosition.y >= center.y - halfLength &&
                    cameraPosition.y <= center.y + halfLength &&
                    cameraPosition.z >= center.z - halfLength &&
                    cameraPosition.z <= center.z + halfLength;

                if (!inCube) {
                    continue;
                }

                let direction = previousCamera.clone().sub(cameraPosition);
                direction.y = 0;
                direction.normalize();
                let xScale;
                let zScale;
                if (Math.abs(direction.x) > 0.001) {
                    xScale =
                        (center.x +
                            (Math.sign(direction.x) * halfLength -
                                cameraPosition.x)) /
                        direction.x;
                } else {
                    xScale = 10e5;
                }
                if (Math.abs(direction.z) > 0.001) {
                    zScale =
                        (center.z +
                            (Math.sign(direction.z) * halfLength -
                                cameraPosition.z)) /
                        direction.z;
                } else {
                    zScale = 10e5;
                }
                let scale = Math.min(xScale, zScale);
                return direction.multiplyScalar(scale + 0.04);
            }
        }
        if (confinedToArena) {
            let outOfBounds = new THREE.Vector3(0, 0, 0);

            if (cameraPosition.x < -heightMap.length / 2) {
                outOfBounds.add(
                    new THREE.Vector3(
                        -heightMap.length / 2 - cameraPosition.x,
                        0,
                        0
                    )
                );
            } else if (cameraPosition.x > heightMap.length / 2) {
                outOfBounds.add(
                    new THREE.Vector3(
                        heightMap.length / 2 - cameraPosition.x,
                        0,
                        0
                    )
                );
            }
            if (cameraPosition.z < -heightMap[0].length / 2) {
                outOfBounds.add(
                    new THREE.Vector3(
                        0,
                        0,
                        -heightMap[0].length / 2 - cameraPosition.z
                    )
                );
            } else if (cameraPosition.z > heightMap[0].length / 2) {
                outOfBounds.add(
                    new THREE.Vector3(
                        0,
                        0,
                        heightMap[0].length / 2 - cameraPosition.z
                    )
                );
            }
            if (outOfBounds != null) {
                return outOfBounds;
            }
        }
        return null;
    }

    generateCube() {
        const newCube = new Cube(this);

        // move it somehwhere
    }
}

export default GameScene;
