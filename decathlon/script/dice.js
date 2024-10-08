class Dice {
	#value;
    cube;
	constructor() {
		this.#value = Math.floor(Math.random() * 6) + 1;
		this.cube = new THREE.Mesh(
			new THREE.BoxGeometry(2, 2, 2),
			new THREE.MeshBasicMaterial({ color: "purple" }),
		);
	}
	get value() {
		return this.#value;
	}
	throw() {
		this.#value = Math.floor(Math.random() * 6) + 1;
	}
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const des = new Dice();

// document.querySelector("canvas").remove();
scene.background = new THREE.Color("#161718");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

des.cube.position.set(0, 0, 0);
des.cube.rotation.set(0.5, 0, 0);

scene.add(des.cube);

const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 1.7);
scene.add(light);

camera.position.z = 5;

const control = new THREE.OrbitControls(camera, renderer.domElement);
const drag = () => {
    control.update();
}
drag();

renderer.render(scene, camera);
