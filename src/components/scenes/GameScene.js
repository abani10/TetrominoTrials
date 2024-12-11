import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Cube, Floor } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from 'three';

let dropCounter = 0;
let cubeLength = 2;
let cubeList = [];
let heightMap = [];
let ceiling = 20;
let dropTime = 100;

class GameScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x000000);

        // Add meshes to scene
        // const land = new Land();
        // const flower = new Flower(this);
        const lights = new BasicLights();
        const cube = new Cube(this);

        const floor = new Floor(this);
        this.add(lights, floor);

        // this.add(cube);
        // Populate GUI
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    generatePiece() {
        // generate a random number to decide what piece type
        // we can change how we want to do this
        let pieceType = Math.floor(Math.random() *7);

        // create the four cubes for the shape
        let cube1 = new Cube(this);
        let cube2 = new Cube(this);
        let cube3 = new Cube(this);
        let cube4 = new Cube(this);

        // assemble the cubes based on what shape pice we're making
        let col = (Math.floor((Math.random() * 20) - 10)) * 2;
        
        cube1.position.add(new THREE.Vector3(col, ceiling, 0));
        if (pieceType == 0) {
            cube2.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position.copy(cube1.position).add(new THREE.Vector3(-cubeLength, 0, 0));
            cube4.position.copy(cube1.position).add(new THREE.Vector3(cubeLength, 0, 0));
        } else if (pieceType == 1) {
            cube2.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength * 2, 0));
            cube4.position.copy(cube1.position).add(new THREE.Vector3(cubeLength, -cubeLength * 2, 0));
        } else if (pieceType == 2) {
            cube2.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength * 2, 0));
            cube4.position.copy(cube1.position).add(new THREE.Vector3(-cubeLength, -cubeLength * 2, 0));
        } else if (pieceType == 3) {
            cube2.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position.copy(cube1.position).add(new THREE.Vector3(-cubeLength, -cubeLength, 0));
            cube4.position.copy(cube1.position).add(new THREE.Vector3(cubeLength, 0, 0));
        } else if (pieceType == 4) {
            cube2.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position.copy(cube1.position).add(new THREE.Vector3(cubeLength, -cubeLength, 0));
            cube4.position.copy(cube1.position).add(new THREE.Vector3(-cubeLength, 0, 0));
        } else if (pieceType == 5) {
            cube2.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position.copy(cube1.position).add(new THREE.Vector3(-cubeLength, -cubeLength, 0));
            cube4.position.copy(cube1.position).add(new THREE.Vector3(-cubeLength, 0, 0));
        } else {
            cube2.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength * 2, 0));
            cube4.position.copy(cube1.position).add(new THREE.Vector3(0, -cubeLength * 3, 0));
        }

        // add the cube pieces to the scene and the cubeList
        this.add(cube1);
        this.add(cube2);
        this.add(cube3);
        this.add(cube4);

        cubeList.push(cube1);
        cubeList.push(cube2);
        cubeList.push(cube3);
        cubeList.push(cube4);
    }

    dropPieces() {
        let tempSize = cubeList.length;
        for (let i = 0; i < tempSize; i++) {
            let newCube = new Cube(this);
                let oldCube = cubeList.shift();
                newCube.position.x = oldCube.position.x;
                newCube.position.y = oldCube.position.y - cubeLength;
                newCube.position.z = oldCube.position.z;
                this.remove(oldCube);
                this.add(newCube);
                cubeList.push(newCube);
        }
    }

    update() {
        // increment the counter for dropping
        dropCounter++;

        // generate a piece every so often
        if (dropCounter % (dropTime * 2) == 0) {
            this.generatePiece();
        }

        // every so often, move all pieces downwards
        if (dropCounter % dropTime == 0){
            this.dropPieces();
        }
        /*
        dropCounter++;

        if (dropCounter == 100) {
            cube.position.add(new THREE.Vector3(col, 3, 0));
            this.add(cube);
            cubeList.push(cube);
            dropCounter = 101;
        }
        if (dropCounter == 301) {
            cube.position.add(new THREE.Vector3(col, 3, 0));
            this.add(cube);
            cubeList.push(cube);
            dropCounter = 101;
        }
        if (dropCounter == 201 || dropCounter == 301) {
            // cube.position.set(new THREE.Vector3(0, -0.2, 0));
            let tempSize = cubeList.length;
            for (let i = 0; i < tempSize; i++) {
                let newCube = new Cube(this);
                let oldCube = cubeList.shift();
                newCube.position.x = oldCube.position.x;
                newCube.position.y = oldCube.position.y - cubeLength;
                newCube.position.z = oldCube.position.z;
                this.remove(oldCube);
                this.add(newCube);
                cubeList.push(newCube);
            }
        }
        for (let i = 0; i < this.state.updateList.size; i++) {
            let currCube = this.state.updateList[i];
            this.remove(currCube);
            currCube.position.add(new THREE.Vector3(0, -0.2, 0));
            this.add(currCube);
        }
            */
    }

    generateCube() {
        const newCube = new Cube(this);

        // move it somehwhere
    }
}

export default GameScene;
