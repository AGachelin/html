import { Tentative } from "./tentative.js";
import { Player } from "./player.js";

document.querySelector("#play-button").addEventListener("click", (event) => {
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "block";
    document.getElementById("throw").style.backgroundColor = "black";
    player.play();
});

const player = new Player("Player 1");

document.querySelector("#done-button").addEventListener("click", (event) => {
    document.getElementById("div1").style.display = "block";
    document.getElementById("div2").style.display = "none";
    document.getElementById("throw").style.backgroundColor = "white";
});
