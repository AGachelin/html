import Image from "next/image";
import styles from "./page.module.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div id="div1">
        <h1 className="text-center audiowide"> Lancer de disque </h1>
        <div className="row">
            <div className="col">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-1">
                            <button type="submit" id="play-button" className="audiowide_button">Play</button>
                        </div>
                    </div>
                </div>
                <h2 className="row justify-content-center" style={{margin: "1em"}}>
                    <button type="submit" className="audiowide_button" data-bs-toggle="collapse" href="#rulesText"
                        aria-expanded="false" aria-controls="rulesText">
                        Règles du jeu
                    </button>
                </h2>
                <div className="collapse audiowide_classNameic" id="rulesText" style={{backgroundColor: white, fontWeight: "1000", border: "5px"}}>
                    Commencez par lancer les 5 dés. Écartez alors au moins un dé. Si
                    vous le désirez, relancez tous les
                    autres.
                    Vous
                    pouvez réitérer l’opération plusieurs fois, à la condition de toujours écarter au moins un dé à
                    chaque coup.
                    Mais
                    attention : seuls les dés de valeur paire peuvent être écartés. Essayez de conserver les dés de
                    valeur
                    élevée.
                    À tout moment, vous pouvez décider d’interrompre vos lancers et de conclure là votre tentative. Par
                    ailleurs
                    une
                    tentative s’achève automatiquement dès que les cinq dés se trouvent écartés.
                    Si, après un lancer, vous n’êtes plus en mesure d’écarter un nouveau dé parce que tous montrent une
                    valeur
                    impaire, vous avez échoué dans votre tentative.</div>
            </div>
            <div className="col">
                <div style={{display:block}}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-3">
                                <button type="submit" id="add_player" className="audiowide_button">Add a
                                    Player</button>
                            </div>
                        </div>
                    </div>
                    <div className="row" id="player_list"/>
                    <div className="row" id="highscores"/>
                </div>
            </div>
        </div>
    <div id="div2" style={{display:'none'}}>
        <canvas id="canvas"/>
        <div id="buttons">
            <button type="submit" id="done-button" className="pure-button pure-button-primary">Terminer la
                partie</button>
            <button type="submit" id="dice_locking" className="pure-button pure-button-primary">Verrouiller les
                dés</button>
            <button type="submit" id="end_turn" className="pure-button pure-button-primary">Terminer le tour</button>
        </div>
    </div>
    </div>
  );
}