import { Player } from "./objects/player.js";
import { HighScoreBoard } from "./player_card/highscore.jsx";


const highscores = {};
const ranks = {};
const ranks_reversed = {};

async function getPlayers(){
	var players = [];
	await fetch(
		"http://localhost:4444/Players"
	).then(
		response=>response.json()
	).then(
		playerList=> playerList.map(p=> players.push(new Player(p.name, p.id)))
	)
	return players;
}

async function addPlayer(num) {// ajouter gestion cancel
	getPlayers();
	const player_name = window.prompt(
		`Nom du joueur ${num + 1} :`,
		`Player ${num + 1}`,
	);
	if (player_name !== null) {
		var player = await fetch("http://localhost:4444/api/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name:player_name
			}),
		}).then(response=>response.json());
	}
	return new Player(player.name, player.id);
};

async function setHighScores (){
	window.getElementById("highscores").innerHTML = "";
	for (const player of players) {
		console.log(ranks, highscores, ranks_reversed);
		if (player.name in highscores) {
			if (player.score > highscores[player.name]) {
				highscores[player.name] = player.score;
				const previous_rank = ranks_reversed[player.name];
				for (const [r, pl] of Object.entries(ranks)) {
					const rank = Number(r);
					if (
						rank < ranks_reversed[player.name] &&
						highscores[pl] < player.score
					) {
						ranks_reversed[player.name] = rank;
					}
				}
				for (let i = previous_rank; i > ranks_reversed[player.name]; i--) {
					ranks[i] = ranks[i - 1];
					ranks_reversed[ranks[i - 1]] = i;
				}
				ranks[ranks_reversed[player.name]] = player.name;
			}
		} else {
			let rank_p = Object.values(ranks).length;
			for (const [r, pl] of Object.entries(ranks)) {
				const rank = Number(r);
				if (rank < rank_p && highscores[pl] < player.score) {
					rank_p = rank;
				}
			}
			if (rank_p < 5) {
				const nb_pl = Object.values(ranks).length;
				highscores[player.name] = player.score;
				if (nb_pl === 5) {
					delete highscores[ranks[nb_pl - 1]];
				}
				for (let i = Math.min(nb_pl, 4); i > rank_p; i--) {
					ranks[i] = ranks[i - 1];
					ranks_reversed[ranks[i - 1]] = i;
				}
				ranks[rank_p] = player.name;
				ranks_reversed[player.name] = rank_p;
			}
		}
	}
    return (
        <HighScoreBoard ranks={ranks} highscores={highscores} /> 
    );
};

async function playGame () {
	for (let i = 0; i < players.length; i++) {
		players[i].tentative = 0;
		for (let j = 0; j < 3; j++) {
			await players[i].play();
		}
		console.log(players[i].score_table);
		players[i].score = Math.max(...players[i].score_table);
		alert(`Score du joueur ${players[i].name}: ${players[i].score}`);
	}
	alert("Partie terminée");
	await setHighScores();
	window.querySelector("#done-button").dispatchEvent(new MouseEvent("click"));
    return (
        <div>
            Score : {players[i].score}
        </div>
    );
};
export default{
	addPlayer:addPlayer,
	playGame:playGame,
	setHighScores:setHighScores,
	getPlayers:getPlayers
}
// window.querySelector("#done-button").addEventListener("click", (event) => {
// 	window.getElementById("div1").style.display = "block";
// 	window.getElementById("player_menu").style.display = "block";
// 	window.getElementById("div2").style.display = "none";
// });
// window.querySelector("#play-button").addEventListener("click", (event) => {
// 	if (players.length === 0) {
// 		return alert("Please add a player before playing the game");
// 	}
// 	window.getElementById("div1").style.display = "none";
// 	window.getElementById("player_menu").style.display = "none";
// 	window.getElementById("div2").style.display = "block";
// 	playGame();
// });