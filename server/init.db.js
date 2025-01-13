import db from "./db.js";

async function initDB() {
	await db.db.sync({ force: true });
}

initDB().then(() => {
	console.log("Base de donnée créée et synchronisée.");
});
