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
            if(this.tentative===3){this.tentative=0;this.score_table=[];}
            this.tentative++;
            await this.current_tentative.init_scene();
            if(this.tentative===1){alert(this.name);}
            this.current_tentative.play_turn();
            return this.current_tentative.getScore().then((score) => {
                if(!this.current_tentative.lost_on_odd){
                    this.score = score;
                    this.score_table.push(this.score);
                    alert(`Score de la tentative n°${this.tentative} : ${this.score}`);
                }
            });
        }
    }