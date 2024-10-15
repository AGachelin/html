import { Dice } from "./dice.js";
class Tentative {
	camera; scene; renderer; initialized;
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	constructor() {
		this.show = this.show.bind(this);
		this.initialized = false;
		this.dices = [];
		this.not_locked_dices = [];
		for (let i = 0; i < 5; i++) {
			this.dices.push(new Dice(i, this.scene));
			this.not_locked_dices.push(this.dices[i]);
			this.show();
		}
		this.score = 0;
	}
	init_scene() {
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.scene.background = new THREE.Color("#000000");
		document.getElementById("dicethrow").appendChild(this.renderer.domElement);
		// this.dices.forEach((x, i) => {
		// 	x.cube.position.y = - 0.95;
		// 	x.cube.scale.setScalar( 0.01 );
		// 	scene.add(x.cube);
		// 	// x.cube.position.set(i * 3, 0, 0);
		// 	// this.scene.add(x.cube);
		// });
		const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 0.5);
		this.scene.add(light);
		this.camera.position.z = 6;
		this.camera.position.x = 6;
		const controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		controls.minDistance = 2;
		controls.maxDistance = 5;
		controls.addEventListener('change',this.show);
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
