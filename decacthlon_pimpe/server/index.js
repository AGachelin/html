import express from "express";
import cors from "cors";
import api from "./app.js";

const app = express();

const hostname = "127.0.0.1";
const port = 4444;

app.use(cors());
app.use(express.json());

app.get("/Players", async (req, res) => {
	try {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.json(await api.getPlayers());
	} catch (e) {
		res.statusCode = 500;
		console.log(e);
		res.end("Internal server error");
	}
});

app.get("/Players/dice_throw", async (req, res) => {
    try {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.json({
            value: Math.floor(Math.random() * 6) + 1
        })
    } catch (e) {
        res.statusCode = 500;
        console.log(e);
        res.end("Internal server error");
    }
});

app.get("/Scores", async (req, res) => {
	try {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.json(await api.getScores());
	} catch (e) {
		res.statusCode = 500;
		console.log(e);
		res.end("Internal server error");
	}
});

app.get("/HighScores", async (req, res) => {
	try {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.json(await api.getHighScores());
	} catch (e) {
		res.statusCode = 500;
		console.log(e);
		res.end("Internal server error");
	}
});

app.get("/Players/:id",async (req, res) => {
	try {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
        const json = await api.findPlayer(req.params.id);
        res.json(json);
	} catch (e) {
		res.statusCode = 500;
		console.log(e);
		res.end("Internal server error");
	}
});

app.post("/api/create", async (req, res) => {
    console.log(req.body);
	try {
        const { name } = req.body;
		res.statusCode = 200;
		res.json(await api.newPlayer(name));
	} catch (e) {
		res.statusCode = 500;
		console.log(e);
		res.end("Internal server error");
	}
});

app.post("/api/score", (req, res) => {
    console.log(req.body);
	try {
        const { player, score } = req.body;
		res.statusCode = 200;
		res.json(api.newScore(player, score));
	} catch (e) {
		res.statusCode = 500;
		console.log(e);
		res.end("Internal server error");
	}
});

app.post("/api/update",async (req, res) => {
	try {
        const { id, name } = req.body;
		res.json(await api.updatePlayer(id, name));
	} catch (e) {
		res.statusCode = 500;
		console.log(e);
		res.end("Internal server error");
	}
});

app.use("/api/delete",async (req, res) => {
    const { id }= req.body;
	try {
		res.json(await api.deletePlayer(id));
	} catch (e) {
		res.statusCode = 500;
		console.log(e);
		res.end("Internal server error");
	}
});

app.use((req, res) => {
	res.statusCode = 404;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.end("Not found");
});

app.listen(port, hostname);
console.log(`Server running at http://${hostname}:${port}/`);
