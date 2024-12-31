import { Player } from "./objects/player.js";
import { PlayerCard } from "./player_card/player_card.jsx";
import { HighScoreBoard } from "./player_card/highscore.jsx";

const highscores = {};
const ranks = {};
const ranks_reversed = {};

let player_id = 0;
const players = [];
const addPlayer = () => {
	const player_name = prompt(
		`Nom du joueur ${players.length + 1} :`,
		`Player ${players.length + 1}`,
	);
	if (player_name !== null) {
		const player = new Player(player_name, player_id);
		players.push(player);
	}
    player_id++
    return (
        <PlayerCard players={players} player_id={player_id} player_score={player.score} />
    )
};

const setHighScores = async () => {
	document.getElementById("highscores").innerHTML = "";
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

const playGame = async () => {
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
	document.querySelector("#done-button").dispatchEvent(new MouseEvent("click"));
    return (
        <div>
            Score : {players[i].score}
        </div>
    );
};

document.getElementById("add_player").onclick = addPlayer;
document.querySelector("#done-button").addEventListener("click", (event) => {
	document.getElementById("div1").style.display = "block";
	document.getElementById("player_menu").style.display = "block";
	document.getElementById("div2").style.display = "none";
});
document.querySelector("#play-button").addEventListener("click", (event) => {
	if (players.length === 0) {
		return alert("Please add a player before playing the game");
	}
	document.getElementById("div1").style.display = "none";
	document.getElementById("player_menu").style.display = "none";
	document.getElementById("div2").style.display = "block";
	playGame();
});
