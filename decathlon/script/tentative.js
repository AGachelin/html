import Dice from "./dice.js"

class Tentative{
    constructor(){
        this.dice1 = new Dice()
        this.dice2 = new Dice()
        this.dice3 = new Dice()
        this.dice4 = new Dice()
        this.dice5 = new Dice()
        this.not_locked_dices = [this.dice1, this.dice2, this.dice3, this.dice4, this.dice5]
        this.score = 0;
        start_turn()
    }
    start_turn(){
        this.not_locked_dices.forEach((x, i) => x.throw());
        document.querySelector("#turn-end-button").addEventListener("click", (event) => {
        if (this.dice1.locked){scorr}
        })
    }
}