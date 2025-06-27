import { db } from "../database/database.js";
import { gameSchema } from "../schemas/gameSchema.js";

export async function createGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    const validation = gameSchema.validate({ name, image, stockTotal, pricePerDay });
    if (validation.error) {
        return res.status(400).send(validation.error.details.map(d => d.message));
    }

    try {
        const existingGame = await db.query("SELECT * FROM games WHERE name = $1", [name]);
        if (existingGame.rowCount > 0) {
            return res.sendStatus(409); // Conflict
        }

        await db.query(
            `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`,
            [name, image, stockTotal, pricePerDay]
        );

        res.sendStatus(201); // Created
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getGames(req, res) {
    try {
        const games = await db.query("SELECT * FROM games");
        res.send(games.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
} 