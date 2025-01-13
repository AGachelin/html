import { Player } from "./objects/player.jsx";
import { HighScoreBoard } from "./player_card/highscore.jsx";
import { useEffect } from 'react';


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
	var highscores = []
	fetch("http://localhost:4444/HighScores"
	).then(
		response=>response.json()
	).then(
		scores=> scores.map(s=> highscores.push({player:s.player, score:s.score}))
	)
	var i = 1;
	highscores.map(score => score.rank = i++);
    return (
        <HighScoreBoard highscores={highscores} /> 
    );
};

async function playGame (players) {
	useEffect(async () => {
	if (players.length === 0) {
		return alert("Please add a player before playing the game");
	}
	else{
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
	}});
	return (
		<div>
			Score : {players[i].score}
		</div>
	);};
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