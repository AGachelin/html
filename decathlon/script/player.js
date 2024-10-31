import Tentative from './tentative.js';

export class Player {
	constructor() {
        this.current_tentative = new Tentative();
		this.tentative = 0;
		this.score = 0;
	}
	async play () {
		this.tentative++;
        this.current_tentative.init_scene();
        this.current_tentative.star_turn();
        this.current_tentative.show();
        
        this.score += await this.current_tentative.getScore();
	}
}
