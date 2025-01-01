import db from "./db.js";

async function newPlayer(name) {
	await db.model.Players.create({
		name: name
	});
	return {
		message: "Player created",
		status: 200,
		name: name
	};
}

async function newScore(player, score) {
	await db.model.HighScores.create({
		player: player,
		score: score
	});
	return {
		message: "Score added",
		status: 200,
		player: player,
		score: score
	};
}

async function findPlayer(id) {
	console.log(id);
	const data = await db.model.Players.findByPk(id);
	return data.toJSON();
}

async function updatePlayer(id, name) {
	const data = await db.model.Players.findByPk(id);
    await data.update({
		name: name
    });
    return {
        message: "Player updated",
        status: 200,
        id: id,
		name: name
    };
}

async function deletePlayer(id) {
	console.log(id);
	const data = await db.model.Players.findByPk(id);
	await data.destroy();
	return {
		message: "Player deleted",
		status: 200,
		id: id,
	};
}

async function getPlayers() {
	const data = await db.model.Players.findAll();
	return data.map((Player) => {
		return Player.toJSON();
	});
}

async function getScores() {
	const data = await db.model.HighScores.findAll();
	return data.map((Score) => {
		return Score.toJSON();
	});
}

async function getHighScores() {
	const data = await db.model.HighScores.findAll({order: [['score', 'DESC']], limit: 10});
	return data.map((Score) => {
		return Score.toJSON();
	});
}

export default {
	newPlayer: newPlayer,
	findPlayer: findPlayer,
	updatePlayer: updatePlayer,
	deletePlayer: deletePlayer,
	getPlayers: getPlayers,
	getScores: getScores,
	getHighScores: getHighScores,
	newScore: newScore
};
