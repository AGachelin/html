export class Dice {
	#value;
	cube;
	constructor(scene) {
		this.scene = scene;
		this.loadModel();
		this.#value = Math.floor(Math.random() * 6) + 1;
	}

	loadModel() {
		return new Promise((resolve, reject) => {
			const loadModel = () => {
				this.cube.position.set(0, 0, 0);
				this.cube.scale.setScalar(0.3);
				resolve();
			};

			const onProgress = (xhr) => {
				if (xhr.lengthComputable) {
					const percentComplete = (xhr.loaded / xhr.total) * 100;
					console.log(`model ${percentComplete.toFixed(2)}% downloaded`);
				}
			};

			const onError = (error) => {
				reject(error);
			};

			this.manager = new THREE.LoadingManager(loadModel);
			const loader = new THREE.OBJLoader(this.manager);
			loader.load(
				"../decathlon/models/dice.obj",
				(obj) => {
					this.cube = obj;
				},
				onProgress,
				onError,
			);
		});
	}
	throw(show) {
		// this method must return the score of the dice
		this.#value = Math.floor(Math.random() * 6) + 1;
		return this.#value;
	}
}
