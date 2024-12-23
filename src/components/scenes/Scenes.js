import { WebGLRenderer } from "three";
import EndScene from "./EndScene";
import GameScene from "./GameScene";

class Scenes {
    constructor() {
        this.scenes = {};
        this.currentScene = undefined;
        this.renderer = undefined;
    }

    // Create scenes
    create() {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(640, 480);
        // Initialize dictionary of scenes
        this.scenes['title'] = new Title();
        this.scenes['instructions'] = new Instructions();

        this.scenes['frist'] = new Frist(); 

        this.scenes['prospect'] = new Prospect();
        this.scenes['prospectgame'] = new ProspectGame();
        this.scenes['prospectgameinstructions'] = new ProspectGameInstructions();

        this.scenes['poe'] = new Poe();
        this.scenes['poegameinstructions'] = new PoeGameInstructions();
        this.scenes['poegame'] = new PoeGame();

        this.scenes['nassau'] = new Nassau();

        this.scenes['garden'] = new Garden();
        this.scenes['gardengame'] = new GardenGame();
        this.scenes['gardengameinstructions'] = new GardenGameInstructions();

        this.scenes['indoors'] = new Indoors();

        this.scenes['gameover'] = new GameOver(); // Poe
        this.scenes['success'] = new Success(); // Poe

        this.scenes['gameoverprospect'] = new GameOverProspect();
        this.scenes['successprospect'] = new SuccessProspect();

        this.scenes['gameovergarden'] = new GameOverGarden();
        this.scenes['successgarden'] = new SuccessGarden();

        this.scenes['end'] = new End();

        // Set current scene to title scene
        this.currentScene = this.scenes['title'];

        this.currentScene.addEvents();
    }

    // Switches scenes
    switchScene(sceneKey) {
        this.currentScene.removeEvents();
        this.currentScene = this.scenes[sceneKey];
        this.currentScene.addEvents();
    }

    gameComplete() {
        return (this.successes[0] === 1 && this.successes[1] === 1 && this.successes[2] === 1);
    }
}

// Singleton pattern in modern JS
const instance = new Scenes();

export default instance;