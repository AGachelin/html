import { Dice } from "./dice.js";

export class Tentative {
    #score;
    lost_on_odd = false;
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
        this.is_able_to_play = true;
        this.selected_dice;
        this.selected_cube = -1;
        this.cubes = [];
        this.show = this.show.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.initialized = false;
        this.dices = [];
        this.not_locked_dices = [];
        this.locked_dices = [];
        this.permanently_locked = [];
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
        this.buttons = document.getElementById("buttons")
        this.renderer.setSize(window.innerWidth, window.innerHeight - this.buttons.scrollHeight*1.1);
        this.scene.background = new THREE.Color("black");
        const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 1.5);
        light.position.set(0, 2, 0);
        this.scene.add(light);
        this.camera.position.z = 2;
        this.camera.position.y = 0.5;
        await Promise.all(this.not_locked_dices.map((dice) => dice.loadModel()));

        for (let i = 0; i < this.not_locked_dices.length; i++) {
            this.cubes.push(this.dices[i].cube);
            this.dices[i].cube.position.set(i - 2, 0, 0);
            const light2 = new THREE.DirectionalLight(0xffffff, 5);
            light2.position.set(i - 2, 0.5, 205);
            this.scene.add(light2);
            this.dices[i].cube.traverse((mesh) => {
                mesh.material = new THREE.MeshPhysicalMaterial({ color: 0x00ff00, roughness: 0.5, metalness : 1});
            });
            this.scene.add(this.dices[i].cube);
        }
        this.orbitControls();
        window.addEventListener("resize", this.onWindowResize, false);
        document.getElementById("end_turn").onclick = () => {
            this.is_able_to_play = false;
        };
        await this.not_locked_dices.map(async (dice) => {
            await dice.throw();
            console.log("diplayed value",dice.getValue());
            const goal = dice.getGoalRotation();
            dice.cube.rotation.x = goal[0];
            dice.cube.rotation.y = goal[1];
        });
        this.onWindowResize();
        this.show();
    }

    show() {
        this.renderer.render(this.scene, this.camera);
    }
    wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async play_turn() {

        this.calculateScore();
        this.checkPlayablility();

        if (this.not_locked_dices.length > 1 && this.is_able_to_play) {
            await this.enable_selector();
            await this.end_turn();
            this.play_turn();
        } 
        // else {
        //     // alert("Your turn is over");
        // }
    }
    async enable_selector() {
        const onMouse = (event) => {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / (window.innerHeight-this.buttons.scrollHeight*1.1)) * 2 + 1;
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersects = this.raycaster.intersectObjects(
                this.scene.children,
                true,
            );
            if (intersects.length !== 0) {
                this.selected_cube = this.cubes.indexOf(intersects[0].object.parent);
                if (this.dices[this.selected_cube].getValue() % 2 === 0) {
                    this.selected_dice = this.dices[this.selected_cube];
                    if (this.permanently_locked.indexOf(this.selected_dice) === -1) {
                        const index_unlocked = this.not_locked_dices.indexOf(
                            this.selected_dice,
                        );
                        if (index_unlocked > -1) {
                            this.selected_dice.cube.traverse((mesh) => {
                                mesh.material.color.set("red");
                            });
                            this.not_locked_dices.splice(index_unlocked, 1);
                            this.locked_dices.push(this.selected_dice);
                        } else {
                            this.selected_dice.cube.traverse((mesh) => {
                                mesh.material.color.set("lime");
                            });
                            this.locked_dices.splice(
                                this.locked_dices.indexOf(this.selected_dice),
                                1,
                            );
                            this.not_locked_dices.push(this.selected_dice);
                        }
                    } else {
                        alert("Ce dé a déjà été vérouillé");
                    }
                } else {
                    alert("Seuls les dés de valeur paire peuvent être sélectionnés");
                }
            }
            this.show();
        };
        let toggle = false;

        window.addEventListener("click", onMouse);
        document.getElementById("dice_locking").onclick = () => {
            toggle = !toggle;
        };

        return new Promise((resolve) => {
            const checkselection = () => {
                if ((toggle && this.locked_dices.length > 0) || !this.is_able_to_play) {
                    if (!this.is_able_to_play) {
                        this.locked_dices.map((dice) => {
                            dice.cube.traverse((mesh) => {
                                mesh.material.color.set("lime");
                            });
                            this.not_locked_dices.push(dice);
                        })
                        this.locked_dices = [];
                    }
                    resolve(this.locked_dices);
                } else {
                    requestAnimationFrame(checkselection);
                }
            };
            checkselection();
        }).then(() => {
            window.removeEventListener("click", onMouse);
            toggle = false;
            if (this.locked_dices.length === 0) {
                this.locked_dices.map((dice) => {
                    dice.cube.traverse((mesh) => {
                        mesh.material.color.set("black");
                    });
                });
            }
        });
    }

    async getScore() {
        return new Promise((resolve) => {
            const checkScore = () => {
                if (!this.is_able_to_play) {
                    resolve(this.#score);
                } else {
                    requestAnimationFrame(checkScore);
                }
            };
            checkScore();
        });
    }
    async end_turn() {
        if (this.locked_dices.length > 0) {
            this.locked_dices.map((dice) => {
                this.permanently_locked.push(dice);
            });
            this.locked_dices = [];
            this.not_locked_dices.map(async (dice) => await dice.throw());
            const anim_end = new Array(this.not_locked_dices.length).fill(false);
            let n = 0;
            while (n < 2 && !anim_end.every(Boolean)) {
                n += 0.05;
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
            this.show();
        }
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / (window.innerHeight - this.buttons.scrollHeight*1.1);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight - this.buttons.scrollHeight*1.1);
        this.show();
    }
    checkPlayablility() {
        const lost = this.not_locked_dices.map((dice) => {
            return dice.getValue() % 2 === 1;
        });
        if (this.not_locked_dices.length === 0) {
            this.is_able_to_play = false;
        }
        else if(lost.every(Boolean)){
            alert("Every dice is odd, this try is void");
            this.is_able_to_play = false;
            this.lost_on_odd = true;
        }

    }
    clearScene() {
        while (this.scene.children.length > 0) {
            const child = this.scene.children[0];
            this.scene.remove(child);

            if (child.geometry) {
                child.geometry.dispose();
            }

            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.map((material) => material.dispose());
                } else {
                    child.material.dispose();
                }
            }

            if (child.texture) {
                child.texture.dispose();
            }
        }
    }
    calculateScore() {
        this.#score = 0;
        this.dices.map((dice) => {
            this.#score += dice.getValue();
        });
    }
}
