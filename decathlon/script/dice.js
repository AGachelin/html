export class Dice {
	#value;
	cube;
	constructor() {
		this.#value = Math.floor(Math.random() * 6) + 1;
	}
	loadModel() {
		return new Promise((resolve, reject) => {
			const loadModel = () => {
				this.cube.scale.setScalar(0.6);
				this.cube.rotation.set(0, 0, 0);
				this.cube.traverse((mesh) => {
					mesh.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
				});
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
				"./models/dice.obj",
				(obj) => {
					this.cube = obj;
				},
				onProgress,
				onError,
			);
		});
	}
	throw() {
		// this method must return the score of the dice
		this.#value = Math.floor(Math.random() * 6) + 1;
		return this.#value;
	}
}
