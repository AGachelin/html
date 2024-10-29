import { Dice } from "./dice.js";

export class Tentative {
    canvas;
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

    selected_dice = -1;

    constructor() {
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
        this.score = 0;
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
        this.scene.background = new THREE.Color("#000000");
        const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 0.5);
        this.scene.add(light);
        this.camera.position.z = 6;
        this.camera.position.x = 6;
        await Promise.all(this.not_locked_dices.map((dice) => dice.loadModel()));

        for (let i = 0; i < this.not_locked_dices.length; i++) {
            this.dices[i].cube.position.set(i - 2, 0, 0);
            const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
            light2.position.set(i-2, 0, 5);
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
    async start_turn() {
        const scores = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < this.not_locked_dices.length; i++) {
            scores[i] = this.not_locked_dices[i].throw(this.show);
            this.score += scores[i];
        }

        console.log(await this.enable_selector());
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
                intersects[0].object.traverse((mesh) => {
                    mesh.material.color.set("red");
                });
                console.log(this.not_locked_dices[0].throw());
                let goal=this.not_locked_dices[0].getGoalRotation();
                // const quaternion = new THREE.Quaternion().setFromAxisAngle((1,0,0), goal[0]/(2*Math.Pi) );
                // const quaternion1 = new THREE.Quaternion().setFromAxisAngle((0,1,0), goal[1] );
                console.log(goal);
                intersects[0].object.rotation.x=goal[0]
                intersects[0].object.rotation.y=goal[1];
                console.log(this.not_locked_dices[0].cube);
                // this.camera.updateProjectionMatrix();
                this.selected_dice = this.not_locked_dices.indexOf(
                    intersects[0].object,
                );
            }

            this.show();
        };
        let toggle = false;

        window.addEventListener("click", onMouse);
        document.getElementById("dice_locking").click = () => {
            toggle = !toggle;
        };

        return new Promise((resolve) => {
            const checkselection = () => {
                if (toggle && this.selected_dice !== -1) {
                    resolve(this.selected_dice);
                } else {
                    requestAnimationFrame(checkselection);
                }
            }
            checkselection();
        }).then( () => {
            window.removeEventListener("click", onMouse);
            toggle = !toggle;
            this.locked_dices.push(this.not_locked_dices.splice(this.selected_dice, 1));
        } );
    }
}
