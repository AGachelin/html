import { Dice } from "./dice.js";

class Tentative {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);
	renderer = new THREE.WebGLRenderer();
	constructor() {
		this.dices = [];
		this.not_locked_dices = [];
		for (let i = 0; i < 5; i++) {
			this.dices.push(new Dice());
			this.not_locked_dices.push(this.dices[i]);
		}
		this.score = 0;
		this.initialized = false;
	}
	init_scene() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.scene.background = new THREE.Color("#000000");
		document.getElementById("dicethrow").appendChild(this.renderer.domElement);
		this.dices.forEach((x, i) => {
			x.cube.position.set(i * 3, 0, 0);
			this.scene.add(x.cube);
		});
		const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 1.7);
		this.scene.add(light);
		this.camera.position.z = 6;
		this.camera.position.x = 6;
	}
	show() {
		if (!this.initialized) {
			this.init_scene();
			this.initialized = true;
		}
		this.renderer.render(this.scene, this.camera);
	}
	start_turn() {
		// this.not_locked_dices.forEach((x) => x.throw());
	}
}

console.log("show");
const tentative = new Tentative();
tentative.show();
