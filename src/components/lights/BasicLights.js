import {
    Group,
    SpotLight,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    RectAreaLight,
} from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0x90ee90, 1.6, 7, 0.8, 1, 1);

        const dir2 = new SpotLight(0x90ee90, 1.6, 7, 0.8, 1, 1);
        // const topLight = new SpotLight(0xffffff, 5, 10, 1, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        //const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);
        const dirLight = new DirectionalLight(0xffffff, 0.15);
        //const rectLight = new RectAreaLight();

        dir.position.set(0, 1, 5);
        dir.target.position.set(0, 0, 0);

        dir2.position.set(0, 5, -5);
        dir.target.position.set(0, 0, 0);

        // topLight.position.set(0, 5, 0);
        // topLight.target.position.set(0, 0, 0);

        this.add(dir, dir2, ambi);
    }
}

export default BasicLights;
