import { Sequelize, DataTypes } from "sequelize";

import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "db.sqlite"),
});

const HighScores = db.define("HighScores", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    player: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    PlayerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

const Players = db.define("Players", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default {
    db: db,
    model: {
        HighScores: HighScores,
        Players: Players
    },
};
