import { Group } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import MODEL from './front.obj';
import * as THREE from 'three';

class Front extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: () => this.spin(), // or this.spin.bind(this)
            twirl: 0,
        };

        // Create a custom Lambert material
        const customMaterial = new THREE.MeshLambertMaterial({
            color: 0xA5A5A5, // Bright green color
            emissive: 0x111111, // Slight emissive effect
            opacity: 0.9, // Slightly transparent
        });

        // Load the object
        const loader = new OBJLoader();
        this.name = 'front';

        loader.load(
            MODEL,
            (object) => {
                // Traverse the object and apply the custom material
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = customMaterial;
                    }
                });

                // Add the object to the group
                this.add(object);
            },
            undefined,
            (error) => {
                console.error('An error occurred loading the object:', error);
            }
        );
        // Add self to parent's update list
        parent.addToUpdateList(this);
    }


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

export default Front;
