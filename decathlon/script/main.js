import { Player } from "./player.js";

const players = [];
const addPlayer = () => {
	players.push(new Player(`Player ${players.length + 1}`));
	document.getElementById("player_list").innerHTML +=
		`<li>${players[players.length - 1].name}</li>`;
};

const playGame = async () => {
	for (let i = 0; i < players.length; i++) {
		alert(players[i].name);
		for (let j = 0; j < 3; j++) {
			await players[i].play();
		}
		console.log(players[i].score_table);
		alert(
			`Score du joueur ${players[i].name}: ${Math.max(...players[i].score_table)}`,
		);
	}
	alert("Partie terminée");
	document.querySelector("#done-button").dispatchEvent(new MouseEvent("click"));
};

document.getElementById("add_player").onclick = addPlayer;
document.querySelector("#done-button").addEventListener("click", (event) => {
	document.getElementById("div1").style.display = "block";
	document.getElementById("player_menu").style.display = "block";
	document.getElementById("div2").style.display = "none";
	document.getElementById("throw").style.backgroundColor = "white";
});
document.querySelector("#play-button").addEventListener("click", (event) => {
	if (players.length === 0) {
		return alert("Please add a player before playing the game");
	}
	document.getElementById("div1").style.display = "none";
	document.getElementById("player_menu").style.display = "none";
	document.getElementById("div2").style.display = "block";
	document.getElementById("throw").style.backgroundColor = "black";
	playGame();
});
