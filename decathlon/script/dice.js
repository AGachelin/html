export class Dice {
    #value;
	constructor() {
		this.#value = Math.floor(Math.random() * 6) + 1;
		this.cube = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: "blue" }),
		);
        this.locked = false;
	}
	value() {
		return this.#value;
	}
	throw() {
		this.#value = Math.floor(Math.random() * 6) + 1;
	}
}
