import { Dice } from "./dice.js";

export class Tentative {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    renderer = new THREE.WebGLRenderer();

    pointer = new THREE.Vector2();
    raycaster = new THREE.Raycaster();

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
        document.getElementById("dicethrow").appendChild(this.renderer.domElement);
        const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 0.5);
        this.scene.add(light);
        this.camera.position.z = 6;
        this.camera.position.x = 6;

        await Promise.all(this.not_locked_dices.map((dice) => dice.loadModel()));

        for (let i = 0; i < this.not_locked_dices.length; i++) {
            this.dices[i].cube.position.set(i - 2, 0, 0);
            this.dices[i].cube.rotation.set(0, 0, 0);
            this.dices[i].cube.traverse((mesh) => {
                mesh.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            });
            this.scene.add(this.dices[i].cube);
        }
        this.orbitControls();
    }

    show() {
        if (!this.initialized) {
            this.init_scene();
            this.initialized = true;
        }
        this.renderer.render(this.scene, this.camera);
    }
    start_turn() {
        scores = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < this.not_locked_dices.length; i++) {
            scores[i] = this.not_locked_dices[i].throw(this.show);
            this.score += scores[i];
        }
        dice_selected = selector();
        if (dice_selected !== -1) {
            this.locked_dices.push(this.not_locked_dices.splice(dice_selected, 1));
            return false;
        }
        return true;
    }
    selector() {
        const onMouse = (event) => {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersects = this.raycaster.intersectObjects(
                this.scene.children,
                true,
            );
            if (intersects.length !== 0) {
                for(const dice of this.not_locked_dices){
                    dice.cube.traverse((mesh) => {
                        mesh.material.color.set("lime");
                    })
                }
                intersects[0].object.traverse((mesh) => {
                    mesh.material.color.set("red");
                });
            }
                
            this.show();
        };
        window.addEventListener("click", onMouse);
    }
}
