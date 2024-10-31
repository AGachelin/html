export class Dice {
	#value;
	cube;
	constructor() {
		this.#value = Math.floor(Math.random() * 6) + 1;
	}
	loadModel() {
		return new Promise((resolve, reject) => {
			const loadModel = () => {
				this.cube.scale.setScalar(0.03);
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
				"./models/Dicev4.obj",
				(obj) => {
					this.cube = obj;
				},
				onProgress,
				onError,
			);
		});
	}
	getGoalRotation() {
		switch (this.#value) {
			case 1:
				return [0, (-1 * Math.PI) / 2];
			case 4:
				return [0, 0];
			case 3:
				return [(2 * Math.PI) / 2, 0];
			case 2:
				return [(-1 * Math.PI) / 2, 0];
			case 5:
				return [Math.PI / 2, 0];
			case 6:
				return [0, (1 * Math.PI) / 2];
		}
	}
	throw() {
		// this method must return the score of the dice
		this.#value = Math.floor(Math.random() * 6) + 1;
		return this.#value;
	}
	getValue() {
		return this.#value;
	}
}
