import db from "./db.js";

async function newPlayer(name) {
	let Player = await db.model.Players.create({
		name: name
	});
	Player = Player.dataValues;
	return {
		id: Player.id,
		name: name
	};
}

async function newScore(player, score) {
	await db.model.HighScores.create({
		player: player,
		score: score
	});
	return {
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
        id: id,
		name: name
    };
}

async function deletePlayer(id) {
	console.log(id);
	const data = await db.model.Players.findByPk(id);
	await data.destroy();
	return {
		id: id,
	};
}

async function getPlayers() {
	const data = await db.model.Players.findAll();
	return data.map((Player) => {
		return Player.toJSON();
	});
}

async function getScores(player) {
	const data = await db.model.HighScores.findAll({where:{"player":`${player}`}});
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
