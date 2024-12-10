import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Cube, Floor } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from 'three';

let dropCounter = 0;
let cubeLength = 2;
let cubeList = [];
let heightMap = [];
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

        // Populate GUI
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update() {
        dropCounter++;
        let cube = new Cube(this);
        let col = (Math.floor(Math.random() * 5) - 2) * 2;

        if (dropCounter == 100) {
            debugger;

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
        // for (let i = 0; i < this.state.updateList.size; i++) {
        //     let currCube = this.state.updateList[i];
        //     this.remove(currCube);
        //     currCube.position.add(new THREE.Vector3(0, -0.2, 0));
        //     this.add(currCube);
        // }
    }

    generateCube() {
        const newCube = new Cube(this);

        // move it somehwhere
    }
}

export default GameScene;
