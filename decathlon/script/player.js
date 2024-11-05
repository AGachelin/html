import { Tentative } from "./tentative.js";

export class Player {
    constructor(name, id) {
        this.current_tentative;
        this.tentative = 0;
        this.score;
        this.score_table = [];
        this.name = name;
        this.id = id;
    }
    async play() {
            this.current_tentative = new Tentative();
            if(this.tentative===3){this.tentative=0;}
            this.tentative++;
            await this.current_tentative.init_scene();
            this.current_tentative.play_turn();
            return this.current_tentative.getScore().then((score) => {
                this.score = score;
                this.score_table.push(this.score);
                alert(`Score de la tentative n°${this.tentative} : ${this.score}`);
            });
        }
    destructor(){
        document.getElementById(String(this.id)).outerHTML = "";
    }
    }
