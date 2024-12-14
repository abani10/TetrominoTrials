import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Cube, Floor, Front } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from 'three';

class EndScene extends Scene {
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
}