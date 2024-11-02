import { Dice } from "./dice.js";

export class Tentative {
	#score;
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		10,
	);
	canvas = document.getElementById("canvas");
	renderer = new THREE.WebGLRenderer({
		canvas: this.canvas,
		antialias: true,
	});
	pointer = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

	constructor() {
		this.#score = 0;
		this.selected_dice = -1;
		this.show = this.show.bind(this);
		this.initialized = false;
		this.dices = [];
		this.not_locked_dices = [];
		this.locked_dices = [];
		for (let i = 0; i < 5; i++) {
			this.dices.push(new Dice());
			this.not_locked_dices.push(this.dices[i]);
			this.show();
		}
	}
	orbitControls() {
		const controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement,
		);
		controls.minDistance = 2;
		controls.maxDistance = 5;
		controls.addEventListener("change", this.show);
	}
	async init_scene() {
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.scene.background = new THREE.Color("black");
		const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 0.5);
		light.position.set(0, 2, 0);
		this.scene.add(light);
		this.camera.position.z = 5;
		await Promise.all(this.not_locked_dices.map((dice) => dice.loadModel()));

		for (let i = 0; i < this.not_locked_dices.length; i++) {
			this.dices[i].cube.position.set(i - 2, 0, 0);
			const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
			light2.position.set(i - 2, 0, 5);
			this.scene.add(light2);
			this.dices[i].cube.traverse((mesh) => {
				mesh.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
			});
			this.scene.add(this.dices[i].cube);
		}
		this.orbitControls();
	}

	show() {
		this.renderer.render(this.scene, this.camera);
	}
	wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	async start_turn() {
		const scores = [0, 0, 0, 0, 0, 0];
		for (let i = 0; i < this.not_locked_dices.length; i++) {
			scores[i] = this.not_locked_dices[i].throw(this.show);
			const goal = this.not_locked_dices[i].getGoalRotation();
			this.not_locked_dices[i].cube.rotation.x = goal[0];
			this.not_locked_dices[i].cube.rotation.y = goal[1];
			this.#score += scores[i];
		}
		this.show();

		if (this.not_locked_dices.length > 1) {
			console.log(await this.enable_selector());
			console.log("not locked dices", this.not_locked_dices.length);
			console.log("locked dices", this.locked_dices.length);
			console.log("selected dice", this.selected_dice);
			await this.end_turn();
			this.selected_dice = -1;
			this.start_turn();
		}
	}
	async enable_selector() {
		const onMouse = (event) => {
			this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
			this.raycaster.setFromCamera(this.pointer, this.camera);
			const intersects = this.raycaster.intersectObjects(
				this.scene.children,
				true,
			);
			if (intersects.length !== 0) {
				for (const dice of this.not_locked_dices) {
					dice.cube.traverse((mesh) => {
						mesh.material.color.set("lime");
					});
				}

				this.selected_dice = this.not_locked_dices.findIndex(
					(dice) => dice.cube === intersects[0].object.parent,
				);

				if (
					this.selected_dice !== -1 &&
					this.not_locked_dices[this.selected_dice].getValue() % 2 === 0
				) {
					intersects[0].object.traverse((mesh) => {
						mesh.material.color.set("red");
					});
				} else {
					this.selected_dice = -1;
				}
			}
			this.show();
			console.log("updated");
		};
		let toggle = false;

		window.addEventListener("click", onMouse);
		document.getElementById("dice_locking").onclick = () => {
			toggle = !toggle;
		};

		return new Promise((resolve) => {
			const checkselection = () => {
				if (toggle && this.selected_dice !== -1) {
					resolve(this.selected_dice);
				} else {
					requestAnimationFrame(checkselection);
				}
			};
			checkselection();
		}).then(() => {
			window.removeEventListener("click", onMouse);
			toggle = false;
			this.not_locked_dices[this.selected_dice].cube.traverse((mesh) => {
				mesh.material.color.set("black");
			});
		});
	}

	async getScore() {
		return new Promise((resolve) => {
			const checkScore = () => {
				if (this.#score > 0) {
					resolve(this.#score);
				} else {
					requestAnimationFrame(checkScore);
				}
			};
			checkScore();
		});
	}
	async end_turn() {
		const index = this.selected_dice;
		if (index > -1) {
			this.locked_dices.push(
				this.not_locked_dices.splice(this.selected_dice, 1),
			);
			this.not_locked_dices.map((dice) => dice.throw());
			const anim_end = new Array(this.not_locked_dices.length).fill(false);
			let n = 0;
			while (n < 2 && !anim_end.every(Boolean)) {
				n += 0.02;
				if (n < 1) {
					for (const dice of this.not_locked_dices) {
						const val = Math.floor(Math.random() * 6) + 1;
						const goal = dice.getGoalRotation(val);
						dice.cube.rotation.x = goal[0];
						dice.cube.rotation.y = goal[1];
					}
				} else {
					for (let i = 0; i < this.not_locked_dices.length; i++) {
						if (!anim_end[i]) {
							const dice = this.not_locked_dices[i];
							let goal;
							const stop_dice = Math.random();
							if (stop_dice > 0.05) {
								const val = Math.floor(Math.random() * 6) + 1;
								goal = dice.getGoalRotation(val);
							} else {
								goal = dice.getGoalRotation();
								anim_end[i] = true;
							}
							dice.cube.rotation.x = goal[0];
							dice.cube.rotation.y = goal[1];
						}
					}
				}
				this.show();
				await this.wait(150);
			}
			for (let i = 0; i < this.not_locked_dices.length; i++) {
				if (!anim_end[i]) {
					const dice = this.not_locked_dices[i];
					const goal = dice.getGoalRotation();
					dice.cube.rotation.x = goal[0];
					dice.cube.rotation.y = goal[1];
				}
			}
		} else {
			alert("lorem ipsum");
		}
	}
}
