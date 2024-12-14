import { Group } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './youDied.obj';

class youDied extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            bob: true,
            spin: () => this.spin(), // or this.spin.bind(this)
            twirl: 0,
        };

        // Load object
        const loader = new OBJLoader();

        this.name = 'youDied';
        loader.load(MODEL, (object) => {
            this.add(object);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

}

export default youDied;
