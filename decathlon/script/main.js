import { Tentative } from "./tentative.js";

document.querySelector("#play-button").addEventListener("click", (event) => {
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "block";
    document.getElementById("throw").style.backgroundColor = "black";
    tent();
});


async function tent() {
    const tentative = new Tentative();
    await tentative.init_scene();
    tentative.start_turn();
    tentative.show();
}

document.querySelector("#done-button").addEventListener("click", (event) => {
    document.getElementById("div1").style.display = "block";
    document.getElementById("div2").style.display = "none";
    document.getElementById("throw").style.backgroundColor = "white";
});
