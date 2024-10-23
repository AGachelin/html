import { Dice } from "./dice.js";

export class Tentative {
    canvas;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });
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
        const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 0.5);
        this.scene.add(light);
        this.camera.position.z = 6;
        this.camera.position.x = 6;
        await Promise.all(this.not_locked_dices.map((dice) => dice.loadModel()));

        for (let i = 0; i < this.not_locked_dices.length; i++) {
            this.dices[i].cube.position.set(i - 2, 0, 0);
            const light2 = new THREE.DirectionalLight(0x0000ff, 5);
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
                console.log(this.not_locked_dices[0].throw());
                let goal=this.not_locked_dices[0].getGoalRotation();
                console.log(goal);
                this.not_locked_dices[0].cube.rotation.x = goal[0];
                this.not_locked_dices[0].cube.rotation.y = goal[1];
            }
                
            this.show();
        };
        window.addEventListener("click", onMouse);
    }
}
