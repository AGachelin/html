import { Dice } from "./dice.js";

export class Tentative {
    canvas;
    renderer;
    pointer = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    selectedDice;

    constructor() {
        this.show = this.show.bind(this);
        const canvas = document.getElementById("canvas");
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
        this.dices = [];
        this.not_locked_dices = [];
        this.locked_dices = [];
        for (let i = 0; i < 5; i++) {
            this.dices.push(new Dice(i));
            this.not_locked_dices.push(this.dices[i]);
        }
        this.score = 0;
    }

    orbitControls(cam, scene) {
        const controls = new THREE.OrbitControls(cam, scene.element);
        controls.addEventListener("change", this.show);
        controls.target.set(0, 0, 0);
    }

    async init_scene() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const Promise1 = Promise.all(
            this.not_locked_dices.map((dice) => dice.loadModel()),
        );
        const Promise2 = Promise1.then((val) => {
            for (let i = 0; i < this.not_locked_dices.length; i++) {
                const sceneElement = document.createElement("div");
                sceneElement.className = "list-item";
                this.dices[i].scene.element = sceneElement;
                document.getElementById("dicethrow").appendChild(sceneElement);
                this.dices[i].scene.background = new THREE.Color("#000000");
                this.dices[i].scene.add(
                    new THREE.HemisphereLight("#FFFFFF", "#757575", 0.25),
                );
                const light = new THREE.DirectionalLight(0xffffff, 0.5);
                light.position.set(-1, 2, 4);
                this.dices[i].scene.add(light);
                this.dices[i].scene.add(this.dices[i].cube);
                this.dices[i].camera.position.set(i - 2, 1, 2);
                this.dices[i].camera.updateProjectionMatrix();
                this.orbitControls(this.dices[i].camera, this.dices[i].scene);
            }
        });
        return Promise2;
    }

    show() {
        this.renderer.setScissorTest(false);
        this.renderer.setClearColor(0x0, 0);
        this.renderer.clear(true, true);
        this.renderer.setScissorTest(true);
        for (let i = 0; i < this.not_locked_dices.length; i++) {
            const element = this.dices[i].scene.element;
            const { left, right, top, bottom, width, height } =
                element.getBoundingClientRect();
            this.dices[i].camera.aspect = width / height;
            const positiveYUpBottom = this.renderer.domElement.clientHeight - bottom;
            this.renderer.setScissor(left, positiveYUpBottom, width, height);
            this.renderer.setViewport(left, positiveYUpBottom, width, height);
            this.dices[i].camera.lookAt(
                this.dices[i].scene.position.x,
                this.dices[i].scene.position.y,
                this.dices[i].scene.position.z,
            );
            this.dices[i].camera.updateProjectionMatrix();
            this.renderer.render(this.dices[i].scene, this.dices[i].camera);
        }
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
            const wid = document
                .getElementsByClassName("list-item")
                .item(0)
                .getBoundingClientRect().width;
            this.pointer.x = ((event.clientX % wid) / wid) * 2 - 1;
            this.pointer.y =
                -(
                    event.clientY /
                    document
                        .getElementsByClassName("list-item")
                        .item(0)
                        .getBoundingClientRect().height
                ) *
                2 +
                1;
            console.log(this.pointer);
            const i = Math.floor(event.clientX / wid);
            this.raycaster.setFromCamera(this.pointer, this.dices[i].camera);
            const intersects = this.raycaster.intersectObjects(
                this.dices[i].scene.children,
                true,
            );
            if (intersects.length !== 0) {
                console.log(intersects[0].object);
                this.selectedDice = intersects[0].object;
                for (let i = 0; i < this.not_locked_dices.length; i++) {
                    this.not_locked_dices[i].cube.traverse((mesh) => {
                        mesh.material.color.set("lime");
                    });
                }
                this.selectedDice.material.color.set("red");
            }
            this.show();
        };
        for (item in Array.from(document.getElementsByClassName("list-item"))) {
            item.addEventListener("click", onMouse);
        }
    }
}
