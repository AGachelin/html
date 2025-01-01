const delete_player = (player, players) => {
    player.destructor();
    players.splice(players.indexOf(player), 1);
}

export default function PlayerCard(props) {
    const { players, player_id, player_score } = props;
    return (

            <div id={player_id} class="card" style="width: 18rem; background-color: #${Math.floor(Math.random() * 16777215).toString(16)}; margin: 0.3em">
            <div class="card-body">
            <h5 class="card-title"> <strong> ${players[players.length - 1].name} </strong> </h5>
                <h6 class="card-subtitle mb-2 text-muted">Score : { player_score } </h6>
                <button type="submit" onClick={delete_player} class="pure-button pure-button-primary">Supprimer ce
                    joueur</button>

            </div>
        </div>
    )
}
