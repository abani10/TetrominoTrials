import {
    Group,
    SpotLight,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    RectAreaLight,
} from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

class EndLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0x00ff00, 2, 20, 0.8, 1, 1);

        const dir2 = new SpotLight(0x90ee90, 1.6, 7, 0.8, 1, 1);
        // const topLight = new SpotLight(0xffffff, 5, 10, 1, 1, 1);
        const ambi = new AmbientLight(0x00ff00, 0.2);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);
        const dirLight = new DirectionalLight(0xffffff, 0.15);
        //const rectLight = new RectAreaLight();

        // Create a green rectangular light
        /* const rectLight = new RectAreaLight(0x00ff00, 100, 10, 10); // Green light, intensity 5, width 2, height 1
        rectLight.position.set(0, -14, 5); // Set position (adjust based on your model's dimensions)
        rectLight.lookAt(0, 0, 0); // Make the light face the center of the scene
        const helper = new RectAreaLightHelper(rectLight);
        rectLight.add(helper);*/

        dir.position.set(0, 6, 13);
        dir.target.position.set(0, 0, 0);

        dir2.position.set(0, -14, -5);
        dir.target.position.set(0, 0, 0);

        // topLight.position.set(0, 5, 0);
        // topLight.target.position.set(0, 0, 0);

        this.add(hemi);
    }
}

export default EndLights;
