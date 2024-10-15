export class Dice {
    #value;
	constructor() {
		this.#value = Math.floor(Math.random() * 6) + 1;
		this.cube = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshPhongMaterial({ color: "blue" }),
		);
	}
	throw(show) { // this method must return the score of the dice
		this.#value = Math.floor(Math.random() * 6) + 1;
        return this.#value;
	}
}
