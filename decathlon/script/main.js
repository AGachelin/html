import { Player } from "./player.js";

let highscores = {};
let ranks = {};
let ranks_reversed = {};

let player_id = 0;
const players = [];
const addPlayer = () => {
    let player_name = prompt(
        `Nom du joueur ${players.length + 1} :`,
        `Player ${players.length + 1}`
    );
    if (player_name !== null) {
        const player = new Player(player_name, player_id);
        players.push(player);
        document.getElementById("player_list").insertAdjacentHTML(
            "beforeend",
            `<li id=${player_id}>
                ${players[players.length - 1].name}    
                <button id="delete_player${player_id}" class="pure-button pure-button-primary">Supprimer ce joueur</button>
                </li>`
        );
        document
            .getElementById(`delete_player${player_id}`)
            .addEventListener("click", () => {
                player.destructor();
                players.splice(players.indexOf(player), 1);
            });
        player_id++;
    }
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
    document
        .getElementById("highscores")
        .insertAdjacentHTML("beforeend", `<h2>High scores</h2>`);
    for (let i = 0; i < Object.values(ranks).length; i++) {
        document.getElementById("highscores").insertAdjacentHTML(
            "beforeend",
            `<li>
        ${ranks[i]}: ${highscores[ranks[i]]}  
        </li>`
        );
    }
};

const playGame = async () => {
    for (let i = 0; i < players.length; i++) {
        alert(players[i].name);
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
