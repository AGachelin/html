export default function HighScoreBoard(props) {
    const {highscores} = props;
    return (
        <div>
            <h1>High Score</h1>
        {highscores.map(s => {
            return (
                <div key={s.rank}>
                    <div className="card" style={{width: "10rem", opacity: 0.5}}>
                        <div className="card-body">
                            <h5 className="card-title"> {s.player} </h5>
                            <h6 className="card-subtitle mb-2 text-muted">Score : {s.score}</h6>
                        </div>
                    </div>
                </div>
            )})}
        </div>
    );
}
