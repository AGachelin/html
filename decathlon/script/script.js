class Dice {
	constructor(number) {
		this.locked = false;
		this.number = number;
	}

	remove_dice() {
		this.locked = true;
	}

	throw_dice() {
		if (!this.locked) {
			this.number = Math.floor(Math.random() * 6) + 1;
		}
	}

	get value() {
		return this.number;
	}
}
