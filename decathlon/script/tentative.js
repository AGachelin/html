import { Dice } from "./dice.js";

export class Tentative {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10
  );
  canvas = document.getElementById("canvas");
  renderer = new THREE.WebGLRenderer({
    canvas: this.canvas,
    antialias: true,
  });
  pointer = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  selected_dice;

  constructor() {
    this.show = this.show.bind(this);
    this.end_turn = this.end_turn.bind(this);
    this.initialized = false;
    this.dices = [];
    this.not_locked_dices = [];
    this.locked_dices = [];
    this.locked_previous_turn = 0;
    this.cubes = [];
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
      this.renderer.domElement
    );
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.addEventListener("change", this.show);
  }
  async init_scene() {
    document.querySelector("#dice_locking").addEventListener("click", this.end_turn);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.background = new THREE.Color("#000000");
    const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 0.5);
    this.scene.add(light);
    this.camera.position.z = 6;
    this.camera.position.x = 6;
    await Promise.all(this.not_locked_dices.map((dice) => dice.loadModel()));

    for (let i = 0; i < this.not_locked_dices.length; i++) {
      this.cubes.push(this.dices[i].cube);
      this.dices[i].cube.position.set(i - 2, 0, 0);
      const light2 = new THREE.DirectionalLight(0xffffff, 0.25);
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
      scores[i] = this.not_locked_dices[i].throw();
      const goal = this.not_locked_dices[i].getGoalRotation();
      this.not_locked_dices[i].cube.rotation.x = goal[0];
      this.not_locked_dices[i].cube.rotation.y = goal[1];
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
        true
      );
      if (intersects.length !== 0) {
        this.selected_cube = this.cubes.indexOf(intersects[0].object.parent);
        if(this.dices[this.selected_cube].getValue()%2===0){
            this.selected_dice = this.dices[this.selected_cube];
            const index_unlocked = this.not_locked_dices.indexOf(this.selected_dice);
            if(index_unlocked>-1){
                this.selected_dice.cube.traverse((mesh) => {
                    mesh.material.color.set("red");
                });
                this.not_locked_dices.splice(index_unlocked, 1);
                this.locked_dices.push(this.selected_dice);
            }
            else{
                this.selected_dice.cube.traverse((mesh) => {
                    mesh.material.color.set("lime");
                });
                this.locked_dices.splice(this.locked_dices.indexOf(this.selected_dice), 1);
                this.not_locked_dices.push(this.selected_dice);
            }
        }
        else{
            alert("Seuls les dés de valeur paire peuvent être sélectionnés");
        }
      }
      this.show();
    };
    window.addEventListener("click", onMouse);
    return new Promise((resolve) => {
        resolve();
    });
  }

  async end_turn() {
    if (this.locked_dices.length > this.locked_previous_turn) {
      this.locked_previous_turn = this.locked_dices.length;
      this.not_locked_dices.map((dice) => dice.throw());
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
          let goal = dice.getGoalRotation();
          dice.cube.rotation.x = goal[0];
          dice.cube.rotation.y = goal[1];
        }
      }
      const lost = this.not_locked_dices.map((dice)=> {return dice.getValue()%2===1;});
      console.log(lost);
      if(lost.every(Boolean)){
        //tentative perdue
        alert("Tous les dés ont une valeur impaire, cette tentative est perdue");
        this.init_scene();
      }
    } else {
      alert("Aucun dé n'a été sélectionné");
    }
  }
}
