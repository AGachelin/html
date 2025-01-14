import { Player } from "./player.js";

const players = await fetch("http://127.0.0.1:4444/Players").then((res) => res.json()).then(async (data) => {;
	return await Promise.all(data.map(async (player) => {
		const p = new Player(player.name, player.id);
		await fetch(`http://localhost:4444/Scores/${player.id}`)
			.then((res) => res.json())
			.then((scores) => {console.log(scores);p.score = Math.max(...scores.map(score=>score.score));});
		console.log(p);
		return p;
	}));
});


const addPlayer = async () => {
	if(!document.cookie.includes("admin") || key===0 || !document.cookie.includes(key)){
		alert("You must be logged in as an admin to add a player");
		return;
	}
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
			    <h6 id="${player.id}_highscore" class="card-subtitle mb-2 text-muted">Highscore : ${player.score | 0} </h6>
                <h6 class="card-subtitle mb-2 text-muted">All scores : </h6>
				<div id="${player.id}_score"></div>
                <button id="delete_player${player.id}" class="pure-button pure-button-primary">Supprimer ce
                    joueur</button>

            </div>
        </div>
`,
		);
		document
			.getElementById(`delete_player${player.id}`)
			.addEventListener("click", () => {
				if(!document.cookie.includes("admin") || key===0 || !document.cookie.includes(key)){
					alert("You must be logged in as an admin to delete a player");
					return;
				}
				else{
				player.destructor();
				players.splice(players.indexOf(player), 1);
                fetch('http://127.0.0.1:4444/api/delete', {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: player.id }),
                });
			}});
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
			    <h6 id="${player.id}_highscore" class="card-subtitle mb-2 text-muted">Highscore : ${player.score | 0} </h6>
                <h6 class="card-subtitle mb-2 text-muted">All scores : </h6>
				<div id="${player.id}_score"></div>
                <button id="delete_player${player.id}" class="pure-button pure-button-primary">Supprimer ce
                    joueur</button>

            </div>
        </div>
`,
		);
		document
			.getElementById(`delete_player${player.id}`)
			.addEventListener("click", () => {
				if(!document.cookie.includes("admin") || key===0 || !document.cookie.includes(key)){
					alert("You must be logged in as an admin to delete a player");
					return;
				}
				else{
				player.destructor();
				players.splice(players.indexOf(player), 1);
                fetch('http://127.0.0.1:4444/api/delete', {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: player.id }),
                });
			}});
        
    });
}

const setHighScores = async () => {
	document.getElementById("highscores").innerHTML = "";
	await displayHighScores();
	await players.map(async (player) => {
		const scores = await fetch(`http://localhost:4444/Scores/${player.id}`).then((res) => res.json());
		document.getElementById(`${player.id}_score`).innerHTML = '';
		console.log(scores);
		for(const score in scores){
			const score_item = document.createElement('li');
			score_item.innerHTML = scores[score].score;
			document.getElementById(`${player.id}_score`).appendChild(score_item);
		}
	}
	)
}

const displayHighScores = async () => {
    const highscores = await fetch('http://localhost:4444/HighScores', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
	document.getElementById("highscores").innerHTML = "";
    highscores.map((score) => {
        document.getElementById("highscores").insertAdjacentHTML(
            "beforeend",
            `
            <div class="card" style="width: 18rem; opacity: 0.5 !important;">
            <div class="card-body">
                <h5 class="card-title"> ${score.player} #${score.PlayerId} </h5>
                <h6 class="card-subtitle mb-2 text-muted">Score : ${score.score}</h6>
            </div>
        </div>
    `,);
    });
}

const playGame = async () => {
	for (let i = 0; i < players.length; i++) {
		players[i].tentative = 0;
		players[i].score_table = [];
		for (let j = 0; j < 3; j++) {
			await players[i].play();
		}
		console.log(players[i].score_table);
		await fetch('http://localhost:4444/api/score', {            
			method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ player: players[i].name, playerid: players[i].id, score: Math.max(...players[i].score_table) }),
        }).then((res) => res.json());
		players[i].score = Math.max(...players[i].score_table, players[i].score);
		document.getElementById(`${players[i].id}_highscore`).innerHTML =
			`Highscore : ${players[i].score}`;
		alert(`Score du joueur ${players[i].name}: ${players[i].score}`);
	}
	alert("Partie terminée");
	await setHighScores();
	document.querySelector("#done-button").dispatchEvent(new MouseEvent("click"));
};

const login = async () => {
	const password = prompt("Enter the password");
	if (password === "admin") {
		document.getElementById("log-in").style.display = "none";
		document.getElementById("log-out").style.display = "block";
		key = Math.random().toString(16);
		await fetch("http://localhost:4444/key", {
			method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: key }),
        }).then(document.cookie = `admin=${key}; max-age=300`);
	} else {
		alert("Wrong password");
	}
}

const logout = () => {
	document.getElementById("log-out").style.display = "none";
	document.getElementById("log-in").style.display = "block";
	document.cookie = 'admin=; max-age=-1';
}

let key = await fetch("http://localhost:4444/key").then((res) => res.text()).then((key)=>{
	if(!document.cookie.includes("admin") || key===0 || !document.cookie.includes(key)){
		logout();
		return "0";
	}
	else{
		document.getElementById("log-in").style.display = "none";
		document.getElementById("log-out").style.display = "block";
		return key;
	}
})

displayPlayers();
setHighScores();
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
document.getElementById("log-in").onclick = login
document.getElementById("log-out").onclick = logout