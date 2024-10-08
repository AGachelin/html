import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

class Dice {
	#value;
    cube;
	constructor() {
		this.#value = Math.floor(Math.random() * 6) + 1;
		this.cube = new THREE.Mesh(
			new Geometry(2, 2, 2),
			new MeshBasicMaterial({ color: "purple" }),
		);
	}
	get value() {
		return this.#value;
	}
	throw() {
		this.#value = Math.floor(Math.random() * 6) + 1;
	}
}

document.getElementById("throw").style.backgroundColor = "purple";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);
const renderer = new THREE.WebGLRenderer();

des = new Dice();

document.querySelector("canvas").remove();
scene.background = new THREE.Color("#161718");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.setPosition(0, 0, 5);

const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 1.7);
scene.add(light);

des.cube.position.set(0, 0, 0);
des.cube.rotation.set(0.5, 0, 0);

renderer.render(scene, camera);
