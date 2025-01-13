import { Player } from "./player.js";

const highscores = {};
const ranks = {};
const ranks_reversed = {};

const players = await fetch("http://127.0.0.1:4444/Players").then((res) => res.json()).then((data) => {;
    return data.map((player) => {
        const p = new Player(player.name, player.id);
        console.log(player);
        return p;
    });
});
const addPlayer = async () => {
	const player_name = prompt(
		`Nom du joueur ${players.length + 1} :`,
		`Player ${players.length + 1}`,
	);
	if (player_name !== null) {
        const { id, name } = await fetch("http://127.0.0.1:4444/api/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: player_name }),
        }).then((res) => res.json());
		const player = new Player(name, id);
		players.push(player);
		document.getElementById("player_list").insertAdjacentHTML(
			"beforeend",
			`
            <div id="${player.id}" class="card" style="width: 18rem; background-color: #${Math.floor(Math.random() * 16777215).toString(16)}; margin: 0.3em">
            <div class="card-body">
            <h5 class="card-title"> <strong> ${player.name} </strong> </h5>
                <h6 id="${player.id}_score" class="card-subtitle mb-2 text-muted">Score : </h6>
                <button id="delete_player${player.id}" class="pure-button pure-button-primary">Supprimer ce
                    joueur</button>

            </div>
        </div>
`,
		);
		document
			.getElementById(`delete_player${player.id}`)
			.addEventListener("click", () => {
				player.destructor();
				players.splice(players.indexOf(player), 1);
                fetch('http://127.0.0.1:4444/api/delete', {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: player.id }),
                });
			});
	}
};

const displayPlayers = () => {
    document.getElementById("player_list").innerHTML = "";
    players.map((player) => {
		document.getElementById("player_list").insertAdjacentHTML(
			"beforeend",
			`
            <div id="${player.id}" class="card" style="width: 18rem; background-color: #${Math.floor(Math.random() * 16777215).toString(16)}; margin: 0.3em">
            <div class="card-body">
            <h5 class="card-title"> <strong> ${player.name} </strong> </h5>
                <h6 id="${player.id}_score" class="card-subtitle mb-2 text-muted">Score : </h6>
                <button id="delete_player${player.id}" class="pure-button pure-button-primary">Supprimer ce
                    joueur</button>

            </div>
        </div>
`,
		);
		document
			.getElementById(`delete_player${player.id}`)
			.addEventListener("click", async () => {
				player.destructor();
                await fetch('http://127.0.0.1:4444/api/delete', {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: player.id }),
                });
				players.splice(players.indexOf(player), 1);
			});
        
    });
    setHighScores();
}

const updateHighScores = async () => {
    //TODO:
}

const displayHighScores = async () => {
    const highscores = await fetch('http://localhost:4444/HighScores', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
    highscores.map((score) => {
        document.getElementById("highscores").insertAdjacentHTML(
            "beforeend",
            `
            <div class="card" style="width: 18rem; opacity: 0.5 !important;">
            <div class="card-body">
                <h5 class="card-title"> ${score.player} </h5>
                <h6 class="card-subtitle mb-2 text-muted">Score : ${score.score}</h6>
            </div>
        </div>
    `,);
    });
}

const playGame = async () => {
	for (let i = 0; i < players.length; i++) {
		players[i].tentative = 0;
		for (let j = 0; j < 3; j++) {
			await players[i].play();
		}
		console.log(players[i].score_table);
		players[i].score = Math.max(...players[i].score_table);
		document.getElementById(`${players[i].id}_score`).innerHTML =
			`Score : ${players[i].score}`;
		alert(`Score du joueur ${players[i].name}: ${players[i].score}`);
	}
	alert("Partie terminée");
	await setHighScores();
	document.querySelector("#done-button").dispatchEvent(new MouseEvent("click"));
};

displayPlayers();
displayHighScores();
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
