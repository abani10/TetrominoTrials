import { Group } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './cube.obj';
import * as THREE from 'three';
//import MATERIAL from './cube.mtl';

class Cube extends Group {
    constructor(parent, randcolor) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: () => this.spin(), // or this.spin.bind(this)
            twirl: 0,
            color: null,
        };
        // Create the color
        const cubecolor = new THREE.Color(randcolor);
        this.state.color = cubecolor;

        // Load the object
        const loader = new OBJLoader();
        loader.load(MODEL, (object) => {
            // Traverse the loaded object and replace materials
            object.traverse((child) => {
                if (child.isMesh) {
                    // Replace material with custom material
                    child.material = new THREE.MeshPhongMaterial({
                        color: cubecolor,
                    });
                }
            });

            // Add the object to this group
            this.add(object);
        });

        /*
        // Load object
        const loader = new OBJLoader();

        this.name = 'cube';
        loader.load(MODEL, (object) => {
            this.add(object);
        }); 

        this.name = 'cube';

        // Load material first
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        // Dimensions of the cube

        const cubecolor = new THREE.Color(randcolor);
        this.state.color = cubecolor;

        const material = new THREE.MeshPhongMaterial({ color: cubecolor });
        // Red material
        const cube = new THREE.Mesh(geometry, material); 

        this.add(cube); */

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    // spin() {
    //     // Add a simple twirl
    //     this.state.twirl += 6 * Math.PI;

    //     // Use timing library for more precice "bounce" animation
    //     // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
    //     // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
    //     const jumpUp = new TWEEN.Tween(this.position)
    //         .to({ y: this.position.y + 1 }, 300)
    //         .easing(TWEEN.Easing.Quadratic.Out);
    //     const fallDown = new TWEEN.Tween(this.position)
    //         .to({ y: 0 }, 300)
    //         .easing(TWEEN.Easing.Quadratic.In);

    //     // Fall down after jumping up
    //     jumpUp.onComplete(() => fallDown.start());

    //     // Start animation
    //     jumpUp.start();
    // }

    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Cube;
