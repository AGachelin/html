async function delete_player (player_id) {
    await fetch("http://localhost:4444/api/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id:player_id
        }),
    })
}

export default function PlayerCard(props) {
    const { name, player_id, player_score, remove} = props;
    return (
            <div id={player_id} className="card" >
            <div className="card-body">
            <h5 className="card-title"> <strong> {name} </strong> </h5>
                <h6 className="card-subtitle mb-2 text-muted">Score : { player_score } </h6>
                <button type="submit" onClick={() => delete_player(player_id).then(remove())} className="pure-button pure-button-primary">Supprimer ce
                    joueur</button>

            </div>
        </div>
    )
}
