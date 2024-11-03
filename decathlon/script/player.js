import Tentative from "./tentative.js";

export class Player {
	constructor() {
		this.current_tentative = new Tentative();
		this.tentative = 0;
		this.score = 0;
        this.score_table = [];
	}
	async play() {
		this.tentative++;
		this.current_tentative.init_scene();
		this.current_tentative.star_turn();

		this.score += await this.current_tentative.getScore();
        this.score_table.push(this.score);
	}
}
