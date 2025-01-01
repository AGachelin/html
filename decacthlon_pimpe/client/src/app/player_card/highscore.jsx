export default function HighScoreBoard(props) {
    const { ranks, highscores } = props;
    return (
        <div>
            <h1>High Score</h1>
        {ranks.map((rank, i) => {
            return (
                <div key={i}>
                    <div className="card" style={{width: "10rem", opacity: 0.5}}>
                        <div className="card-body">
                            <h5 className="card-title"> {ranks[i]} </h5>
                            <h6 className="card-subtitle mb-2 text-muted">Score : {highscores[ranks[i]]}</h6>
                        </div>
                    </div>
                </div>
            )})}
        </div>
    );
}
