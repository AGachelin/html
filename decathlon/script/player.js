class Player {
	constructor() {
		this.tentative = 0;
		this.score = 0;
	}
	play () {
		this.tentative++;
		this.current_tentative = new Tentative();
	}
}
